import { Express } from 'express';


declare global {
    namespace Express {
        interface Request {
            id : Number;
            role: string;
        }
    }
}