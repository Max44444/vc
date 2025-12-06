import { pinata } from '../config/ipfs.config.ts'

export class IPFSService {
    async addJSON(data: object): Promise<string> {
        try {
            const result = await pinata.pinJSONToIPFS(data, {
                pinataMetadata: {
                    name: `credential-${Date.now()}`,
                },
            })
            return result.IpfsHash
        } catch (error) {
            console.error(error)
            throw error;
        }
    }

    async getJSON(cid: string): Promise<any> {
        try {
            const url = `https://ipfs.io/ipfs/${cid}`
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Gateway error: ${response.statusText}`)
            }

            return await response.json()
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}
