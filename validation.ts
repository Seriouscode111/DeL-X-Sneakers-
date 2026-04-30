/**
 * Validation utilities for security
 */

export const validatePassword = (password: string): { isValid: boolean; error: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase) {
    return { isValid: false, error: 'Password must contain both uppercase and lowercase letters' };
  }
  
  if (!hasNumber) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (!hasSpecial) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, error: '' };
};
