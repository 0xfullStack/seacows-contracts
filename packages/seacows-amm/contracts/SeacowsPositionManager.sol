// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.13;

import {SeacowsERC3525} from './base/SeacowsERC3525.sol';
import {SeacowsERC721TradePairFactory} from './base/SeacowsERC721TradePairFactory.sol';
import {FeeManagement} from './base/FeeManagement.sol';
import {ISeacowsPositionManager} from './interfaces/ISeacowsPositionManager.sol';
import {ISeacowsERC721TradePair} from './interfaces/ISeacowsERC721TradePair.sol';
import {IWETH} from './interfaces/IWETH.sol';
import {SpeedBump} from './base/SpeedBump.sol';

contract SeacowsPositionManager is
    SeacowsERC3525,
    SeacowsERC721TradePairFactory,
    FeeManagement,
    ISeacowsPositionManager
{
    address public immutable WETH;
    SpeedBump public immutable SPEED_BUMP;

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

    receive() external payable {
        require(msg.sender == WETH);
    }

    /**
        @notice Creates a new Pair for a ERC20 Token and ERC721 Collection with specified fee tier
        @param _token The ERC20 contract address
        @param _collection The ERC721 contract address
        @param _fee The fee tier. Please check TradePair for the fee tiers.
        @return _pair The new created pair address
     */
    function createPair(address _token, address _collection, uint256 _fee) public returns (address _pair) {
        _pair = _createPair(_token, _collection, _fee);
        uint256 _slot = _createSlot(_pair);
        pairSlots[_pair] = _slot;
        slotPairs[_slot] = _pair;
        pairTokenIds[_pair] = _mint(_pair, _slot, 0);
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
        @return tokenAmount The amount of ERC20 token user added
        @return ids The nft tokenIDs array of collection user added
        @return liquidity The liquidity value user received
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
    ) public returns (uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        _checkDeadline(deadline);
        _checkTokenIdOwner(toTokenId, msg.sender);
        (tokenAmount, ids) = _addLiquidity(token, collection, fee, tokenDesired, idsDesired, tokenMin);
        address pair = getPair(token, collection, fee);
        _sendERC20Tokens(token, msg.sender, pair, tokenAmount);
        _sendERC721Tokens(collection, msg.sender, pair, idsDesired);
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
        @return tokenAmount The amount of eth user added
        @return ids The nft tokenIDs array of collection user added
        @return liquidity The liquidity value user received
     */
    function addLiquidityETH(
        address collection,
        uint256 fee,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 toTokenId,
        uint256 deadline
    ) external payable returns (uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        _checkDeadline(deadline);
        _checkTokenIdOwner(toTokenId, msg.sender);
        (tokenAmount, ids) = _addLiquidity(WETH, collection, fee, msg.value, idsDesired, tokenMin);
        address pair = getPair(WETH, collection, fee);
        IWETH(WETH).deposit{value: tokenAmount}();

        if (IWETH(WETH).transfer(pair, tokenAmount) == false) {
            revert SPM_TOKEN_TRANSFER_FAILED();
        }

        _sendERC721Tokens(collection, msg.sender, pair, idsDesired);

        liquidity = ISeacowsERC721TradePair(pair).mint(toTokenId);
        if (msg.value > tokenAmount) {
            _sendETHs(msg.sender, msg.value - tokenAmount);
        }
    }

    /**
        @notice Remove liquidity from the Pair based on the ERC20 address, ERC721 address and fee tier
        @dev cTokenOut and cNftOut are calculated based on the user's actual share, 
        representing the expected quantities the user can receive, including floating points. 
        However, due to the indivisibility of NFTs, we must adjust through the core compensation algorithm to ensure the obtained NFT quantity is an integer, 
        namely tokenOut and idsOut.
        @param token The ERC20 contract address
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param liquidity The amount of liquidity wanted to remove.
        @param constraint The constraint to prevent txn get reverted after slippage. Ref: RemoveLiquidityConstraint
        @param fromTokenId The Position NFT that is used to burn the liquidity and redeem the assets.
        @param to The address that will receive the withdrawn assets
        @param deadline The timestamp of deadline in seconds
        @return cTokenOut The estimated amount of ERC20 tokens the user is expected to receive.
        @return cNftOut The estimated count of ERC721 tokens the user is expected to receive.
        @return tokenOut The actual amount of ERC20 tokens received after be adjusted by algorithmic compensation.
        @return idsOut An array of token IDs representing the actual ERC721 tokens received, after be adjusted by algorithmic compensation.
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
        @dev cTokenOut and cNftOut are calculated based on the user's actual share, 
        representing the expected quantities the user can receive, including floating points. 
        However, due to the indivisibility of NFTs, we must adjust through the core compensation algorithm to ensure the obtained NFT quantity is an integer, 
        namely tokenOut and idsOut.
        @param collection The ERC721 contract address
        @param fee The fee tier. Please check TradePair for the fee tiers.
        @param liquidity The amount of liquidity wanted to remove.
        @param constraint The constraint to prevent txn get reverted after slippage. Ref: RemoveLiquidityConstraint
        @param fromTokenId The position NFT that is used to burn the liquidity and redeem the assets.
        @param to The address that will receive the withdrawn assets
        @param deadline The timestamp of deadline in seconds
        @return cTokenOut The estimated amount of ERC20 tokens the user is expected to receive.
        @return cNftOut The estimated count of ERC721 tokens the user is expected to receive.
        @return tokenOut The actual amount of ERC20 tokens received after be adjusted by algorithmic compensation.
        @return idsOut An array of token IDs representing the actual ERC721 tokens received, after be adjusted by algorithmic compensation.
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

        _sendERC721Tokens(collection, address(this), address(SPEED_BUMP), idsOut);
        IWETH(WETH).withdraw(tokenOut);
        _sendETHs(address(SPEED_BUMP), tokenOut);
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
    ) internal returns (uint256 cTokenOut, uint256 cNftOut, uint256 tokenOut, uint256[] memory idsOut) {
        _checkDeadline(deadline);
        _checkTokenIdOwner(fromTokenId, msg.sender);
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
        @return newTokenId The new minted user tokenID in the pair, also stand for user's position ID
        @return tokenAmount The amount of ERC20 token user added
        @return ids The nft tokenIDs array of collection user added
        @return liquidity The liquidity value user received
     */
    function mint(
        address token,
        address collection,
        uint256 fee,
        uint256 tokenDesired,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 deadline
    ) external returns (uint256 newTokenId, uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        address pair = getPair(token, collection, fee);
        if (pair == address(0)) {
            pair = createPair(token, collection, fee);
        }
        newTokenId = _mint(msg.sender, pairSlots[pair], 0);
        (tokenAmount, ids, liquidity) = addLiquidity(
            token,
            collection,
            fee,
            tokenDesired,
            idsDesired,
            tokenMin,
            newTokenId,
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
        @return newTokenId The new minted user tokenID in the pair, also stand for user's position ID
        @return tokenAmount The amount of eth user added
        @return ids The nft tokenIDs array of collection user added
        @return liquidity The liquidity value user received
     */
    function mintWithETH(
        address collection,
        uint256 fee,
        uint256[] memory idsDesired,
        uint256 tokenMin,
        uint256 deadline
    ) external payable returns (uint256 newTokenId, uint256 tokenAmount, uint256[] memory ids, uint256 liquidity) {
        _checkDeadline(deadline);
        address pair = getPair(WETH, collection, fee);
        if (pair == address(0)) {
            pair = createPair(WETH, collection, fee);
        }
        newTokenId = _mint(msg.sender, pairSlots[pair], 0);
        (tokenAmount, ids) = _addLiquidity(WETH, collection, fee, msg.value, idsDesired, tokenMin);
        IWETH(WETH).deposit{value: tokenAmount}();
        if (IWETH(WETH).transfer(pair, tokenAmount) == false) {
            revert SPM_TOKEN_TRANSFER_FAILED();
        }

        _sendERC721Tokens(collection, msg.sender, pair, idsDesired);
        liquidity = ISeacowsERC721TradePair(pair).mint(newTokenId);
        if (msg.value > tokenAmount) {
            _sendETHs(msg.sender, msg.value - tokenAmount);
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
        _checkTokenIdOwner(tokenId, msg.sender);
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
        return _renderTokenMetadata(tokenId);
    }
}
