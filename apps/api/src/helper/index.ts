import crypto from "crypto";
import { randomUUID } from "crypto";

async function genApiKey() : Promise<string> {
  try {
    const prefix = "nt_";
    const randomByte = crypto.randomBytes(32);

    const base64Key = randomByte.toString("base64url");
    const keyId = randomUUID();
    const apiKey = `${prefix}${keyId}_${base64Key}`;

    return apiKey;
  } catch (error: unknown) {
    throw new Error("Error occured while generate API key");
  }
}

export { genApiKey }