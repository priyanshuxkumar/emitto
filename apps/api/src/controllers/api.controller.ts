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

        const result = await prisma.apiKey.create({
            data : {
                name: parsedData.data.name,
                apikey : hashApiKey,
                userId,
                isActive: true,
                shortToken: apiKey.slice(0,11)
            }
        })

        res.status(201).json({
            message: "Api key created successfully. This key will not be shown again. Save it securely!", 
            apiKey,
            apiKeyMetadata : {
                id : result.id,
                name : result.name,
                shortToken : result.shortToken,
                lastUsed : null,
                createdAt : result.createdAt
            }
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

const getApiKeyDetails  = async(req : Request , res: Response) => {
    const apiKeyId = req.params.id;
    try {
        const result = await prisma.apiKey.findFirst({
            where : {
                id : apiKeyId
            },
            include : {
                user : true,
                apikeyLogs : {
                    select : {
                        createdAt : true
                    },
                    orderBy : {
                        createdAt : 'desc'
                    },
                    take : 1
                },
            }
        });

        if(!result) {
            res.status(404).json({message : "API Key not found"});
            return;
        }
        res.status(200).json({
                id : result.id,
                name : result.name,
                permission : 'Full',
                shortToken : result.shortToken,
                status : result.isActive,
                totalUses : result.apikeyLogs.length, //Count of api being used
                userId : result.userId,
                creatorEmail : result.user.email,
                lastUsed : result.apikeyLogs[0]?.createdAt, // API Last used time 
                createdAt : result.createdAt 
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "API key not found or already deleted" });
                return;
            }
        }

        res.status(500).json({ message: "Something went wrong" });
    }
}

const getAllApiKeys = async(req : Request , res: Response) => {
    const userId = req.id as number;
    try {
        const result = await prisma.apiKey.findMany({
            where : {
                userId
            },
            include : {
                apikeyLogs : {
                    select : {
                        createdAt : true
                    },
                    orderBy : {
                        createdAt : 'desc'
                    },
                    take : 1
                },
            }
        });
        res.status(200).json(
            result.map(item => {
                return {
                    id : item.id,
                    name : item.name,
                    shortToken : item.shortToken,
                    lastUsed : item.apikeyLogs[0]?.createdAt, // API Last used time 
                    createdAt : item.createdAt
                }
            })
        );
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ message: "API key not found or already deleted" });
                return;
            }
        }

        res.status(500).json({ message: "Something went wrong" });
    }
}

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

const disableApiKey = async(req: Request , res: Response) => {
    const userId = req.id as number;
    try {
        const apiKeyId = req.params.id;
        if(!apiKeyId) {
            res.status(400).json({message : "Api key is missing"});
            return;
        }

        const apikey = await prisma.apiKey.findUnique({
            where : {
                id : apiKeyId,
                userId
            }
        });

        if(!apikey) {
            res.status(404).json({message : "Api key not found"});
            return;
        }

        await prisma.apiKey.update({
            where : {
                id : apiKeyId
            },
            data : {
                isActive : false
            }
        });

        res.status(200).json({ message : "Api key has been disabled"});
    } catch (error) {
        if(error instanceof Error) {
            res.status(500).json({message : error.message});
            return;
        }
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getApiKeyLogs = async (req: Request, res: Response) => {
    const userId = req.id as number;
    try {
        const result = await prisma.apiKeyLogs.findMany({
            where : {
                userId 
            },
            select : {
                id : true,
                method : true,
                endpoint : true,
                responseStatus: true,
                createdAt : true
            }
        });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
    }
}

const getApiKeyLogDetails = async (req: Request, res: Response) => {
    const userId = req.id as number;
    const logId = req.params.id;
    try {
        const result = await prisma.apiKeyLogs.findMany({
            where : {
                id : logId,
                userId
            },
            omit : {
                apikeyId : true,
                userId : true
            }
        });
        res.status(200).json(result[0]);
    } catch (error) {
        console.error(error);
    }
}

export { createApiKey, getAllApiKeys, getApiKeyDetails, destroyApiKey, updateApiKeyName, disableApiKey, getApiKeyLogs, getApiKeyLogDetails }