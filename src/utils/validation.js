export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
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