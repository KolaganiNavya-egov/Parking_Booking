import { db } from '../database/database';
import { useLiveQuery } from 'dexie-react-hooks';

function LogRecords(props) {
    const role = props.role;
    console.log(role, "role");

    // Data polling from the login table
    const data = useLiveQuery(() => db.login.toArray(), []);

    //format the time
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

            <div className="pt-2 p-5">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold text-slate-800 mb-6 pt-5 text-center">
                        Log Records
                    </h1>

                    {data && data.length > 0 ? (
                        <div className="overflow-x-auto shadow-lg rounded-lg border border-slate-200">
                            <table className="w-full bg-white">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-5 py-3 text-center text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-5 py-3 text-center text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-5 py-3 text-center text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-5 py-3 text-center text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Entry
                                        </th>
                                        <th className="px-5 py-3 text-center text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Exit
                                        </th>
                                        <th className="px-5 py-3 text-center text-l font-semibold text-slate-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {[...data].reverse().map((record, index) => (
                                        <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-5 py-3 text-center whitespace-nowrap text-sm font-medium text-slate-900">
                                                {record.id}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">
                                                {record.usr || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-slate-700">
                                                {record.role || '-'}
                                            </td>
                                            <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-slate-700">
                                                {formatDateTime(record.entry)}
                                            </td>
                                            <td className="px-6 py-4  text-center whitespace-nowrap text-sm text-slate-700">
                                                {formatDateTime(record.exit)}
                                            </td>
                                            <td className="px-6 py-4 text-center whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${record.status === 'logged in'
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

export default LogRecords;