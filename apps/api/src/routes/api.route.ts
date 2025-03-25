import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { createApiKey, destroyApiKey, updateApiKeyName } from '../controllers/api.controller';

const router = Router()

router.route("/create").post(auth, createApiKey);

router.route("/:id").put(auth , updateApiKeyName);

router.route("/:id").delete(auth, destroyApiKey);

export const apiRouter = router;