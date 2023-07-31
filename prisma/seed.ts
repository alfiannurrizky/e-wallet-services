import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      username: 'test',
      email: 'tes@dawda.com',
      password: 'apssword'
    }
  })

  const wallet = await prisma.wallet.create({
    data: {
      userId: '12312',
      balance: 10000
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
