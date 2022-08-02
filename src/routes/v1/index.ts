import { Router } from 'express'
import { customers2Router } from './customers2'
import { snsRouter } from './sns'

const routerV1 = Router()

routerV1.use('/customers2', customers2Router)
routerV1.use('/sns', snsRouter)

export { routerV1 }