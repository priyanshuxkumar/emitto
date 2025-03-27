import { Request, Response } from "express";
import { SendEmailSchema } from "../types";
import { producer, TOPIC_EMAIL } from "@repo/kafka";

const sendEmail = async(req: Request, res: Response) => {
    try {
        const body = req.body;
        const parsedData = SendEmailSchema.safeParse(body);
        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }
        console.log(parsedData.data)
        await producer.send({
            topic: TOPIC_EMAIL,
            messages: [{
                value : JSON.stringify(parsedData.data),
            }]
        });
        res.status(200).json({message : "Email processing..."})
        console.log('Produced successfully!');
    } catch (error) {
        console.log("Error occured while sending email!",error);
    }
}

export { sendEmail }