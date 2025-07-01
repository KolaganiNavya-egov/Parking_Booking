import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useToast } from '../login/toast';
import { db } from '../database/database';
import { useLiveQuery } from 'dexie-react-hooks';

function AddVehicle(props) {
    let username = props.usr;
    const role = props.role;
    const navigate = useNavigate();
    const toast = useToast();
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        licensePlate: '',
    });

    //data polling to get data of user with active bookings
    const data = useLiveQuery(() =>
        db.booking_details
            .where('usr')
            .equals(username)
            .and(item => item.status === 'active')
            .toArray(),
        [username]
    );

    //data polling to get vehicle details
    const vehdata = useLiveQuery(() =>
        db.booking_details
            .where('status')
            .equals('active')
            .toArray()
    );

    //validate vehicle field
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        const licensePlatePattern = /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{1,3}[0-9]{4}$/;
        if (!value.trim()) {
            newErrors.licensePlate = 'License Plate is required';
        } else if (!licensePlatePattern.test(value)) {
            newErrors.licensePlate = 'Invalid License Plate format (e.g., KA01AB1234)';
        } else {
            delete newErrors.licensePlate;
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

    //on submit
    const handleSubmit = async () => {
        if (Object.keys(errors).length === 0) {
            if (formData.licensePlate === '') {
                toast.error("Enter all details");
            }
            else {
                if (vehdata?.some(record => record.vno.toLowerCase() === formData.licensePlate.toLowerCase())) {
                    setFormData({
                        licensePlate: '',
                    });
                    toast.error("This vehicle is already parked!");
                }
                else {
                    navigate('/user/booking', { state: { usr: username, role: role, vno: formData.licensePlate } })
                }
            }
        }
    };

    useEffect(() => {
        if (data?.length > 0) {
            setAlreadyBooked(true);
        }
        else {
            setAlreadyBooked(false);
        }
    }, [data]);

    return (
        <div className="container bg-gray-50 mx-80px px-4 py-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
                <h1 className="text-2xl md:text-2xl font-bold mb-4 text-slate-800">
                    Welcome, {username.toUpperCase()}
                </h1>
                <p className="text-l text-slate-600">
                    {alreadyBooked ? " ⓘ One User can only book one Slot" : "Reserve your parking spot in just a few clicks"}
                </p>
            </div>

            {/* Booking Form */}
            <div className="w-full max-w-md mx-auto">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r bg-white px-6 py-4">
                        <h2 className="text-l font-bold text-black text-center">
                            {alreadyBooked ? "Booked Slot Details" : "Vehicle Details"}
                        </h2>
                    </div>


                    <div className="p-4 space-y-4">
                        {/* License Plate */}
                        {alreadyBooked ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-l">🚗</span>
                                        <span className="font-semibold text-slate-700">Vehicle Number:</span>
                                    </div>
                                    <span className="text-slate-900 font-mono text-base">{data[0]?.vno}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">👤</span>
                                        <span className="font-semibold text-slate-700">User ID:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">{data[0]?.usr}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">🅿️</span>
                                        <span className="font-semibold text-slate-700">Slot:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">{data[0]?.slot}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg">⏰</span>
                                        <span className="font-semibold text-slate-700">Entry Time:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">{new Date(data[0]?.entry).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        License Plate Number
                                    </label>
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        value={formData.licensePlate}
                                        onChange={handleInputChange}
                                        placeholder="e.g., TS09EH1234"
                                        pattern="^[A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4}$"
                                        title="Format: 2 letters (state), 2 digits (district), 1–3 letters (series), 4 digits (number), e.g., TS09EH1234"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    {errors.licensePlate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="w-full bg-gradient-to-r from-slate-700 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-m hover:from-slate-800 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >Start Booking
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddVehicle;
