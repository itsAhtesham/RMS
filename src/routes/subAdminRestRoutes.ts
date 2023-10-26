import {Router} from 'express'
import {validate} from 'express-validation'
import { deleteDishSchema, dishSchema, restSchema, updateDishSchema, updateRestSchema } from '../utils/validate'
import {createRestaurant, updateRestaurant, deleteRestaurant, getDishes, createDish, updateDish, deleteDish} from '../controllers/subAdmin'

const subAdminRestRoute : Router = Router()

subAdminRestRoute.post('/', validate(restSchema), createRestaurant)
subAdminRestRoute.put('/:id', validate(updateRestSchema), updateRestaurant)
subAdminRestRoute.delete('/:id', deleteRestaurant)

subAdminRestRoute.get('/:id/dishes', getDishes)
subAdminRestRoute.post('/:id/dish', validate(dishSchema), createDish)
subAdminRestRoute.put('/:id/dish', validate(updateDishSchema), updateDish)
subAdminRestRoute.delete('/:id/dish', validate(deleteDishSchema), deleteDish)

export {subAdminRestRoute}