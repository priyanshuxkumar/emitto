import { Request, Response } from "express";
import { SendSMSSchema } from "../types";
import { isApiKeyValid } from "../helper";
import { producer, TOPIC_SMS } from "@repo/kafka";

const sendSMS = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        console.log(body)
        const parsedData = SendSMSSchema.safeParse(body);
        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }

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

        //Publish to topic
        await producer.send({
            topic: TOPIC_SMS,
            messages: [{
                value : JSON.stringify({
                    ...parsedData.data,
                    userId,
                    // apikeylogId : apikeylog.id
                }),
            }]
        });
        res.status(200).json({message : "SMS processing..."});
    } catch (error) {
        console.error(error);
    }
}

export { sendSMS };