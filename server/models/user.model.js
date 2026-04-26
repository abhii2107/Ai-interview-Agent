import mongoose, { Mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    credits: {
        type: Number,
        default:100
    }

}, { timestamps: true })

const User = mongoose.model("User",userSchema)

export default User