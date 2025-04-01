import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { createApiKey, destroyApiKey, disableApiKey, getAllApiKeys, getApiKeyDetails, getApiKeyLogs, updateApiKeyName, getApiKeyLogDetails } from '../controllers/api.controller';
import { prisma } from '@repo/db';

const router = Router()

router.route("/create").post(auth, createApiKey);

router.route("/logs").get(auth, getApiKeyLogs);

router.route("/log/:id").get(auth, getApiKeyLogDetails);

router.route("/").get(auth, getAllApiKeys);

router.route("/:id").get(auth, getApiKeyDetails);

router.route("/disable/:id").put(auth , disableApiKey);

router.route("/:id").put(auth , updateApiKeyName);

router.route("/:id").delete(auth, destroyApiKey);

export const apiRouter = router;