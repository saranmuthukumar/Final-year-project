import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';

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

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: ROLES.STUDENT,
        name: '',
        rollNumber: '',
        department: '',
        batch: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.endsWith('@jkkn.ac.in')) {
            setError('Registration is restricted to @jkkn.ac.in email addresses only.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        const profileData = {
            name: formData.name,
            department: formData.department,
            batch: formData.batch,
        };

        if (formData.role === ROLES.STUDENT) {
            profileData.rollNumber = formData.rollNumber;
            profileData.interests = [];
        }

        const result = await register({
            email: formData.email,
            password: formData.password,
            role: formData.role,
            profileData,
        });

        if (result.success) {
            navigate(formData.role === ROLES.STUDENT ? '/student' : '/alumni');
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    // Per-field stagger animation using explicit delay
    const fadeUp = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay, ease: 'easeOut' },
    });

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
            <div className="hidden lg:flex lg:w-5/12 relative items-center justify-center overflow-hidden">
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
                <FloatingParticle delay={3} size={4} x={70} y={15} duration={3.5} />

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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </motion.div>

                    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Join Our Community
                    </h1>
                    <p className="text-primary-100 text-lg leading-relaxed">
                        Create your account and become part of a thriving alumni network.
                    </p>
                </motion.div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-4 sm:p-6 relative z-10 overflow-y-auto">
                <div className="w-full max-w-2xl">
                    {/* Mobile logo */}
                    <motion.div {...fadeUp(0)} className="lg:hidden text-center mb-6">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-primary-500/25">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">Join Alumni Bridge</h1>
                    </motion.div>

                    {/* Card */}
                    <div className="auth-gradient-border">
                        <div className="bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 auth-card-glow">
                            <motion.div {...fadeUp(0.05)} className="mb-6">
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    Create Account
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Fill in your details to get started
                                </p>
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                </AnimatePresence>

                                {/* Role Selection */}
                                <motion.div {...fadeUp(0.1)}>
                                    <label className="block text-sm font-medium text-gray-300 mb-3">
                                        I am a <span className="text-primary-400">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { role: ROLES.STUDENT, label: 'Student', icon: '📖', desc: 'Currently enrolled' },
                                            { role: ROLES.ALUMNI, label: 'Alumni', icon: '🎓', desc: 'Graduated' },
                                        ].map((option) => (
                                            <motion.button
                                                key={option.role}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, role: option.role })}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${formData.role === option.role
                                                    ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10'
                                                    : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{option.icon}</span>
                                                    <div>
                                                        <div className={`font-semibold text-sm ${formData.role === option.role ? 'text-primary-300' : 'text-gray-300'}`}>
                                                            {option.label}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{option.desc}</div>
                                                    </div>
                                                </div>
                                                {formData.role === option.role && (
                                                    <motion.div
                                                        layoutId="roleIndicator"
                                                        className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
                                                        transition={{ type: 'spring', bounce: 0.3 }}
                                                    >
                                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </motion.div>
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Form Fields Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <motion.div {...fadeUp(0.15)} className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name <span className="text-primary-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'name' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Email */}
                                    <motion.div {...fadeUp(0.2)} className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address <span className="text-primary-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'email' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Password */}
                                    <motion.div {...fadeUp(0.25)}>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Password <span className="text-primary-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'password' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('password')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                                placeholder="Min 8 characters"
                                            />
                                            <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                                        </div>
                                    </motion.div>

                                    {/* Confirm Password */}
                                    <motion.div {...fadeUp(0.3)}>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Confirm Password <span className="text-primary-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'confirmPassword' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('confirmPassword')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                                placeholder="Re-enter password"
                                            />
                                            <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
                                        </div>
                                    </motion.div>

                                    {/* Roll Number (Student only) */}
                                    <AnimatePresence>
                                        {formData.role === ROLES.STUDENT && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Roll Number <span className="text-primary-400">*</span>
                                                </label>
                                                <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'rollNumber' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'rollNumber' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        name="rollNumber"
                                                        type="text"
                                                        required
                                                        value={formData.rollNumber}
                                                        onChange={handleChange}
                                                        onFocus={() => setFocusedField('rollNumber')}
                                                        onBlur={() => setFocusedField(null)}
                                                        className="block w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                                        placeholder="CS21001"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Department */}
                                    <motion.div {...fadeUp(0.35)}>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Department <span className="text-primary-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'department' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'department' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>
                                            <select
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('department')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                className="block w-full pl-12 pr-10 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-gray-800">Select Department</option>
                                                <option value="Computer Science" className="bg-gray-800">Computer Science</option>
                                                <option value="Information Technology" className="bg-gray-800">Information Technology</option>
                                                <option value="Electronics" className="bg-gray-800">Electronics</option>
                                                <option value="Mechanical" className="bg-gray-800">Mechanical</option>
                                                <option value="Civil" className="bg-gray-800">Civil</option>
                                                <option value="Electrical" className="bg-gray-800">Electrical</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Batch */}
                                    <motion.div {...fadeUp(0.4)}>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Batch <span className="text-primary-400">*</span>
                                        </label>
                                        <div className={`relative rounded-xl transition-all duration-300 auth-input-glow ${focusedField === 'batch' ? 'ring-2 ring-primary-500/50' : ''}`}>
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <svg className={`h-5 w-5 transition-colors duration-300 ${focusedField === 'batch' ? 'text-primary-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                name="batch"
                                                type="text"
                                                required
                                                value={formData.batch}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('batch')}
                                                onBlur={() => setFocusedField(null)}
                                                className="block w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-gray-800/80 transition-all duration-300 text-sm"
                                                placeholder="2021"
                                            />
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Submit */}
                                <motion.div {...fadeUp(0.45)} className="pt-2">
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.01, y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="relative w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-shadow duration-300 hover:shadow-lg hover:shadow-primary-500/25"
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
                                            {loading ? 'Creating account...' : 'Create Account'}
                                            {!loading && (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </span>
                                    </motion.button>
                                </motion.div>

                                {/* Sign in link */}
                                <motion.p {...fadeUp(0.5)} className="text-center text-sm text-gray-400 pt-2">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                                    >
                                        Sign in here
                                    </Link>
                                </motion.p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
