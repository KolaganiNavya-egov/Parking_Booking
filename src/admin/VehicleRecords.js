import { db } from '../database/database';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';

function VehicleRecords(props) {
    const role = props.role;
    console.log(role,"role");
    const [formData, setFormData] = useState({
        licensePlate: ''
    })

    //on field value change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Data polling from the booking_details table
    const data = useLiveQuery(() => db.booking_details.toArray(), []);

    //filter the data using the licensePlate given by admin
    const filteredData = data?.filter(record =>
        record.vno?.toLowerCase().includes(formData.licensePlate.toLowerCase())
    );

    //format the date
    const formatDateTime = (isoString) => {
        if (!isoString) return '-';
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 text-slate-900 overflow-auto">
            <div className="pt-2 p-6">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold text-slate-800 mb-6 pt-5 text-center">
                        Vehicle Log Records
                    </h1>
                    <div className="pt-2 p-6">
                        <div className="flex items-center space-x-4">
                            <label
                                htmlFor="licensePlate"
                                className="text-l font-medium text-gray-700"
                            >
                                Enter the Vehicle Number :
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
                                className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
                            />
                        </div>
                    </div>

                    {data && data.length > 0 ? (
                        <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200">
                            <table className="w-full bg-white">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Vehicle
                                        </th>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Slot
                                        </th>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Entry
                                        </th>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Exit
                                        </th>
                                        <th className="px-5 py-3 text-right text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {[...filteredData].reverse().map((record, index) => (
                                        <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium text-slate-900">
                                                {record.id}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-slate-700">
                                                {record.usr || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-slate-700">
                                                {record.vno.toUpperCase() || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-slate-700">
                                                {record.slot || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-slate-700">
                                                {formatDateTime(record.entry)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap text-sm text-slate-700">
                                                {formatDateTime(record.exit)}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${record.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {record.status || 'unknown'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-slate-400 text-lg">
                                No parking records found
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VehicleRecords;