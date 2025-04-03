import { NextFunction, Request, Response } from 'express';
import { SubmitFeedbackSchema } from '../types';
import { prisma} from '@repo/db';
import { HTTP_RESPONSE_CODE } from '../constants/constant';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const submitFeedback = async(req : Request , res: Response, next: NextFunction) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = SubmitFeedbackSchema.safeParse(body);
        if(!parsedData.success) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        }
        await prisma.feedback.create({
            data : {
                ...parsedData.data,
                userId
            }
        });

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(new ApiResponse(
            true,
            HTTP_RESPONSE_CODE.SUCCESS,
            null,
            "Feedback submit successfully"
        ));
    } catch (error) {
        next(error);
    }
}

export { submitFeedback };