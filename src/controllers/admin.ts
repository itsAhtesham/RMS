import { Request, Response } from "express";
import pool from "../database/config/connection";
import bcrypt from 'bcryptjs'

const getUsers = async(req:Request, res: Response) => {
    try {
        const sql = 'SELECT name, email, role FROM users JOIN user_roles on users.id = user_roles.userID JOIN roles on user_roles.roleID = roles.id'
        const result = await pool.query(sql)
        res.status(200).json({message:'All Users :', data : result.rows})
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

const createUser =async (req:Request, res:Response) => {
    try {
        const createdBy = req.id
        const { name, email, password, role, addName, latitude, longitide} = req.body
        const encryptedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users(name, email, password, createdBy) VALUES($1,$2,$3,$4) returning id'
        const result = await pool.query(sql, [name, email, encryptedPassword, createdBy])
        const roleSql = 'SELECT id FROM roles WHERE role=$1'
        const roleResult = await pool.query(roleSql, [role])
        const userRoleSql = 'INSERT INTO user_roles(userID, roleID) VALUES($1, $2) returning * '
        const userRoleResult = await pool.query(userRoleSql, [result.rows[0].id, roleResult.rows[0].id])
        const addressSql = 'INSERT INTO address(name, latitude, longitude, userID) VALUES($1, $2, $3, $4)'
        const addressResult = await pool.query(addressSql, [addName, latitude, longitide, result.rows[0].id])
        res.status(200).json({ message: 'Registration Successful', data: result.rows[0], addData : addressResult.rows[0]})
    } catch (error) {
        res.status(500).send(error);
    }
}

const createRestaurant =async (req:Request, res : Response) => {
    try {
        const createdBy = req.id
        const { name, latitude, longitude } = req.body;
        const sql : string ="INSERT INTO restaurants (name, latitude, longitude, createdBy) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await pool.query(sql, [name, latitude, longitude, createdBy]);
        res.status(200).json({message: "Restaurant successfully created !!", data: result.rows});
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
}

const updateRestaurant =async (req: Request, res : Response) => {
    try {
        const restId = req.params.id
        const {name, latitude, longitude} = req.body;
        if (name === undefined && latitude === undefined && longitude === undefined) {
            res.status(400).send("Provide some data to update") 
            return
        }
        const sql = `
        UPDATE restaurants
        SET
            name = CASE WHEN $1::text IS NOT NULL THEN $1::text ELSE name END,
            latitude = CASE WHEN $2::float4 IS NOT NULL THEN $2::float4 ELSE latitude END,
            longitude = CASE WHEN $3::float4 IS NOT NULL THEN $3::float4 ELSE longitude END,
            updatedAt = NOW() 
        WHERE id = $4
        RETURNING name, latitude, longitude
        `;
        const result = await pool.query(sql, [name, latitude, longitude, Number(restId)])
        res.status(200).json({ message: "Restaurant Updated", data: result.rows })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const deleteRestaurant = async (req : Request, res : Response) => {
    try {
        const restId = req.params.id
        const sql = `UPDATE restaurants SET archivedAt = now() WHERE id = $1 returning name`
        const result = await pool.query(sql, [Number(restId)])
        res.status(200).json({ message: `Restaurant: ${result.rows[0].name} deleted successfully` })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const createDish = async (req:Request, res:Response) => {
    try {
        const createdBy = req.id
        const restId = req.params.id
        const { name, price } = req.body;
        const sql = 'INSERT INTO dishes (name, price, restID, createdby) VALUES ($1, $2, $3, $4) RETURNING *'
        const result = await pool.query(sql, [name, Number(price), Number(restId), createdBy])
        res.status(200).json({ message: `Restaurant with id: ${restId} Dish: ${name} successfully created !!`, data: result.rows })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const updateDish =async (req: Request, res : Response) => {
    try {
        const restId = req.params.id
        const {name, price, dishId} = req.body;
        if (name === undefined && price === undefined) {
            res.status(400).send("At least provide one of the name or price to update")
            return
        }
        const sql = `
        UPDATE dishes
        SET
            name = CASE WHEN $1::text IS NOT NULL THEN $1::text ELSE name END,
            price = CASE WHEN $2::float4 IS NOT NULL THEN $2::float4 ELSE price END,
            updatedAt = NOW() 
        WHERE id = $3 AND restID = $4
        RETURNING name, price;
        `;
        const result = await pool.query(sql, [name, price, dishId, Number(restId)])
        res.status(200).json({ message: "Dish Updated", data: result.rows})
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

const deleteDish =async (req : Request, res : Response) => {
    try {
        const restId = req.params.id
        const {dishId} = req.body
        const sql = `UPDATE dishes SET archivedAt = now() WHERE id = $1 AND restID = $2 returning name`
        const result = await pool.query(sql, [dishId, Number(restId)])
        res.status(200).json({ message: `Dish: ${result.rows[0].name} deleted successfully` })
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export {getUsers, createUser, createRestaurant, updateRestaurant, deleteRestaurant, createDish, updateDish, deleteDish}