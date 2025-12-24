const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EMPLOYEES_FILE = path.join(DATA_DIR, 'employees.json');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Seed Users
    const users = [
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

    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('✅ Users seeded successfully');
    console.log('   - Admin: username=admin, password=admin123');
    console.log('   - User: username=user, password=user123');

    // Seed Employees
    const employees = [
      {
        id: uuidv4(),
        fullName: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@company.com',
        phone: '+1 (555) 123-4567',
        position: 'Senior Software Engineer',
        department: 'Engineering',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Jane Smith',
        username: 'janesmith',
        email: 'jane.smith@company.com',
        phone: '+1 (555) 234-5678',
        position: 'Product Manager',
        department: 'Product',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Michael Johnson',
        username: 'michaelj',
        email: 'michael.johnson@company.com',
        phone: '+1 (555) 345-6789',
        position: 'UX Designer',
        department: 'Design',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Emily Davis',
        username: 'emilyd',
        email: 'emily.davis@company.com',
        phone: '+1 (555) 456-7890',
        position: 'Marketing Director',
        department: 'Marketing',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'David Wilson',
        username: 'davidw',
        email: 'david.wilson@company.com',
        phone: '+1 (555) 567-8901',
        position: 'DevOps Engineer',
        department: 'Engineering',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Sarah Brown',
        username: 'sarahb',
        email: 'sarah.brown@company.com',
        phone: '+1 (555) 678-9012',
        position: 'HR Manager',
        department: 'Human Resources',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=6',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Robert Taylor',
        username: 'robertt',
        email: 'robert.taylor@company.com',
        phone: '+1 (555) 789-0123',
        position: 'Data Analyst',
        department: 'Analytics',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=7',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Lisa Anderson',
        username: 'lisaa',
        email: 'lisa.anderson@company.com',
        phone: '+1 (555) 890-1234',
        position: 'Sales Manager',
        department: 'Sales',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'James Martinez',
        username: 'jamesm',
        email: 'james.martinez@company.com',
        phone: '+1 (555) 901-2345',
        position: 'QA Engineer',
        department: 'Engineering',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=9',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Jennifer Garcia',
        username: 'jenniferr',
        email: 'jennifer.garcia@company.com',
        phone: '+1 (555) 012-3456',
        position: 'Content Writer',
        department: 'Marketing',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'William Lee',
        username: 'williaml',
        email: 'william.lee@company.com',
        phone: '+1 (555) 123-4560',
        position: 'Backend Developer',
        department: 'Engineering',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=11',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        fullName: 'Amanda White',
        username: 'amandaw',
        email: 'amanda.white@company.com',
        phone: '+1 (555) 234-5601',
        position: 'Frontend Developer',
        department: 'Engineering',
        isActive: true, // ← STATUS
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    await fs.writeFile(EMPLOYEES_FILE, JSON.stringify(employees, null, 2));
    console.log(`✅ ${employees.length} employees seeded successfully`);

    console.log('\n🎉 Database seed completed!');
    console.log('\n📝 You can now start the server with: npm run dev');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
