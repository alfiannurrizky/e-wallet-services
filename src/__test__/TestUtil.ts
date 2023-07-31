import { User, Wallet } from '@prisma/client'
import prisma from '../utils/database'
import bcrypt from 'bcrypt'

export const createTestUser = async (): Promise<User> => {
  const user = await prisma.user.create({
    data: {
      username: 'testUser',
      email: 'testUser@email.com',
      password: await bcrypt.hash('password', 10)
    }
  })

  return user
}

export const createTestUserDestination = async (): Promise<User> => {
  const userDestination = await prisma.user.create({
    data: {
      username: 'testUserDestination',
      email: 'testUser2@email.com',
      password: await bcrypt.hash('password', 10)
    }
  })

  return userDestination
}

export const getTestUser = async (): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      username: 'testUser'
    }
  })

  return user
}

export const getTestUserDestination = async (): Promise<User | null> => {
  const userDestination = await prisma.user.findFirst({
    where: {
      username: 'testUserDestination'
    }
  })

  return userDestination
}

export const getTestWallet = async (id: string): Promise<Wallet | null> => {
  const wallet = await prisma.wallet.findUnique({
    where: {
      userId: id
    }
  })

  return wallet
}

export const removeTestUser = async () => {
  await prisma.user.deleteMany()
}

export const createTestWallet = async (id: string) => {
  await prisma.wallet.create({
    data: {
      userId: id,
      balance: 100000
    }
  })
}

export const removeTestWallet = async () => {
  await prisma.wallet.deleteMany()
}

export const removeTestTransaction = async () => {
  await prisma.transaction.deleteMany()
}
