import { Contract, ContractTransactionReceipt, ContractTransactionResponse, ethers, JsonRpcProvider } from "ethers";
import SBT_ABI from "../resources/SoulboundToken_ABI.json" with {type: "json"};
import dotenv from "dotenv";
dotenv.config();

export class EthersService {

    private contract: Contract

    constructor() {
        const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/" + process.env.INFURA_API_KEY!);
        const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);

        this.contract = new ethers.Contract(process.env.SBT_ADDRESS!, SBT_ABI, wallet);
    }

    async issueToken(recipient: string, vcCid: string): Promise<string> {
        const mintTx: ContractTransactionResponse = await this.contract.safeMint!(recipient, `ipfs://${vcCid}`);
        const result: ContractTransactionReceipt | null = await mintTx.wait();

        const transferLog = result!.logs.map(log => {
            try {
                return this.contract.interface.parseLog(log)
            } catch(e) {
                return null;
            }
        }).filter(x => !!x && x.name === "Transfer")[0];

        return transferLog!.args.tokenId.toString()
    }

    async getTokenUri(id: string): Promise<string> {
        return await this.contract.tokenURI!(id)
    }
}