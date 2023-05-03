// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import { SeacowsERC3525 } from "./base/SeacowsERC3525.sol";
import { SeacowsERC721TradePairFactory } from "./base/SeacowsERC721TradePairFactory.sol";

import { ISeacowsPositionManager } from "./interfaces/ISeacowsPositionManager.sol";
import { ISeacowsERC721TradePair } from "./interfaces/ISeacowsERC721TradePair.sol";
import { IWETH } from "./interfaces/IWETH.sol";
import { SeacowsLibrary } from "./lib/SeacowsLibrary.sol";

/// @title The base contract for an NFT/TOKEN AMM pair
/// Inspired by 0xmons; Modified from https://github.com/sudoswap/lssvm
/// @notice This implements the core swap logic from NFT to TOKEN
contract SeacowsPositionManager is SeacowsERC3525, SeacowsERC721TradePairFactory, ISeacowsPositionManager {
    using Counters for Counters.Counter;

    address public immutable WETH;

    mapping(address => uint256) private _pairSlots;
    mapping(address => uint256) private _pairTokenIds;

    Counters.Counter private _slotGenerator;

    constructor(address template_, address _WETH) SeacowsERC3525("Seacows LP Token", "SLP", 18) SeacowsERC721TradePairFactory(template_) {
        WETH = _WETH;
    }

    modifier onlyPair(uint256 _slot) {
        require(_pairSlots[msg.sender] == _slot, "SeacowsPositionManager: Only Pair");
        _;
    }

    modifier checkDeadline(uint deadline) {
        require(deadline >= block.timestamp, "SeacowsPositionManager: EXPIRED");
        _;
    }

    receive() external payable {
        assert(msg.sender == WETH);
    }


    function createPair(address _token, address _collection, uint112 _fee) public returns (address _pair) {
        _pair = _createPair(_token, _collection, _fee);
        uint256 _slot = _createSlot(_pair);
        uint256 tokenId = _mint(_pair, _slot, 0);
        _pairSlots[_pair] = _slot;
        _pairTokenIds[_pair] = tokenId;
        
        emit PairCreated(_token, _collection, _fee, _slot, _pair);
    }

    // **** ADD LIQUIDITY ****
    function _addLiquidity(
        address token,
        address collection,
        uint112 fee,
        uint tokenDesired,
        uint[] memory idsDesired,
        uint tokenMin
    ) internal virtual returns (uint tokenAmount, uint[] memory ids) {
        // create the pair if it doesn"t exist yet
        address pair = getPair(token, collection, fee);
        require(pair != address(0), "SeacowsPositionManager: PAIR_DOES_NOT_EXIST");
        (uint112 tokenReserve, uint112 nftReserve,) = ISeacowsERC721TradePair(pair).getReserves();
        if (tokenReserve == 0 && nftReserve == 0) {
            (tokenAmount, ids) = (tokenDesired, idsDesired);
        } else {
            uint tokenOptimal = SeacowsLibrary.quote(idsDesired.length * (10 ** 18), nftReserve, tokenReserve);
            if (tokenOptimal <= tokenDesired) {
                require(tokenOptimal >= tokenMin, "SeacowsPositionManager: INSUFFICIENT_B_AMOUNT");
                (tokenAmount, ids) = (tokenOptimal, idsDesired);
            }
        }
    }

    function addLiquidity(
        address token,
        address collection,
        uint112 fee,
        uint tokenDesired,
        uint[] memory idsDesired,
        uint tokenMin,
        uint256 toTokenId,
        uint deadline
    ) public checkDeadline(deadline) returns (uint tokenAmount, uint[] memory ids, uint liquidity) {
        require(_exists(toTokenId), "SeacowsPositionManager: INVALID_TOKEN_ID");
        (tokenAmount, ids) = _addLiquidity(token, collection, fee, tokenDesired, idsDesired, tokenMin);
        address pair = getPair(token, collection, fee);

        IERC20(token).transferFrom(msg.sender, pair, tokenAmount);
        for (uint i = 0; i < idsDesired.length; i++) {
            IERC721(collection).safeTransferFrom(msg.sender, pair, idsDesired[i]);
        }
        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
    }

    function addLiquidityETH(
        address collection,
        uint112 fee,
        uint[] memory idsDesired,
        uint tokenMin,
        uint256 toTokenId,
        uint deadline
    ) public payable checkDeadline(deadline) returns (uint tokenAmount, uint[] memory ids, uint liquidity) {
        require(_exists(toTokenId), "SeacowsPositionManager: INVALID_TOKEN_ID");
        (tokenAmount, ids) = _addLiquidity(
            WETH,
            collection,
            fee,
            msg.value,
            idsDesired,
            tokenMin
        );
        address pair = getPair(WETH, collection, fee);
        IWETH(WETH).deposit{value: tokenAmount}();
        assert(IWETH(WETH).transfer(pair, tokenAmount));

        for (uint i = 0; i < idsDesired.length; i++) {
            IERC721(collection).safeTransferFrom(msg.sender, pair, idsDesired[i]);
        }

        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
        // refund dust eth, if any
        if (msg.value > tokenAmount) {
            (bool success, ) = msg.sender.call{ value: msg.value - tokenAmount }("");
            require(success, "ETH transfer failed");
        }
    }

    // **** REMOVE LIQUIDITY ****
    function removeLiquidity(
        address token,
        address collection,
        uint112 fee,
        uint liquidity,
        uint tokenMin,
        uint[] memory idsDesired,
        uint256 fromTokenId,
        address to,
        uint deadline
    ) public virtual checkDeadline(deadline) returns (uint tokenAmount, uint nftAmount) {
        require(_exists(fromTokenId), "SeacowsPositionManager: INVALID_TOKEN_ID");
        address pair = getPair(token, collection, fee);
        uint256 _pairTokenId = tokenOf(pair);

        transferFrom(fromTokenId, _pairTokenId, liquidity); // send liquidity to pair
        (tokenAmount, ) = ISeacowsERC721TradePair(pair).burn(to, idsDesired);
        require(tokenAmount >= tokenMin, "SeacowsPositionManager: INSUFFICIENT_TOKEN_AMOUNT");
        nftAmount = idsDesired.length;
    }

    function removeLiquidityETH(
        address collection,
        uint112 fee,
        uint liquidity,
        uint tokenMin,
        uint[] memory idsDesired,
        uint256 fromTokenId,
        address to,
        uint deadline
    ) public virtual checkDeadline(deadline) returns (uint tokenAmount, uint nftAmount) {
        require(_exists(fromTokenId), "SeacowsPositionManager: INVALID_TOKEN_ID");
        (tokenAmount, nftAmount) = removeLiquidity(
            WETH,
            collection,
            fee,
            liquidity,
            tokenMin,
            idsDesired,
            fromTokenId,
            address(this),
            deadline
        );

        for (uint i = 0; i < idsDesired.length; i++) {
            IERC721(collection).safeTransferFrom(address(this), to, idsDesired[i]);
        }
        
        IWETH(WETH).withdraw(tokenAmount);
    
        (bool success, ) = to.call{ value: tokenAmount }(new bytes(0));
        require(success, "TransferHelper::safeTransferETH: ETH transfer failed");
    }
    
    function mint(
        address token,
        address collection,
        uint112 fee,
        uint tokenDesired,
        uint[] memory idsDesired,
        uint tokenMin,
        uint deadline
    ) public returns (uint tokenAmount, uint[] memory ids, uint liquidity)  {
        address pair = getPair(token, collection, fee);
        if (pair == address(0)) {
            pair = createPair(token, collection, fee);
        }
        uint256 tokenId = _mint(msg.sender, slotOfPair(pair), 0);
        (tokenAmount, ids, liquidity) = addLiquidity(token, collection, fee, tokenDesired, idsDesired, tokenMin, tokenId, deadline);
    }
    
    function mintWithETH(
        address collection,
        uint112 fee,
        uint[] memory idsDesired,
        uint tokenMin,
        uint deadline
    ) public payable checkDeadline(deadline) returns (uint tokenAmount, uint[] memory ids, uint liquidity)  {
        address pair = getPair(WETH, collection, fee);
        if (pair == address(0)) {
            pair = createPair(WETH, collection, fee);
        }
        uint256 toTokenId = _mint(msg.sender, slotOfPair(pair), 0);
        (tokenAmount, ids) = _addLiquidity(
            WETH,
            collection,
            fee,
            msg.value,
            idsDesired,
            tokenMin
        );
        IWETH(WETH).deposit{value: tokenAmount}();
        assert(IWETH(WETH).transfer(pair, tokenAmount));

        for (uint i = 0; i < idsDesired.length; i++) {
            IERC721(collection).safeTransferFrom(msg.sender, pair, idsDesired[i]);
        }

        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
        // refund dust eth, if any
        if (msg.value > tokenAmount) {
            (bool success, ) = msg.sender.call{ value: msg.value - tokenAmount }("");
            require(success, "ETH transfer failed");
        }
    }
    
    function mintValue(uint256 tokenId, uint256 _value) public onlyPair(slotOf(tokenId)) {
        _mintValue(tokenId, _value);
    }
    
    function burn(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "SeacowsPositionManager: UNAUTHORIZED");
        require(balanceOf(tokenId) == 0, "SeacowsPositionManager: NOT_CLEARED");
        _burn(tokenId);
    }
    
    function burnValue(uint256 tokenId, uint256 burnValue_) public onlyPair(slotOf(tokenId)) {
        _burnValue(tokenId, burnValue_);
    }


    // **** SWAP ****
    function swapTokensForExactNFTs(
        address _pair,
        uint[] memory idsOut,
        uint amountInMax,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountIn) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint tokenReserve, uint nftReserve,) = pair.getReserves();
        amountIn = SeacowsLibrary.getAmountIn(idsOut.length * pair.COMPLEMENT_PRECISION(), tokenReserve, nftReserve, pair.fee(), pair.PERCENTAGE_PRECISION());
        require(amountIn <= amountInMax, "SeacowsPositionManager: EXCESSIVE_INPUT_AMOUNT");
        IERC20(pair.token()).transferFrom(msg.sender, _pair, amountIn);
        pair.swap(0, idsOut, to);
    }

    function swapExactNFTsForTokens(
        address _pair,
        uint[] memory idsIn,
        uint amountOutMin,
        address to,
        uint deadline
    ) external virtual checkDeadline(deadline) returns (uint amountOut) {
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(_pair);
        (uint tokenReserve, uint nftReserve,) = pair.getReserves();
        amountOut = SeacowsLibrary.getAmountOut(idsIn.length * pair.COMPLEMENT_PRECISION(), nftReserve, tokenReserve, pair.fee(), pair.PERCENTAGE_PRECISION());
        require(amountOut >= amountOutMin, "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT");
        for (uint i = 0; i < idsIn.length; i++) {
            IERC721(pair.collection()).safeTransferFrom(msg.sender, _pair, idsIn[i]);
        }
        pair.swap(amountOut, new uint[](0), to);
    }


    function slotOfPair(address _pair) public view returns (uint256) {
        return _pairSlots[_pair];
    }

    function tokenOf(address _pair) public view returns (uint256) {
        return _pairTokenIds[_pair];
    }
    
    function _createSlot(address _pair) internal returns (uint256 newSlot) {
        _slotGenerator.increment();
        newSlot = _slotGenerator.current();
        _pairSlots[_pair] = newSlot;
    }
}
