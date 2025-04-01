import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { getUser, updateUserDetails } from '../controllers/user.controller';

const router = Router()

router.route("/").get(auth, getUser);

router.route("/update").patch(auth, updateUserDetails)

export const userRouter = router;