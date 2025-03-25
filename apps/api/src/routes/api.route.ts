import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { createApiKey } from '../controllers/api.controller';

const router = Router()

router.route("/create").post(auth, createApiKey);

export const apiRouter = router;