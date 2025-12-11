import api from "./api";

export const signupUser = async (username, email, password, role) => {
    const response = await api.post("/auth/signup", {
        username,
        email,
        password,
        role,
        loginType: "N"
    })

    if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
    }
    return response.data
}

export const loginUser = async (email, password, role) => {
    const response = await api.post("/auth/login", {
        email,
        password,
        role,
        loginType: "N"
    })

    if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken)
    }
    return response.data
}