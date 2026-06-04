import razorpay from "../services/razorPay.service.js";

export const createOrder = async (req,res) => {
    try {
        const{planId,amount,credits} = req.body;
        if(!amount || !credits){
            return res.status(400).json({message: "Amount and credits are required"})
        }
        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        }

        const order = await razorpay.orders.create(options);

        

    } catch (error) {
        
    }
}