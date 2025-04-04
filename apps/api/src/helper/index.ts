import crypto from "crypto";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { config } from "../config";
import { prisma } from "@repo/db";
import { ApiError } from "../utils/ApiError";
import { HTTP_RESPONSE_CODE } from "../constants/constant";

function generateHash(value : string) : string {
  return crypto.createHash("sha256").update(value).digest("hex");
};

function verifyHash(value : string , hash : string) : boolean {
  return generateHash(value) === hash;
};

function genApiKey() : string {
  try {
    const prefix = "nt_";
    const randomByte = crypto.randomBytes(32);

    const base64Key = randomByte.toString("base64url");
    const keyId = randomUUID();
    const apiKey = `${prefix}${keyId}_${base64Key}`;

    return apiKey;
  } catch (error: unknown) {
    throw error;
  }
}

async function isApiKeyValid(apiKey : string) : Promise<{ apiKeyId: string, userId: number }> {
    try { 
      const hashedApiKey = generateHash(apiKey);
      
      const result = await prisma.apiKey.findUnique({
        where : {
          apikey : hashedApiKey
        },
        select : {
          id : true,
          userId : true,
          apikey : true,
          isActive : true,
          expiresAt : true
        }
      });

      if(!result) {
        throw new ApiError(false, HTTP_RESPONSE_CODE.NOT_FOUND, "API Key not found or Invalid");
      }

      if(!result.isActive) {
        throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Api Key is not active");
      }

      if(result.expiresAt) { 
        const expirationTime = new Date(result?.expiresAt).getTime();
        const currentTime = Date.now();
        
        if(expirationTime < currentTime){
          throw new ApiError(false, HTTP_RESPONSE_CODE.BAD_REQUEST, "Api Key has been expired");
        }
      }

      return {
        apiKeyId : result.id,
        userId : result.userId
      };
    } catch (error) {
      throw error;
    }
}

async function genAccessAndRefreshToken(userId: number, role: string) {
  try {
    const accessToken = jwt.sign({ id: userId, role: role }, config.jwtSecret, {
      expiresIn: "24h",
    });

    const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret, {expiresIn: "7d"})

    return {
      accessToken,
      refreshToken
    }

  } catch (error) {
    throw error;
  }
}

export { generateHash, verifyHash, genApiKey, isApiKeyValid, genAccessAndRefreshToken };