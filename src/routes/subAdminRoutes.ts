import {Router} from 'express'
import {validate} from 'express-validation'
import { deleteDishSchema, dishSchema, regSchemaSubAdmin, restSchema, updateDishSchema, updateRestSchema } from '../utils/validate'
import {getUsers, createUser, getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant, getDishes, createDish, updateDish, deleteDish} from '../controllers/subAdmin'
import { verifyRole } from '../middlewares/verifyRole'
import { subAdminRestRoute } from './subAdminRestRoutes'

const subAdminRoutes : Router = Router()

subAdminRoutes.use(verifyRole('subadmin'))

subAdminRoutes.get('/users', getUsers)
subAdminRoutes.post('/user', validate(regSchemaSubAdmin), createUser)
subAdminRoutes.get('/restaurants', getRestaurants)

subAdminRoutes.use('/restaurant', subAdminRestRoute)

export {subAdminRoutes}