import { db } from '../database/database';
import { useLiveQuery } from 'dexie-react-hooks';

function MyBooking(props) {
    let username = props.usr;
    let role = props.role;
    console.log(role, "role");

    //data polling from the booking table
    const data = useLiveQuery(() =>
        db.booking_details
            .where('usr')
            .equals(username)
            .toArray(),
        [username]
    );

    return (
        <div className="container bg-gray-150 mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-2">My Bookings</h2>
            </div>

            {data && data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...data].reverse().map((booking, index) => (
                        <div key={booking.id || index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-l font-semibold text-slate-800">
                                    Booking #{data.length - index}
                                </h3>
                                {booking.status === "active" && (
                                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                        {booking.status.toUpperCase()}
                                    </span>
                                )}
                            </div>


                            <div className="space-y-2">

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-l">👤</span>
                                        <span className="font-semibold text-slate-700">User ID:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">{booking.usr}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-l">🚗</span>
                                        <span className="font-semibold text-slate-700">Vehicle Number:</span>
                                    </div>
                                    <span className="text-slate-900 font-mono text-base">{booking.vno.toUpperCase()}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-l">📆</span>
                                        <span className="font-semibold text-slate-700">Date:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">{booking.date}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-l">🅿️</span>
                                        <span className="font-semibold text-slate-700">Slot:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">{booking.slot}</span>
                                </div>

                                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-l">⏰</span>
                                        <span className="font-semibold text-slate-700">Entry Time:</span>
                                    </div>
                                    <span className="text-slate-900 capitalize">
                                        {new Date(booking.entry).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </span>
                                </div>

                                {booking.status === "inactive" && (
                                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-l">⏰</span>
                                            <span className="font-semibold text-slate-700">Exit Time:</span>
                                        </div>
                                        <span className="text-slate-900 capitalize">
                                            {new Date(booking.exit).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            })}
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🚗</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Bookings</h3>
                </div>
            )}
        </div>
    );
}

export default MyBooking;