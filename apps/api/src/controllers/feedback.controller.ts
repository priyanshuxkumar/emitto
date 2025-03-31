import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { SubmitFeedbackSchema } from '../types';
import { Prisma, prisma} from '@repo/db';

const submitFeedback = async(req : Request , res: Response) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = SubmitFeedbackSchema.safeParse(body);
        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }

        await prisma.feedback.create({
            data : {
                ...parsedData.data,
                userId
            }
        });
        res.status(201).json({message : 'Feedback submit successfully'});
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(409).json({message: "User already exists with this email"});
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

export { submitFeedback };