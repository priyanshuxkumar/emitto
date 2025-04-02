import { NextFunction, Request, Response } from "express";
import { EmailSchema, SendEmailSchema } from "../types";
import { producer, TOPIC_EMAIL } from "@repo/kafka";
import { isApiKeyValid } from "../helper";
import { prisma } from "@repo/db";
import { HTTP_RESPONSE_CODE } from "../constants/constant";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

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
        const apikeylog = await prisma.apiKeyLogs.create({
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

const checkEmailUnique =  async(req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const parsedEmail = EmailSchema.safeParse(email);
        if(!parsedEmail.data) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedEmail?.error?.issues[0]?.message ?? "Invalid Input");
        }

        const isEmailExist = await prisma.user.count({
            where : {
                email
            },
            take: 1 // Stop counting after first match found
        });
        if(isEmailExist) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Email already exists");
        } 

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                null,
                "Email is available"
            )
        );
    } catch (error) {
        next(error); 
    }
}

const getAllEmail = async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.id as number
    try {
        const result = await prisma.email.findMany({
            where : {
                userId
            },
            orderBy : {
                createdAt : 'desc'
            }
        });

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
        next(error);
    }
}

const getEmailDetails = async (req: Request, res: Response, next: NextFunction) => {
    const emailId = req.params.id;
    try {
        const result = await prisma.email.findUnique({
            where : {
                id : emailId
            }
        });
        if(!result) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Email not found")
        }

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

export { sendEmail, checkEmailUnique, getAllEmail, getEmailDetails }