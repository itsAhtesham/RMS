import {Router} from "express";
import {adminRoutes} from './adminRoutes'
import {subAdminRoutes} from './subAdminRoutes'

const rms : Router = Router();

rms.use('/admin', adminRoutes)
rms.use('/sub-admin', subAdminRoutes)

export default rms;