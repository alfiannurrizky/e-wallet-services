import { Request, Response } from 'express'
import AuthService from '../services/AuthService'
import dotenv from 'dotenv'
import { UserType } from '../types/UserType'
dotenv.config()

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const payload: UserType = req.body

      await AuthService.register(payload)

      return res.status(201).json({
        success: true,
        message: 'register successfully'
      })
    } catch (error) {
      res.status(400).json({ success: false, error })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const payload: Pick<UserType, 'email' | 'password'> = req.body
      const token = await AuthService.login(payload)

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          tokenType: 'Bearer',
          token: token
        }
      })
    } catch (error) {
      res.status(401).json({ success: false, error })
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const user = await AuthService.profile(req.user.id)

      return res.status(200).json({
        message: 'data user',
        data: user
      })
    } catch (error) {
      res.status(500).json({ error: error })
    }
  }
}

export default new AuthController()
