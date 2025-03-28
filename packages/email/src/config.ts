import dotenv from "dotenv";
dotenv.config();
import { SESClient } from "@aws-sdk/client-ses";

const SES_CONFIG = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
    region: process.env.AWS_REGION!,
};

const sesClient = new SESClient(SES_CONFIG);

export { sesClient }