import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import { config, cookieOptions } from '../config';
import { ZodError } from 'zod';
import { SigninSchema, SignupSchema } from '../types';
import { Prisma, prisma, User } from '@repo/db';
import { genAccessAndRefreshToken } from '../helper';

const registerUser = async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SignupSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }
        const user : User | null = await prisma.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

        if(user){
            res.status(409).json({message: 'User already exists with this email'})
            return;
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
        })

        res.status(200).json({message: "Check your inbox for verification email!"})
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json({message: "User already exists with this email"});
            return;
        }
        if(error instanceof ZodError) {
            res.status(400).json({message: error.errors[0]?.message || "Invalid input"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'});   
    }
}

const loginUser = async(req: Request , res: Response) => {
    try {
        const body = req.body;
        const parsedData = SigninSchema.safeParse(body)
        if(!parsedData.success){
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
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
        })
        if(!user){
            res.status(404).json({message : 'Invalid Credentials'});
            return;
        }

        const hashPassword: string = String(user.password?.hash);

        const isPasswordCorrect = await bcrypt.compare(parsedData.data.password , hashPassword)
        if(!isPasswordCorrect){
            res.status(403).json({message: 'Invalid Credentials'});
            return;
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

        res.status(200).json({message: 'Signin successfull!'})
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof ZodError) {
            res.status(400).json({message: error.errors[0]?.message || "Invalid input"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'}); 
    }
}

const logoutUser = async(req: Request , res: Response) =>  {
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

        res.status(200).json({message: "Logout successfull"});
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : "Something went wrong"});    
    }
}


export { registerUser, loginUser, logoutUser }