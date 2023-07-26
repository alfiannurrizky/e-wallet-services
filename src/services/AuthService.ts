import { User } from '@prisma/client'
import { UserType } from '../types/UserType'
import prisma from '../utils/database'
import bcrypt from 'bcrypt'
import ResponseError from '../utils/response'

interface IAuthService {
  register(payload: UserType): Promise<User>
}

class AuthService implements IAuthService {
  async register(payload: UserType) {
    const emailExist = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    })

    if (emailExist) {
      throw new ResponseError(400, 'email already exist!')
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10)

    const user = await prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        password: hashedPassword
      }
    })

    return user
  }
}

export default new AuthService()
