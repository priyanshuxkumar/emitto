import { NextFunction, Request, Response } from 'express';
import { prisma } from '@repo/db';
import { ApiKeyName, ParamsSchema } from '../types';
import { genApiKey, generateHash } from '../helper';
import { HTTP_RESPONSE_CODE } from '../constants/constant';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { redis } from '../services/redis';
import { getApiKeyDetailsKey, getAllApiKeysKey, getApiKeyLogsKey, getApiKeyLogDetailsKey } from '../services/redis/keys';

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
            throw new ApiError(false, HTTP_RESPONSE_CODE.CONFLICT, "API already exist with same name");
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

        // Add new data to existing data on List
        const key = getAllApiKeysKey(userId);
        await redis.lPush(
            key,
            JSON.stringify({
              id: result.id,
              name: result.name,
              shortToken: result.shortToken,
              lastUsed: null,
              createdAt: result.createdAt,
            })
        );

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
        let key = getApiKeyDetailsKey(apiKeyId as string);

        // Check the cache exist
        const cache = await redis.hGetAll(key);
        if(cache && Object.keys(cache).length > 0)  {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);
            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    {
                        id: cache.id,
                        name: cache.name,
                        permission: cache.permission,
                        shortToken: cache.shortToken,
                        status: Boolean(cache.status),
                        totalUses: Number(cache.totalUses),
                        userId: Number(cache.userId),
                        creatorEmail: cache.creatorEmail,
                        lastUsed: new Date(cache.lastUsed as string),
                        createdAt: new Date(cache.createdAt as string),
                    }
                )
            );
            return;
        }
        const result = await prisma.apiKey.findFirst({
            where : {
                id : apiKeyId
            },
            include : {
                user : true,
                apikeyLogs : { // Last used log
                    select : {
                        createdAt : true
                    },
                    orderBy : {
                        createdAt : 'desc'
                    },
                    take : 1
                },
            },
            orderBy : {
                createdAt : "desc"
            }
        });

        if(!result) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API Key not found");
        }

        // Cache the data
        await redis.hSet(key, {
            id : result.id,
            name : result.name,
            permission : result.permission,
            shortToken : result.shortToken,
            status : result.isActive.toString(),
            totalUses : result.apikeyLogs.length,
            userId : result.userId,
            creatorEmail : result.user.email,
            lastUsed: result.apikeyLogs[0]?.createdAt?.toISOString() || '',
            createdAt: result.createdAt.toISOString(),    
        });

        console.log(`Cache miss for ${req.baseUrl}${req.path}`);

        res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
            new ApiResponse(
                true,
                HTTP_RESPONSE_CODE.SUCCESS,
                {
                    id : result.id,
                    name : result.name,
                    permission : result.permission,
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
        const key = getAllApiKeysKey(userId);

        // Check the cache exist
        const cache = await redis.lRange(key, 0 , 19);
        if(cache.length > 0) {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);
            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    cache.map(item => JSON.parse(item)),
                )
            )
            return;
        };

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

        // Cache the data
        if(result.length > 0) {
            await redis.rPush(key, result.map(item => JSON.stringify(
                {
                    id : item.id,
                    name : item.name,
                    shortToken : item.shortToken,
                    lastUsed : item.apikeyLogs[0]?.createdAt || null,
                    createdAt : item.createdAt
                }
            )));
        }

        console.log(`Cache miss for ${req.baseUrl}${req.path}`);
        
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
        const key = getApiKeyLogsKey(userId);

        // Check the cache exist
        const cache = await redis.lRange(key, 0 , 19);
        if(cache.length > 0) {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);
            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    cache.map(item => JSON.parse(item)),
                )
            )
            return;
        }

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
            },
            orderBy : {
                createdAt : "desc"
            }
        });

        // Cache the data
        if(result.length > 0) {
            await redis.rPush(key, result.map(item => JSON.stringify(
                {
                    id: item.id,
                    method: item.method,
                    endpoint: item.endpoint,
                    responseStatus: item.responseStatus,
                    createdAt: item.createdAt
                }
            )))
        }
        console.log(`Cache miss for ${req.baseUrl}${req.path}`);

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
        // Check the cache exist
        const key = getApiKeyLogDetailsKey(logId as string);

        const cache = await redis.hGetAll(key);
        if(cache && Object.keys(cache).length > 0) {
            console.log(`Cache hit for ${req.baseUrl}${req.path}`);
            res.status(HTTP_RESPONSE_CODE.SUCCESS).json(
                new ApiResponse(
                    true,
                    HTTP_RESPONSE_CODE.SUCCESS,
                    {
                        id: cache.id,
                        method: cache.method,
                        endpoint: cache.endpoint,
                        responseStatus: Number(cache.responseStatus),
                        requestBody: JSON.parse(cache.requestBody as string),
                        responseBody: JSON.parse(cache.responseBody as string),
                        createdAt: new Date(cache.createdAt as string),
                    }
                )
            );
            return;
        }

        const result = await prisma.apiKeyLogs.findUnique({
            where : {
                id : logId,
                userId
            },
            omit : { //Removing fields from result
                apikeyId : true,
                userId : true
            }
        });

        if(!result) {
            throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API key log not found")
        }

        // Cache the data
        await redis.hSet(key, {
            id: result.id,
            method: result.method,
            endpoint: result.endpoint,
            responseStatus: String(result.responseStatus),
            requestBody: JSON.stringify(result.requestBody),
            responseBody: JSON.stringify(result.responseBody),
            createdAt: result.createdAt.toISOString(),
        });
        console.log(`Cache miss for ${req.baseUrl}${req.path}`);

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