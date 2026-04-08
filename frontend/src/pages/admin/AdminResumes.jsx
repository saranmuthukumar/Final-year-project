import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNotifications } from '../../context/NotificationContext';

const AdminResumes = () => {
    const { addNotification } = useNotifications();
    const [resumes, setResumes] = useState([
        { id: 1, student: 'Alice Johnson', alumni: 'John Doe', file: 'Alice_Resume.pdf', status: 'Approved', date: '2025-12-30' },
        { id: 2, student: 'Bob Smith', alumni: 'Pending', file: 'Bob_Dev_CV.docx', status: 'Pending', date: '2025-12-31' },
        { id: 3, student: 'Charlie Brown', alumni: 'Jane Smith', file: 'Charlie_Design.pdf', status: 'Rejected', date: '2025-12-28' },
    ]);

    const handleAction = (id, action) => {
        setResumes(resumes.map(r => r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r));
        addNotification({
            title: `Resume ${action === 'approve' ? 'Approved' : 'Rejected'}`,
            message: `Resume ID ${id} has been ${action}d by Admin.`,
            type: action === 'approve' ? 'success' : 'error',
        });
    };

    return (
        <DashboardLayout role="Admin" title="Resume Moderation">
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b dark:border-gray-700">
                            <tr>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Student</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Reviewer (Alumni)</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">File</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y dark:divide-gray-700">
                            {resumes.map((resume) => (
                                <tr key={resume.id}>
                                    <td className="py-4 px-4 text-sm font-medium dark:text-white">{resume.student}</td>
                                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{resume.alumni}</td>
                                    <td className="py-4 px-4 text-sm text-teal-600 dark:text-cyan-400 hover:underline cursor-pointer">{resume.file}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${resume.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300' :
                                            resume.status === 'Rejected' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300' :
                                                'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                                            }`}>
                                            {resume.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{resume.date}</td>
                                    <td className="py-4 px-4 space-x-2">
                                        {resume.status === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(resume.id, 'approve')}
                                                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium text-sm"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(resume.id, 'reject')}
                                                    className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-medium text-sm"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium text-sm">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminResumes;
