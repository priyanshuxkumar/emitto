import dotenv from "dotenv";
dotenv.config();

import { SESClient } from "@aws-sdk/client-ses";
import { SNSClient } from "@aws-sdk/client-sns";

const AWS_CONFIG = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
    },
    region: process.env.AWS_REGION! || 'ap-south-1',
};

const sesClient = new SESClient(AWS_CONFIG); // Email Service
 
const snsClient = new SNSClient(AWS_CONFIG); // SMS Service
  

export { sesClient, snsClient }