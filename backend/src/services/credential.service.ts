import { v4 as uuidv4 } from 'uuid'
import type { ValidateFunction } from 'ajv'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import type { EducationCredential, EducationCredentialSubject } from '../schemas/education-credential.schema.ts'
import validationSchema from '../schemas/education-credential-json-schema.json' with { type: "json" };

export class CredentialService {

    private readonly ajv: Ajv
    private readonly validate: ValidateFunction

    constructor() {
        this.ajv = new Ajv()
        addFormats(this.ajv)
        this.validate = this.ajv.compile(validationSchema)
    }

    createUnsignedCredential(
        issuerDID: string,
        issuerName: string,
        holderDID: string,
        achievement: EducationCredentialSubject['achievement']
    ): EducationCredential {
        const credentialId = `https://credentials.example.com/${ uuidv4() }`
        const now = new Date().toISOString()

        return {
            '@context': [
                'https://www.w3.org/2018/credentials/v1',
                'https://www.w3.org/2018/credentials/examples/v1',
                'https://purl.imsglobal.org/spec/ob/v3p0/context.json'
            ],
            id: credentialId,
            type: ['VerifiableCredential', 'OpenBadgeCredential'],
            issuer: {
                id: issuerDID,
                name: issuerName,
                url: 'https://university.example.com'
            },
            issuanceDate: now,
            validFrom: now,
            credentialSubject: {
                id: holderDID,
                name: '',
                achievement
            }
        }
    }

    validateCredential(credential: object): { valid: boolean; errors?: any } {
        const valid = this.validate(credential)
        if (!valid) {
            return {valid: false, errors: this.validate.errors}
        }
        return {valid: true}
    }
}
