import { Request, Response } from 'express';
import { prisma } from '@repo/db';
import { ApiKeyName } from '../types';
import { genApiKey } from '../helper';

const createApiKey = async(req: Request , res: Response) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = ApiKeyName.safeParse(body);

        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }
        const apikey : string = await genApiKey();

        if(!apikey) {
            return
        }

        await prisma.apiKey.create({
            data : {
                name: parsedData.data.name,
                apikey,
                userId,
                isActive: true
            }
        })

        res.status(201).json({message: "Api key created successfully", apikey});
    } catch (error : unknown) {
        console.log(error)
        return
    }
}



export { createApiKey }