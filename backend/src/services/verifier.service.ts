import { agent } from '../config/veramo.config.ts'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import validationSchema from '../schemas/education-credential-json-schema.json' with { type: "json" };

export interface VerificationResult {
    valid: boolean
    verified: boolean
    errors?: any[]
    schemaValidation?: {
        valid: boolean
        errors?: any[]
    }
    signatureVerification?: {
        verified: boolean
        error?: string
    }
    structureValidation?: {
        valid: boolean
        errors?: string[]
    }
}

export class VerifierService {
    private ajv: Ajv
    private validate: any

    constructor() {
        this.ajv = new Ajv({ allErrors: true })
        addFormats(this.ajv)

        try {
            this.validate = this.ajv.compile(validationSchema)
        } catch (error) {
            console.warn('JSON Schema not loaded, schema validation will be skipped')
        }
    }

    async verifyCredential(credential: any): Promise<VerificationResult> {
        const result: VerificationResult = {
            valid: false,
            verified: false,
        }

        try {
            const structureValidation = this.validateW3CStructure(credential)
            result.structureValidation = structureValidation

            if (!structureValidation.valid) {
                result.errors = structureValidation.errors
                return result
            }

            if (this.validate) {
                const schemaValid = this.validate(credential)
                result.schemaValidation = {
                    valid: schemaValid,
                    errors: this.validate.errors || [],
                }

                if (!schemaValid) {
                    result.errors = this.validate.errors
                }
            }

            const verificationResult = await agent.verifyCredential({
                credential,
            })

            result.signatureVerification = {
                verified: verificationResult.verified,
                error: verificationResult.error?.message,
            }

            result.verified = verificationResult.verified
            result.valid = structureValidation.valid &&
                (result.schemaValidation?.valid !== false) &&
                verificationResult.verified

            return result
        } catch (error) {
            if (error instanceof Error) {
                result.errors = [error.message]
            }
            return result
        }
    }

    private validateW3CStructure(credential: any): { valid: boolean; errors?: string[] } {
        const errors: string[] = []

        if (!credential['@context']) {
            errors.push('Missing required field: @context')
        } else {
            if (!Array.isArray(credential['@context'])) {
                errors.push('@context must be an array')
            } else if (!credential['@context'].includes('https://www.w3.org/2018/credentials/v1')) {
                errors.push('@context must include https://www.w3.org/2018/credentials/v1')
            }
        }

        if (!credential.type) {
            errors.push('Missing required field: type')
        } else {
            if (!Array.isArray(credential.type)) {
                errors.push('type must be an array')
            } else if (!credential.type.includes('VerifiableCredential')) {
                errors.push('type must include VerifiableCredential')
            }
        }

        if (!credential.credentialSubject) {
            errors.push('Missing required field: credentialSubject')
        } else if (typeof credential.credentialSubject !== 'object') {
            errors.push('credentialSubject must be an object')
        }

        if (!credential.issuer) {
            errors.push('Missing required field: issuer')
        }

        if (!credential.issuanceDate && !credential.validFrom) {
            errors.push('Missing required field: issuanceDate or validFrom')
        }

        if (credential.issuanceDate && !this.isValidISODate(credential.issuanceDate)) {
            errors.push('issuanceDate must be a valid ISO 8601 date')
        }

        if (credential.proof) {
            if (!credential.proof.type) {
                errors.push('proof.type is required')
            }
            if (!credential.proof.proofPurpose) {
                errors.push('proof.proofPurpose is required')
            }
            if (!credential.proof.verificationMethod) {
                errors.push('proof.verificationMethod is required')
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        }
    }

    private isValidISODate(dateString: string): boolean {
        const date = new Date(dateString)
        return date instanceof Date && !isNaN(date.getTime()) &&
            date.toISOString().slice(0, -5) === dateString.slice(0, -5)
    }

    async validateJSONLDContext(credential: any): Promise<{ valid: boolean; error?: string }> {
        try {
            const contexts = credential['@context']

            if (!Array.isArray(contexts)) {
                return { valid: false, error: '@context must be an array' }
            }

            const requiredContexts = [
                'https://www.w3.org/2018/credentials/v1',
            ]

            for (const required of requiredContexts) {
                if (!contexts.includes(required)) {
                    return {
                        valid: false,
                        error: `Missing required context: ${required}`
                    }
                }
            }

            return { valid: true }
        } catch (error) {
            if (error instanceof Error) {
                return { valid: false, error: error.message }
            }
            return { valid: false, error: 'Unknown error' }
        }
    }
}
