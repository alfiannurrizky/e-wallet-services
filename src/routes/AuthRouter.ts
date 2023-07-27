import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import {
  loginValidation,
  registerValidation
} from '../middlewares/validation/auth'
import auth from '../middlewares/auth'

const router: Router = Router()

router.post('/register', registerValidation, AuthController.register)
router.post('/login', loginValidation, AuthController.login)
router.get('/profile', auth.authenticate, AuthController.profile)

export default router
