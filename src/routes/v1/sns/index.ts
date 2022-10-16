import { Router } from 'express'
import { authMiddleware } from '../../../middlewares'
import { sns } from '../../../controllers'

const snsRouter = Router()

snsRouter.post('/callback', sns.create)

export { snsRouter }