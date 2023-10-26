import { Joi } from "express-validation";

export const regSchemaAdmin = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,12}$")).required(),
    role: Joi.string().valid("admin", "subadmin", "user").required(),
    addName: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).required(),
};

export const regSchemaSubAdmin = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{5,12}$")).required(),
    role: Joi.string().valid("subadmin", "user").required(),
    addName: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required()
  }).required(),
};

export const logSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{5,12}$"))
      .required(),
  }).required(),
};

export const addSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
};

export const restSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  }).required(),
};

export const updateRestSchema = {
  body: Joi.object({
    name: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number(),
  }).required(),
};

export const dishSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    price: Joi.string().required(),
  }).required(),
};

export const updateDishSchema = {
  body: Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    dishId: Joi.number().integer()
  }).required(),
};

export const deleteDishSchema = {
  body : Joi.object({
    dishId : Joi.number().integer().required()
  }).required()
}