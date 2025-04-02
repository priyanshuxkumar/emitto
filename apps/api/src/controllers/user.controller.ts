import { NextFunction, Request, Response } from 'express';
import { prisma, User } from '@repo/db';
import { UpdateUserDetailsSchema } from '../types';
import { ApiError } from '../utils/ApiError';
import { HTTP_RESPONSE_CODE } from '../constants/constant';
import { ApiResponse } from '../utils/ApiResponse';

const getUser = async(req: Request , res: Response, next: NextFunction) =>  {
    const userId = req.id as number;
    try {
        const user : User | null = await prisma.user.findFirst({
            where : {
                id : userId
            }
        })

        if(!user) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "User not found");
        }


        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                {
                    id: user.id,
                    email : user.email,
                    userMetadata : {
                        name : user.name,
                        avatarUrl: user.avatarUrl,
                        email : user.email,
                        emailVerified: user.verified
                    }
                },
            )
        );
    } catch (error : unknown) {
        next(error);
    }
}

const updateUserDetails = async(req: Request , res: Response, next: NextFunction) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = UpdateUserDetailsSchema.safeParse(body);
        if(!parsedData.success){
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        }

        const updatedUser = await prisma.user.update({
            where : {
                id: userId
            },
            data: {
                ...parsedData.data
            }
        });

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                {
                    email : updatedUser.email, 
                    name : updatedUser.name
                },
                "Update successfull"
            )
        );
    } catch (error) {
        next(error);
    }
}


export { getUser, updateUserDetails }