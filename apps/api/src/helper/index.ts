import crypto from "crypto";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";


async function genApiKey() : Promise<string> {
  try {
    const prefix = "nt_";
    const randomByte = crypto.randomBytes(32);

    const base64Key = randomByte.toString("base64url");
    const keyId = randomUUID();
    const apiKey = `${prefix}${keyId}_${base64Key}`;

    return apiKey;
  } catch (error: unknown) {
    throw new Error("Error occurred while generating API key");
  }
}

async function convertApiToHash(apiKey : string) : Promise<string> {
    try {
        const salt = await bcrypt.genSalt(12);
        const hashApiKey = await bcrypt.hash(apiKey, salt);
        return hashApiKey;
    } catch (error) {
        throw new Error("Error occurred while creating hash of API key");
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
    throw new Error("Something went wrong while generating access and refresh tokens");
  }
}

export { genApiKey , convertApiToHash, genAccessAndRefreshToken }