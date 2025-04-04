import { NextFunction, Request, Response } from 'express';
import { prisma, User } from '@repo/db';
import { UpdateUserDetailsSchema } from '../types';
import { ApiError } from '../utils/ApiError';
import { HTTP_RESPONSE_CODE } from '../constants/constant';
import { ApiResponse } from '../utils/ApiResponse';
import { redis } from '../services/redis/index';
import { getLoggedInUserKey } from '../services/redis/keys';

const getUser = async(req: Request , res: Response, next: NextFunction) =>  {
    const userId = req.id as number;
    try {
        let key = getLoggedInUserKey(userId as number); 

        const cache = await redis.hGetAll(key);
        if(cache && Object.keys(cache).length > 0) {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);

            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    {
                        id: Number(cache.id),
                        email: cache.email,
                        userMetadata: JSON.parse(cache.userMetadata as string),
                    }
                )
            );
            return;
        }

        const user : User | null = await prisma.user.findFirst({
            where : {
                id : userId
            }
        })

        if(!user) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "User not found");
        }

        //Cache the data
        const data = {
            id: user.id,
            email: user.email,
            userMetadata: JSON.stringify({
                name: user.name,
                avatarUrl: user.avatarUrl,
                email: user.email,
                emailVerified: user.verified
            })
        }
        await redis.hSet(key, data);

        console.log(`Cache miss for ${req.baseUrl}${req.path}`);

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                {
                    id: user.id,
                    email: user.email,
                    userMetadata: JSON.parse(data.userMetadata),
                }
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

        const updatedUser : User = await prisma.user.update({
            where : {
                id: userId
            },
            data: {
                ...parsedData.data
            }
        });

        //Update the cache of user on redis 
        let key = getLoggedInUserKey(userId);
        await redis.hSet(key,{
            id: updatedUser.id,
            email: updatedUser.email,
            userMetadata: JSON.stringify({
                name: updatedUser.name,
                avatarUrl: updatedUser.avatarUrl,
                email: updatedUser.email,
                emailVerified: updatedUser.verified
            })
        })

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