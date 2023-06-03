import { Router } from 'express'
import WalletController from '../controllers/WalletController'
import { auth } from '../middlewares/AuthMiddleware'

const router: Router = Router()

router.get('/details', auth, WalletController.detailWallet)
router.post('/topup', auth, WalletController.topUp)
router.post('/wallets', auth, WalletController.createWallet)
router.post('/transfers', auth, WalletController.transfers)

export default router
