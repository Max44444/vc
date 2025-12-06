export interface EducationCredentialSubject {
    id: string
    name: string
    email?: string
    achievement: {
        type: string
        name: string
        description?: string
        creditsEarned?: number
        completionDate: string
        grade?: string
        pdfData?: string
        skills?: string[]
    }
}

export interface EducationCredential {
    '@context': string[]
    id: string
    type: string[]
    issuer: {
        id: string
        name: string
        url?: string
    }
    issuanceDate: string
    validFrom?: string
    validUntil?: string
    credentialSubject: EducationCredentialSubject
    credentialSchema?: {
        id: string
        type: string
    }
    proof?: {
        type: string
        created: string
        proofPurpose: string
        verificationMethod: string
        jws?: string
    }
}
