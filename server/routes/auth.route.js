import express from "express";
import { googleAuth, logout } from "../controller/auth.controller";


const authRouter = express.Router();

authRouter.post("/google",googleAuth) 
authRouter.post("/logout",logout) 


export default authRouter