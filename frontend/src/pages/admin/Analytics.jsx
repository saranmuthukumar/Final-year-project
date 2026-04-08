import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const COLORS = ['#0d9488', '#10b981', '#8b5cf6', '#f59e0b', '#f43f5e', '#06b6d4', '#d946ef'];

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAlumni: 0,
        totalStudents: 0,
        totalWebinars: 0,
        totalJobs: 0,
        totalDonations: 0,
        donationCount: 0,
    });
    const [roleDistribution, setRoleDistribution] = useState([]);
    const [deptDistribution, setDeptDistribution] = useState([]);
    const [studentInterests, setStudentInterests] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const [usersRes, webinarsRes, jobsRes, donationsRes, analyticsRes] = await Promise.all([
                api.get('/users'),
                api.get('/webinars'),
                api.get('/jobs'),
                api.get('/donations/stats'),
                api.get('/students/analytics').catch(() => ({ data: { data: [] } }))
            ]);

            const usersList = usersRes.data.data?.users || [];
            const totalUsers = usersRes.data.data?.total || usersList.length;

            // Role distribution
            const roleCounts = {};
            usersList.forEach(u => {
                roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
            });
            const roleData = Object.entries(roleCounts).map(([role, count]) => ({
                name: role,
                value: count,
                percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
            }));
            setRoleDistribution(roleData);

            // Department distribution (from profile data if available)
            const deptCounts = {};
            usersList.forEach(u => {
                const dept = u.department || u.profile?.department;
                if (dept) {
                    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
                }
            });
            const deptData = Object.entries(deptCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 6);
            const maxDept = Math.max(...deptData.map(d => d.count), 1);
            setDeptDistribution(deptData.map(d => ({ ...d, percentage: Math.round((d.count / maxDept) * 100) })));

            const donationStats = donationsRes.data.data?.total || { total: 0, count: 0 };
            const interestsData = analyticsRes.data.data || [];

            setStudentInterests(interestsData);

            setStats({
                totalUsers,
                totalAlumni: roleCounts['Alumni'] || 0,
                totalStudents: roleCounts['Student'] || 0,
                totalWebinars: webinarsRes.data.data?.pagination?.total || 0,
                totalJobs: jobsRes.data.data?.pagination?.total || 0,
                totalDonations: donationStats.total || 0,
                donationCount: donationStats.count || 0,
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout role="Admin" title="Platform Analytics">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, color: 'from-cyan-500 to-teal-700', icon: '👥' },
        { label: 'Alumni', value: stats.totalAlumni, color: 'from-emerald-500 to-emerald-700', icon: '🎓' },
        { label: 'Students', value: stats.totalStudents, color: 'from-purple-500 to-purple-700', icon: '📚' },
        { label: 'Webinars', value: stats.totalWebinars, color: 'from-cyan-500 to-cyan-700', icon: '📹' },
        { label: 'Job Postings', value: stats.totalJobs, color: 'from-amber-500 to-orange-600', icon: '💼' },
        { label: 'Donations', value: `₹${stats.totalDonations.toLocaleString()}`, color: 'from-pink-500 to-rose-600', icon: '💝', sub: `${stats.donationCount} contributors` },
    ];

    let cumulativePercent = 0;
    const conicStops = roleDistribution.map((item, i) => {
        const start = cumulativePercent;
        cumulativePercent += item.percentage;
        return `${COLORS[i % COLORS.length]} ${start}% ${cumulativePercent}%`;
    }).join(', ');

    // Prepare student interests chart data
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
    const interestChartData = {
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

    const interestChartOptions = {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#9CA3AF',
                    font: { family: 'Inter, sans-serif' },
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: true
            }
        },
        maintainAspectRatio: false,
    };

    return (
        <DashboardLayout role="Admin" title="Platform Analytics">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`card bg-gradient-to-br ${card.color} text-white`}
                    >
                        <div className="text-3xl mb-2">{card.icon}</div>
                        <h3 className="text-sm font-medium text-white/80">{card.label}</h3>
                        <p className="text-3xl font-bold mt-1">{card.value}</p>
                        {card.sub && <p className="text-xs text-white/70 mt-1">{card.sub}</p>}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Pie Chart - Role Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User Role Distribution</h3>
                    <div className="flex items-center justify-center gap-8">
                        {/* Pie Chart */}
                        <div
                            className="w-48 h-48 rounded-full shadow-lg relative"
                            style={{
                                background: conicStops
                                    ? `conic-gradient(${conicStops})`
                                    : '#e5e7eb',
                            }}
                        >
                            {/* Inner circle for donut effect */}
                            <div className="absolute inset-6 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center shadow-inner">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                            {roleDistribution.map((item, i) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.value} ({item.percentage}%)</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Bar Chart - Department Distribution */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Departments</h3>
                    {deptDistribution.length > 0 ? (
                        <div className="space-y-4">
                            {deptDistribution.map((dept, i) => (
                                <div key={dept.name}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{dept.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400 font-semibold">{dept.count}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${dept.percentage}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No department data available</p>
                    )}
                </motion.div>

                {/* Analytics Section - Student Interests */}
                {studentInterests.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card lg:col-span-2"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                            Student Interests Distribution
                        </h3>
                        <div className="h-64 sm:h-80 w-full flex items-center justify-center relative">
                            <Pie data={interestChartData} options={interestChartOptions} />
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Webinar Overview</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalWebinars}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total webinars hosted</p>
                </div>

                <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Job Postings</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalJobs}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total job opportunities</p>
                </div>

                <div className="card">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Donations Raised</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">₹{stats.totalDonations.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">From {stats.donationCount} contributions</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
