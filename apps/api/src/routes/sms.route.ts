import { Router } from 'express';
import { sendSMS } from '../controllers/sms.controller';

const router = Router()

router.route("/send").post(sendSMS);

export const smsRouter = router;
