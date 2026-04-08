import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../utils/constants';
import { useState } from 'react';
import NotificationCenter from '../notifications/NotificationCenter';

const Navbar = () => {
    const { user, profile, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';

        switch (user.role) {
            case ROLES.ADMIN:
                return '/admin';
            case ROLES.ALUMNI:
                return '/alumni';
            case ROLES.STUDENT:
                return '/student';
            case ROLES.COORDINATOR:
                return '/coordinator';
            default:
                return '/';
        }
    };

    return (
        <nav className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-900 shadow-lg sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-extrabold tracking-tight text-white hidden sm:block">Alumni <span className="text-amber-300">Bridge</span></span>
                            <span className="text-xl font-extrabold tracking-tight text-white sm:hidden">Alumni <span className="text-amber-300">Bridge</span></span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NotificationCenter />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'light' ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={getDashboardLink()}
                                    className="text-teal-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-3">
                                    {profile?.profileImage ? (
                                        <img src={profile.profileImage} alt={profile?.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center border-2 border-white/30">
                                            <span className="text-teal-900 font-bold text-xs">{(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-teal-100">
                                        {profile?.name || user?.name || user?.role}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-teal-100 hover:text-white rounded-lg text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-teal-900 rounded-lg text-sm font-bold transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button and theme toggle */}
                    <div className="md:hidden flex items-center space-x-2">
                        <NotificationCenter />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-teal-100 hover:bg-teal-600/50 transition-colors"
                        >
                            {theme === 'light' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-teal-100 hover:text-white hover:bg-teal-600/50 transition-colors"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-teal-800 border-t border-teal-600/30">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {isAuthenticated ? (
                            <>
                                <div className="px-3 py-2 text-sm text-teal-200 border-b border-teal-600/30">
                                    {profile?.name || user?.name || user?.role} ({user.role})
                                </div>
                                <Link
                                    to={getDashboardLink()}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600/50 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600/50 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600/50 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-teal-100 hover:text-white hover:bg-teal-600/50 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
