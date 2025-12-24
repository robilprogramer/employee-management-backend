# Employee Management System - Backend

Backend API untuk sistem Employee Management dengan implementasi JWT authentication, Role-Based Access Control (RBAC), dan validasi menggunakan Yup.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [RBAC Implementation](#rbac-implementation)
- [Validation](#validation)
- [Testing](#testing)

## ✨ Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control (RBAC)** - Admin and User roles dengan permissions berbeda
- **Input Validation** - Validasi comprehensive menggunakan Yup
- **RESTful API** - Clean dan structured endpoints
- **Error Handling** - Centralized error handling middleware
- **Pagination & Search** - List employees dengan pagination dan pencarian
- **Modular Architecture** - Separation of concerns (Routes → Controllers → Services → Models)
- **Mock Database** - JSON file storage untuk development (mudah di-migrate ke SQL/NoSQL)

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Yup
- **Password Hashing**: bcryptjs
- **Development**: Nodemon
- **Storage**: JSON files (easily replaceable with PostgreSQL/MongoDB)

## 📁 Project Structure

```
employee-management-backend/
├── src/
│   ├── config/
│   │   └── index.js                 # Centralized configuration
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   └── employeeController.js    # Employee CRUD logic
│   ├── middlewares/
│   │   ├── auth.js                  # JWT & RBAC middleware
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validate.js              # Validation middleware
│   ├── models/
│   │   ├── userModel.js             # User data access layer
│   │   └── employeeModel.js         # Employee data access layer
│   ├── routes/
│   │   ├── index.js                 # Routes aggregator
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── employeeRoutes.js        # Employee endpoints
│   ├── services/
│   │   ├── authService.js           # Business logic untuk auth
│   │   └── employeeService.js       # Business logic untuk employees
│   ├── validations/
│   │   ├── authValidation.js        # Yup schemas untuk auth
│   │   └── employeeValidation.js    # Yup schemas untuk employees
│   ├── scripts/
│   │   └── seed.js                  # Database seeder
│   ├── data/                        # JSON storage (auto-generated)
│   │   ├── users.json
│   │   └── employees.json
│   └── server.js                    # Application entry point
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 📦 Installation

### Prerequisites

- Node.js >= 14.x
- npm atau yarn

### Steps

1. **Extract file ZIP**

```bash
unzip employee-management-backend.zip
cd employee-management-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` jika perlu (default sudah configured untuk development)

4. **Seed database dengan sample data**

```bash
npm run seed
```

## 🔐 Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=employee-management-secret-key-2024
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Database Configuration
DB_TYPE=json
```

## 🚀 Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di: `http://localhost:5000`

### Quick Test

```bash
# Test health check
curl http://localhost:5000/health

# Test API info
curl http://localhost:5000/api
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1",
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "role": "admin"
    }
  }
}
```

#### 2. Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "role": "user"
}
```

#### 3. Get Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### 4. Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Employee Endpoints

#### 1. Get All Employees (Paginated & Searchable)

```http
GET /api/employees?page=1&perPage=10&search=john
Authorization: Bearer <token>
```

**Access:** Admin, User

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `perPage` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search by name, username, email, department, position

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "perPage": 10,
    "total": 12,
    "totalPages": 2
  }
}
```

#### 2. Get Employee by ID

```http
GET /api/employees/:id
Authorization: Bearer <token>
```

**Access:** Admin, User

#### 3. Create Employee

```http
POST /api/employees
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "position": "Software Engineer",
  "department": "Engineering",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

**Access:** Admin only

#### 4. Update Employee

```http
PUT /api/employees/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "position": "Senior Software Engineer"
}
```

**Access:** Admin only

#### 5. Delete Employee

```http
DELETE /api/employees/:id
Authorization: Bearer <token>
```

**Access:** Admin only

#### 6. Check Username Availability

```http
GET /api/employees/check/username?username=johndoe&excludeId=abc-123
Authorization: Bearer <token>
```

**Access:** Admin only

#### 7. Check Email Availability

```http
GET /api/employees/check/email?email=john@example.com&excludeId=abc-123
Authorization: Bearer <token>
```

**Access:** Admin only

#### 8. Get Statistics

```http
GET /api/employees/stats
Authorization: Bearer <token>
```

**Access:** Admin only

## 🔑 Authentication & Authorization

### Authentication Flow

1. **Login** → Receive JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Token verified** by middleware pada setiap protected request
4. **User info extracted** dari token dan available di `req.user`

### Token Structure

JWT payload berisi:
```json
{
  "id": "1",
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## 🛡️ RBAC Implementation

### Roles

| Role  | Description |
|-------|-------------|
| admin | Full access - dapat create, read, update, delete employees |
| user  | Read-only access - hanya dapat view employees |

### Permissions Matrix

| Endpoint | Admin | User |
|----------|-------|------|
| GET /api/employees | ✅ | ✅ |
| GET /api/employees/:id | ✅ | ✅ |
| POST /api/employees | ✅ | ❌ |
| PUT /api/employees/:id | ✅ | ❌ |
| DELETE /api/employees/:id | ✅ | ❌ |
| GET /api/employees/check/* | ✅ | ❌ |
| GET /api/employees/stats | ✅ | ❌ |

### Middleware Usage

```javascript
// Requires authentication
router.get('/employees', authenticate, controller.getAll);

// Requires authentication + admin role
router.post('/employees', authenticate, authorize('admin'), controller.create);

// Multiple roles allowed
router.get('/data', authenticate, authorize('admin', 'manager'), controller.getData);
```

## ✅ Validation

### Yup Validation Rules

#### Username
- **Required**
- Alphanumeric only (`/^[a-zA-Z0-9]+$/`)
- Length: 3-30 characters
- Must be unique

#### Email
- **Required**
- Valid email format
- Must be unique

#### Phone
- **Required**
- Valid phone format (`/^[\d\s\-\+\(\)]+$/`)

#### Full Name
- **Required**
- Length: 2-100 characters

#### Position & Department
- **Required**
- Length: 2-100 characters

#### Avatar URL
- Optional
- Must be valid URL if provided

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Username must be alphanumeric only",
    "Email must be a valid email address"
  ]
}
```

## 🧪 Testing

### Manual Testing dengan cURL

#### 1. Login sebagai Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### 2. Get Employees (dengan token)

```bash
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. Create Employee (Admin only)

```bash
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "phone": "+1234567890",
    "position": "Developer",
    "department": "IT"
  }'
```

#### 4. Try Create as User (should fail)

```bash
# Login as user first
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}'

# Try to create (will return 403 Forbidden)
curl -X POST http://localhost:5000/api/employees \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Testing dengan Postman

1. Import collection dari file `postman_collection.json` (jika tersedia)
2. Set environment variable `baseUrl` = `http://localhost:5000/api`
3. Login dan copy token ke environment variable `token`
4. Test semua endpoints

### Default Test Accounts

```
Admin Account:
- Username: admin
- Password: admin123
- Role: admin

User Account:
- Username: user
- Password: user123
- Role: user
```

## 🏗️ Architecture & Design Decisions

### 1. Modular Structure

```
Routes → Controllers → Services → Models
```

- **Routes**: Define endpoints dan apply middlewares
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic
- **Models**: Data access layer

### 2. Middleware Chain

```
Request → CORS → Body Parser → Routes → Auth → Validation → Controller → Response
                                                     ↓
                                              Error Handler
```

### 3. Error Handling

- Custom `AppError` class untuk controlled errors
- Global error handler middleware
- Consistent error response format
- Development vs Production error details

### 4. Validation Strategy

- Schema-based validation menggunakan Yup
- Validation middleware untuk reusability
- Separate validation schemas per domain (auth, employee)
- Frontend dan backend validation alignment

### 5. Security

- JWT token authentication
- Password hashing dengan bcrypt (10 rounds)
- Role-based authorization
- CORS configuration
- Input validation dan sanitization

## 📝 Trade-offs & Future Improvements

### Current Implementation

✅ **Pros:**
- Simple dan mudah di-setup
- No database dependency untuk quick start
- Clear structure dan separation of concerns
- Comprehensive validation
- Secure authentication

⚠️ **Cons:**
- JSON file storage tidak scalable
- No data persistence pada production
- Limited query capabilities
- No transaction support

### Future Improvements

1. **Database Migration**
   - PostgreSQL atau MongoDB
   - Prisma ORM atau Mongoose
   - Migration scripts

2. **Enhanced Features**
   - Refresh token mechanism
   - Password reset flow
   - Email verification
   - File upload untuk avatars
   - Audit logs

3. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests

4. **Performance**
   - Redis caching
   - Rate limiting
   - Query optimization

5. **DevOps**
   - Docker containerization
   - CI/CD pipeline
   - Environment-specific configs

## 🤝 Development Guidelines

### Code Style

- Use ES6+ features
- Async/await untuk asynchronous operations
- Consistent naming conventions
- Comprehensive error handling
- Comments untuk complex logic

### Git Workflow

```bash
# Feature branch
git checkout -b feature/employee-filters

# Commit
git commit -m "feat: add department filter to employees"

# Push
git push origin feature/employee-filters
```

### Adding New Endpoints

1. Create validation schema di `/validations`
2. Add service method di `/services`
3. Create controller method di `/controllers`
4. Define route di `/routes`
5. Update README documentation

## 📞 Support

Jika ada pertanyaan atau issues:

1. Check existing documentation
2. Review error messages carefully
3. Check logs di console
4. Verify environment variables
5. Ensure database is seeded

## 📄 License

ISC

---

**Happy Coding! 🚀**
