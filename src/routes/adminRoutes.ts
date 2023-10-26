import { Router } from "express";
import { verifyRole } from "../middlewares/verifyRole";
import { validate } from "express-validation";
import { getRestaurants} from "../controllers/users";
import {adminRestRoute} from '../routes/adminRestRoutes'
import { regSchemaAdmin} from "../utils/validate";
import { getUsers, createUser} from "../controllers/admin";

const adminRoutes: Router = Router();

adminRoutes.use(verifyRole("admin"));

adminRoutes.get("/users", getUsers);
adminRoutes.post("/user", validate(regSchemaAdmin), createUser);
adminRoutes.get("/restaurants", getRestaurants);

adminRoutes.use('/restaurant', adminRestRoute)

export { adminRoutes };