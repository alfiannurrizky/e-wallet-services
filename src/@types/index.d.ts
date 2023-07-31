import 'express'
import { UserType } from '../types/UserType'

declare global {
  namespace Express {
    interface Request {
      user: UserType
    }
  }
}
