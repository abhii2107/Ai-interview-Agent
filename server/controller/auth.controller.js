// we already got the response we will use the displayname and eamil from response(response.user.displayname) and we will use the name and email and will create the user in our mongoDB database  

import generateToken from "../config/Token";
import User from "../models/user.model";


// frontend data


// create user


// token


// cokies 

export const googleAuth = async (req,res) => {
    try {
        // frontend se data
        const {name,email} = req.body;
        // first check that the user is already present in database or not
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name,
                email,
                credits:100 
            })
        }

        let token = await generateToken(user._id)
        res.cookie("token",token,{
            http:true,
            secure:false,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7, // milli seconds
        })
        return res.status(200).json(user)
     
        
    } catch (error) {
        return res.status(500).json({message:`GoogleAuth Error ${error}`})
    }
}

export const logout = async(req,res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"logout successfully"})
    } catch (error) {
        return res.status(500).json({message:`logout Error ${error}`})
    }
}