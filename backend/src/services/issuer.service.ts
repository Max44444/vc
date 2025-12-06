import { agent } from '../config/veramo.config.ts'
import { CredentialService } from './credential.service.ts'
import type { EducationCredentialSubject } from '../schemas/education-credential.schema.ts'
import { IPFSService } from './ipfs.service.ts'
import { PersistenceService} from "./persistence.service.ts";
import { EthersService } from "./ethers.service.ts";
import { VerifiableCredential } from "@veramo/core-types/src/types/vc-data-model.ts";

export class IssuerService {

    private credentialService: CredentialService
    private ipfsService: IPFSService
    private persistenceService: PersistenceService
    private ethersService: EthersService

    constructor() {
        this.credentialService = new CredentialService()
        this.ipfsService = new IPFSService()
        this.persistenceService = new PersistenceService()
        this.ethersService = new EthersService()
    }

    async issueCredential(
        issuerDID: string,
        issuerName: string,
        holderDID: string,
        holderName: string,
        achievement: EducationCredentialSubject['achievement']
    ) {
        try {
            const unsignedCredential = this.credentialService.createUnsignedCredential(
                issuerDID,
                issuerName,
                holderDID,
                achievement
            )

            unsignedCredential.credentialSubject.name = holderName

            const validation = this.credentialService.validateCredential(unsignedCredential)
            if (!validation.valid) {
                throw new Error(`Credential validation failed: ${ JSON.stringify(validation.errors) }`)
            }

            const verifiableCredential = await agent.createVerifiableCredential({
                credential: unsignedCredential,
                proofFormat: 'jwt',
                save: false,
            })

            const cid = await this.ipfsService.addJSON(verifiableCredential)

            const tokenId = await this.ethersService.issueToken(holderDID, cid)

            await this.persistenceService.addCertificate(issuerDID, tokenId, cid)

            return this.transformVCData(tokenId, cid, verifiableCredential)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async verifyCredential(credential: any) {
        try {
            const result = await agent.verifyCredential({credential})

            return {
                verified: result.verified,
                error: result.error,
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async validate(certificateId: string) {
        try {
            const certificateUrl = await this.ethersService.getTokenUri(certificateId)
            const certificateCid = certificateUrl.slice("ipfs://".length)
            const credential = await this.ipfsService.getJSON(certificateCid)

            const result = await agent.verifyCredential({credential})
            return { isValid: result.verified, error: result.error }
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getOrCreateIssuerDID(issuerName: string = 'Default Issuer') {
        try {
            const existingDIDs = await agent.didManagerFind()

            if (existingDIDs.length > 0) {
                return existingDIDs?.[0]?.did
            }

            const identifier = await agent.didManagerCreate({
                alias: issuerName,
                provider: 'did:key',
                kms: 'local',
            })

            return identifier.did
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getIssuerCertificates(issuerId: string) {
        try {
            const issuerData = await this.persistenceService.getByCid(issuerId)

            if (!issuerData) return [];

            return await Promise.all(issuerData.certificates.map(async ({ tokenId, certificateCid }) => {
                const credential = await this.ipfsService.getJSON(certificateCid)
                return this.transformVCData(tokenId, certificateCid, credential)
            }))
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async getCertificateById(certificateId: string) {
        try {
            const certificateUrl = await this.ethersService.getTokenUri(certificateId)
            const certificateCid = certificateUrl.slice("ipfs://".length)
            const credential = await this.ipfsService.getJSON(certificateCid)
            return this.transformVCData(certificateId, certificateCid, credential)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async registerIssuer(name: string, id: string, email: string, description: string) {
        try {
            return await this.persistenceService.add(id, name, email, description)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    private transformVCData(id: string, cid: string, credential: VerifiableCredential) {
        return {
            id,
            recipientDid: credential.credentialSubject.id,
            recipientName: credential.credentialSubject.name,
            courseName: credential.credentialSubject.achievement.name,
            certificateType: credential.credentialSubject.achievement.type,
            pdfData: credential.credentialSubject.achievement.pdfData,
            issuanceDate: credential.issuanceDate,
            grade: credential.credentialSubject.achievement.grade,
            description: credential.credentialSubject.achievement.description,
            issuerDid: typeof credential.issuer !== "string" ? credential.issuer?.id : credential.issuer,
            ipfsCid: cid,
            status: "active",
        }
    }
}
