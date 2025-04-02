import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import { config, cookieOptions } from '../config';
import { SigninSchema, SignupSchema } from '../types';
import { prisma, User } from '@repo/db';
import { genAccessAndRefreshToken } from '../helper';
import { ApiError } from '../utils/ApiError';
import { HTTP_RESPONSE_CODE } from '../constants/constant';
import { ApiResponse } from '../utils/ApiResponse';

const registerUser = async(req: Request , res: Response, next : NextFunction) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body)
        if(!parsedData.success){
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        }

        const user : User | null = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        });
        if(user){
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(parsedData.data.password, salt);

        await prisma.user.create({
            data: {
                ...parsedData.data,
                password : {
                    create : {
                        hash
                    }
                }
            }
        });

        res.status(HTTP_RESPONSE_CODE.CREATED).json(new ApiResponse(
            true, 
            HTTP_RESPONSE_CODE.CREATED, 
            null,
            "Check your inbox for verification email!"
        ));
    } catch (error : unknown) {
        next(error); 
    }
}

const loginUser = async(req: Request, res: Response, next: NextFunction ) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body)
        if(!parsedData.success){
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        }

        const user = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            },
            select: {
                id: true,
                email: true,
                password : {
                    select : {
                        hash : true
                    }
                },
                role: true
            }
        });
        if(!user){
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "User not found")
        }

        const hashPassword: string = String(user.password?.hash);

        const isPasswordCorrect = await bcrypt.compare(parsedData.data.password , hashPassword);
        if(!isPasswordCorrect){
            throw new ApiError(false, HTTP_RESPONSE_CODE.UNAUTHORIZED, "Invalid Credentials");
        }

        const { accessToken, refreshToken } = await genAccessAndRefreshToken(user.id , user.role);

        //Hash the refreshtoken
        const salt = await bcrypt.genSalt(10);
        const secret: string = await bcrypt.hash(refreshToken, salt);

        //Create the entry on db of refreshtoken
        await prisma.refreshToken.create({
            data: {
                secret: secret,
                userId: user.id as number,
                expiresAt : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
            }
        });

        res.cookie('_a_token_', accessToken, cookieOptions);
        res.cookie('_r_token_', refreshToken, {...cookieOptions, maxAge: 1000 * 60 * 60 * 24 * 7});
        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(new ApiResponse(
            true,
            HTTP_RESPONSE_CODE.SUCCESS,
            null,
            "Signin successfull"
        ));
    } catch (error : unknown) {
        next(error);
    }
}

const logoutUser = async(req: Request , res: Response, next: NextFunction) =>  {
    try {
        res.clearCookie("_a_token_");
        res.clearCookie("_r_token_");

        if (config.nodeEnv === 'production') {
            res.clearCookie("_a_token_", { 
                secure: true,
                sameSite: 'none'
            });
            res.clearCookie("_r_token_", { 
                secure: true,
                sameSite: 'none'
            });
        }

        res.clearCookie("_a_token_");     
        res.clearCookie("_r_token_");        
        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(new ApiResponse(
            true,
            HTTP_RESPONSE_CODE.SUCCESS,
            null,
            "Logout successfull"
        ));
    } catch (error : unknown) {
       next(error);  
    }
}


export { registerUser, loginUser, logoutUser }