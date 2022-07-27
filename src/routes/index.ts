import { Router } from 'express'
import { routerV1 } from './v1'

const routes = Router()

routes.use('/v1', routerV1)
routes.get('/health', async (request, response) => {
    response.status(200).json({ message: `Live - ${new Date()}` })
})

export { routes }