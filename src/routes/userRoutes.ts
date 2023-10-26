import {Router} from 'express'
import {login, getRestaurants, getDishes, createAddress, getDistance, logout} from '../controllers/users'
import { auth } from '../middlewares/auth';
import { addSchema } from '../utils/validate';
import { validate } from 'express-validation';

const userRouter : Router = Router();

userRouter.post('/login', login)

userRouter.use(auth)

userRouter.get("/restaurants", getRestaurants);
userRouter.get('/restaurant/:id/dishes', getDishes)
userRouter.post('/address', validate(addSchema), createAddress)
userRouter.get('/distance/:restId', getDistance)
userRouter.post('/logout', logout)


export default userRouter;