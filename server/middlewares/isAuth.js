import { verify } from "jsonwebtoken"
import jwt from "jsonwebtoken"



const isAuth = async(req,res,next) => {
    try {
        let {token} = req.cookies

        if(!token){
            return res
            .status(400)
            .json({message: "user does not have Token"})
        }

        const verifyToken = jwt.verify(token,process.env.JWT_SECRET)

        if (!verifyToken){
            return res.status(400).json({message:"user does not have a valid tokn"})

        }

        req.userId = verifyToken.userId
        next();
ṅṅṅṅ

    } catch (error) {
        
    }
}