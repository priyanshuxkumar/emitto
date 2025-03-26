import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { config } from '../config';

export const auth = (req: Request , res: Response , next: NextFunction) => {
    try {
        const token = req.cookies._a_token_;
        if(!token){
            res.status(401).json({message: "Unauthenticated!. Please login"});
            return;
        }

        const payload = jwt.verify(token, config.jwtSecret);
        if(typeof payload !== 'string' && payload.id){
            req.id = payload.id;
            next();
        }else {
            res.status(401).json({message: "Unauthorized Access"});
            return;
        }
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
}