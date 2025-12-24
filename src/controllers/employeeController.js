const employeeService = require('../services/employeeService');

class EmployeeController {
  /**
   * Get all employees
   * GET /api/employees
   * Access: Admin, User
   */
  async getAllEmployees(req, res, next) {
    try {
      const { page, perPage, search } = req.query;

      const result = await employeeService.getAllEmployees({
        page: parseInt(page) || 1,
        perPage: parseInt(perPage) || 10,
        search: search || ''
      });

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employee by ID
   * GET /api/employees/:id
   * Access: Admin, User
   */
  async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;

      const employee = await employeeService.getEmployeeById(id);

      res.json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new employee
   * POST /api/employees
   * Access: Admin only
   */
  async createEmployee(req, res, next) {
    try {
      const employeeData = req.body;

      const newEmployee = await employeeService.createEmployee(employeeData);

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: newEmployee
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update employee
   * PUT /api/employees/:id
   * Access: Admin only
   */
  async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const employeeData = req.body;

      const updatedEmployee = await employeeService.updateEmployee(id, employeeData);

      res.json({
        success: true,
        message: 'Employee updated successfully',
        data: updatedEmployee
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete employee
   * DELETE /api/employees/:id
   * Access: Admin only
   */
  async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;

      const result = await employeeService.deleteEmployee(id);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check username availability
   * GET /api/employees/check/username
   * Access: Admin
   */
  async checkUsername(req, res, next) {
    try {
      const { username, excludeId } = req.query;

      if (!username) {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      const result = await employeeService.checkUsernameAvailability(username, excludeId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check email availability
   * GET /api/employees/check/email
   * Access: Admin
   */
  async checkEmail(req, res, next) {
    try {
      const { email, excludeId } = req.query;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const result = await employeeService.checkEmailAvailability(email, excludeId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get employee statistics
   * GET /api/employees/stats
   * Access: Admin
   */
  async getStatistics(req, res, next) {
    try {
      const stats = await employeeService.getStatistics();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmployeeController();
