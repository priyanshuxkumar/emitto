import { Router } from 'express';
import { sendEmail } from '../controllers/email.controller';

const router = Router()

router.route("/send").post(sendEmail);

export const emailRouter = router;
