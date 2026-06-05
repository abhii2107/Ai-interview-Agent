import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createOrder, verifypayment } from "../controller/payment.controller.js";


const paymentRouter = express.Router();

paymentRouter.post("/order",isAuth, createOrder);
paymentRouter.post("/verify",isAuth, verifypayment);

export default paymentRouter;
