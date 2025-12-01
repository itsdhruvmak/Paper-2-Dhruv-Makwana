import User from "../../../../database/model/User.js"


export const findUserByEmail = async (email) => {
    return await User.findOne({ email })
}

export const findSocialUser = async (loginType, socialId) => {
    return await User.findOne({ loginType, socialId })
}

export const createUser = async (userData) => {
    const newUser = new User(userData)
    return await newUser.save()
}