import { NextFunction, Request, Response } from 'express';
import { prisma } from '@repo/db';
import { ApiKeyName, ParamsSchema } from '../types';
import { genApiKey, generateHash } from '../helper';
import { HTTP_RESPONSE_CODE } from '../constants/constant';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';

const createApiKey = async(req: Request , res: Response, next: NextFunction) => {
    const userId = req.id as number;
    try {
        const body = req.body;
        const parsedData = ApiKeyName.safeParse(body);

        if(!parsedData.success) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        }

        const isApiExist = await prisma.apiKey.findUnique({
            where : {
                userId: userId,
                name : parsedData.data.name
            }
        })

        if(isApiExist) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "API already exist with same name");
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
        });

        res.status(HTTP_RESPONSE_CODE.CREATED).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.CREATED,
                {
                    apiKey,
                    id : result.id,
                    name : result.name,
                    shortToken : result.shortToken,
                    lastUsed : null,
                    createdAt : result.createdAt
                },
                "API Created successfull"
            )
        );
    } catch (error : unknown) {
        next(error);
    }
};

const getApiKeyDetails  = async(req : Request , res: Response, next: NextFunction) => {
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
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API Key not found");
        }

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                {
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
                }
            )
        );
    } catch (error) {
        next(error);
    }
}

const getAllApiKeys = async(req : Request , res: Response, next: NextFunction) => {
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
        
        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                result.map(item => {
                    return {
                        id : item.id,
                        name : item.name,
                        shortToken : item.shortToken,
                        lastUsed : item.apikeyLogs[0]?.createdAt, // API Last used time 
                        createdAt : item.createdAt
                    }
                })
                
            )
        );
    } catch (error) {
        next(error);
    }
}

const destroyApiKey = async(req: Request , res: Response, next: NextFunction) => {
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
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API Key not found");
        }

        await prisma.apiKey.update({
            where : {
                id : apikeyId
            },
            data : {
                isActive : false
            }
        });

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                null,
                "API deleted successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

const updateApiKeyName = async(req: Request , res: Response, next: NextFunction) => {
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
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, parsedData?.error?.issues[0]?.message ?? "Invalid Input");
        };

        const result = await prisma.apiKey.findFirst({
            where : {
                id : apikeyId
            }
        });

        if(!result) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API Key not found");
        }

        const apiKey = await prisma.apiKey.update({
            where : {
                id : apikeyId
            },
            data: {
                name: parsedData.data.name
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
                }
            }
        });

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                {
                    id : apiKey.id,
                    name : apiKey.name,
                    shortToken : apiKey.shortToken,
                    lastUsed : apiKey.apikeyLogs[0],
                    createdAt : apiKey.createdAt
                },
                "API updated successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

const disableApiKey = async(req: Request , res: Response, next : NextFunction) => {
    const userId = req.id as number;
    try {
        const apiKeyId = req.params.id;
        if(!apiKeyId) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Invalid request");
        }

        const apikey = await prisma.apiKey.findUnique({
            where : {
                id : apiKeyId,
                userId
            }
        });

        if(!apikey) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API Key not found");
        }

        await prisma.apiKey.update({
            where : {
                id : apiKeyId
            },
            data : {
                isActive : false
            }
        });

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                null,
                "API Key has been disabled"
            )
        );
    } catch (error) {
        next(error);
    }
}

const getApiKeyLogs = async (req: Request, res: Response, next: NextFunction) => {
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

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                result,
            )
        );
    } catch (error) {
        next(error);
    }
}

const getApiKeyLogDetails = async (req: Request, res: Response, next: NextFunction) => {
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
        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                result[0],
            )
        );
    } catch (error) {
        next(error);
    }
}

export {
  createApiKey,
  getAllApiKeys,
  getApiKeyDetails,
  destroyApiKey,
  updateApiKeyName,
  disableApiKey,
  getApiKeyLogs,
  getApiKeyLogDetails,
};