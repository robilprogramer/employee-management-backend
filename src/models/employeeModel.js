const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');

class EmployeeModel {
  constructor() {
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      
      // Check if employees.json exists, if not create empty array
      try {
        await fs.access(EMPLOYEES_FILE);
      } catch {
        await this.writeEmployees([]);
      }
    } catch (error) {
      console.error('Error ensuring data directory:', error);
    }
  }

  async readEmployees() {
    try {
      const data = await fs.readFile(EMPLOYEES_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading employees:', error);
      return [];
    }
  }

  async writeEmployees(employees) {
    await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
  }

  async findAll(options = {}) {
    const { page = 1, perPage = 10, search = '' } = options;
    let employees = await this.readEmployees();

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      employees = employees.filter(emp => 
        emp.fullName.toLowerCase().includes(searchLower) ||
        emp.username.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const total = employees.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const paginatedEmployees = employees.slice(offset, offset + perPage);

    return {
      data: paginatedEmployees,
      pagination: {
        page: parseInt(page),
        perPage: parseInt(perPage),
        total,
        totalPages
      }
    };
  }

  async findById(id) {
    const employees = await this.readEmployees();
    return employees.find(emp => emp.id === id);
  }

  async findByUsername(username) {
    const employees = await this.readEmployees();
    return employees.find(emp => emp.username === username);
  }

  async findByEmail(email) {
    const employees = await this.readEmployees();
    return employees.find(emp => emp.email === email);
  }

  async create(employeeData) {
    const employees = await this.readEmployees();

    // Check username uniqueness
    if (employees.some(e => e.username === employeeData.username)) {
      throw new Error('Username already exists');
    }

    // Check email uniqueness
    if (employees.some(e => e.email === employeeData.email)) {
      throw new Error('Email already exists');
    }

    const newEmployee = {
      id: uuidv4(),
      ...employeeData,
      avatarUrl: employeeData.avatarUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    employees.push(newEmployee);
    await this.writeEmployees(employees);

    return newEmployee;
  }

  async update(id, employeeData) {
    const employees = await this.readEmployees();
    const index = employees.findIndex(emp => emp.id === id);

    if (index === -1) {
      return null;
    }

    // Check username uniqueness (excluding current employee)
    if (employeeData.username && employees.some(e => e.id !== id && e.username === employeeData.username)) {
      throw new Error('Username already exists');
    }

    // Check email uniqueness (excluding current employee)
    if (employeeData.email && employees.some(e => e.id !== id && e.email === employeeData.email)) {
      throw new Error('Email already exists');
    }

    employees[index] = {
      ...employees[index],
      ...employeeData,
      updatedAt: new Date().toISOString()
    };

    await this.writeEmployees(employees);
    return employees[index];
  }

  async delete(id) {
    const employees = await this.readEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== id);

    if (filteredEmployees.length === employees.length) {
      return null;
    }

    await this.writeEmployees(filteredEmployees);
    return true;
  }

  async count() {
    const employees = await this.readEmployees();
    return employees.length;
  }
}

module.exports = new EmployeeModel();
