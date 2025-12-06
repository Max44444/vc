import { agent } from '../config/veramo.config.ts'

export class DIDService {


    async createDID() {
        const didEntity = await agent.didManagerCreate()
        return didEntity
    }

    async resolveDID(did: string) {
        const didDocument = await agent.resolveDid({ didUrl: did })
        return didDocument
    }

    async getAllDIDs() {
        const dids = await agent.didManagerFind()
        return dids
    }
}
