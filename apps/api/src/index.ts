import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

import { corsOptions } from './config';
import { authRouter } from './routes/auth.route';
import { apiRouter } from './routes/api.route';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api/auth', authRouter);
app.use('/api/apikey', apiRouter);


