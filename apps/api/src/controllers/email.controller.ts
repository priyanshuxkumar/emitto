import { NextFunction, Request, Response } from "express";
import { SendEmailSchema } from "../types";
import { producer, TOPIC_EMAIL } from "@repo/kafka";
import { isApiKeyValid } from "../helper";
import { ApiKeyLogs, Email, prisma } from "@repo/db";
import { HTTP_RESPONSE_CODE } from "../constants/constant";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { getAllEmailsKey, getEmailDetailsKey } from "../services/redis/keys";
import { redis } from "../services/redis";

const sendEmail = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const parsedData = SendEmailSchema.safeParse(body);
        if(!parsedData.success) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        };
        
        const apiKey = req.headers['x-api-key'];
        if(!apiKey) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid request");
        };

        let apiKeyId : string;
        let userId : number;

        ({ apiKeyId, userId } = await isApiKeyValid(apiKey as string));


        //Create the entry about API usage / Logs
        const method = req.method;
        const endpoint = req.url;
        const apikeylog : ApiKeyLogs = await prisma.apiKeyLogs.create({
            data : {
                userId,
                method,
                endpoint,
                requestBody : req.body,
                apikeyId : apiKeyId,
            }
        });

        //Publish to topic
        await producer.send({
            topic: TOPIC_EMAIL,
            messages: [{
                value : JSON.stringify({
                    ...parsedData.data,
                    userId,
                    apikeylogId : apikeylog.id
                }),
            }]
        });


        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                null,
                "Email processing"
            )
        );
    } catch (error) {
        next(error);
    }
}

const getAllEmail = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.id as number;
    try {
        let key =  getAllEmailsKey(userId as number);
        
        const cache = await redis.lRange(key, 0 , 19);
        if(cache.length > 0) {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);
            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    cache.map((item : any) => JSON.parse(item)),
                )
            )
            return;
        }

        const result : Email[] = await prisma.email.findMany({
            where : {
                userId
            },
            orderBy : {
                createdAt : 'desc'
            },
            take : 20
        });

        //Cache the data
        if(result.length > 0) {
            await redis.rPush(key, result.map(item => JSON.stringify(
                {
                    id : item.id,
                    to : item.to,
                    status : 'Delivered',
                    subject : item.subject,
                    sentTime : item.createdAt
                }
            )));
        }

        console.log(`Cache miss for ${req.baseUrl}${req.path}`);

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                result.map(item => {
                    return {
                        id : item.id,
                        to : item.to,
                        status : 'Delivered',
                        subject : item.subject,
                        sentTime : item.createdAt
                    }
                }),
                "Email is available"
            )
        );
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const getEmailDetails = async (req: Request, res: Response, next: NextFunction) => {
    const emailId = req.params.id;
    try {
        let key = getEmailDetailsKey(emailId as string);

        const cache = await redis.hGetAll(key);
        if(cache && Object.keys(cache).length > 0) {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);
            
            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    {
                        id: cache.id,
                        from: cache.from,
                        to: JSON.parse(cache.to as string),
                        subject: cache.subject,
                        html: cache.html,
                        metadata: JSON.parse(cache.metadata as string),
                        userId: Number(cache.userId),
                        createdAt: new Date(cache.createdAt as string)
                    },
                )
            )
            return;
        }
        const result : Email | null = await prisma.email.findUnique({
            where : {
                id : emailId
            }
        });
        if(!result) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Email not found")
        }

        await redis.hSet(key, {
            id: result.id,
            from: result.from,
            to: JSON.stringify(result.to),
            subject: result.subject,
            html: result.html,
            metadata: JSON.stringify(result.metadata),
            userId: result.userId.toString(),
            createdAt: result.createdAt.toISOString()
        });

        console.log(`Cache miss for ${req.baseUrl}${req.path}`);

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                result,
            )
        );
    } catch (error) {
        next(error)
    }
}

export { sendEmail, getAllEmail, getEmailDetails }