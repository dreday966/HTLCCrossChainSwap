const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock", function () {
  
  async function deployHTLCFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Htlc = await ethers.getContractFactory("HTLC");
    const htlc = await Htlc.deploy();

    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy();
    
    const NFT = await ethers.getContractFactory("TestNFT");
    const nft = await NFT.deploy();

    return { token, nft, htlc, owner, otherAccount };
  }

  describe("LockETH", function () {
    it("refund immediatelly should fail", async function () {
      const { htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await htlc.lockETH(now + 60, 1, otherAccount.address, hash, {value: 1})
      await expect(htlc.refundETH()).to.be.reverted;
    });
    it("refund in 61s should success", async function () {
      const { htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await htlc.lockETH(now + 60, 1, otherAccount.address, hash, {value: 1})
      await network.provider.send("evm_increaseTime", [61])
      await expect(htlc.refundETH()).not.to.be.reverted;
    });
    it("withdaw with wrong r should fail", async function () {
      const { htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const notR = "0x123456"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await htlc.lockETH(now + 60, 1, otherAccount.address, hash, {value: 1})
      await expect(htlc.withdrawETH(notR)).to.be.reverted;
    });
    it("withdaw with right r should success", async function () {
      const { htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await htlc.lockETH(now + 60, 1, otherAccount.address, hash, {value: 1})
      await expect(htlc.withdrawETH(r)).not.to.be.reverted;
    });
  });

  describe("LockToken", function () {
    it("refund immediatelly should fail", async function () {
      const { htlc, otherAccount, token } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000)
      await token.approve(htlc.address, 1) 
      await htlc.lockToken(now + 60, [token.address, 1], otherAccount.address, hash)
      await expect(htlc.refundToken()).to.be.reverted;
    });
    it("refund in 61s should success", async function () {
      const { token, htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await token.approve(htlc.address, 1) 
      await htlc.lockToken(now + 60, [token.address, 1], otherAccount.address, hash)
      await network.provider.send("evm_increaseTime", [61])
      await expect(htlc.refundToken()).not.to.be.reverted;
    });
    it("withdaw with wrong r should fail", async function () {
      const { token, htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const notR = "0x123456"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await token.approve(htlc.address, 1) 
      await htlc.lockToken(now + 60, [token.address, 1], otherAccount.address, hash)
      await expect(htlc.withdrawToken(notR)).to.be.reverted;
    });
    it("withdaw with right r should success", async function () {
      const { token, htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await token.approve(htlc.address, 1) 
      await htlc.lockToken(now + 60, [token.address, 1], otherAccount.address, hash)
      await expect(htlc.withdrawToken(r)).not.to.be.reverted;
    });
  });

  describe("LockNFT", function () {
    it("refund immediatelly should fail", async function () {
      const { htlc, otherAccount, nft } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000)
      await nft.approve(htlc.address, 7) 
      await htlc.lockNFT(now + 60, [nft.address, 7], otherAccount.address, hash)
      await expect(htlc.refundNFT()).to.be.reverted;
    });
    it("refund in 61s should success", async function () {
      const { nft, htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await nft.approve(htlc.address, 7) 
      await htlc.lockNFT(now + 60, [nft.address, 7], otherAccount.address, hash)
      await network.provider.send("evm_increaseTime", [61])
      await expect(htlc.refundNFT()).not.to.be.reverted;
    });
    it("withdaw with wrong r should fail", async function () {
      const { nft, htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const notR = "0x123456"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await nft.approve(htlc.address, 7) 
      await htlc.lockNFT(now + 60, [nft.address, 7], otherAccount.address, hash)
      await expect(htlc.withdrawNFT(notR)).to.be.reverted;
    });
    it("withdaw with right r should success", async function () {
      const { nft, htlc, otherAccount } = await loadFixture(deployHTLCFixture);
      const r = "0x1234"
      const hash = ethers.utils.keccak256(r)
      const now = Math.round(Date.now()/1000) 
      await nft.approve(htlc.address, 7) 
      await htlc.lockNFT(now + 60, [nft.address, 7], otherAccount.address, hash)
      await expect(htlc.withdrawNFT(r)).not.to.be.reverted;
    });
  });



  
});
