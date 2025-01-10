import React, { useState } from 'react';
import { Card } from "@material-tailwind/react";
import { AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import heroImage from '../assets/hero.jpg';
import nagariImage from '../assets/nagari.jpg';

const AuthLayout = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <Card className="w-full max-w-4xl h-[600px] relative overflow-hidden z-10">
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <LoginForm 
                            key="login" 
                            nagariImage={nagariImage} 
                            onToggleForm={() => setIsLogin(false)} 
                        />
                    ) : (
                        <RegisterForm 
                            key="register" 
                            nagariImage={nagariImage} 
                            onToggleForm={() => setIsLogin(true)} 
                        />
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
};

export default AuthLayout;