import { Request, Response } from "express";
import { EmailSchema, SendEmailSchema } from "../types";
import { producer, TOPIC_EMAIL } from "@repo/kafka";
import { isApiKeyValid } from "../helper";
import { prisma, Prisma } from "@repo/db";
import { ZodError } from "zod";

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

const checkEmailUnique =  async(req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const parsedEmail = EmailSchema.safeParse(email);
        if(!parsedEmail.data) {
            res.status(400).json({message: parsedEmail?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }

        const isEmailExist = await prisma.user.count({
            where : {
                email
            },
            take: 1 // Stop counting after first match found
        });

        if(isEmailExist) {
            res.status(200).json({status: false, message : "Email already exists"});
            return;
        } 
        res.status(200).json({status: true, message : "Email is available"})
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

const getAllEmail = async(req: Request, res: Response) => {
    const userId = req.id as number
    try {
        const result = await prisma.email.findMany({
            where : {
                userId
            }
        })

        res.status(200).json(
            result.map(item => {
                return {
                    id : item.id,
                    to : item.to,
                    status : 'Delivered',
                    subject : item.subject,
                    sentTime : item.createdAt
                }
            })
        )
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

const getEmailDetails = async (req: Request, res: Response) => {
    const emailId = req.params.id;
    try {
        const result = await prisma.email.findUnique({
            where : {
                id : emailId
            }
        });
        if(!result) {
            res.status(404).json({ message : "Email not found" });
            return;
        }
        res.status(200).json(result);
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

export { sendEmail, checkEmailUnique, getAllEmail, getEmailDetails }