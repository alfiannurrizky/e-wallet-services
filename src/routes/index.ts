import { Router } from 'express'
import AuthRoutes from './AuthRoutes'
import WalletRoutes from './WalletRoutes'

const router: Router = Router()

router.use('/api/v1/', AuthRoutes)
router.use('/api/v1/', WalletRoutes)

export default router
