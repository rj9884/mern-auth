import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://mern-auth-frontend-ffah.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));

app.get('/ping', (req, res) => {
  res.send('pong');
});
app.get("/", (_, res)=> res.json({
  message: "🔐 MERN Authentication API is running successfully!",
  status: "active",
  version: "1.0.0",
  endpoints: {
    auth: "/api/v1/auth",
    user: "/api/v1/user"
  },
  documentation: "Check the README.md for API documentation"
}));
import authRouter from './routes/auth.route.js'
app.use('/api/v1/auth',authRouter);

import userRouter from './routes/user.route.js'
app.use('/api/v1/user', userRouter)

export {app};