import { check, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

export const registerValidation = [
  check('username').notEmpty().withMessage('the username field is required!'),
  check('email').isEmail().withMessage('must be an email type!').notEmpty().withMessage('the email field is required!'),
  check('password')
    .notEmpty()
    .withMessage('the password field is required!')
    .isLength({ min: 8 })
    .withMessage('must be min 8 characters'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()
      })
    }
    next()
  }
]

export const loginValidation = [
  check('email').notEmpty().withMessage('the email field is required!'),
  check('password').notEmpty().withMessage('the password field is required!'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: errors.array()
      })
    }
    next()
  }
]
