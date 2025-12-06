import { expect } from "chai";
import hre from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SBTModule = buildModule("SBT", (m) => {
    const sbt = m.contract("SoulboundToken", ["SBT", "SBT"]);
    return { sbt };
});

it ("should should have the correct values", async () => {
    const connection = await hre.network.connect();
    const [owner, addr1] = await connection.ethers.getSigners();

    const { sbt } = await connection.ignition.deploy(SBTModule);
    const sbtAddress = await sbt.getAddress();

    const fullSbt = await connection.ethers.getContractAt("SoulboundToken", sbtAddress);

    await fullSbt.safeMint(addr1.address, "https://uri.com/1");

    expect(await fullSbt.locked(1)).to.equal(true);
    expect(await fullSbt.ownerOf(1)).to.equal(addr1.address);

    await expect(
        fullSbt.connect(addr1).transferFrom(addr1.address, owner.address, 1)
    ).to.be.revertedWith("SBT: token is soulbound");

    await fullSbt.connect(addr1).burn(1);
    expect(fullSbt.ownerOf(1)).to.be.revert;
})
