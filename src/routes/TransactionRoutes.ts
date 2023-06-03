import { Router } from 'express'
import TransactionController from '../controllers/TransactionController'
import { auth } from '../middlewares/AuthMiddleware'

const router: Router = Router()

router.get('/transactions', auth, TransactionController.getTransaction)

export default router
