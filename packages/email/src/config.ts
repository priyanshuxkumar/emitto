import { Resend } from 'resend';
import dotenv from "dotenv";

dotenv.config();

const config = {
  resendApiKey : process.env.RESEND_API_KEY
}

const resend = new Resend(config.resendApiKey);

export { config, resend}