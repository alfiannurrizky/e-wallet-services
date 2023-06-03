import sequelize from '../config/connection'
import { IWallet } from '../types/WalletType'

const { Wallet, User, Transaction } = require('../models')

class WalletService {
  public async addSaldo(balance: number, id: string) {
    const dbTransaction = await sequelize.transaction()

    try {
      const amount = balance
      const note = 'add balance'

      const user = await User.findOne({
        where: { id: id },
        include: 'wallet'
      })

      if (user && user.wallet) {
        user.wallet.balance += amount
        await user.wallet.save()

        const transaction = await Transaction.create({
          walletId: user.wallet.id,
          type: 'debit',
          amount: amount,
          description: note
        })
      }

      await dbTransaction.commit()
    } catch (error) {
      await dbTransaction.rollback()
    }

    return
  }

  public async sendBalance(id: string, balance: number, destination: string) {
    const dbTransaction = await sequelize.transaction()

    try {
      const user = await User.findOne({
        where: { id: id },
        include: 'wallet'
      })

      const destinationUser = await Wallet.findOne({
        where: { id: destination },
        include: 'user'
      })

      const amount = balance
      const note = 'transfer balance'

      if (user.wallet.balance < amount) {
        return { success: false, message: 'your money is not enough' }
      }

      user.wallet.balance -= amount
      await user.wallet.save()

      const transaction = await Transaction.create({
        walletId: user.wallet.id,
        type: 'debit',
        amount: amount,
        description: note
      })

      destinationUser.balance += amount
      await destinationUser.save()

      await dbTransaction.commit()

      return { success: true, message: `success transfer to ${destinationUser.user.username}` }
    } catch (error) {
      await dbTransaction.rollback()
    }
  }

  public async createWallet(payload: IWallet) {
    const wallet = await Wallet.create(payload)

    return wallet
  }

  public async getHistoryTransaction(id: string) {
    const histories = await Wallet.findAll({
      where: { userId: id },
      include: 'transactions',
      order: [['createdAt', 'DESC']]
    })

    return histories
  }
}

export default new WalletService()
