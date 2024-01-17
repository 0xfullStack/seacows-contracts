// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ERC721} from '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {Counters} from '@openzeppelin/contracts/utils/Counters.sol';
import {SeacowsERC3525} from './base/SeacowsERC3525.sol';
import {SeacowsERC721TradePairFactory} from './base/SeacowsERC721TradePairFactory.sol';
import {FeeManagement} from './base/FeeManagement.sol';
import {ISeacowsPositionManager} from './interfaces/ISeacowsPositionManager.sol';
import {ISeacowsERC721TradePair} from './interfaces/ISeacowsERC721TradePair.sol';
import {IWETH} from './interfaces/IWETH.sol';
import {SpeedBump} from './base/SpeedBump.sol';
import {NFTRenderer} from './lib/NFTRenderer.sol';

contract SeacowsPositionManager is
    SeacowsERC3525,
    SeacowsERC721TradePairFactory,
    FeeManagement,
    ISeacowsPositionManager
{
    using Counters for Counters.Counter;

    uint256 public constant PERCENTAGE_PRECISION = 10 ** 4;

    address public immutable WETH;

    SpeedBump public immutable SPEED_BUMP;

    Counters.Counter private _slotGenerator;

    struct RemoveLiquidityConstraint {
        uint256 cTokenOutMin;
        uint256 cNftOutMin;
        uint256[] nftIds;
    }

    constructor(
        address template_,
        address _weth,
        address _speedBump
    ) SeacowsERC3525('Seacows LP Token', 'SLP', 18) SeacowsERC721TradePairFactory(template_) {
        WETH = _weth;
        SPEED_BUMP = SpeedBump(payable(_speedBump));
    }

    modifier checkDeadline(uint256 deadline) {
        if (deadline < block.timestamp) {
            revert SPM_EXPIRED();
        }
        _;
    }

    receive() external payable {
        assert(msg.sender == WETH);
    }

    /**
        @notice Creates a new Pair for a ERC20 Token and ERC721 Collection with specified fee tier
        @param _token The ERC20 contract address
        @param _collection The ERC721 contract address
        @param _fee The fee tier. Please check TradePair for the fee tiers.
     */
    function createPair(address _token, address _collection, uint256 _fee) public returns (address _pair) {
        _pair = _createPair(_token, _collection, _fee);
        uint256 _slot = _createSlot(_pair);
        uint256 tokenId = _mint(_pair, _slot, 0);
        pairSlots[_pair] = _slot;
        pairTokenIds[_pair] = tokenId;
        slotPairs[_slot] = _pair;
        emit PairCreated(_token, _collection, _fee, _slot, _pair);
    }

    function _addLiquidity(
        address token,
        address collection,
        uint256 fee,
        uint256 tokenDesired,
        uint256[] memory idsDesired,
        uint256 tokenMin
    ) internal virtual returns (uint256 tokenAmount, uint256[] memory ids) {
        address pair = getPair(token, collection, fee);
        if (pair == address(0)) {
            revert SPM_PAIR_NOT_EXIST();
        }
        (uint256 tokenReserve, uint256 nftReserve) = ISeacowsERC721TradePair(pair).getReserves();
        if (tokenReserve == 0 && nftReserve == 0) {
            if (idsDesired.length < 2) {
                revert SPM_INSUFFICIENT_MINIMUM_LIQUIDITY_AMOUNT();
            }
            (tokenAmount, ids) = (tokenDesired, idsDesired);
        } else {
            if (idsDesired.length <= 0) {
                revert SPM_INSUFFICIENT_AMOUNT();
            }
            if (tokenReserve <= 0 || nftReserve <= 0) {
                revert SPM_INSUFFICIENT_LIQUIDITY();
            }
            uint256 tokenOptimal = (idsDesired.length *
                ISeacowsERC721TradePair(pair).COMPLEMENT_PRECISION() *
                tokenReserve) / nftReserve;
            if (tokenOptimal > tokenDesired || tokenOptimal < tokenMin) {
                revert SPM_INSUFFICIENT_AMOUNT();
            }
            (tokenAmount, ids) = (tokenOptimal, idsDesired);
        }
    }

    /**
        @notice Add liquidity to the Pair based on the ERC20 address, ERC721 address and fee tier
        @param token The ERC20 contract address
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param tokenDesired The amount of ERC20 token to add
        @param idsDesired The ids of ERC721 NFT to add
        @param tokenMin The min. amount of ERC20 token wanted to add. Scenario: the txn is processed after a long waiting time.
        @param toTokenId The position NFT that is used to store the liquidity.
        @param deadline The timestamp of deadline in seconds
     */
    function addLiquidity(
        address token,
        address collection,
        uint256 fee,
        uint256 tokenDesired,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 toTokenId,
        uint256 deadline
    ) public checkDeadline(deadline) returns (uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        if (ownerOf(toTokenId) != msg.sender) {
            revert SPM_INVALID_TOKEN_ID();
        }

        (tokenAmount, ids) = _addLiquidity(token, collection, fee, tokenDesired, idsDesired, tokenMin);
        address pair = getPair(token, collection, fee);

        IERC20(token).transferFrom(msg.sender, pair, tokenAmount);
        for (uint256 i; i < idsDesired.length; ) {
            IERC721(collection).safeTransferFrom(msg.sender, pair, idsDesired[i]);
            unchecked {
                ++i;
            }
        }
        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
    }

    /**
        @notice Add liquidity with ETH to the Pair based on the ERC721 address and fee tier
        @notice There is a hidden tokenDesired which passed via payable
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param idsDesired The ids of ERC721 NFT to add
        @param tokenMin The min. amount of ERC20 token wanted to add. Scenario: the txn is processed after a long waiting time.
        @param toTokenId The Position NFT that is used to store the liquidity.
        @param deadline The timestamp of deadline in seconds
     */
    function addLiquidityETH(
        address collection,
        uint256 fee,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 toTokenId,
        uint256 deadline
    ) external payable checkDeadline(deadline) returns (uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        if (ownerOf(toTokenId) != msg.sender) {
            revert SPM_INVALID_TOKEN_ID();
        }
        (tokenAmount, ids) = _addLiquidity(WETH, collection, fee, msg.value, idsDesired, tokenMin);
        address pair = getPair(WETH, collection, fee);
        IWETH(WETH).deposit{value: tokenAmount}();
        assert(IWETH(WETH).transfer(pair, tokenAmount));

        for (uint256 i; i < idsDesired.length; ) {
            IERC721(collection).safeTransferFrom(msg.sender, pair, idsDesired[i]);
            unchecked {
                ++i;
            }
        }

        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
        if (msg.value > tokenAmount) {
            (bool success, ) = msg.sender.call{value: msg.value - tokenAmount}('');
            if (success == false) {
                revert SPM_ETH_TRANSFER_FAILED();
            }
        }
    }

    /**
        @notice Remove liquidity from the Pair based on the ERC20 address, ERC721 address and fee tier
        @param token The ERC20 contract address
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param liquidity The amount of liquidity wanted to remove.
        @param constraint The constraint to prevent txn get reverted after slippage. Ref: RemoveLiquidityConstraint
        @param fromTokenId The Position NFT that is used to burn the liquidity and redeem the assets.
        @param to The address that will receive the withdrawn assets
        @param deadline The timestamp of deadline in seconds
     */
    function removeLiquidity(
        address token,
        address collection,
        uint256 fee,
        uint256 liquidity,
        RemoveLiquidityConstraint memory constraint,
        uint256 fromTokenId,
        address to,
        uint256 deadline
    ) public returns (uint256 cTokenOut, uint256 cNftOut, uint256 tokenOut, uint256[] memory idsOut) {
        (cTokenOut, cNftOut, tokenOut, idsOut) = _removeLiquidity(
            token,
            collection,
            fee,
            liquidity,
            constraint,
            fromTokenId,
            address(SPEED_BUMP), // transfers to speedBump
            deadline
        );

        SPEED_BUMP.batchRegisterNFTs(collection, idsOut, to);
        SPEED_BUMP.registerToken(token, tokenOut, to);
        return (cTokenOut, cNftOut, tokenOut, idsOut);
    }

    /**
        @notice Remove liquidity from the WETH Pair based on the ERC721 address and fee tier. Also convert WETH to ETH
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param liquidity The amount of liquidity wanted to remove.
        @param constraint The constraint to prevent txn get reverted after slippage. Ref: RemoveLiquidityConstraint
        @param fromTokenId The position NFT that is used to burn the liquidity and redeem the assets.
        @param to The address that will receive the withdrawn assets
        @param deadline The timestamp of deadline in seconds
     */
    function removeLiquidityETH(
        address collection,
        uint256 fee,
        uint256 liquidity,
        RemoveLiquidityConstraint memory constraint,
        uint256 fromTokenId,
        address to, // owner of the NFTs, the user
        uint256 deadline
    ) public returns (uint256 cTokenOut, uint256 cNftOut, uint256 tokenOut, uint256[] memory idsOut) {
        (cTokenOut, cNftOut, tokenOut, idsOut) = _removeLiquidity(
            WETH,
            collection,
            fee,
            liquidity,
            constraint,
            fromTokenId,
            address(this),
            deadline
        );

        for (uint256 i; i < idsOut.length; ) {
            IERC721(collection).safeTransferFrom(address(this), address(SPEED_BUMP), idsOut[i]);
            unchecked {
                ++i;
            }
        }

        IWETH(WETH).withdraw(tokenOut);

        (bool success, ) = address(SPEED_BUMP).call{value: tokenOut}(new bytes(0));
        if (success == false) {
            revert SPM_ETH_TRANSFER_FAILED();
        }

        SPEED_BUMP.batchRegisterNFTs(collection, idsOut, to);
        SPEED_BUMP.registerETH(tokenOut, to);
        return (cTokenOut, cNftOut, tokenOut, idsOut);
    }

    function _removeLiquidity(
        address token,
        address collection,
        uint256 fee,
        uint256 liquidity,
        RemoveLiquidityConstraint memory constraint,
        uint256 fromTokenId,
        address to,
        uint256 deadline
    )
        internal
        checkDeadline(deadline)
        returns (uint256 cTokenOut, uint256 cNftOut, uint256 tokenOut, uint256[] memory idsOut)
    {
        if (ownerOf(fromTokenId) != msg.sender) {
            revert SPM_INVALID_TOKEN_ID();
        }
        address pair = getPair(token, collection, fee);
        transferFrom(fromTokenId, tokenOf(pair), liquidity); // send liquidity to pair
        (cTokenOut, cNftOut, tokenOut, idsOut) = ISeacowsERC721TradePair(pair).burn(msg.sender, to, constraint.nftIds);
        if (cTokenOut < constraint.cTokenOutMin) {
            revert SPM_BELOW_TOKEN_OUT_MIN_CONSTRAINT();
        }
        if (cNftOut < constraint.cNftOutMin) {
            revert SPM_BELOW_NFT_OUT_MIN_CONSTRAINT();
        }
    }

    /**
        @notice Mint a new Position NFTs. If Pair doesn't exist, it will create a new Pair.
        @param token The ERC20 contract address
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param tokenDesired The amount of ERC20 token to add
        @param idsDesired The ids of ERC721 NFT to add
        @param tokenMin The min. amount of ERC20 token wanted to add. Scenario: the txn is processed after a long waiting time.
        @param deadline The timestamp of deadline in seconds
     */
    function mint(
        address token,
        address collection,
        uint256 fee,
        uint256 tokenDesired,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 deadline
    ) external returns (uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        address pair = getPair(token, collection, fee);
        if (pair == address(0)) {
            pair = createPair(token, collection, fee);
        }
        uint256 tokenId = _mint(msg.sender, pairSlots[pair], 0);
        (tokenAmount, ids, liquidity) = addLiquidity(
            token,
            collection,
            fee,
            tokenDesired,
            idsDesired,
            tokenMin,
            tokenId,
            deadline
        );
    }

    /**
        @notice Mint a new Position NFTs with ETH. If Pair doesn't exist, it will create a new Pair.
        @dev The hidden tokenDesired is passed via payable
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param idsDesired The ids of ERC721 NFT to add
        @param tokenMin The min. amount of ERC20 token wanted to add. Scenario: the txn is processed after a long waiting time.
        @param deadline The timestamp of deadline in seconds
     */
    function mintWithETH(
        address collection,
        uint256 fee,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 deadline
    ) external payable checkDeadline(deadline) returns (uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        address pair = getPair(WETH, collection, fee);
        if (pair == address(0)) {
            pair = createPair(WETH, collection, fee);
        }
        uint256 toTokenId = _mint(msg.sender, pairSlots[pair], 0);
        (tokenAmount, ids) = _addLiquidity(WETH, collection, fee, msg.value, idsDesired, tokenMin);
        IWETH(WETH).deposit{value: tokenAmount}();
        assert(IWETH(WETH).transfer(pair, tokenAmount));

        for (uint256 i; i < idsDesired.length; ) {
            IERC721(collection).safeTransferFrom(msg.sender, pair, idsDesired[i]);

            unchecked {
                ++i;
            }
        }

        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
        if (msg.value > tokenAmount) {
            (bool success, ) = msg.sender.call{value: msg.value - tokenAmount}('');
            if (success == false) {
                revert SPM_ETH_TRANSFER_FAILED();
            }
        }
    }

    function mintValue(uint256 tokenId, uint256 _value) public {
        if (pairSlots[msg.sender] != slotOf(tokenId)) {
            revert SPM_ONLY_PAIR_CAN_MINT();
        }
        _mintValue(tokenId, _value);
    }

    /**
        @notice Burn a Position NFT. Only burnable when the liquidity is 0
        @param tokenId The Position NFT TokenID to be burnt
     */
    function burn(uint256 tokenId) public {
        if (ownerOf(tokenId) != msg.sender) {
            revert SPM_UNAUTHORIZED();
        }
        if (balanceOf(tokenId) != 0) {
            revert SPM_ONLY_BURNABLE_WHEN_CLEARED();
        }
        _burn(tokenId);
    }

    function burnValue(uint256 tokenId, uint256 burnValue_) public {
        if (pairSlots[msg.sender] != slotOf(tokenId)) {
            revert SPM_ONLY_PAIR_CAN_BURN();
        }
        _burnValue(tokenId, burnValue_);
    }

    function slotOfPair(address _pair) public view returns (uint256) {
        return pairSlots[_pair];
    }

    function pairOfSlot(uint256 _slot) public view returns (address) {
        return slotPairs[_slot];
    }

    function tokenOf(address _pair) public view returns (uint256) {
        return pairTokenIds[_pair];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_exists(tokenId) == false) {
            revert SPM_INVALID_TOKEN_ID();
        }

        uint256 slotId = slotOf(tokenId);
        ISeacowsERC721TradePair pair = ISeacowsERC721TradePair(slotPairs[slotId]);
        string memory tokenSymbol = ERC20(pair.token()).symbol();
        string memory collectionSymbol = ERC721(pair.collection()).symbol();
        uint256 fee = pair.feePercent();
        uint256 poolShare = (balanceOf(tokenId) * PERCENTAGE_PRECISION * 100) / totalValueSupplyOf(slotId);

        return
            NFTRenderer.render(
                NFTRenderer.RenderParams({
                    pool: address(pair),
                    id: tokenId,
                    tokenSymbol: tokenSymbol,
                    nftSymbol: collectionSymbol,
                    tokenAddress: pair.token(),
                    nftAddress: pair.collection(),
                    swapFee: fee,
                    poolShare: poolShare,
                    owner: ownerOf(tokenId)
                })
            );
    }

    function _createSlot(address _pair) internal returns (uint256 newSlot) {
        _slotGenerator.increment();
        newSlot = _slotGenerator.current();
        pairSlots[_pair] = newSlot;
    }

    function isPaused() external view returns (bool) {
        return paused();
    }
}
