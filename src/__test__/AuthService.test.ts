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
