import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import multer from 'multer'
import router from './routes/index'

dotenv.config()

class App {
  public app: Application

  constructor() {
    this.app = express()
    this.plugins()
    this.routes()
  }

  protected plugins(): void {
    this.app.use(cors())
    this.app.use(morgan('combined'))
    this.app.use(express.json())
    this.app.use(multer().none())
    this.app.use(router)
  }

  protected routes(): void {
    this.app.use(router)
  }
}

const app = new App().app
export default app
