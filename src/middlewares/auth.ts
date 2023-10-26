import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import pool from '../database/config/connection'
export const secretKey : string = 'securedsecretkey';

interface JwtPayload {
    id : number,
    role : string,
    sessionId : string
}

export async function auth(req : Request, res : Response, next : NextFunction){
    try {
        const token = req.headers["authorization"]!;
        let bearerToken;
        if(token && token.startsWith('Bearer')){
            bearerToken = token.split(" ")[1]
        }
        if (!bearerToken) {
            return res.status(401).json({ message: 'Token missing' });
        }
        const decoded = jwt.verify(bearerToken, secretKey) as JwtPayload;
        const sql = 'SELECT * FROM sessions WHERE id = $1 AND archivedAt is NOT NULL'
        const result = await pool.query(sql, [decoded.sessionId])
        if(result.rowCount !== 0){
            return res.status(401).send("Session Expired ! Login Again...")
        }
        req.role = decoded.role
        req.id = decoded.id
        req.sessionID = decoded.sessionId
        next();        
    } catch (error) {
        res.status(401).send("Invalid Token");
    }
}

