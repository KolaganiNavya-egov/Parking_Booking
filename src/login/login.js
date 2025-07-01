import { useState } from 'react';
import { Car, User, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from './toast';
import { db } from '../database/database';

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role;
    const toast = useToast();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [data, setData] = useState([]);


    // Get role icon
    const getRoleConfig = () => {
        switch (role) {
            case 'user':
                return { icon: User, label: 'User' };
            case 'staff':
                return { icon: Users, label: 'Staff' };
            case 'admin':
                return { icon: Shield, label: 'Admin' };
            default:
                return { icon: User, label: 'User' };
        }
    };

    const { icon: RoleIcon, label } = getRoleConfig();

    //validate the fields
    const validateField = (name, value) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'username':
                if (!value.trim()) {
                    newErrors.username = 'Username is required';
                } else if (value.length < 3) {
                    newErrors.username = 'Username must be at least 3 characters';
                } else {
                    delete newErrors.username;
                }
                break;
            case 'password':
                if (!value.trim()) {
                    newErrors.password = 'Password is required';
                } else if (value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                } else {
                    delete newErrors.password;
                }
                break;
            case 'email':
                if (role === 'user' && isSignUp) {
                    if (!value.trim()) {
                        newErrors.email = 'Email is required';
                    } else if (!/\S+@\S+\.\S+/.test(value)) {
                        newErrors.email = 'Please enter a valid email';
                    } else {
                        delete newErrors.email;
                    }
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
    };

    //on input field change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change
        validateField(name, value);
    };

    //add user details in the user_details table
    async function registerUser(email, usr, pwd) {
        try {
            const existing = await db.user_details.get(usr);
            if (existing) {
                toast.error("Username already exists");
                return;
            }
            await db.user_details.add({
                usr, email, pwd
            })
            console.log("signup successfull");
        }
        catch (error) {
            console.log(error, "error");
        }
    }

    //get details by role
    async function getUserByRole(role, username) {
        switch (role) {
            case "staff":
                return await db.staff_details.get(username);

            case "admin":
                return await db.admin_details.get(username);

            case "user":
                return await db.user_details.get(username);

            default:
                throw new Error("Invalid role");
        }
    }

    async function login(role, username, password) {
        const user = await getUserByRole(role, username);
        if (!user) return "User not found";
        if (user.pwd !== password) return "Incorrect password";
        toast.success("Login Successful");
        return "success";
    }

    const handleSubmit = async () => {
        if (Object.keys(errors).length === 0) {
            if (formData.username === '' || formData.password === '' || (isSignUp && formData.email === '')) {
                toast.error("Enter all details");
            }
            else {
                if (isSignUp) {
                    await registerUser(formData.email, formData.username, formData.password);
                    navigate('/user', { state: { usr: formData.username, role: role }, replace: true })
                    await db.login.add({
                        usr: formData.username,
                        role: role,
                        entry: new Date().toISOString(),
                        exit: null,
                        status: "logged in"
                    });
                }
                else {
                    const ret = await login(role, formData.username, formData.password);
                    if (ret !== "success") {
                        toast.error(ret);
                    }
                    else {
                        if (role === "user") {
                            navigate('/user', { state: { usr: formData.username, role: role }, replace: true })
                            await db.login.add({
                                usr: formData.username,
                                role: role,
                                entry: new Date().toISOString(),
                                exit: null,
                                status: "logged in"
                            });
                        }
                        else if (role === "staff") {
                            navigate('/staff', { state: { usr: formData.username, role: role }, replace: true })
                            await db.login.add({
                                usr: formData.username,
                                role: role,
                                entry: new Date().toISOString(),
                                exit: null,
                                status: "logged in"
                            });
                        }
                        else {
                            navigate('/admin', { state: { usr: formData.username, role: role }, replace: true })
                            await db.login.add({
                                usr: formData.username,
                                role: role,
                                entry: new Date().toISOString(),
                                exit: null,
                                status: "logged in"
                            });
                        }
                    }
                }
            }
        }
    }

    // Staff and Admin only show login
    const showSignUpOption = role === 'user';

    useEffect(() => {
        const fetchData = async () => {
            const data = await db.login
                .where('status')
                .equals("logged in")
                .toArray();

            setData(data);
        };
        fetchData();
    }, []);

    //if logged in
    if (data.length === 1) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center animate-fade-in-down">
                    <div className="flex justify-center mb-4">
                        <svg
                            className="w-16 h-16 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-800 mb-2">You're already logged in!</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900 font-app flex items-center justify-center p-4 overflow-auto">
            <nav className="fixed top-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-9 h-9 bg-gradient-to-r from-slate-700 to-blue-600 rounded-lg flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">
                                Quick Park
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative w-full max-w-md overflow-auto">
                {/* Header */}
                <div className="text-center pb-1">
                    {/* Role Indicator */}
                    <div className="flex items-center justify-center space-x-2 mb-2 pt-10">
                        <RoleIcon className={`w-5 h-5 text-blue-600`} />
                        <span className={`text-lg font-semibold text-blue-600`}>{label} Access</span>
                    </div>
                </div>

                {/* Login Form Card */}
                <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-7">
                    {/* Toggle Buttons - Only for Users */}
                    {showSignUpOption && (
                        <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setIsSignUp(false)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isSignUp
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSignUp(true)}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isSignUp
                                    ? 'bg-white text-slate-800 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-800'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}

                    {/* Form Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800">
                            {!showSignUpOption
                                ? `${label} Login`
                                : isSignUp
                                    ? 'Create Account'
                                    : 'Welcome Back'
                            }
                        </h2>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                        {/* Car Number Field - Only for User Sign Up */}
                        {role === 'user' && isSignUp && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                        )}

                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-slate-800 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-slate-900 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >
                            {!showSignUpOption
                                ? 'Sign In'
                                : isSignUp
                                    ? 'Create Account'
                                    : 'Sign In'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
