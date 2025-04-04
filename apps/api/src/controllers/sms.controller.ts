import { NextFunction, Request, Response } from "express";
import { SendSMSSchema } from "../types";
import { isApiKeyValid } from "../helper";
import { producer, TOPIC_SMS } from "@repo/kafka";
import { ApiKeyLogs, prisma } from "@repo/db";
import { ApiError } from "../utils/ApiError";
import { HTTP_RESPONSE_CODE } from "../constants/constant";
import { ApiResponse } from "../utils/ApiResponse";

const sendSMS = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const parsedData = SendSMSSchema.safeParse(body);
        if(!parsedData.success) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        }

        const apiKey = req.headers['x-api-key'];
        if(!apiKey) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid request");
        };

        let apiKeyId : string;
        let userId : number;
        ({apiKeyId, userId} = await isApiKeyValid(apiKey as string));

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
            topic: TOPIC_SMS,
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
                "SMS processing"
            )
        );
    } catch (error) {
        next(error);
    }
}

export { sendSMS };