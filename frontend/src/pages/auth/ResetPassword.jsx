import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const FloatingParticle = ({ delay, size, x, y, duration }) => (
    <motion.div
        className="absolute rounded-full bg-white/20"
        style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
        animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
        }}
        transition={{
            duration: duration || 4,
            repeat: Infinity,
            delay: delay || 0,
            ease: 'easeInOut',
        }}
    />
);

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { resetPassword } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        const result = await resetPassword(token, formData.password);

        if (result.success) {
            setSuccess('Password reset successfully! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    const PasswordToggle = ({ show, onToggle }) => (
        <button
            type="button"
            onClick={onToggle}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
        >
            {show ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
            ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            )}
        </button>
    );

    return (
        <div className="min-h-screen flex relative overflow-hidden bg-gray-950">
            {/* Animated background blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary-600/20 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
            <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-accent-600/15 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-10%] left-[30%] w-[450px] h-[450px] bg-primary-400/10 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />

            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/80 to-accent-700/70" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                <FloatingParticle delay={0} size={8} x={20} y={30} duration={5} />
                <FloatingParticle delay={1} size={6} x={60} y={20} duration={4} />
                <FloatingParticle delay={2} size={10} x={40} y={70} duration={6} />
                <FloatingParticle delay={0.5} size={5} x={80} y={50} duration={5.5} />
                <FloatingParticle delay={1.5} size={7} x={15} y={80} duration={4.5} />

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="relative z-10 text-center px-12"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </motion.div>

                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Secure Your Account
                    </h1>
                    <p className="text-primary-100 text-lg mb-8 leading-relaxed">
                        Create a strong password to keep your account safe and secure.
                    </p>
                </motion.div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <motion.div variants={itemVariants} className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary-500/25">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Secure Account</h1>
                    </motion.div>

                    {/* Card */}
                    <div className="auth-gradient-border">
                        <div className="bg-gray-900/80 backdrop-blur-xl p-8 sm:p-10 auth-card-glow">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    Set New Password
                                </h2>
                                <p className="text-gray-400 text-sm mb-8">
                                    Please enter your new password below
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            {error}
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0, y: -10 }}
                                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm flex items-center gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            {success}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Password */}
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'password' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className="block w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                            placeholder="Min 8 characters"
                                        />
                                        <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                    </div>
                                </motion.div>

                                {/* Confirm Password */}
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'confirmPassword' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField('confirmPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            className="block w-full pl-12 pr-12 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                            placeholder="Re-enter password"
                                        />
                                        <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                                    </div>
                                </motion.div>

                                {/* Submit */}
                                <motion.div variants={itemVariants}>
                                    <motion.button
                                        type="submit"
                                        disabled={loading || !!success}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-500/25 mt-4"
                                        style={{
                                            background: 'linear-gradient(135deg, #0d9488, #0f766e, #a21caf)',
                                            backgroundSize: '200% 200%',
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            {loading && (
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            )}
                                            {loading ? 'Resetting...' : 'Reset Password'}
                                            {!loading && (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </motion.button>
                                </motion.div>
                            </form>

                            {/* Back Link */}
                            {success && (
                                <motion.div variants={itemVariants} className="mt-8 text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Go back to Sign In
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;
