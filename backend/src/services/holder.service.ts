import { agent } from '../config/veramo.config.ts'
import { IPFSService } from './ipfs.service.ts'

export interface StoredCredential {
    id: string
    credential: any
    cid?: string
    receivedAt: string
}

export class HolderService {
    private ipfsService: IPFSService
    private credentials: Map<string, StoredCredential> // In-memory storage (for MVP)

    constructor() {
        this.ipfsService = new IPFSService()
        this.credentials = new Map()
    }

    async createHolderDID(alias: string = 'Student') {
        try {
            const identifier = await agent.didManagerCreate({
                alias,
                provider: 'did:key',
                kms: 'local',
            })

            return {
                did: identifier.did,
                alias: identifier.alias,
                keys: identifier.keys,
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getHolderDIDs() {
        try {
            return await agent.didManagerFind()
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async receiveCredential(credential: any, storeToPinata: boolean = false) {
        try {
            const verification = await agent.verifyCredential({ credential })

            if (!verification.verified) {
                throw new Error('Invalid credential: verification failed')
            }

            const credentialId = credential.id || credential.credentialSubject.id
            const receivedAt = new Date().toISOString()

            let cid: string | undefined

            if (storeToPinata) {
                cid = await this.ipfsService.addJSON(credential)
            }

            const storedCredential: StoredCredential = {
                id: credentialId,
                credential,
                cid,
                receivedAt,
            }

            this.credentials.set(credentialId, storedCredential)

            return {
                success: true,
                credentialId,
                cid,
                receivedAt,
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getCredentials(holderDID?: string) {
        try {
            const allCredentials = Array.from(this.credentials.values())

            if (holderDID) {
                return allCredentials.filter(
                    (cred) => cred.credential.credentialSubject.id === holderDID
                )
            }

            return allCredentials
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getCredentialById(credentialId: string) {
        try {
            const credential = this.credentials.get(credentialId)

            if (!credential) {
                throw new Error('Credential not found')
            }

            return credential
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getCredentialFromIPFS(cid: string) {
        try {
            const credential = await this.ipfsService.getJSON(cid)
            return credential
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async deleteCredential(credentialId: string) {
        try {
            const deleted = this.credentials.delete(credentialId)

            if (!deleted) {
                throw new Error('Credential not found')
            }

            return { success: true, credentialId }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
