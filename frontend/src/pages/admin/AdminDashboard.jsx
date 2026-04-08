import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingAlumni: 0,
        pendingStudents: 0,
        pendingWebinars: 0,
        pendingJobs: 0,
    });
    const [pendingAlumni, setPendingAlumni] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [pendingJobs, setPendingJobs] = useState([]);
    const [studentInterests, setStudentInterests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [alumniRes, studentsRes, jobsRes, webinarsRes, usersRes, analyticsRes] = await Promise.all([
                api.get('/alumni/pending'),
                api.get('/students/pending'),
                api.get('/jobs?isApproved=false'),
                api.get('/webinars?isApproved=false'),
                api.get('/users'),
                api.get('/students/analytics').catch(() => ({ data: { data: [] } }))
            ]);

            const pendingAlumniList = alumniRes.data.data || [];
            const pendingStudentsList = studentsRes.data.data || [];
            const pendingJobsList = jobsRes.data.data?.jobs || [];
            const pendingWebinarsList = webinarsRes.data.data?.webinars || [];
            const totalUsers = usersRes.data.data?.total || 0;
            const interestsData = analyticsRes.data.data || [];

            setPendingAlumni(pendingAlumniList);
            setPendingStudents(pendingStudentsList);
            setPendingJobs(pendingJobsList);
            setStudentInterests(interestsData);
            setStats({
                totalUsers,
                pendingAlumni: pendingAlumniList.length,
                pendingStudents: pendingStudentsList.length,
                pendingWebinars: pendingWebinarsList.length,
                pendingJobs: pendingJobsList.length,
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveAlumni = async (alumniId) => {
        try {
            await api.put(`/alumni/${alumniId}/approve`);
            toast.success('Alumni approved!');
            setPendingAlumni(prev => prev.filter(a => a._id !== alumniId));
            setStats(s => ({ ...s, pendingAlumni: s.pendingAlumni - 1 }));
        } catch (error) {
            toast.error('Failed to approve alumni');
        }
    };

    const handleApproveStudent = async (studentId) => {
        try {
            await api.put(`/students/${studentId}/approve`);
            toast.success('Student approved!');
            setPendingStudents(prev => prev.filter(s => s._id !== studentId));
            setStats(s => ({ ...s, pendingStudents: s.pendingStudents - 1 }));
        } catch (error) {
            toast.error('Failed to approve student');
        }
    };

    const handleApproveJob = async (jobId) => {
        try {
            await api.put(`/jobs/${jobId}/approve`);
            toast.success('Job approved and published!');
            setPendingJobs(prev => prev.filter(j => j._id !== jobId));
            setStats(s => ({ ...s, pendingJobs: s.pendingJobs - 1 }));
        } catch (error) {
            toast.error('Failed to approve job');
        }
    };

    const totalPending = stats.pendingAlumni + stats.pendingStudents + stats.pendingWebinars + stats.pendingJobs;

    const statCards = [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            gradient: 'from-teal-500 to-teal-700',
            bg: 'bg-teal-50 dark:bg-teal-900/20',
            border: 'border-teal-200 dark:border-teal-800',
            text: 'text-teal-700 dark:text-teal-300',
            link: '/admin/users',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            label: 'Pending Alumni',
            value: stats.pendingAlumni,
            gradient: 'from-amber-500 to-orange-600',
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            border: 'border-amber-200 dark:border-amber-800',
            text: 'text-amber-700 dark:text-amber-300',
            link: '/admin/approvals',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Pending Students',
            value: stats.pendingStudents,
            gradient: 'from-sky-500 to-cyan-700',
            bg: 'bg-sky-50 dark:bg-sky-900/20',
            border: 'border-sky-200 dark:border-sky-800',
            text: 'text-sky-700 dark:text-sky-300',
            link: '/admin/approvals',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
        },
        {
            label: 'Pending Webinars',
            value: stats.pendingWebinars,
            gradient: 'from-violet-500 to-purple-700',
            bg: 'bg-violet-50 dark:bg-violet-900/20',
            border: 'border-violet-200 dark:border-violet-800',
            text: 'text-violet-700 dark:text-violet-300',
            link: '/admin/approvals',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            label: 'Pending Jobs',
            value: stats.pendingJobs,
            gradient: 'from-emerald-500 to-emerald-700',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            border: 'border-emerald-200 dark:border-emerald-800',
            text: 'text-emerald-700 dark:text-emerald-300',
            link: '/admin/approvals',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
        },
    ];

    const quickActions = [
        { label: 'Create Event', icon: '📅', to: '/admin/events/create', color: 'blue' },
        { label: 'Approvals', icon: '✅', to: '/admin/approvals', color: 'yellow' },
        { label: 'Resume Review', icon: '📋', to: '/admin/resumes', color: 'purple' },
        { label: 'User Management', icon: '👥', to: '/admin/users', color: 'green' },
    ];

    // Prepare chart data
    const chartColors = [
        'rgba(13, 148, 136, 0.8)', // teal-600
        'rgba(14, 165, 233, 0.8)', // sky-500
        'rgba(139, 92, 246, 0.8)', // violet-500
        'rgba(245, 158, 11, 0.8)', // amber-500
        'rgba(236, 72, 153, 0.8)', // pink-500
        'rgba(16, 185, 129, 0.8)', // emerald-500
        'rgba(59, 130, 246, 0.8)', // blue-500
        'rgba(244, 63, 94, 0.8)'   // rose-500
    ];

    const topInterests = studentInterests.slice(0, 8); // Display top 8 interests
    const chartData = {
        labels: topInterests.map(i => i.interest.charAt(0).toUpperCase() + i.interest.slice(1)),
        datasets: [
            {
                data: topInterests.map(i => i.count),
                backgroundColor: chartColors.slice(0, topInterests.length),
                borderColor: chartColors.slice(0, topInterests.length).map(c => c.replace('0.8', '1')),
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#9CA3AF', // gray-400
                    font: {
                        family: 'Inter, sans-serif'
                    },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)', // gray-900
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        },
        maintainAspectRatio: false,
    };

    if (loading) {
        return (
            <DashboardLayout role="Admin" title="Admin Dashboard">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Admin" title="Admin Dashboard">
            {/* Hero Banner */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-700 to-cyan-800 text-white shadow-xl"
            >
                <h2 className="text-2xl font-bold mb-1">Welcome, Admin! 👑</h2>
                <p className="text-primary-100 text-sm">
                    {totalPending > 0
                        ? `You have ${totalPending} items pending your review.`
                        : 'Everything is up to date. Great job!'}
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        {card.link ? (
                            <Link to={card.link}>
                                <div className={`rounded-2xl border p-5 ${card.bg} ${card.border} hover:shadow-lg transition-shadow cursor-pointer`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`${card.text} opacity-80`}>{card.icon}</div>
                                        {card.value > 0 && card.label !== 'Total Users' && <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />}
                                    </div>
                                    <p className={`text-3xl font-bold ${card.text} mb-1`}>{card.value}</p>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.label}</p>
                                </div>
                            </Link>
                        ) : (
                            <div className={`rounded-2xl border p-5 ${card.bg} ${card.border}`}>
                                <div className={`${card.text} opacity-80 mb-3`}>{card.icon}</div>
                                <p className={`text-3xl font-bold ${card.text} mb-1`}>{card.value}</p>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.label}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action) => (
                    <Link key={action.label} to={action.to}>
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="card text-center py-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="text-3xl mb-2">{action.icon}</div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{action.label}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Analytics Section */}
            {studentInterests.length > 0 && (
                <div className="card mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        Student Interests Distribution
                    </h3>
                    <div className="h-64 sm:h-80 w-full flex items-center justify-center relative">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>
            )}

            {/* Pending Students */}
            {pendingStudents.length > 0 && (
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Pending Student Approvals
                            <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full">
                                {pendingStudents.length}
                            </span>
                        </h3>
                        <Link to="/admin/approvals" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                            View All →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Name', 'Email', 'Roll No', 'Department', 'Batch', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {pendingStudents.slice(0, 5).map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student.userId?.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student.rollNumber}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student.department}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{student.batch}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <button onClick={() => handleApproveStudent(student._id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium transition-colors">
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pending Alumni */}
            <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Pending Alumni Approvals
                        {pendingAlumni.length > 0 && (
                            <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                                {pendingAlumni.length}
                            </span>
                        )}
                    </h3>
                    <Link to="/admin/approvals" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                        View All →
                    </Link>
                </div>
                {pendingAlumni.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    {['Name', 'Email', 'Department', 'Batch', 'Action'].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                {pendingAlumni.slice(0, 5).map((alumni) => (
                                    <tr key={alumni._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{alumni.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{alumni.userId?.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{alumni.department}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{alumni.batch}</td>
                                        <td className="px-4 py-3 text-sm">
                                            <button onClick={() => handleApproveAlumni(alumni._id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium transition-colors">
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No pending alumni approvals</p>
                )}
            </div>

            {/* Pending Jobs */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Pending Job Approvals
                        {pendingJobs.length > 0 && (
                            <span className="ml-2 text-sm font-medium px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                                {pendingJobs.length}
                            </span>
                        )}
                    </h3>
                    <Link to="/admin/approvals" className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">
                        View All →
                    </Link>
                </div>
                {pendingJobs.length > 0 ? (
                    <div className="space-y-3">
                        {pendingJobs.slice(0, 5).map((job) => (
                            <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{job.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{job.company} • {job.location} • {job.jobType}</p>
                                </div>
                                <button onClick={() => handleApproveJob(job._id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium transition-colors">
                                    Approve
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No pending job approvals</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
