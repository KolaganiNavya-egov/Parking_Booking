import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Car, LogOut, User, ChevronDown } from 'lucide-react';
import { db } from '../database/database';
import AddVehicle from './addVehicle';
import MyBooking from './myBooking';

function UserHome() {
    const location = useLocation();
    let username = location.state?.usr;
    const role = location.state?.role;
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [activeComponent, setActiveComponent] = useState("book");

    //on Log out
    const handleLogout = async () => {
        const now = new Date().toISOString(); // current timestamp
        try {
            // Find the latest active login entry for the user
            const record = await db.login
                .where('usr')
                .equals(username)
                .filter(r => r.status === "logged in")
                .last();

            if (record) {
                await db.login.update(record.id, {
                    exit: now,
                    status: "logged out"
                });
            }

            navigate('/', { replace: true });
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const handleBookSlot = () => {
        setActiveComponent('book');
    };

    const handleMyBookings = () => {
        setActiveComponent('mybookings');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            {/* Navigation */}
            <nav className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-2 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-blue-600 rounded-lg flex items-center justify-center">
                                <Car className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">
                                Quick Park
                            </span>
                        </div>

                        <div className="flex items-center space-x-6">
                            <button
                                onClick={handleBookSlot}
                                className="px-4 py-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-l font-medium"
                            >
                                Book a Slot
                            </button>
                            <button
                                onClick={handleMyBookings}
                                className="px-4 py-2 text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors duration-200 text-l font-medium"
                            >
                                My Bookings
                            </button>
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center space-x-3 cursor-pointer"
                                    onClick={toggleDropdown}
                                >
                                    <div className="w-9 h-9 bg-gradient-to-r from-slate-800 to-blue-500 rounded-full flex items-center justify-center hover:from-slate-900 hover:to-blue-600 transition-all duration-200">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                                        <div className="p-4 border-b border-slate-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-9 h-9 bg-gradient-to-r from-slate-800 to-blue-500 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-l font-semibold text-slate-800">{username}</span>
                                                    <span className="text-l text-slate-500 capitalize">{role}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full flex  text-l items-center space-x-3 px-3 py-2 text-left text-slate-700 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                                            >
                                                <LogOut className="w-4 h-4 text-slate-500" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {activeComponent === 'book' && <AddVehicle usr={username} role={role} />}
            {activeComponent === 'mybookings' && <MyBooking usr={username} role={role} />}
        </div>
    );
}

export default UserHome;