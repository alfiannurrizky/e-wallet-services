import { Router } from 'express'
import WalletController from '../controllers/WalletController'
import auth from '../middlewares/auth'
import {
  topUpValidation,
  transfersValidation
} from '../middlewares/validation/wallet'

const router: Router = Router()

router.get('/details', auth.authenticate, WalletController.detailWallet)
router.post(
  '/topup',
  auth.authenticate,
  topUpValidation,
  WalletController.topUp
)
router.post('/wallets', auth.authenticate, WalletController.createWallet)
router.post(
  '/transfers',
  auth.authenticate,
  transfersValidation,
  WalletController.transfers
)

export default router
