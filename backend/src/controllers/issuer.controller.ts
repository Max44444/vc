import type { Request, Response } from 'express'
import { IssuerService } from '../services/issuer.service.ts'

const issuerService = new IssuerService()

const handleError = (res: Response, error: unknown, defaultMessage: string): void => {
    if (error instanceof Error) {
        res.status(500).json({ error: error.message })
    } else {
        res.status(500).json({ error: defaultMessage })
    }
}

export class IssuerController {
    async issue(req: Request, res: Response): Promise<void> {
        try {
            const { issuerDID, issuerName, holderDID, holderName, achievement } = req.body

            const result = await issuerService.issueCredential(
                issuerDID,
                issuerName,
                holderDID,
                holderName,
                achievement
            )

            res.status(201).json(result)
        } catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }

    async verify(req: Request, res: Response): Promise<void> {
        try {
            const { credential } = req.body

            const result = await issuerService.verifyCredential(credential)

            res.status(200).json(result)
        } catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }

    async validate(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.query

            const result = await issuerService.validate(id as string)

            res.status(200).json(result)
        } catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }

    async getIssuerDID(req: Request, res: Response): Promise<void> {
        try {
            const { issuerName } = req.query

            const did = await issuerService.getOrCreateIssuerDID(issuerName as string)

            res.status(200).json({ did })
        } catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }

    async getIssuerCertificates(req: Request, res: Response): Promise<void> {
        try {
            const { issuerId } = req.query

            const certificates = await issuerService.getIssuerCertificates(issuerId as string)

            res.status(200).json(certificates)
        } catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }

    async getCertificateById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.query

            const certificate = await issuerService.getCertificateById(id as string)

            res.status(200).json(certificate)
        } catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }

    async registerIssuer(req: Request, res: Response): Promise<void> {
        try {
            const { name, id, email, description } = req.body

            const issuerData = await issuerService.registerIssuer(name, id, email, description)

            res.status(200).json(issuerData)
        }catch (error) {
            handleError(res, error, 'Unknown error')
        }
    }
}
