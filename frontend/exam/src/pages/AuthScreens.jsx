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
        <div className='min-h-screen bg-gray-100 flex justify-center items-center px-4'>
            <div className='w-full max-w-md bg-white p-6 rounded-lg shadow'>
                <div className='flex mb-4 border-b'>
                    <button onClick={() => setActiveTab("login")}
                        className={`flex-1 py-2 ${activeTab === 'login' ? "border-b-2 font-semibold" : "text-gray-500"}`}>
                        Login
                    </button>

                    <button onClick={() => setActiveTab("signup")}
                        className={`flex-1 py-2 ${activeTab === 'signup' ? "border-b-2 font-semibold" : "text-gray-500"}`}>
                        Signup
                    </button>

                </div>

                <Formik
                    initialValues={activeTab === "login" ? { email: "", password: "", role: "" } : { username: "", email: "", password: "", role: "" }}
                    validationSchema={activeTab === "login" ? loginSchema : signupSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    <Form className='space-y-4'>
                        {activeTab === 'signup' && (
                            <div>
                                <label className='text-sm'>Username</label>
                                <Field name="username"
                                    className="w-full border p-2 rounded"
                                    placeholder="username" />
                                <ErrorMessage name="username" component="p"
                                    className='text-red-500 text-xs' />
                            </div>
                        )}

                        <div>
                            <label className='text-sm'>Email</label>
                            <Field type="email"
                                name="email"
                                className="w-full border p-2 rounded"
                                placeholder="Email" />
                            <ErrorMessage name='email' component="p" className='text-red-500 text-xs' />
                        </div>

                        <div>
                            <label className='text-sm'>Password</label>
                            <Field type="password"
                                name="password"
                                className="w-full border p-2 rounded"
                                placeholder="Password" />
                            <ErrorMessage name="password" component="p" className='text-red-500 text-xs' />
                        </div>

                        <div>
                            <label className='text-sm'>Select Role</label>
                            <Field as="select" name="role" className="w-full border p-2 rounded">
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </Field>
                            <ErrorMessage name="role" component="p" className='text-red-500 text-xs' />
                        </div>

                        <button type='submit'
                            className='w-full bg-black text-white py-2 rounded'>
                            {activeTab === "login" ? "Login" : "Signup"}
                        </button>
                    </Form>
                </Formik>

            </div>
        </div>
    )
}

export default AuthScreens
