const employeeModel = require('../models/employeeModel');
const { AppError } = require('../middlewares/errorHandler');

class EmployeeService {
  /**
   * Get all employees with pagination and search
   */
  async getAllEmployees(options) {
    console.log('Options in service:', options);
    return await employeeModel.findAll(options);
  }

  /**
   * Get employee by ID
   */
  async getEmployeeById(id) {
    const employee = await employeeModel.findById(id);

    if (!employee) {
      throw new AppError('Employee not found', 404);
    }

    return employee;
  }

  /**
   * Create new employee
   */
  async createEmployee(employeeData) {
    try {
      const newEmployee = await employeeModel.create(employeeData);
      return newEmployee;
    } catch (error) {
      if (error.message === 'Username already exists') {
        throw new AppError('Username already exists', 400);
      }
      if (error.message === 'Email already exists') {
        throw new AppError('Email already exists', 400);
      }
      throw error;
    }
  }

  /**
   * Update employee
   */
  async updateEmployee(id, employeeData) {
    try {
      const updatedEmployee = await employeeModel.update(id, employeeData);

      if (!updatedEmployee) {
        throw new AppError('Employee not found', 404);
      }

      return updatedEmployee;
    } catch (error) {
      if (error.message === 'Username already exists') {
        throw new AppError('Username already exists', 400);
      }
      if (error.message === 'Email already exists') {
        throw new AppError('Email already exists', 400);
      }
      throw error;
    }
  }

  /**
   * Delete employee
   */
  async deleteEmployee(id) {
    const result = await employeeModel.delete(id);

    if (!result) {
      throw new AppError('Employee not found', 404);
    }

    return { message: 'Employee deleted successfully' };
  }

  /**
   * Check if username is available
   */
  async checkUsernameAvailability(username, excludeId = null) {
    const employee = await employeeModel.findByUsername(username);
    
    if (!employee) {
      return { available: true };
    }

    if (excludeId && employee.id === excludeId) {
      return { available: true };
    }

    return { available: false };
  }

  /**
   * Check if email is available
   */
  async checkEmailAvailability(email, excludeId = null) {
    const employee = await employeeModel.findByEmail(email);
    
    if (!employee) {
      return { available: true };
    }

    if (excludeId && employee.id === excludeId) {
      return { available: true };
    }

    return { available: false };
  }

  /**
   * Get employee statistics
   */
  async getStatistics() {
    const total = await employeeModel.count();
    return {
      total,
      // Add more statistics as needed
    };
  }
}

module.exports = new EmployeeService();
