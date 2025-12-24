const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

class UserModel {
  constructor() {
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      
      // Check if users.json exists, if not create with default users
      try {
        await fs.access(USERS_FILE);
      } catch {
        await this.initializeDefaultUsers();
      }
    } catch (error) {
      console.error('Error ensuring data directory:', error);
    }
  }

  async initializeDefaultUsers() {
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        fullName: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        username: 'user',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        fullName: 'Regular User',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    await fs.writeFile(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
    console.log('✅ Default users initialized');
  }

  async readUsers() {
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  async writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  }

  async findAll() {
    return await this.readUsers();
  }

  async findById(id) {
    const users = await this.readUsers();
    return users.find(user => user.id === id);
  }

  async findByUsername(username) {
    const users = await this.readUsers();
    return users.find(user => user.username === username);
  }

  async findByEmail(email) {
    const users = await this.readUsers();
    return users.find(user => user.email === email);
  }

  async create(userData) {
    const users = await this.readUsers();
    
    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      throw new Error('Username already exists');
    }

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: String(users.length + 1),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);
    await this.writeUsers(users);
    
    return newUser;
  }

  async update(id, userData) {
    const users = await this.readUsers();
    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
      return null;
    }

    // Check username uniqueness (excluding current user)
    if (userData.username && users.some(u => u.id !== id && u.username === userData.username)) {
      throw new Error('Username already exists');
    }

    // Check email uniqueness (excluding current user)
    if (userData.email && users.some(u => u.id !== id && u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    users[index] = {
      ...users[index],
      ...userData,
      updatedAt: new Date().toISOString()
    };

    await this.writeUsers(users);
    return users[index];
  }

  async delete(id) {
    const users = await this.readUsers();
    const filteredUsers = users.filter(user => user.id !== id);

    if (filteredUsers.length === users.length) {
      return null;
    }

    await this.writeUsers(filteredUsers);
    return true;
  }
}

module.exports = new UserModel();
