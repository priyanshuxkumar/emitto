import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma, prisma, User } from '@repo/db';
import { UpdateUserDetailsSchema } from '../types';

const getUser = async(req: Request , res: Response) =>  {
    const userId = req.id as number;
    try {
        const user : User | null = await prisma.user.findFirst({
            where : {
                id : userId
            }
        })

        if(!user) {
            res.status(404).json({message : "User not found"});
            return;
        }

        res.status(200).json({
                id: user.id,
                email : user.email,
                userMetadata : {
                    name : user.name,
                    avatarUrl: user.avatarUrl,
                    email : user.email,
                    emailVerified: user.verified
                }
            }
        )
    } catch (error : unknown) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(404).json({message: "User not found"});
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(500).json({message : 'Something went wrong'}); 
    }
}

const updateUserDetails = async(req: Request , res: Response) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = UpdateUserDetailsSchema.safeParse(body);
        if(!parsedData.success){
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }

        const updatedUser = await prisma.user.update({
            where : {
                id: userId
            },
            data: {
                ...parsedData.data
            }
        });

        res.status(200).json({message : "Update successfull", email : updatedUser.email, name : updatedUser.name});
    } catch (error) {
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


export { getUser, updateUserDetails }