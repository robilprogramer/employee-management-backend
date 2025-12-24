const yup = require('yup');

/**
 * Login Schema
 */
const loginSchema = yup.object({
  username: yup
    .string()
    .required('Username is required'),
  
  password: yup
    .string()
    .required('Password is required')
});

/**
 * Register Schema
 */
const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric only'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Email must be a valid email address'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  
  role: yup
    .string()
    .oneOf(['admin', 'user'], 'Role must be either admin or user')
    .default('user')
});

module.exports = {
  loginSchema,
  registerSchema
};
