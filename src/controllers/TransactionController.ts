import { Request, Response } from 'express'

const { Transaction, Wallet } = require('../models')

class TransactionController {
  public async getTransaction(req: Request, res: Response) {
    const transaction = await Transaction.findAll({
      include: 'wallet'
    })

    return res.status(200).json({ data: transaction })
  }
}

export default new TransactionController()
