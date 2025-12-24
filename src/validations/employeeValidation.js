const yup = require('yup');

/**
 * Username validation:
 * - Required
 * - Alphanumeric only
 * - 3-30 characters
 */
const usernameSchema = yup
  .string()
  .required('Username is required')
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must not exceed 30 characters')
  .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric only');

/**
 * Email validation:
 * - Required
 * - Valid email format
 */
const emailSchema = yup
  .string()
  .required('Email is required')
  .email('Email must be a valid email address');

/**
 * Create Employee Schema
 */
const createEmployeeSchema = yup.object({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),

  username: usernameSchema,

  email: emailSchema,

  phone: yup
    .string()
    .required('Phone is required')
    .matches(/^[\d\s\-\+\(\)]+$/, 'Phone number format is invalid'),

  position: yup
    .string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),

  department: yup
    .string()
    .required('Department is required')
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must not exceed 100 characters'),

  avatarUrl: yup
    .string()
    .url('Avatar URL must be a valid URL')
    .nullable()
    .default(null)
});

/**
 * Update Employee Schema (all fields optional)
 */
const updateEmployeeSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),

  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .matches(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric only'),

  email: yup
    .string()
    .email('Email must be a valid email address'),

  phone: yup
    .string()
    .matches(/^[\d\s\-\+\(\)]+$/, 'Phone number format is invalid'),

  position: yup
    .string()
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position must not exceed 100 characters'),

  department: yup
    .string()
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department must not exceed 100 characters'),

  avatarUrl: yup
    .string()
    .url('Avatar URL must be a valid URL')
    .nullable()
});

/**
 * Query Parameters Schema
 */
const queryEmployeeSchema = yup.object({
  page: yup
    .number()
    .integer()
    .min(1, 'Page must be at least 1')
    .default(1),

  perPage: yup
    .number()
    .integer()
    .min(1, 'PerPage must be at least 1')
    .max(100, 'PerPage must not exceed 100')
    .default(10),

  search: yup
    .string()
    .max(100, 'Search query too long')
    .nullable()
    .default(''),
    
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'all'])
    .default('all')
});

module.exports = {
  createEmployeeSchema,
  updateEmployeeSchema,
  queryEmployeeSchema
};
