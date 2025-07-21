import express, { Express, Request, Response, Router } from 'express'
import suncalc from 'suncalc'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
dotenv.config()

const app = express() as Express
const router = express.Router() as Router

const host = process.env.HOST ?? '0.0.0.0'
const port = process.env.PORT ?? 8081

app.listen(port, () => {
  console.log(`App listening at ${host}:${port}`)
})

export type Data = Record<string, unknown>

export interface ApiResponse {
  data: Data | Data[]
  status?: number
}

const throwError = (message: any, status = 400): any => {
  throw new Error(JSON.stringify({ status, message }))
}
const handleResponse = (res: Response, response: ApiResponse): void => {
  const { status, data } = response
  if (process.env.NODE_ENV !== 'production') {
    console.log({ status: status ?? 200, data })
  }
  res.status(status ?? 200).send(data)
}
const handleError = (res: Response, error: any): void => {
  const { status, message } = parseError(error)
  res.status(status).send({ message })
}
const parseError = (error: any): any => {
  if (error?.response) {
    const { status, data } = error?.response ?? {}
    console.log({ status, message: data })
    return { status, message: data }
  } else {
    try {
      if (error?.body) {
        const { status, message } = JSON.parse(error?.body) ?? {}
        console.log({ status, message })
        return { status, message }
      } else {
        const { status, message } = JSON.parse(error?.message) ?? {}
        console.log({ status, message })
        return { status, message }
      }
    } catch {
      console.log(error)
      const { status, message } = error ?? {}
      console.log({ status: status ?? 400, message: message ?? 'Internal Server Error' })
      return { status: status ?? 400, message: message ?? 'Internal Server Error' }
    }
  }
}

router.get('/:calc/:date/:latitude,:longitude', (req: Request, res: Response): void => {
  try {
    const timeTypes = [
      'solarNoon',
      'nadir',
      'sunrise',
      'sunset',
      'sunriseEnd',
      'sunsetStart',
      'dawn',
      'dusk',
      'nauticalDawn',
      'nauticalDusk',
      'nightEnd',
      'night',
      'goldenHourEnd',
      'goldenHour',
    ] as const

    const type = req.query.type as TimeTypes

    type TimeTypes = (typeof timeTypes)[number]

    const calc = req.params.calc as 'position' | 'times' | TimeTypes
    if ((calc !== 'position' && calc !== 'times' && !timeTypes.includes(calc)) || (type && !timeTypes.includes(type))) {
      throwError('calc must be position or times or a valid time type')
    }
    if (!req.params.date || !req.params.latitude || !req.params.longitude) {
      throwError('required params missing')
    }
    const latitude = Number(req.params.latitude)
    const longitude = Number(req.params.longitude)
    const date = req.params.date === 'now' ? new Date() : new Date(dayjs(req.params.date).format())
    const times = suncalc.getTimes(date, latitude, longitude)
    const data
      = calc === 'position'
        ? (suncalc.getPosition(times.sunrise, latitude, longitude) as any)
        : calc === 'times'
          ? times[type]
            ? { [type]: times[type] }
            : times
          : { [calc]: times[calc] }

    handleResponse(res, { status: 200, data })
  } catch (error: any) {
    handleError(res, error)
  }
})

app.use('/api', router)
