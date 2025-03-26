import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { config } from "../config";


export const admin = (req : Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies._a_token_ || req.headers.authorization?.split(" ")[1] as string;
        if(!token) {
            res.status(401).json({message: "Unauthenticated!. Please login"});
            return;
        }

        const payload = jwt.verify(token, config.jwtSecret) as {id: number , role: string };
        if(payload.role == 'ADMIN'){
            req.id = payload.id;
            req.role = payload.role;
            next();
        }else {
            res.status(401).json({message: "Unauthorized Access"});
            return;
        }
    } catch (error) {
        res.status(500).json({message: "Something went wrong"});
    }
}  