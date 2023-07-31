import { Router } from 'express'
import AuthRouter from './AuthRouter'
import WalletRouter from './WalletRouter'

const router: Router = Router()

router.use('/api/v1/', AuthRouter)
router.use('/api/v1/', WalletRouter)

export default router
