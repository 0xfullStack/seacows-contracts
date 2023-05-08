import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { type MockSeacowsERC3525 } from 'types';

describe('SeacowsERC3525', () => {
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let MockSeacowsERC3525: MockSeacowsERC3525;

  beforeEach(async () => {
    [, alice, bob] = await ethers.getSigners();
    const nftFactoryLibraryFactory = await ethers.getContractFactory('NFTRenderer');
    const rendererLib = await nftFactoryLibraryFactory.deploy();

    const MockSeacowsERC3525FC = await ethers.getContractFactory('MockSeacowsERC3525', {
      libraries: {
        NFTRenderer: rendererLib.address,
      },
    });

    MockSeacowsERC3525 = await MockSeacowsERC3525FC.deploy();
  });

  it('Should store the totalValueSupply of each slot', async () => {
    /**
     * @notes
     * Alice:
     * Slot = 1, Token ID = 1, value = 5 ether
     * Slot = 2, Token ID = 2, value = 6 ether
     *
     * Bob:
     * Slot = 1, Token ID = 3, value = 7 ether
     * Slot = 2, Token ID = 4, value = 8 ether
     */
    await (await MockSeacowsERC3525.mint(alice.address, 1, 1, ethers.utils.parseEther('5'))).wait();
    await (await MockSeacowsERC3525.mint(alice.address, 2, 2, ethers.utils.parseEther('6'))).wait();
    await (await MockSeacowsERC3525.mint(bob.address, 3, 1, ethers.utils.parseEther('7'))).wait();
    await (await MockSeacowsERC3525.mint(bob.address, 4, 2, ethers.utils.parseEther('8'))).wait();

    // Verify
    expect(await MockSeacowsERC3525.totalValueSupplyOf(1)).to.be.equal(ethers.utils.parseEther('12'));
    expect(await MockSeacowsERC3525.totalValueSupplyOf(2)).to.be.equal(ethers.utils.parseEther('14'));
  });

  it('updates totalValueSupply of each slot correctly', async () => {
    /**
     * @notes
     * Slot 1 mint:
     * Token ID = 1, value = 5 ether
     * Token ID = 2, value = 6 ether
     * Total Supply = 11
     *
     * Slot 1 burn:
     * Token ID = 1, value = 1 ether
     * Token ID = 2, value = 2 ether
     * Total Supply = 8
     *
     */
    await (await MockSeacowsERC3525.mint(alice.address, 1, 1, ethers.utils.parseEther('5'))).wait();
    await (await MockSeacowsERC3525.mint(alice.address, 2, 1, ethers.utils.parseEther('6'))).wait();
    expect(await MockSeacowsERC3525.totalValueSupplyOf(1)).to.be.equal(ethers.utils.parseEther('11'));

    await (await MockSeacowsERC3525.burnValue(1, ethers.utils.parseEther('1'))).wait();
    await (await MockSeacowsERC3525.burnValue(2, ethers.utils.parseEther('2'))).wait();

    expect(await MockSeacowsERC3525['balanceOf(uint256)'](1)).to.be.equal(ethers.utils.parseEther('4'));
    expect(await MockSeacowsERC3525['balanceOf(uint256)'](2)).to.be.equal(ethers.utils.parseEther('4'));
    expect(await MockSeacowsERC3525.totalValueSupplyOf(1)).to.be.equal(ethers.utils.parseEther('8'));
  });
});
