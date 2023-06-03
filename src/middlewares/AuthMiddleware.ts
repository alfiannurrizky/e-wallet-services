import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token
  if (!token) {
    return res.status(401).json({ message: 'unauthenticated' })
  }
  try {
    const data: any = jwt.verify(token, process.env.JWT_TOKEN!)
    res.locals = data.payload
    return next()
  } catch (error) {
    return res.status(400).json({
      succes: false,
      message: 'Invalid token'
    })
  }
}
