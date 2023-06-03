import { Request, Response } from 'express'
import WalletService from '../services/WalletService'
const { Wallet, User, Transaction } = require('../models')

class WalletController {
  public async detailWallet(req: Request, res: Response) {
    const detail = await WalletService.getHistoryTransaction(res.locals.id)

    return res.status(200).json({
      message: `history transactions ${res.locals.username}`,
      data: detail
    })
  }

  public async topUp(req: Request, res: Response) {
    const topup = await WalletService.addSaldo(req.body.balance, res.locals.id)

    return res.status(200).json({
      success: true,
      message: `success top up balance ${req.body.balance}`
    })
  }

  public async transfers(req: Request, res: Response) {
    const userId = res.locals.id
    const balance = parseInt(req.body.balance)
    const userDestination = req.body.walletId

    const transfer = await WalletService.sendBalance(userId, balance, userDestination)

    return transfer?.success
      ? res.status(200).json({ success: true, message: transfer.message })
      : res.status(400).json({ success: false, message: transfer?.message })
  }

  public async createWallet(req: Request, res: Response) {
    const wallet = await WalletService.createWallet({
      userId: res.locals.id,
      balance: 0
    })

    return res.status(201).json({
      success: true,
      message: 'success',
      data: wallet
    })
  }
}

export default new WalletController()
