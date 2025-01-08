import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { useNavigate } from 'react-router-dom';
import nagariImage from '../assets/nagari.jpg'; // Import the image
import heroImage from '../assets/hero.jpg'; // Import the hero image
import { toast } from 'react-toastify';

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    
    const newErrors = [];
    if (!hasUpperCase) newErrors.push('uppercase letter');
    if (!hasLowerCase) newErrors.push('lowercase letter');
    if (!hasNumber) newErrors.push('number');
    if (!hasMinLength) newErrors.push('8+ characters');
    
    return newErrors;
};

const AuthLayout = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        const newErrors = {};
        
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            newErrors.password = `Password must include: ${passwordErrors.join(', ')}`;
        }
        
        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (!isLogin && !formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors in the form');
            setIsLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Authentication successful!');
            console.log('Authentication successful!');
        } catch (error) {
            setErrors({ submit: 'Authentication failed. Please try again.' });
            toast.error('Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const imageVariants = {
        initial: { x: isLogin ? '100%' : '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: isLogin ? '-100%' : '100%', opacity: 0 }
    };

    const formVariants = {
        initial: { x: isLogin ? '-100%' : '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: isLogin ? '100%' : '-100%', opacity: 0 }
    };

    const transition = {
        type: 'spring',
        stiffness: 100,
        damping: 20
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
             

            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <Card className="w-full max-w-4xl h-[600px] relative overflow-hidden z-10">
                <AnimatePresence>
                    {/* Image Section */}
                    <motion.div
                        key={`image-${isLogin ? 'login' : 'register'}`}
                        className="absolute w-1/2 h-full"
                        style={{ 
                            left: isLogin ? '50%' : '0'
                        }}
                        variants={imageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600">
                            <img src={nagariImage} alt="Auth" className="w-full h-full object-cover" />
                        </div>
                    </motion.div>

                    {/* Form Section */}
                    <motion.div
                        key={`form-${isLogin ? 'login' : 'register'}`}
                        className="absolute w-1/2 h-full flex items-center justify-center p-6"
                        style={{ 
                            left: isLogin ? '0' : '50%'
                        }}
                        variants={formVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                            <div className="text-center">
                                <Typography variant="h4" color="blue">
                                    {isLogin ? 'Masuk' : 'Daftar'}
                                </Typography>
                            </div>
                            
                            {errors.submit && (
                                <Typography variant="small" color="red" className="mb-4">
                                    {errors.submit}
                                </Typography>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <Input
                                        type="email"
                                        name="email"
                                        label="Email"
                                        icon={<EnvelopeIcon className="h-5 w-5" />}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        required
                                    />
                                    {errors.email && (
                                        <Typography variant="small" color="red" className="mt-1">
                                            {errors.email}
                                        </Typography>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        type="password"
                                        name="password"
                                        label="Password"
                                        icon={<LockClosedIcon className="h-5 w-5" />}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={!!errors.password}
                                        required
                                    />
                                    {errors.password && (
                                        <Typography variant="small" color="red" className="mt-1">
                                            {errors.password}
                                        </Typography>
                                    )}
                                </div>

                                {!isLogin && (
                                    <>
                                        <div>
                                            <Input
                                                type="password"
                                                name="confirmPassword"
                                                label="Confirm Password"
                                                icon={<LockClosedIcon className="h-5 w-5" />}
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                error={!!errors.confirmPassword}
                                                required
                                            />
                                            {errors.confirmPassword && (
                                                <Typography variant="small" color="red" className="mt-1">
                                                    {errors.confirmPassword}
                                                </Typography>
                                            )}
                                        </div>

                                        <div>
                                            <Input
                                                type="text"
                                                name="fullName"
                                                label="Full Name"
                                                icon={<UserIcon className="h-5 w-5" />}
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                error={!!errors.fullName}
                                                required
                                            />
                                            {errors.fullName && (
                                                <Typography variant="small" color="red" className="mt-1">
                                                    {errors.fullName}
                                                </Typography>
                                            )}
                                        </div>
                                    </>
                                )}

                                <Button
                                    variant="gradient"
                                    fullWidth
                                    color='blue'
                                    type="submit"
                                    disabled={isLoading}
                                    className="mt-6"
                                >
                                    {isLoading ? <span className="loader"></span> : (isLogin ? 'MASUK' : 'DAFTAR')}
                                </Button>

                               
                            </div>

                            {isLogin && (
                                <Typography variant="small" className="text-center mt-4">
                                    <a href="#" className="text-blue-500 hover:underline">
                                        Lupa Password?
                                    </a>
                                </Typography>
                            )}

                            <Typography variant="small" className="text-center mt-6">
                                {isLogin ? "Tidak Punya Akun?" : 'Sudah Punya Akun?'}{' '}
                                <a
                                    href="#"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setFormData({
                                            email: '',
                                            password: '',
                                            confirmPassword: '',
                                            fullName: ''
                                        });
                                        setErrors({});
                                    }}
                                    className="font-medium text-blue-500 hover:underline"
                                >
                                    {isLogin ? 'Daftar' : 'Masuk'}
                                </a>
                            </Typography>
                        </form>
                    </motion.div>
                </AnimatePresence>
            </Card>
            
        </div>
    );
};

export default AuthLayout;