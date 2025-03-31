import { Router } from 'express';
import { submitFeedback } from '../controllers/feedback.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router()

router.route("/submit").post(auth, submitFeedback);

export const feedbackRouter = router;
