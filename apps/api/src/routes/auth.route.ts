import { Router } from 'express';
import { registerUser , loginUser, getUser, logoutUser } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router()

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/").get(auth, getUser);

router.route("/logout").post(auth, logoutUser);


export const authRouter = router;