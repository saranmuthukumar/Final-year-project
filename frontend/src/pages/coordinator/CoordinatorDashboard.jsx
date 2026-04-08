import DashboardLayout from '../../components/dashboard/DashboardLayout';

const CoordinatorDashboard = () => {
    return (
        <DashboardLayout role="Coordinator" title="Coordinator Dashboard">
            <div className="card mb-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-2xl font-bold mb-2">Coordinator Panel</h2>
                <p className="text-primary-100">Manage webinars, events, and student engagement</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-cyan-50 dark:bg-cyan-900/20 border-blue-100 dark:border-cyan-800">
                    <h3 className="text-sm font-medium text-teal-600 dark:text-cyan-400">Active Webinars</h3>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">0</p>
                </div>
                <div className="card bg-emerald-50 dark:bg-emerald-900/20 border-green-100 dark:border-emerald-800">
                    <h3 className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Upcoming Events</h3>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">0</p>
                </div>
                <div className="card bg-violet-50 dark:bg-violet-900/20 border-purple-100 dark:border-purple-800">
                    <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">Student Engagement</h3>
                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">0%</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CoordinatorDashboard;
