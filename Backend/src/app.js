import express from 'express';
import cookiesParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookiesParser());

app.use('/api/auth',authRouter);

export default app;