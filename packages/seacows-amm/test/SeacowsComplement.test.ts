import { type SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { type MockSeacowsComplement, type MockERC20, type MockERC721 } from 'types';

describe('MockSeacowsComplement', () => {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let carol: SignerWithAddress;
  let MockSeacowsComplement: MockSeacowsComplement;
  let MockERC721: MockERC721;
  let MockERC20: MockERC20;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const MockSeacowsComplementFC = await ethers.getContractFactory('MockSeacowsComplement');
    const MockERC721FC = await ethers.getContractFactory('MockERC721');
    const MockERC20FC = await ethers.getContractFactory('MockERC20');

    MockSeacowsComplement = await MockSeacowsComplementFC.deploy();
    MockERC721 = await MockERC721FC.deploy();
    MockERC20 = await MockERC20FC.deploy();

    /**
     * @notes
     * Mint assets to MockSeacowsComplement
     * MockERC20: 4 ethers
     * MockERC721: [0, 1, 2, 3]
     */
    await MockERC20.mint(MockSeacowsComplement.address, ethers.utils.parseEther('4'));
    for (let i = 0; i < 4; i++) {
      await MockERC721.mint(MockSeacowsComplement.address);
    }
  });

  it('Should have correct constants', async () => {
    expect(await MockSeacowsComplement.COMPLEMENT_PRECISION()).to.equal(ethers.utils.parseEther('1'));
    expect(await MockSeacowsComplement.COMPLEMENT_THRESHOLD()).to.equal(ethers.utils.parseEther('0.5'));
  });

  it('Should get the complemented balance correctly', async () => {
    const [tokenBalance, nftBalance] = await MockSeacowsComplement.getComplementedBalance(
      MockERC20.address,
      MockERC721.address,
    );
    expect(tokenBalance).to.equal(ethers.utils.parseEther('4'));
    expect(nftBalance).to.be.equal(ethers.utils.parseEther('4'));
  });

  /**
   * @notes
   * Input:
   * Tokens: 0.2 ETH, NFTs: 0.2 NFTs
   *
   * Output:
   * Tokens: 0.4 ETH, NFTs: 0 NFTs
   */
  it('should output 0 NFT but more tokens when complemented NFT amount < 0.5 NFT', async () => {
    const expectedTokenOut = ethers.utils.parseEther('0.2');
    const expectedNFTOut = ethers.utils.parseEther('0.2');

    expect(await MockSeacowsComplement.tokenComplement()).to.equal(0);
    expect(await MockSeacowsComplement.nftComplement()).to.equal(0);

    await (await MockSeacowsComplement.updateComplement(expectedTokenOut, expectedNFTOut)).wait();

    expect(await MockSeacowsComplement.tokenAmountOut()).to.equal(ethers.utils.parseEther('0.4'));
    expect(await MockSeacowsComplement.nftAmountOut()).to.equal(0);

    const [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(ethers.utils.parseEther('0.2'));
    expect(complement1).to.equal(ethers.utils.parseEther('-0.2'));
  });

  /**
   * @notes
   * Input:
   * Tokens: 1 ETH, NFTs: 1 NFTs
   *
   * Output:
   * Tokens: 1 ETH, NFTs: 1 NFTs
   */
  it('should output 1 NFT when complemented NFT amount = 1 NFT', async () => {
    const expectedTokenOut = ethers.utils.parseEther('1');
    const expectedNFTOut = ethers.utils.parseEther('1');
    await (await MockSeacowsComplement.updateComplement(expectedTokenOut, expectedNFTOut)).wait();
    expect(await MockSeacowsComplement.tokenAmountOut()).to.equal(ethers.utils.parseEther('1'));
    expect(await MockSeacowsComplement.nftAmountOut()).to.equal(ethers.utils.parseEther('1'));

    const [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(0);
    expect(complement1).to.equal(0);
  });

  /**
   * @notes
   * Input:
   * Tokens: 2.9 ETH, NFTs: 2.9 NFTs
   *
   * Output:
   * Tokens: 2.8 ETH, NFTs: 3 NFTs
   */
  it('should output round off amount of NFT but more tokens when complemented NFT amount > 0.5 NFT', async () => {
    const expectedTokenOut = ethers.utils.parseEther('2.9');
    const expectedNFTOut = ethers.utils.parseEther('2.9');
    await (await MockSeacowsComplement.updateComplement(expectedTokenOut, expectedNFTOut)).wait();
    expect(await MockSeacowsComplement.tokenAmountOut()).to.equal(ethers.utils.parseEther('2.8'));
    expect(await MockSeacowsComplement.nftAmountOut()).to.equal(ethers.utils.parseEther('3'));

    const [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(ethers.utils.parseEther('-0.1'));
    expect(complement1).to.equal(ethers.utils.parseEther('0.1'));
  });

  /**
   * @notes
   * Given inital complement
   * Token Complement: -0.2 ETH
   * NFT Complement: 0.2 NFTs
   *
   * Input:
   * Tokens: 3.1 ETH, NFTs: 3.1 NFTs
   *
   * Output:
   * Tokens: 3.2 ETH, NFTs: 3 NFTs
   */
  it('should output more tokens when less NFTs are output', async () => {
    // Setup initial complement
    await (
      await MockSeacowsComplement.updateComplement(ethers.utils.parseEther('0.2'), ethers.utils.parseEther('0.2'))
    ).wait();
    let [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(ethers.utils.parseEther('0.2'));
    expect(complement1).to.equal(ethers.utils.parseEther('-0.2'));

    // Process actual output
    const expectedTokenOut = ethers.utils.parseEther('3.1');
    const expectedNFTOut = ethers.utils.parseEther('3.1');
    await (await MockSeacowsComplement.updateComplement(expectedTokenOut, expectedNFTOut)).wait();
    expect(await MockSeacowsComplement.tokenAmountOut()).to.equal(ethers.utils.parseEther('3.2'));
    expect(await MockSeacowsComplement.nftAmountOut()).to.equal(ethers.utils.parseEther('3'));

    [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(ethers.utils.parseEther('0.3'));
    expect(complement1).to.equal(ethers.utils.parseEther('-0.3'));
  });

  /**
   * @notes
   * Given inital complement
   * Token Complement: -0.2 ETH
   * NFT Complement: 0.2 NFTs
   *
   * Input:
   * Tokens: 2.6 ETH, NFTs: 2.6 NFTs
   *
   * Output:
   * Tokens: 2.2 ETH, NFTs: 3 NFTs
   */
  it('should output less tokens when more NFTs are output', async () => {
    // Setup initial complement
    await (
      await MockSeacowsComplement.updateComplement(ethers.utils.parseEther('0.2'), ethers.utils.parseEther('0.2'))
    ).wait();
    let [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(ethers.utils.parseEther('0.2'));
    expect(complement1).to.equal(ethers.utils.parseEther('-0.2'));

    // Process actual output
    const expectedTokenOut = ethers.utils.parseEther('2.7');
    const expectedNFTOut = ethers.utils.parseEther('2.7');
    await (await MockSeacowsComplement.updateComplement(expectedTokenOut, expectedNFTOut)).wait();
    expect(await MockSeacowsComplement.tokenAmountOut()).to.equal(ethers.utils.parseEther('2.4'));
    expect(await MockSeacowsComplement.nftAmountOut()).to.equal(ethers.utils.parseEther('3'));

    [complement0, complement1] = await MockSeacowsComplement.complements();
    expect(complement0).to.equal(ethers.utils.parseEther('-0.1'));
    expect(complement1).to.equal(ethers.utils.parseEther('0.1'));
  });
});
