import { Request, Response } from 'express'
import WalletService from '../services/WalletService'
import logger from '../utils/logger'

class WalletController {
  public async detailWallet(req: Request, res: Response) {
    try {
      const detail = await WalletService.getHistoryTransaction(req.user.id)

      logger.info('success get history transaction user')

      return res.status(200).json({
        message: `history transactions ${req.user.username}`,
        data: detail
      })
    } catch (error) {
      logger.error('failed get history transaction user')
      res.status(500).json({ error })
    }
  }

  async topUp(req: Request, res: Response) {
    try {
      const topup = await WalletService.addSaldo(req.user.id, req.body.balance)

      logger.info('success top up balance user')

      return res.status(200).json({
        success: true,
        message: `success top up balance ${req.body.balance}`
      })
    } catch (error) {
      logger.error('failed top up balance user')
      res.status(500).json({ error })
    }
  }

  public async transfers(req: Request, res: Response) {
    try {
      const userId = req.user.id
      const balance = parseInt(req.body.balance)
      const userDestination = req.body.walletId

      const transfer = await WalletService.sendBalance(
        userId,
        balance,
        userDestination
      )

      logger.info('success transfers balance')

      return res.status(200).json({
        success: true,
        message: `success transfer`
      })
    } catch (error) {
      logger.error('failed transfers balance')
      res.status(400).json({
        success: false,
        error
      })
    }
  }

  async createWallet(req: Request, res: Response) {
    try {
      const wallet = await WalletService.createWallet({
        userId: req.user.id,
        balance: 0
      })

      logger.info('success created wallet')

      return res.status(201).json({
        success: true,
        message: 'success create new wallet',
        data: wallet
      })
    } catch (error) {
      logger.error('failed created wallet')
      console.error(error)
    }
  }
}

export default new WalletController()
