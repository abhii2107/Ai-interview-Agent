import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorPay.service.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        if (!amount || !credits) {
            return res.status(400).json({ message: "Amount and credits are required" })
        }
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }

        let order;
        try {
            console.log("Creating Razorpay order...");
            order = await razorpay.orders.create(options);
            console.log("Order created:", order);
        } catch (error) {
            console.error("RAZORPAY ERROR:", error);
            return res.status(500).json({ message: "Failed to create Razorpay order", error: error.message });
        }

        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            razorpayOrderId: order.id,
            status: "created",
        });

        return res.json(order);



    } catch (error) {
        return res.status(500).json({ message: "Something went wrong with razorpay order", error: error.message })
    }
}

export const verifypayment = async (req, res) => {
    try {
        const razorpayOrderId = req.body.razorpay_order_id || req.body.razorpayOrder_Id;
        const razorpayPaymentId = req.body.razorpay_payment_id || req.body.razorpayPayment_Id;
        const razorpaySignature = req.body.razorpay_signature || req.body.razorpay_Signature;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return res.status(400).json({ message: "Missing Razorpay verification fields" });
        }

        // cryto module to verify signature
        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpaySignature) {
            return res.status(400).json({ message: "Invalid signature" })
        }

        const payment = await Payment.findOne({ razorpayOrderId });

        if (!payment) {
            return res.json({ message: "Payment not found" })
        }

        if (payment.status === "paid") {
            return res.json({ message: "Payment already Paid" })
        }


        // update Payment record
        payment.status = "paid";
        payment.razorpayPaymentId = razorpayPaymentId;
        await payment.save();

        // Add credits to user Account
        const updatedUser = await User.findByIdAndUpdate(
            payment.userId,
            { $inc: { credits: payment.credits } },
            { returnDocument: "after" }
        )

        res.json({
            success: true,
            message: "Payment verified successfully",
            user: updatedUser
        })


    } catch (error) {
        return res.status(500).json({ message: "Something went wrong while verifying payment", error: error.message })
    }
}