import { Request, Response } from 'express'
import { CustomRequest } from '../../../middlewares/authMiddleware'

export const create = async (request: Request, response: Response) => {
  console.log('/sns request.headers', request.headers)
  console.log('/sns request.body', request.body)
    response.status(200).send()
}