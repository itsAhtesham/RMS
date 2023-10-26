import { Router } from "express";
import { validate } from "express-validation";
import { getDishes } from "../controllers/users";
import { restSchema, updateRestSchema, dishSchema, updateDishSchema, deleteDishSchema} from "../utils/validate";
import { createRestaurant, updateRestaurant, deleteRestaurant, createDish, updateDish, deleteDish} from "../controllers/admin";

const adminRestRoute: Router = Router();

adminRestRoute.post("/", validate(restSchema), createRestaurant);
adminRestRoute.put("/:id", validate(updateRestSchema), updateRestaurant);
adminRestRoute.delete("/:id", deleteRestaurant);

adminRestRoute.get("/:id/dishes", getDishes);
adminRestRoute.post("/:id/dish", validate(dishSchema), createDish);
adminRestRoute.put("/:id/dish", validate(updateDishSchema), updateDish);
adminRestRoute.delete("/:id/dish", validate(deleteDishSchema), deleteDish);

export {adminRestRoute}