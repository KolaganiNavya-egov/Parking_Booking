import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../login/toast';
import { db } from '../database/database';

function AddStaff(props) {
    const navigate = useNavigate();
    const role = props.role;
    const usr = props.usr;
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

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
            default:
                break;
        }

        setErrors(newErrors);
    };

    //on change of data fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate on change
        validateField(name, value);
    };

    //To register the staff in database
    async function registerStaff(usr, pwd) {
        try {
            const existing = await db.staff_details.get(usr);
            if (existing) {
                toast.error("Username already exists");
                return;
            }
            await db.staff_details.add({
                usr, pwd
            })
            toast.success("staff added successfully");
            console.log("staff added successfully");
        }
        catch (error) {
            toast.success("staff creation failed");
            console.log(error, "error");
        }
    }

    //When we create on add staff
    const handleSubmit = async () => {
        if (Object.keys(errors).length === 0) {
            if (formData.username === '' || formData.password === '') {
                toast.error("Enter all details");
            }
            else {
                await registerStaff(formData.username, formData.password);
                setFormData({
                    username: '',
                    password: ''
                });
                navigate('/admin', { state: { usr: usr, role: role } })
            }
        }
    }

    return (
        <div className="min-h-screen-40px bg-gray-50 text-slate-900 font-app flex items-center justify-center p-5  text-l overflow-auto">
            <div className="relative w-full max-w-md overflow-auto">
                {/* Header */}
                <div className="text-center pb-1">
                    {/* Role Indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-4 pt-10">
                        <span className={`text-xl font-semibold text-blue-600`}>Add Staff</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6">
                    <div className="space-y-3">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-l font-medium text-slate-700 mb-1">
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
                            <label htmlFor="password" className="block text-l font-medium text-slate-700 mb-1">
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
                            className="w-full bg-gradient-to-r from-slate-800 to-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:from-slate-900 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                        >Add Staff
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddStaff;
