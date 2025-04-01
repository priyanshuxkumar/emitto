import { Router } from 'express';
import { registerUser , loginUser, logoutUser } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router()

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/logout").post(auth, logoutUser);


export const authRouter = router;