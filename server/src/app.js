import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));

app.get('/ping', (req, res) => {
  res.send('pong');
});
app.get("/", (req, res)=> res.send("Hey there!"));
import authRouter from './routes/auth.route.js'
app.use('/api/v1/auth',authRouter);

import userRouter from './routes/user.route.js'
app.use('/api/v1/user', userRouter)

export {app};