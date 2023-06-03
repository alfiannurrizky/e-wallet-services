import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import { auth } from '../middlewares/AuthMiddleware'
import { loginValidation, registerValidation } from '../validations/UserValidation'

const router: Router = Router()

router.post('/register', registerValidation, AuthController.register)
router.post('/login', loginValidation, AuthController.login)
router.get('/profile', auth, AuthController.profile)
router.post('/logout', auth, AuthController.logout)

export default router
