import supertest from 'supertest'
import app from '../server'
import { createTestUSer, removeTestUser } from './TestUtil'

describe('POST /api/v1/register', () => {
  beforeEach(async () => {
    await createTestUSer()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should return success register user', async () => {
    const response = await supertest(app).post('/api/v1/register').send({
      username: 'test',
      email: 'test@email.com',
      password: 'password'
    })

    expect(response.status).toBe(201)
    expect(response.body.message).toBe('register successfully')
  })

  it('should return failed email exist', async () => {
    const response = await supertest(app).post('/api/v1/register').send({
      username: 'test',
      email: 'testUser@email.com',
      password: 'password'
    })

    expect(response.status).toBe(400)
    expect(response.body.error.message).toBe('email already exist!')
  })

  it('should return required field ', async () => {
    const response = await supertest(app).post('/api/v1/register').send({
      username: '',
      email: 'testUser@email.com',
      password: 'password'
    })

    expect(response.status).toBe(422)
    expect(response.body.message[0].msg).toBe('the username field is required!')
  })

  it('should return failed email format ', async () => {
    const response = await supertest(app).post('/api/v1/register').send({
      username: 'test',
      email: 'wrong email format',
      password: 'password'
    })

    expect(response.status).toBe(422)
    expect(response.body.message[0].msg).toBe('must be an email type!')
  })

  it('should return failed password length less than 8 characters ', async () => {
    const response = await supertest(app).post('/api/v1/register').send({
      username: 'test',
      email: 'testUser@email.com',
      password: 'passw'
    })

    expect(response.status).toBe(422)
    expect(response.body.message[0].msg).toBe('must be min 8 characters')
  })
})

describe('POST api/v1/login', () => {
  beforeEach(async () => {
    await createTestUSer()
  })

  afterEach(async () => {
    await removeTestUser()
  })

  it('should return success login', async () => {
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: 'password'
    })

    expect(response.status).toBe(200)
    expect(response.body.data.token).toBeDefined()
  })

  it('should return failed login wrong password', async () => {
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: 'wrong password'
    })

    expect(response.status).toBe(401)
    expect(response.body.error.message).toBe('email or password is wrong!')
    expect(response.body.success).toBe(false)
  })

  it('should return failed login user not found', async () => {
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'usernotfound@email.com',
      password: 'password'
    })

    expect(response.status).toBe(401)
    expect(response.body.error.message).toBe('user not found!')
    expect(response.body.success).toBe(false)
  })

  it('should return required field', async () => {
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: ''
    })

    expect(response.status).toBe(422)
    expect(response.body.message[0].msg).toBe('the password field is required!')
  })
})

describe('GET api/v1/profile', () => {
  let token: string = ''

  beforeAll(async () => {
    await createTestUSer()
    const response = await supertest(app).post('/api/v1/login').send({
      email: 'testUser@email.com',
      password: 'password'
    })

    token = response.body.data.token
  })

  afterAll(async () => {
    await removeTestUser()
  })

  it('should return get current user login', async () => {
    const response = await supertest(app)
      .get('/api/v1/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.data).toBeDefined()
    expect(response.body.data.username).toBe('testUser')
  })
})
