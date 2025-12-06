import hre from "hardhat";
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

async function main() {
	const SBTModule = buildModule("SBT", (m) => {
		const sbt = m.contract("SoulboundToken", ["SBT", "SBT"]);
		return { sbt };
	});

	const connection = await hre.network.connect();

	const { sbt } = await connection.ignition.deploy(SBTModule);

	console.log("Contract SoulboundToken deployed to:", await sbt.getAddress());
}

main()
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
