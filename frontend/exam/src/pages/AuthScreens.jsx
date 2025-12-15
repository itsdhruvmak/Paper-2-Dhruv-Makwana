import { useState } from 'react'
import * as yup from 'yup'
import { loginUser, signupUser } from '../services/auth'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage, Field, Form, Formik } from 'formik'

const AuthScreens = () => {

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("login")

    const signupSchema = yup.object({
        username: yup.string().required("Username is required"),
        email: yup.string().email("Not valid").required("Email is required"),
        password: yup.string().min(8, "minimum 8 letters are required").required("Password is required"),
        role: yup.string().required("please select a role")
    })

    const loginSchema = yup.object({
        email: yup.string().email("Not valid").required("Email is required"),
        password: yup.string().required("password is required"),
        role: yup.string().required("please select a role")
    })

    const handleSubmit = async (values) => {
        try {
            let data;
            console.log("Submit values:", values);

            if (activeTab === "login") {
                data = await loginUser(values.email, values.password, values.role)
            } else {
                data = await signupUser(values.username, values.email, values.password, values.role)
            }

            if (data.refreshToken) {
                localStorage.setItem('refreshToken', data.refreshToken)
            }

            const userRole = data.user.role;
            if (userRole === "Admin") {
                navigate("/admin")
            } else {
                navigate("/layout")
            }
        } catch (error) {
            alert(error.responose?.data?.message || "Something went wrong")
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4'>
            <div className='w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-xl'>

                {/* Tabs */}
                <div className='flex mb-6 rounded-lg overflow-hidden border'>
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`flex-1 py-3 text-sm font-medium transition-all duration-300
                        ${activeTab === 'login'
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setActiveTab("signup")}
                        className={`flex-1 py-3 text-sm font-medium transition-all duration-300
                        ${activeTab === 'signup'
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                    >
                        Signup
                    </button>
                </div>

                <Formik
                    initialValues={activeTab === "login"
                        ? { email: "", password: "", role: "" }
                        : { username: "", email: "", password: "", role: "" }}
                    validationSchema={activeTab === "login" ? loginSchema : signupSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    <Form className='space-y-5'>

                        {activeTab === 'signup' && (
                            <div>
                                <label className='text-sm font-medium text-gray-700'>Username</label>
                                <Field
                                    name="username"
                                    placeholder="Enter username"
                                    className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2
                                    focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                                    transition"
                                />
                                <ErrorMessage name="username" component="p"
                                    className='text-red-500 text-xs mt-1' />
                            </div>
                        )}

                        <div>
                            <label className='text-sm font-medium text-gray-700'>Email</label>
                            <Field
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2
                                focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                                transition"
                            />
                            <ErrorMessage name='email' component="p"
                                className='text-red-500 text-xs mt-1' />
                        </div>

                        <div>
                            <label className='text-sm font-medium text-gray-700'>Password</label>
                            <Field
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2
                                focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                                transition"
                            />
                            <ErrorMessage name="password" component="p"
                                className='text-red-500 text-xs mt-1' />
                        </div>

                        <div>
                            <label className='text-sm font-medium text-gray-700'>Select Role</label>
                            <Field
                                as="select"
                                name="role"
                                className="w-full mt-1 rounded-lg border border-gray-300 px-3 py-2
                                bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                                transition"
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </Field>
                            <ErrorMessage name="role" component="p"
                                className='text-red-500 text-xs mt-1' />
                        </div>

                        <button
                            type='submit'
                            className='w-full bg-black text-white py-3 rounded-lg font-medium
                            hover:bg-gray-900 active:scale-[0.98] transition-all duration-200'
                        >
                            {activeTab === "login" ? "Login" : "Signup"}
                        </button>
                    </Form>
                </Formik>

            </div>
        </div>
    )
}

export default AuthScreens
