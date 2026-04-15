import express from 'express';
import cookiesParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookiesParser());

app.use('/api/auth', (req , res) => {
    res.send('Auth route');
});

export default app;