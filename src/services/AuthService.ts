import { User } from '@prisma/client'
import { UserType } from '../types/UserType'
import prisma from '../utils/database'
import bcrypt from 'bcrypt'
import ResponseError from '../utils/response'
import JWT from '../utils/jwt'

interface IAuthService {
  register(payload: UserType): Promise<User>
  login(payload: Pick<UserType, 'email' | 'password'>): Promise<string>
  profile(id: string): Promise<object | null>
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

  async login(payload: Pick<UserType, 'email' | 'password'>) {
    const existUser = await prisma.user.findUnique({
      where: {
        email: payload.email
      }
    })

    if (!existUser) {
      throw new ResponseError(404, 'user not found!')
    }

    const isValid = await bcrypt.compare(payload.password, existUser.password)

    if (!isValid) {
      throw new ResponseError(400, 'email or password is wrong!')
    }

    const result = {
      id: existUser.id,
      username: existUser.username,
      email: existUser.email
    }

    const token = await JWT.signToken(result)

    if (!token) {
      throw new ResponseError(401, 'invalid token')
    }

    return token
  }

  async profile(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        id: true,
        username: true,
        email: true,
        wallet: true
      }
    })

    return user
  }
}

export default new AuthService()
