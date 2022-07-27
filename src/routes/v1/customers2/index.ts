import { Router } from 'express'
import { authMiddleware } from '../../../middlewares'
import { customers2 } from '../../../controllers'

const customers2Router = Router()

customers2Router.post('/send-email', authMiddleware, customers2.find)

export { customers2Router }