import { check, validationResult } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

export const topUpValidation = [
  check('balance')
    .notEmpty()
    .isInt()
    .withMessage('the balance field is required!'),

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

export const transfersValidation = [
  check('balance')
    .notEmpty()
    .isInt()
    .withMessage('the balance field is required!'),
  check('walletId').notEmpty().withMessage('the walletId field is required!'),

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
