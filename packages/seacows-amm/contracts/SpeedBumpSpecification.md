**Specification**
The speedBump contract acts as a temporary holder of ERC-20's and ERC-721's when
they are withdrawn from the pool. It forces the user to wait until the next block
to remove liquidity. This is done to reduce the risk of exploits that make use of flash
loans. Flash loans revert if all liquidity + fees are not returned in the same block,
thus the speedBump makes a flash loan exploit less likely. 

**Constructor**
The constructor takes as an argument the associated address for the position Manager. The functions "registerNftWithdrawal" and "depositEther" have a modifier that makes it so they can only be called by the positionManager.  

**Register Withdrawal ERC-721:**

1. The positionManager sends the NFT (ERC-721) to the SpeedBump contract.
2. The positionManager calls a function on the SpeedBump contract to register the withdrawal request, providing the user’s address and the current block number. This is protected by nonReentrant modifier

**User Withdraw (ERC-721)**
1. The user sends a message to "withdrawNft" with tokenID.
2. If the user has a deposit on the speedBump, and the current block number is at least the block number at registration + 1, the NFT will be transfered to the user

**Depositing ERC-20**
1. The positionManager sends the ERC-20 to the SpeedBump contract.
2. The position manager call depositERC20 with the ERC-20 token address and an amount of the token, registering it to the user in a withdrawl struct

**Withdraw ERC-20**
1. The user sends a message to "withdrawERC20" with the associated address of the ERC-20 contract.
2. If the block number is at least the block number registered in the withdraw struct + 1, the ERC-20 is withdrawn to the user. This is protected by the non-reentrant modifier.