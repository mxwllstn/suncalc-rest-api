import express, { Express } from 'express'
import router from './router'
import cors from 'cors'
import dotenv from 'dotenv'
import morganBody from 'morgan-body'
import morgan from 'morgan'
dotenv.config()

const app = <Express>express()

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8081

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
  morganBody(app)
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/api', router)

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`)
})
