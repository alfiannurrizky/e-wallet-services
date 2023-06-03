import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import multer from 'multer'
import cookieParser from 'cookie-parser'
import router from './routes/index'
import sequelize from './config/connection'

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
    this.app.use(bodyParser.json())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(multer().none())
    this.app.use(cookieParser())
    this.app.use(router)
  }

  protected routes(): void {
    this.app.use(router)
  }
}

const port = process.env.PORT
const app = new App().app

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.')
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error)
  })

app.listen(port, () => {
  console.log(`server running on port ${port}`)
})
