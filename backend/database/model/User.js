import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    loginType: { type: String, enum: ["N", "G"], default: "N" },
    socialId: { type: String },
    username: { type: String },
    email: {
        type: String,
        required: function () {
            return this.loginType === "N"
        },
        sparse: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter valid email"]
    },
    password: {
        type: String,
        required: function () {
            return this.loginType === "N"
        },
    },
    role: { type: String, enum: ["User", "Admin"], required: true, default: "User" }
}, { timestamps: true })


userSchema.pre("save", async function (next) {
    try {
        if (this.loginType === "N") {
            if (this.isModified("password")) {
                this.password = await bcrypt.hash(this.password, 10)
            }
        } else {
            this.userName = null;
            this.email = null;
            this.password = null;
            this.socialId = null;
        }

    } catch (error) {
        next(error)
    }
})

const User = mongoose.model("User", userSchema)

export default User;