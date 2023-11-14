import { Response } from 'express'

export type Data = Record<string, unknown>

export type ApiResponse = {
  data: Data | Data[]
  status?: number
}

const utils = {
  throwError: (message: any, status = 400): Promise<any> => {
    throw new Error(JSON.stringify({ status, message }))
  },
  handleResponse: (res: Response, response: ApiResponse): void => {
    const { status, data } = response
    res.status(status || 200).send(data)
  },
  handleError: (res: Response, error: any): void => {
    const { status, message } = utils.parseError(error)
    res.status(status).send({ message })
  },
  parseError: (error: any): any => {
    if (error?.response) {
      const { status, data } = error?.response || {}
      return { status, message: data }
    } else {
      try {
        if (error?.body) {
          const { status, message } = JSON.parse(error?.body) || {}
          return { status, message }
        } else {
          const { status, message } = JSON.parse(error?.message) || {}
          return { status, message }
        }
      } catch {
        console.log(error)
        const { status, message } = error || {}
        return { status: status || 400, message: message || 'Internal Server Error' }
      }
    }
  }
}

export default utils
