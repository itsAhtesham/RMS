import {Request, Response, NextFunction} from 'express'

export function verifyRole(role : string){
    return (req:Request, res:Response, next:NextFunction) => {
        if(role != req.role){
            return res.status(403).send('Unauthorized')
        }
        else{
            next()
        }
    }
}