import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../utils/api';

const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        department: '',
        batch: '',
        interest: '',
    });
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // grid or list

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const res = await api.get('/students');
            setStudents(res.data.data.students);
            setLoading(false);
        } catch (error) {
            console.error('Error loading students:', error);
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept = !filters.department || s.department === filters.department;
        const matchesBatch = !filters.batch || s.batch === filters.batch;
        const matchesInterest = !filters.interest || (s.interests && s.interests.some(i => i.toLowerCase().includes(filters.interest.toLowerCase())));

        return matchesSearch && matchesDept && matchesBatch && matchesInterest;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({ department: '', batch: '', interest: '' });
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <DashboardLayout role="Alumni" title="Student Directory">
                <LoadingSpinner size="lg" text="Loading student directory..." />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Alumni" title="Student Directory">
            {/* Search and Filters */}
            <div className="card mb-6 animate-slide-down">
                <div className="space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by student name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10 w-full"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.department}
                            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Departments</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Electrical">Electrical</option>
                        </select>
                        <select
                            value={filters.batch}
                            onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
                            className="input-field"
                        >
                            <option value="">All Batches</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Filter by interest..."
                            value={filters.interest}
                            onChange={(e) => setFilters({ ...filters, interest: e.target.value })}
                            className="input-field"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={clearFilters}
                                className="btn-secondary flex-1 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear
                            </button>
                            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} transition-colors duration-200`}
                                    title="Grid View"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 3H3v7h7V3zm11 0h-7v7h7V3zM10 14H3v7h7v-7zm11 0h-7v7h7v-7z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} transition-colors duration-200`}
                                    title="List View"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Count */}
                    {(searchTerm || filters.department || filters.batch || filters.interest) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                            <span>Showing {filteredStudents.length} of {students.length} students</span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Students Cards/List */}
            {filteredStudents.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredStudents.map((student, index) => (
                                <motion.div
                                    key={student._id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="card-hover group flex flex-col h-full bg-white dark:bg-gray-800 border-none shadow-premium dark:shadow-premium-dark rounded-xl overflow-hidden hover:shadow-glow dark:hover:shadow-glow-dark transition-all duration-300 relative isolate"
                                >
                                    {/* Card Header Background */}
                                    <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600 absolute top-0 left-0 right-0 z-0"></div>

                                    {/* Avatar & Badge */}
                                    <div className="px-6 pt-6 pb-2 relative z-10 flex items-start justify-between">
                                        <div className="mt-8 relative">
                                            <div className="absolute inset-0 bg-primary-500 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                                            {student.profileImage ? (
                                                <img src={student.profileImage} alt={student.name}
                                                    className="w-20 h-20 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-800 group-hover:scale-105 transition-transform duration-300 relative z-10" />
                                            ) : (
                                                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800 group-hover:scale-105 transition-transform duration-300 relative z-10">
                                                    <span className="text-2xl font-bold text-white tracking-wider">
                                                        {getInitials(student.name)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-sm mt-2">
                                            {student.batch}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="px-6 pb-4 flex-1 flex flex-col relative z-10">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {student.name}
                                        </h3>

                                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5 opacity-90">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <span className="truncate">{student.department}</span>
                                        </p>

                                        {/* Bio */}
                                        {student.bio && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 italic">
                                                "{student.bio}"
                                            </p>
                                        )}

                                        {/* Interests */}
                                        {student.interests && student.interests.length > 0 && (
                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50 mb-6">
                                                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">Interests</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {student.interests.slice(0, 3).map((interest, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-md text-xs font-medium border border-gray-200 dark:border-gray-600/50 shadow-sm">
                                                            {interest}
                                                        </span>
                                                    ))}
                                                    {student.interests.length > 3 && (
                                                        <span className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-md text-xs font-medium border border-primary-100 dark:border-primary-800/30">
                                                            +{student.interests.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {!student.interests || student.interests.length === 0 && (
                                            <div className="mt-auto mb-6"></div>
                                        )}

                                        {/* Email / Action Footer */}
                                        <div className="flex items-center justify-between gap-3 mt-auto border-t border-gray-100 dark:border-gray-700/50 pt-4">
                                            <a href={`mailto:${student.email}`} className="text-sm text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 flex items-center gap-1.5 transition-colors truncate" title="Send Email">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <span className="truncate">{student.email}</span>
                                            </a>
                                            <Link
                                                to={`/alumni/messages/${student._id}`}
                                                className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 transition-colors shadow-sm flex-shrink-0"
                                                title="Send Message"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredStudents.map((student, index) => (
                                <motion.div
                                    key={student._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2, delay: index * 0.03 }}
                                    className="card-hover flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white dark:bg-gray-800 border-l-4 border-primary-500 shadow-sm"
                                >
                                    {/* Avatar */}
                                    {student.profileImage ? (
                                        <img src={student.profileImage} alt={student.name}
                                            className="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white dark:border-gray-700 flex-shrink-0" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-700 flex-shrink-0">
                                            <span className="text-xl font-bold text-white">
                                                {getInitials(student.name)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                                {student.name}
                                            </h3>
                                            <span className="badge-blue text-xs whitespace-nowrap">{student.batch}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                {student.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {student.email}
                                            </span>
                                        </div>

                                        {/* Inline Interests */}
                                        {student.interests && student.interests.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {student.interests.slice(0, 4).map((interest, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                        {interest}
                                                    </span>
                                                ))}
                                                {student.interests.length > 4 && (
                                                    <span className="px-2 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded text-xs border border-gray-200 dark:border-gray-700">
                                                        +{student.interests.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action */}
                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0">
                                        <Link
                                            to={`/alumni/messages/${student._id}`}
                                            className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            Message
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )
            ) : (
                <EmptyState
                    icon={
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    title="No students found"
                    description="There are currently no students matching your search or filter criteria."
                    actionText="Clear Filters"
                    onAction={clearFilters}
                />
            )}
        </DashboardLayout>
    );
};

export default StudentDirectory;
