const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createEmployeeSchema,
  updateEmployeeSchema,
  queryEmployeeSchema
} = require('../validations/employeeValidation');

/**
 * @route   GET /api/employees/check/username
 * @desc    Check username availability
 * @access  Private (Admin only)
 */
router.get(
  '/check/username',
  authenticate,
  authorize('admin'),
  employeeController.checkUsername
);

/**
 * @route   GET /api/employees/check/email
 * @desc    Check email availability
 * @access  Private (Admin only)
 */
router.get(
  '/check/email',
  authenticate,
  authorize('admin'),
  employeeController.checkEmail
);

/**
 * @route   GET /api/employees/stats
 * @desc    Get employee statistics
 * @access  Private (Admin only)
 */
router.get(
  '/stats',
  authenticate,
  authorize('admin'),
  employeeController.getStatistics
);

/**
 * @route   GET /api/employees
 * @desc    Get all employees (with pagination and search)
 * @access  Private (Admin, User)
 */
router.get(
  '/',
  authenticate,
  validate(queryEmployeeSchema, 'query'),
  employeeController.getAllEmployees
);

/**
 * @route   GET /api/employees/:id
 * @desc    Get employee by ID
 * @access  Private (Admin, User)
 */
router.get(
  '/:id',
  authenticate,
  employeeController.getEmployeeById
);

/**
 * @route   POST /api/employees
 * @desc    Create new employee
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  employeeController.deleteEmployee
);

module.exports = router;
