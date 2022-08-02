import { Response } from 'express'
import { CustomRequest } from '../../../middlewares/authMiddleware'

export const create = async (request: CustomRequest, response: Response) => {
  console.log('/sns request.body', request.body)
    response.status(200).send()
}