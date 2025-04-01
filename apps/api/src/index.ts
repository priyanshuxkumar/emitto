import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { corsOptions } from './config';
import { authRouter } from './routes/auth.route';
import { apiRouter } from './routes/api.route';
import { emailRouter } from './routes/email.route';
import { feedbackRouter } from './routes/feedback.route';
import { userRouter } from './routes/user.route';
import { smsRouter } from './routes/sms.route';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/apikey', apiRouter);
app.use('/api/emails', emailRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/sms', smsRouter);

