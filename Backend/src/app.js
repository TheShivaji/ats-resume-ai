import express from 'express';
import cookiesParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookiesParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/auth',authRouter);

export default app;