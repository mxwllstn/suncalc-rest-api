import { Response } from 'express'
export type Id = string | number
export type Item = Record<string, unknown>
export type List = Item[]

export type Data = Record<string, unknown>

export type ApiResponse = {
  data: Data | Data[]
  status?: number
}

const utils = {
  groupByKey: (list: any[], key: string | number): any =>
    list.reduce((hash, obj) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }), {}),
  isObject: (data: Record<string, unknown>): boolean => typeof data === 'object' && !!data,
  isEmptyObject: (data: Record<string, unknown>): boolean => utils.isObject(data) && Object.keys(data).length === 0,
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
  parseThrownError: (error: any): any => {
    return JSON.parse(error.message)
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
  },
  kebabize: (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase()),
  camelize: (str: string) => str.replace(/-./g, x=>x[1].toUpperCase())
}

export default utils
