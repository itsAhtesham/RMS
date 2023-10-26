import { Request, Response } from "express";
import pool from "../database/config/connection";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { secretKey} from '../middlewares/auth'

const login =async (req:Request, res:Response) => {
    try {
        const {email, password} = req.body; 
        const sql = 'SELECT users.id, email, password, role FROM users JOIN user_roles on users.id = user_roles.userID JOIN roles on user_roles.roleID = roles.id where email = $1'
        const user = await pool.query(sql, [email]);
        if(! await bcrypt.compare(password, user.rows[0].password)){
            return res.status(401).send('Wrong Credentials')
        }else {
            const id = user.rows[0].id;
            const role = user.rows[0].role;
            const sessionSql = 'INSERT into sessions(userID) VALUES($1) returning id'
            const sessionResult = await pool.query(sessionSql, [id])
            const sessionId : string = sessionResult.rows[0].id
            const token = jwt.sign({id, role, sessionId}, secretKey, {expiresIn:'30m'})
            return res.status(200).json({message:'Login Successful', token})
        }
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

const getRestaurants = async (req: Request, res: Response) => {
    try {
        const sql : string = "SELECT name, latitude, longitude FROM restaurants WHERE archivedAt IS NULL";
        const result = await pool.query(sql);
        return res.status(200).json({ message: "All Restaurants : ", data: result.rows });
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
};

const getDishes = async (req : Request, res : Response) => {
    try {
        // const restId = Number(req.params.id)  --> One way
        const restId = +(req.params.id)  // --> Other way
        if(isNaN(restId)){
            return res.status(400).send("Invalid Restaurant ID :");
        }
        const sql : string = 'SELECT dishes.name, dishes.price FROM dishes JOIN restaurants ON dishes.restid = restaurants.id WHERE restID = $1 AND restaurants.archivedAt IS NULL AND dishes.archivedat IS NULL'
        const result = await pool.query(sql, [restId])
        return res.status(200).json({ message: `All Dishes of Restaurant with id: ${restId}`, data: result.rows })
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
}

const createAddress =async (req : Request, res : Response) => {
    try {
        const userId = req.id
        const {name, latitude, longitude} = req.body
        const sql = 'INSERT INTO address(name, latitude, longitude, userID) VALUES($1, $2, $3, $4) returning name, latitude, longitude'
        const result = await pool.query(sql, [name, latitude, longitude, userId])
        return res.status(200).json({ message: `Address added successfully`, data: result.rows })
    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
}

const getDistance = async (req : Request, res : Response) => {
    try {
        const userId = req.id
        const restId = Number(req.params.restId)
        const userSql = 'SELECT latitude as userX, longitude as userY FROM address WHERE userID = $1 ORDER BY id DESC LIMIT 1'
        const userResult = await pool.query(userSql, [userId])
        if(userResult.rowCount == 0){ 
            return res.status(200).json({message: 'Please add an address'})
        }
        const {userx, usery} = userResult.rows[0];
        const restaurantSql = 'SELECT latitude as restX, longitude as restY FROM restaurants WHERE id = $1 AND archivedAt IS NULL'
        const restaurantResult = await pool.query(restaurantSql, [restId])
        const {restx, resty} = restaurantResult.rows[0];
        const distance = Math.sqrt((userx-restx)*(userx-restx) + (usery-resty)*(usery-resty)).toFixed(2);
        return res.status(200).json({ message: `Distance is ${distance} KMs`})
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

const logout =async (req : Request, res : Response) => {
    try {
        const sessionId = req.sessionID
        const sql = 'UPDATE sessions set archivedAt = now() WHERE id = $1'
        const result = await pool.query(sql, [sessionId])
        res.status(200).json({message:'Logout Successful'})
    } catch (error) {
        return res.status(500).send('Internal Server Error')
    }
}

export { login, getRestaurants, getDishes, createAddress, getDistance, logout}