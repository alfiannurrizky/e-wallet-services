import { Request, Response } from 'express'
import AuthService from '../services/AuthService'
import dotenv from 'dotenv'
import { UserType } from '../types/UserType'
import logger from '../utils/logger'
dotenv.config()

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const payload: UserType = req.body

      await AuthService.register(payload)

      logger.info('sucess register user')

      return res.status(201).json({
        success: true,
        message: 'register successfully'
      })
    } catch (error) {
      logger.error('failed register user')
      res.status(400).json({ success: false, error })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const payload: Pick<UserType, 'email' | 'password'> = req.body
      const token = await AuthService.login(payload)

      logger.info('sucess login user')

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          tokenType: 'Bearer',
          token: token
        }
      })
    } catch (error) {
      logger.error('failed login user')
      res.status(401).json({ success: false, error })
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = await AuthService.profile(req.user.id)

      logger.info('sucess get current user')

      return res.status(200).json({
        message: 'data user',
        data: user
      })
    } catch (error) {
      logger.error('failed get current user')
      res.status(500).json({ error: error })
    }
  }
}

export default new AuthController()
