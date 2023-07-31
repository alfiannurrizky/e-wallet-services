import { Request, Response } from 'express'
import logger from '../utils/logger'

const { Transaction, Wallet } = require('../models')

class TransactionController {
  public async getTransaction(req: Request, res: Response) {
    const transaction = await Transaction.findAll({
      include: 'wallet'
    })

    logger.info('success get all data transaction')

    return res.status(200).json({ data: transaction })
  }
}

export default new TransactionController()
