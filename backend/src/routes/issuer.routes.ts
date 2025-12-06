import { Router } from 'express'
import { IssuerController } from '../controllers/issuer.controller.ts'

const router = Router()
const issuerController = new IssuerController()

router.post('/issue', issuerController.issue)
router.post('/verify', issuerController.verify)
router.post('/validate', issuerController.validate)
router.post('/register', issuerController.registerIssuer)
router.get('/did', issuerController.getIssuerDID)
router.get('/certificates', issuerController.getIssuerCertificates)
router.get('/certificate', issuerController.getCertificateById)

export default router
