import { Router } from 'express'
import { customers2Router } from './customers2'

const routerV1 = Router()

routerV1.use('/customers2', customers2Router)

export { routerV1 }