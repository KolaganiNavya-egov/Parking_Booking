import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Car, X, CheckCircle, XCircle, User, ChevronDown, LogOut, ChevronLeft } from 'lucide-react';
import { useToast } from '../login/toast';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/database';
import { useRef, useEffect } from 'react';

function BookSlot() {
    const location = useLocation();
    const username = location.state?.usr;
    const role = location.state?.role;
    const vehicleno = location.state?.vno;
    const navigate = useNavigate();
    const toast = useToast();
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bookStatus, setBookStatus] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    //Data polling from slot_details table
    const data = useLiveQuery(() => db.slot_details.toArray(), []);

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

            //update the user as logged out
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

    // Group slots by position (top, left, right)
    const groupedSlots = data ? data.reduce((acc, slot) => {
        const row = slot.id[0];
        if (row === 'A') {
            acc.top.push(slot);
        } else if (row === 'B' || row === 'C') {
            acc.left.push(slot);
        } else if (row === 'D' || row === 'E') {
            acc.right.push(slot);
        }
        return acc;
    }, { top: [], left: [], right: [] }) : { top: [], left: [], right: [] };


    const handleSlotClick = (slot) => {
        if (slot.status === 'available') {
            setSelectedSlot(slot.id);
            setShowModal(true);
        }
        if (slot.status === "occupied") {
            toast.error("the slot is occupied");
        }
    };

    //to book a slot
    const handleBookSlot = async () => {
        if (selectedSlot == null) {
            toast.error("Select a slot");
        }
        else {
            try {
                await db.slot_details.update(selectedSlot, { status: 'occupied' });
                await db.booking_details.add({
                    usr: username,
                    vno: vehicleno,
                    slot: selectedSlot,
                    entry: new Date().toISOString(),  // current timestamp
                    exit: null,
                    date: new Date().toLocaleDateString(), // optional: for daily grouping
                    status: 'active'
                });
                setBookStatus("success");
                setShowModal(true);
                setSelectedSlot(null);
            }
            catch (error) {
                toast.error("Booking failed");
                setBookStatus("fail");
                console.error("Booking error:", error);
            }
        }
    };

    //slot styles
    const getSlotStyles = (slot) => {
        const baseStyles = "w-16 h-16 m-1 rounded-lg border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200 hover:scale-105";
        if (slot.status === 'occupied') {
            return `${baseStyles} bg-red-300 border-red-400 text-white cursor-not-allowed hover:scale-100`;
        } else if (selectedSlot === slot.id) {
            return `${baseStyles} bg-blue-300 border-blue-400 text-white shadow-lg`;
        } else {
            return `${baseStyles} bg-white-300 border-green-300 text-black hover:bg-green-200`;
        }
    };

    //close the popup
    const closeModal = () => {
        setShowModal(false);
        setSelectedSlot(null);
    };

    //toggle the profile tab
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

    const Modal = ({ isOpen, onClose, slot }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                {bookStatus === "success" ? (
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"><div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                        <CheckCircle className="w-10 h-10 text-green-700 mx-auto mb-4" />
                        <h1 className="text-l font-bold mb-2">Slot Booked Successfully!</h1>
                        <p className="text-gray-700 mb-4">
                            <strong>{username}</strong>, your slot <strong>{slot}</strong> has been booked.
                        </p>
                        <button
                            type="button"
                            className="w-full bg-gradient-to-r from-slate-700 to-blue-600 text-white py-2 px-3 rounded-lg font-semibold text-m hover:from-slate-800 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => navigate('/user', { state: { usr: username, role: role }, replace: true })}
                        >Go to Home
                        </button>
                    </div>
                    </div>
                ) : bookStatus === "fail" ? (
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"><div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                        <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Slot Booking Failed!</h1>
                        <button
                            type="button"
                            className="w-full bg-gradient-to-r from-slate-700 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-m hover:from-slate-800 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => navigate('/user', { state: { usr: username, role: role }, replace: true })}
                        >Book Again !
                        </button>
                    </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="text-center mb-6">
                            <div className="text-2xl mb-2">🚗</div>
                            <h3 className="text-xl font-semibold text-slate-800">Confirm Booking</h3>
                        </div>

                        <p className="text-gray-600 mb-6 text-center">
                            You have selected slot: <strong className="text-slate-800">{slot}</strong>
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleBookSlot}
                                className="bg-gradient-to-r from-slate-700 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-slate-800 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Book Slot
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-150 text-slate-900 font-sans">
            {/* Navigation */}
            <nav className="bg-white border-b border-slate-200 shadow-sm">
                <div className="container mx-auto px-2 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate('/user', { state: { usr: username, role: role } })}
                                className="w-5 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
                                title="Go Back"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-700" />
                            </button>
                            <div className="w-9 h-9 bg-gradient-to-r from-slate-700 to-blue-600 rounded-lg flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">
                                Quick Park
                            </span>
                        </div>

                        <div className="flex items-center space-x-6">
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

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-l font-bold text-center mb-8">Select Your Parking Slot</h1>

                    {/* Legend */}
                    <div className="flex justify-center space-x-6 mb-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-white rounded border border-black"></div>
                            <span className="text-sm">Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-red-400 rounded"></div>
                            <span className="text-sm">Occupied</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-400 rounded"></div>
                            <span className="text-sm">Selected</span>
                        </div>
                    </div>

                    {/* U-Shaped Parking Layout */}
                    <div className="bg-white justify-center rounded-xl shadow-lg p-8 mb-6">
                        <div className="relative">
                            {/* Top Row */}
                            <div className="flex justify-center mb-8">
                                <div className="flex items-center space-x-2">
                                    <div className="flex">
                                        {groupedSlots.top.map((slot) => (
                                            <button
                                                key={slot.id}
                                                className={getSlotStyles(slot)}
                                                onClick={() => handleSlotClick(slot)}
                                                disabled={slot.status === 'occupied'}
                                                title={`Slot ${slot.id} - ${slot.status}`}
                                            >
                                                {slot.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Middle Section with Left and Right */}
                            <div className="flex justify-between items-start">
                                {/* Left Column */}
                                <div className="flex flex-col items-center">
                                    <div className="flex space-x-4">
                                        {/* B Row */}
                                        <div className="flex flex-col space-y-2">
                                            {groupedSlots.left.filter(slot => slot.id.startsWith('B')).map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    className={getSlotStyles(slot)}
                                                    onClick={() => handleSlotClick(slot)}
                                                    disabled={slot.status === 'occupied'}
                                                    title={`Slot ${slot.id} - ${slot.status}`}
                                                >
                                                    {slot.id}
                                                </button>
                                            ))}
                                        </div>
                                        {/* C Row */}
                                        <div className="flex flex-col space-y-2">
                                            {groupedSlots.left.filter(slot => slot.id.startsWith('C')).map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    className={getSlotStyles(slot)}
                                                    onClick={() => handleSlotClick(slot)}
                                                    disabled={slot.status === 'occupied'}
                                                    title={`Slot ${slot.id} - ${slot.status}`}
                                                >
                                                    {slot.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex flex-col items-center">
                                    <div className="flex space-x-4">
                                        {/* D Row */}
                                        <div className="flex flex-col space-y-2">
                                            {groupedSlots.right.filter(slot => slot.id.startsWith('D')).map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    className={getSlotStyles(slot)}
                                                    onClick={() => handleSlotClick(slot)}
                                                    disabled={slot.status === 'occupied'}
                                                    title={`Slot ${slot.id} - ${slot.status}`}
                                                >
                                                    {slot.id}
                                                </button>
                                            ))}
                                        </div>
                                        {/* E Row */}
                                        <div className="flex flex-col space-y-2">
                                            {groupedSlots.right.filter(slot => slot.id.startsWith('E')).map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    className={getSlotStyles(slot)}
                                                    onClick={() => handleSlotClick(slot)}
                                                    disabled={slot.status === 'occupied'}
                                                    title={`Slot ${slot.id} - ${slot.status}`}
                                                >
                                                    {slot.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="text-center text-gray-600">
                        <p>Click on any available (green) slot to select it for booking.</p>
                        <p className="text-sm mt-1">Red slots are already occupied and cannot be selected.</p>
                    </div>

                    <Modal
                        isOpen={showModal}
                        onClose={closeModal}
                        slot={selectedSlot}
                    />
                </div>
            </div>
        </div>
    );
}

export default BookSlot;
