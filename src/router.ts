import express, { Router, Request, Response } from 'express'
import utils from './lib/utils'
import suncalc from 'suncalc'
import dayjs from 'dayjs'
const { throwError, handleResponse, handleError } = utils

const router = <Router>express.Router()

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
      'goldenHour'
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
    const data =
      calc === 'position'
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

export default router
