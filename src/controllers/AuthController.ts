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

  // public async login(req: Request, res: Response) {
  //   const user = await AuthService.findByEmail(req.body.email)

  //   if (!user) {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: 'user not found!' })
  //   }

  //   const comparePassword = await passwordCompare(
  //     req.body.password,
  //     user.password
  //   )

  //   if (!comparePassword) {
  //     return res
  //       .status(400)
  //       .json({ success: false, message: 'email or password is wrong' })
  //   }

  //   const accessTokenExpireIn = process.env.ACCESS_TOKEN_EXPIRE
  //   const refreshTokenExpireIn = process.env.REFRESH_TOKEN_JWT_EXPIRE

  //   const payload = {
  //     id: user.id,
  //     username: user.username,
  //     email: user.email
  //   }

  //   const accessToken = jwt.sign({ payload }, process.env.JWT_TOKEN!, {
  //     expiresIn: accessTokenExpireIn
  //   })
  //   const resfreshToken = jwt.sign({ payload }, process.env.JWT_TOKEN!, {
  //     expiresIn: refreshTokenExpireIn
  //   })

  //   return res
  //     .cookie('access_token', accessToken, {
  //       httpOnly: true,
  //       sameSite: 'strict'
  //     })
  //     .cookie('refreshToken', resfreshToken, {
  //       httpOnly: true,
  //       sameSite: 'strict'
  //     })
  //     .status(200)
  //     .json({ succes: true, message: 'login successfully' })
  // }

  // public profile = async (req: Request, res: Response) => {
  //   const user = await AuthService.userProfile(res.locals.id)

  //   return res.status(200).json({
  //     success: true,
  //     data: user
  //   })
  // }

  // public async logout(req: Request, res: Response) {
  //   const logout = res.clearCookie('access_token')

  //   res.status(200).json({ message: 'logout successfully' })
  // }
}

export default new AuthController()
