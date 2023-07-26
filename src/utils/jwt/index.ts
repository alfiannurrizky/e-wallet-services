import { UserType } from '../../types/UserType'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

class JWT {
  signToken(
    payload: Omit<UserType, 'password'>,
    expires = '1h'
  ): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          payload: payload,
          iat: Date.now()
        },
        process.env.TOKEN!,
        {
          expiresIn: expires
        },
        (err, token) => {
          if (err) {
            reject(err)
          }
          resolve(token)
        }
      )
    })
  }

  verifyToken(token: string): Promise<jwt.JwtPayload | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.TOKEN!, (err, decoded) => {
        if (err) {
          reject(err)
        }
        resolve(decoded as JwtPayload)
      })
    })
  }
}

export default new JWT()
