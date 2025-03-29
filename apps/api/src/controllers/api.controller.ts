import { Request, Response } from 'express';
import { Prisma, prisma } from '@repo/db';
import { ApiKeyName, ParamsSchema } from '../types';
import { genApiKey, generateHash } from '../helper';
import { ZodError } from 'zod';

const createApiKey = async(req: Request , res: Response) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = ApiKeyName.safeParse(body);

        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        }

        const isApiExist = await prisma.apiKey.findUnique({
            where : {
                userId: userId,
                name : parsedData.data.name
            }
        })

        if(isApiExist) {
            res.status(409).json({message : "API key name already exists. Choose a different name"});
            return;
        }

        const apiKey : string = genApiKey();

        if (!apiKey) {
            throw new Error("Failed to generate API key");
        }

        const hashApiKey = generateHash(apiKey);

        if (!hashApiKey) {
            throw new Error("Failed to hash API key");
        }

        await prisma.apiKey.create({
            data : {
                name: parsedData.data.name,
                apikey : hashApiKey,
                userId,
                isActive: true
            }
        })

        res.status(201).json({
            message: "Api key created successfully. This key will not be shown again. Save it securely!", 
            apiKey
        });
    } catch (error : unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "API key not found or already deleted" });
                return;
            }
        }

        if (error instanceof ZodError) {
            res.status(400).json({ message: "Invalid input", errors: error.errors });
            return;
        }

        res.status(500).json({ message: "Something went wrong" });
    }
};

const destroyApiKey = async(req: Request , res: Response) => {
    try {
        const parsedParams = ParamsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({ message: "Invalid API key ID" });
            return;
        };

        const apikeyId = parsedParams.data.id;

        const apikey = await prisma.apiKey.findFirst({
            where : {
                id : apikeyId
            }
        });

        if(!apikey) {
            res.status(404).json({message: "Apikey not found or already deleted"});
            return;
        }

        await prisma.apiKey.update({
            where : {
                id : apikeyId
            },
            data : {
                isActive : false
            }
        });

        res.status(200).json({message : "Apikey deleted successfully!"});
    } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "API key not found or already deleted" });
                return;
            }
        }

        if (error instanceof ZodError) {
            res.status(400).json({ message: "Invalid input", errors: error.errors });
            return;
        }
        
        res.status(500).json({ message: "Something went wrong" });
    }
};

const updateApiKeyName = async(req: Request , res: Response) => {
    try {
        const parsedParams = ParamsSchema.safeParse(req.params);
        if (!parsedParams.success) {
            res.status(400).json({ message: "Invalid API key ID" });
            return;
        }
        const apikeyId = parsedParams.data.id;
        const body = req.body;
        const parsedData = ApiKeyName.safeParse(body);

        if(!parsedData.success) {
            res.status(400).json({message: parsedData?.error?.issues[0]?.message ?? "Invalid Input"});
            return;
        };

        const result = await prisma.apiKey.findFirst({
            where : {
                id : apikeyId
            }
        });

        if(!result) {
            res.status(404).json({message: "Apikey not found"});
            return;
        }

        await prisma.apiKey.update({
            where : {
                id : apikeyId
            },
            data: {
                name: parsedData.data.name
            }
        });

        res.status(200).json({message : "Apikey updated successfully!"});
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "API key not found or already deleted" });
                return;
            }
        }

        if (error instanceof ZodError) {
            res.status(400).json({ message: "Invalid input", errors: error.errors });
            return;
        }
        
        res.status(500).json({ message: "Something went wrong" });
    }
};


export { createApiKey, destroyApiKey, updateApiKeyName }