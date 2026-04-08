import { useState } from 'react';
import { Link } from 'react-router-dom';
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

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        setLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            setSuccess(result.message);
        } else {
            setError(result.message);
        }

        setLoading(false);
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                    </motion.div>

                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Account Recovery
                    </h1>
                    <p className="text-primary-100 text-lg mb-8 leading-relaxed">
                        Don't worry, we'll help you get back to your account in no time.
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Account Recovery</h1>
                    </motion.div>

                    {/* Card */}
                    <div className="auth-gradient-border">
                        <div className="bg-gray-900/80 backdrop-blur-xl p-8 sm:p-10 auth-card-glow">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    Forgot Password?
                                </h2>
                                <p className="text-gray-400 text-sm mb-8">
                                    Enter your email to receive a reset link
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

                                {/* Email */}
                                <motion.div variants={itemVariants}>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'email' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                            placeholder="Enter your email"
                                        />
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
                                            {loading ? 'Sending link...' : 'Send Reset Link'}
                                            {!loading && (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            )}
                                        </span>
                                    </motion.button>
                                </motion.div>
                            </form>

                            {/* Divider & Back Link */}
                            <motion.div variants={itemVariants} className="mt-8 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Sign In
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
