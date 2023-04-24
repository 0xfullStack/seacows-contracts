import { expect } from "chai";
import { ethers } from "hardhat";
import { MockSeacowsComplement, MockERC20, MockERC721 } from "types";

describe("SeacowsComplement", async function () {
  const [owner, alice, bob] = await ethers.getSigners();

  const SeacowsComplementFC = await ethers.getContractFactory("MockSeacowsComplement");
  const MockERC721FC = await ethers.getContractFactory("MockERC721");
  const MockERC20FC = await ethers.getContractFactory("MockERC20");
  let SeacowsComplement: MockSeacowsComplement;
  let MockERC721: MockERC721;
  let MockERC20: MockERC20;

  this.beforeEach(async () => {
    SeacowsComplement = await SeacowsComplementFC.deploy();
    MockERC721 = await MockERC721FC.deploy();
    MockERC20 = await MockERC20FC.deploy();

    MockERC20.mint(alice.address, "1 ethers");
    MockERC721.mint(alice.address);
  });

  it("Should revert with the right error if called too soon", async function () {
    await MockERC20.balanceOf(alice.address);
    // const { lock } = await loadFixture(deployOneYearLockFixture);
    // await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });
});
