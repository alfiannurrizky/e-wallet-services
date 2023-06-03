import { IUser } from '../types/UserType'

const { User } = require('../models')

class AuthService {
  public async createUser(payload: IUser) {
    const user = await User.create(payload)

    return user
  }

  public async checkEmailAlreadyTaken(email: string) {
    const userEmail = await User.findOne({ where: { email: email } })

    return userEmail
  }

  public async findByEmail(email: string) {
    const userEmail = await User.findOne({
      where: { email: email }
    })

    return userEmail
  }

  public async userProfile(id: string) {
    const user = await User.findOne({
      where: { id: id },
      include: 'wallet',
      attributes: {
        exclude: ['password']
      }
    })

    return user
  }
}

export default new AuthService()
