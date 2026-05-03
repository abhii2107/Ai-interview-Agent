import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";


dotenv.config();
const app = express()
// cross origin resource sharing middleware frontend se connect krne k liye 
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter);
app.use("/api/user",userRouter)

const PORT = process.env.PORT || 6000;
app.listen(PORT,() => {
    console.log(`server running on ${PORT}`)
    connectDB()
})