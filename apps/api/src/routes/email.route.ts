import { Router } from 'express';
import { sendEmail, getAllEmail, getEmailDetails } from '../controllers/email.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router()

router.route("/send").post(sendEmail);

router.route("/").get(auth, getAllEmail);

router.route("/:id").get(auth, getEmailDetails);

export const emailRouter = router;
