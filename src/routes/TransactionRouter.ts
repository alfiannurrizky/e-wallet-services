import { Router } from 'express'
import TransactionController from '../controllers/TransactionController'
import auth from '../middlewares/auth'

const router: Router = Router()

router.get(
  '/transactions',
  auth.authenticate,
  TransactionController.getTransaction
)

export default router
