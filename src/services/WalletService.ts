import { WalletType } from '../types/WalletType'
import prisma from '../utils/database'
import ResponseError from '../utils/response'

interface IWallet {
  addSaldo(id: string, balance: number): Promise<void>
  sendBalance(id: string, balance: number, destination: string): Promise<any>
}
class WalletService implements IWallet {
  async addSaldo(id: string, balance: number) {
    const amount = balance
    const note = 'top up balance'

    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        wallet: true
      }
    })

    if (user && user.wallet) {
      user.wallet.balance += amount

      await prisma.wallet.update({
        where: { id: user.wallet.id },
        data: { balance: user.wallet.balance }
      })

      await prisma.transaction.create({
        data: {
          walletId: user.wallet.id,
          type: 'debit',
          amount: amount,
          description: note
        }
      })
    }

    return
  }

  async sendBalance(id: string, balance: number, destination: string) {
    await prisma.$transaction(async () => {
      const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
          wallet: true
        }
      })

      const userDestination = await prisma.wallet.findUnique({
        where: { id: destination },
        include: {
          user: true
        }
      })

      const amount = balance
      const note = 'transfer balance'

      if (user!.wallet!.balance < amount) {
        throw new ResponseError(400, 'your money is not enough')
      }

      user!.wallet!.balance -= amount

      await prisma.wallet.update({
        where: { id: user!.wallet!.id },
        data: { balance: user!.wallet!.balance }
      })

      await prisma.transaction.create({
        data: {
          walletId: user!.wallet!.id,
          type: 'debit',
          amount: amount,
          description: note
        }
      })

      userDestination!.balance += amount

      await prisma.wallet.update({
        where: { id: userDestination!.id },
        data: { balance: userDestination?.balance }
      })
    })
  }

  async createWallet(payload: WalletType) {
    const wallet = await prisma.wallet.create({
      data: payload
    })

    return wallet
  }

  public async getHistoryTransaction(id: string) {
    const histories = await prisma.wallet.findMany({
      where: { userId: id },
      include: {
        transaction: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return histories
  }
}

export default new WalletService()
