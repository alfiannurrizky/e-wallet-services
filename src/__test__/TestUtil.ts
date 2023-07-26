import prisma from '../utils/database'
import bcrypt from 'bcrypt'

export const createTestUSer = async () => {
  await prisma.user.create({
    data: {
      username: 'testUser',
      email: 'testUser@email.com',
      password: await bcrypt.hash('password', 10)
    }
  })
}

export const removeTestUser = async () => {
  await prisma.user.deleteMany({
    where: {
      username: {
        contains: 'test'
      }
    }
  })
}
