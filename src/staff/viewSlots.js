import { db } from '../database/database';
import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';

function ViewSlot(props) {
    const role = props.role;
     console.log(role,"role");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [bookingDetails, setBookingDetails] = useState([]);

    //Data polling form the slot_details table
    const data = useLiveQuery(() => db.slot_details.toArray(), []);

    const booking = useLiveQuery(() =>
        db.booking_details
            .where('status')
            .equals('active')
            .toArray()
    );
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

    //obtain slot styles
    const getSlotStyles = (slot) => {
        const baseStyles = "w-16 h-16 m-1 rounded-lg border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200 hover:scale-105";
        if (slot.status === 'occupied') {
            return `${baseStyles} bg-red-300 border-red-400 text-white cursor-not-allowed`;
        }
        else {
            return `${baseStyles} bg-white-300 border-green-300 text-black`;
        }
    };

    //on slot click
    const handleSlotClick = (slot) => {
        if (slot.status === 'occupied') {
            setBookingDetails(booking.filter(item => item.slot === slot.id));
            setSelectedSlot(slot);
            setShowPopup(true);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedSlot(null);
    };

    // Format date and time
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString()
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-8">Parking Slot</h1>

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
                    </div>
                    <div className="text-center text-gray-600">
                        <p>Click on the Booked Slots to get the Booking Details</p>
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
                </div>
            </div>

            {showPopup && selectedSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-50 rounded-lg p-4 max-w-md w-1/2 mx-4 relative">
                        {/* Close button */}
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>

                        {/* Popup content */}
                        <div className="pr-6">
                            <h2 className="text-l font-bold mb-4 text-gray-800 text-center">
                                Slot {selectedSlot.id} - Booking Details
                            </h2>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Booking ID:</span>
                                    <span className="text-gray-800">#{bookingDetails[0].id}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">User:</span>
                                    <span className="text-gray-800">{bookingDetails[0].usr}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Vehicle No:</span>
                                    <span className="text-gray-800">{bookingDetails[0].vno.toUpperCase()}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Entry Date:</span>
                                    <span className="text-gray-800">{formatDateTime(bookingDetails[0].entry).date}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-600">Entry Time:</span>
                                    <span className="text-gray-800">{formatDateTime(bookingDetails[0].entry).time}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={closePopup}
                                className="w-full bg-gradient-to-r from-slate-700 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-m hover:from-slate-800 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewSlot;
