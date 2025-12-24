const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);

// API Info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Employee Management API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout'
      },
      employees: {
        getAll: 'GET /api/employees',
        getById: 'GET /api/employees/:id',
        create: 'POST /api/employees (Admin)',
        update: 'PUT /api/employees/:id (Admin)',
        delete: 'DELETE /api/employees/:id (Admin)',
        checkUsername: 'GET /api/employees/check/username (Admin)',
        checkEmail: 'GET /api/employees/check/email (Admin)',
        stats: 'GET /api/employees/stats (Admin)'
      }
    }
  });
});

module.exports = router;
