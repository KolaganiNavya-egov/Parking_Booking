import { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../login/toast';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../database/database';

function ManageSlot(props) {
    const role = props.role;
    console.log(role,"role");
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'book' or 'release'
    const [currentSlot, setCurrentSlot] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        username: 'staff',
        licensePlate: ''
    });

    //Data polling from slot_details table
    const data = useLiveQuery(() => db.slot_details.toArray(), []);

    //data polling from booking-details table
    const vehdata = useLiveQuery(() =>
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


    //handle event on click on slot
    const handleSlotClick = (slot) => {
        setCurrentSlot(slot);
        if (slot.status === 'available') {
            setModalType('book');
            setShowModal(true);
        } else if (slot.status === 'occupied') {
            setModalType('release');
            setShowModal(true);
        }
    };

    //validate the License plate given by staff to register
    const validateField = (name, value) => {
        const newErrors = { ...errors };
        const licensePlatePattern = /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{1,3}[0-9]{4}$/;
        if (name === 'licensePlate') {
            if (!value.trim()) {
                newErrors.licensePlate = 'License Plate is required';
            } else if (!licensePlatePattern.test(value)) {
                newErrors.licensePlate = 'Invalid License Plate format (e.g., KA01AB1234)';
            } else {
                delete newErrors.licensePlate;
            }
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

        setTimeout(() => {
            validateField(name, value);
        }, 0);
    };

    //to handle booking a slot
    const handleBookSlot = async () => {
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
                    try {
                        await db.slot_details.update(currentSlot.id, { status: 'occupied' });
                        await db.booking_details.add({
                            usr: formData.username,
                            vno: formData.licensePlate,
                            slot: currentSlot.id,
                            entry: new Date().toISOString(),  // current timestamp
                            exit: null,
                            date: new Date().toLocaleDateString(), // optional: for daily grouping
                            status: 'active'
                        });
                    }
                    catch (error) {
                        toast.error("Booking failed");
                        console.error("Booking error:", error);
                    }
                    setShowModal(false);
                    setCurrentSlot(null);
                    setModalType('');
                    setFormData({ username: 'staff', licensePlate: '' });
                }
            }
        }
    };

    //to handle Releasing a slot and making it available
    const handleReleaseSlot = async () => {
        try {
            await db.slot_details.update(currentSlot.id, { status: "available" });
            await db.booking_details
                .where('slot')
                .equals(currentSlot.id) // Use currentSlot.id instead of currentSlot object
                .and(item => item.status === 'active') // Only update active bookings
                .modify({
                    status: 'inactive',
                    exit: new Date().toISOString(),
                });
            // toast.success(`Slot ${currentSlot.id} has been released successfully`);

            console.log(`Successfully released slot ${currentSlot.id}`);

        } catch (error) {
            console.error('Error releasing slot:', error);
            // toast.error('Failed to release slot. Please try again.');
        }
        setShowModal(false);
        setCurrentSlot(null);
        setModalType('');
        setFormData({ username: 'staff', licensePlate: '' });
    };

    //close the popup
    const closeModal = () => {
        setShowModal(false);
        setCurrentSlot(null);
        setModalType('');
        setFormData({ username: 'staff', licensePlate: '' });
        setErrors({});
    };

    //to get styles to the slots (red for booked, transparent for available)
    const getSlotStyles = (slot) => {
        const baseStyles = "w-16 h-16 m-1 rounded-lg border-2 flex items-center justify-center font-bold text-sm cursor-pointer transition-all duration-200 hover:scale-105";
        if (slot.status === 'occupied') {
            return `${baseStyles} bg-red-300 border-red-400 text-white cursor-not-allowed hover:scale-100`;
        } else if (currentSlot?.id === slot.id) {
            return `${baseStyles} bg-blue-300 border-blue-400 text-white shadow-lg`;
        } else {
            return `${baseStyles} bg-white-300 border-green-300 text-black hover:bg-green-200`;
        }
    };

    //popup to book and release slot
    const Modal = ({ isOpen, onClose, type, slot }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {type === 'book' ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🅿️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Book Parking Slot
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Do you want to book slot <strong>{slot?.id}</strong>?
                            </p>

                            <div className="space-y-4 text-left mb-6">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                        (By Staff)
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={"staff"}
                                        required
                                        disabled={true}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                {/* License Plate Field */}
                                <div>
                                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-2">
                                        License Plate Number
                                    </label>
                                    <input
                                        type="text"
                                        id="licensePlate"
                                        name="licensePlate"
                                        value={formData.licensePlate}
                                        onChange={handleInputChange}
                                        placeholder="e.g., TS09EH1234"
                                        required
                                        autoFocus
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    {errors.licensePlate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleBookSlot}
                                    className="w-full bg-gradient-to-r from-slate-700 to-blue-600 text-white py-2 px-4 rounded-lg font-semibold text-m hover:from-slate-800 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >Book Slot
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🚗</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Release Parking Slot
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Do you want to make slot <strong>{slot?.id}</strong> available?
                            </p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReleaseSlot}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-all"
                                >
                                    Make Available
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-8">Manage Parking Slot</h1>
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

                    {/* Instructions */}
                    <div className="text-center text-gray-600">
                        <p>Click on any available (green) slot to select it for booking.</p>
                        <p>Click on any available (red) slot to make them available.</p>
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

            <Modal
                isOpen={showModal}
                onClose={closeModal}
                type={modalType}
                slot={currentSlot}
            />
        </div>
    );
}

export default ManageSlot;