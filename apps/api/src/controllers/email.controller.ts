import { Request, Response } from "express";
import { SendEmailSchema } from "../types";
import { producer, TOPIC_EMAIL } from "@repo/kafka";
import { isApiKeyValid } from "../helper";
import { prisma, Prisma } from "@repo/db";

const sendEmail = async(req: Request, res: Response) => {
    try {
        const body = req.body;
        const parsedData = SendEmailSchema.safeParse(body);
        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        };
        
        const apiKey = req.headers['x-api-key'];
        if(!apiKey) {
            res.status(401).json({message: "Missing Api Key"});
            return;
        };

        let apiKeyId : string;
        let userId : number;
        try {
            const { apiKeyId : apikey_id, userId: user_id } = await isApiKeyValid(apiKey as string);
            apiKeyId = apikey_id;
            userId = user_id;
        } catch (error) {
            if(error instanceof Error){
                res.status(500).json({ message : error?.message });
                return;
            } else {
                res.status(500).json({ message : "Something went wrong"});
                return;
            }
        };

        //Update the lastUsed field on Api table
        await prisma.apiKey.update({
            where : {
                id : apiKeyId
            },
            data : {
                lastUsedAt : new Date()
            }
        });

        await producer.send({
            topic: TOPIC_EMAIL,
            messages: [{
                value : JSON.stringify({
                    ...parsedData.data,
                    userId
                }),
            }]
        });
        res.status(200).json({message : "Email processing..."});
    } catch (error) {
        if(error instanceof Prisma.PrismaClientUnknownRequestError) {
            res.status(500).json({ message : error.message}) 
            return;
        }
        if(error instanceof Error) {
            res.status(500).json({ message : error.message || "Something went wrong"});
            return;
        }
        res.status(500).json({ message : "Something went wrong"});
    }
}

export { sendEmail }