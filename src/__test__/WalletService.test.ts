import supertest from 'supertest'
import app from '../server'
import {
  createTestUser,
  createTestUserDestination,
  createTestWallet,
  getTestUser,
  getTestUserDestination,
  getTestWallet,
  removeTestTransaction,
  removeTestUser,
  removeTestWallet
} from './TestUtil'

describe('POST /api/v1/wallets', () => {
  let token: string = ''

  beforeAll(async () => {
    await createTestUser()
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: 'password'
    })

    token = response.body.data.token
  })

  afterEach(async () => {
    await removeTestWallet()
  })

  afterAll(async () => {
    await removeTestUser()
  })

  it('should return success create new wallet', async () => {
    const response = await supertest(app)
      .post('/api/v1/wallets')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('success create new wallet')
    expect(response.body.data).toBeDefined()
  })
})

describe('POST /api/v1/topup', () => {
  let token: string = ''

  beforeAll(async () => {
    const user = await createTestUser()
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: 'password'
    })

    token = response.body.data.token
    await createTestWallet(user.id)
  })

  afterAll(async () => {
    await removeTestTransaction()
    await removeTestWallet()
    await removeTestUser()
  })

  it('should return success top up balance', async () => {
    const response = await supertest(app)
      .post('/api/v1/topup')
      .set('Authorization', `Bearer ${token}`)
      .send({
        balance: 300000
      })

    const user = await getTestUser()
    const wallet = await getTestWallet(user!.id)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('success top up balance 300000')
    expect(wallet?.balance).toBe(400000)
  })

  it('should return required field top up balance', async () => {
    const response = await supertest(app)
      .post('/api/v1/topup')
      .set('Authorization', `Bearer ${token}`)
      .send({
        balance: ''
      })

    expect(response.status).toBe(422)
    expect(response.body.message[0].path).toBe('balance')
  })
})

describe('POST /api/v1/transfer', () => {
  let token: string = ''

  beforeAll(async () => {
    const user = await createTestUser()
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: 'password'
    })

    token = response.body.data.token
    await createTestWallet(user.id)

    const userDestination = await createTestUserDestination()
    await createTestWallet(userDestination.id)
  })

  afterAll(async () => {
    await removeTestTransaction()
    await removeTestWallet()
    await removeTestUser()
  })

  it('should return success transfer balance', async () => {
    const user = await getTestUser()
    const userDestination = await getTestUserDestination()
    const userWalletDestination = await getTestWallet(userDestination!.id)

    const response = await supertest(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user?.id,
        balance: 100000,
        walletId: userWalletDestination!.id
      })

    const userWallet = await getTestWallet(user!.id)
    const destinationWallet = await getTestWallet(userDestination!.id)

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('success transfer')
    expect(userWallet?.balance).toBe(0)
    expect(destinationWallet?.balance).toBe(200000)
  })

  it('should return required field', async () => {
    const user = await getTestUser()
    const userDestination = await getTestUserDestination()
    const userWalletDestination = await getTestWallet(userDestination!.id)

    const response = await supertest(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user?.id,
        balance: '',
        walletId: userWalletDestination!.id
      })

    expect(response.status).toBe(422)
    expect(response.body.message[0].path).toBe('balance')
  })

  it('should return failed transfer less money', async () => {
    const user = await getTestUser()
    const userDestination = await getTestUserDestination()
    const wallet = await getTestWallet(userDestination!.id)

    const response = await supertest(app)
      .post('/api/v1/transfers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: user?.id,
        balance: 500000,
        walletId: wallet!.id
      })

    expect(response.status).toBe(400)
    expect(response.body.error.message).toBe('your money is not enough')
  })
})
