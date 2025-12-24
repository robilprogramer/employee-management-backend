# Employee Management Backend - Dokumentasi Arsitektur & Trade-offs

## 📐 Arsitektur Sistem

### 1. Layered Architecture

```
┌─────────────────────────────────────┐
│         HTTP Request/Response        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Middleware Layer               │
│  • CORS                             │
│  • Body Parser                      │
│  • Authentication (JWT)             │
│  • Authorization (RBAC)             │
│  • Validation (Yup)                 │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Routes Layer                   │
│  • Endpoint definitions             │
│  • Middleware composition           │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Controllers Layer              │
│  • Request handling                 │
│  • Response formatting              │
│  • Error delegation                 │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Services Layer                 │
│  • Business logic                   │
│  • Data transformation              │
│  • Validation orchestration         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Models Layer                   │
│  • Data access                      │
│  • CRUD operations                  │
│  • File I/O (JSON storage)          │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      Data Storage (JSON Files)      │
│  • users.json                       │
│  • employees.json                   │
└─────────────────────────────────────┘
```

### 2. Authentication Flow

```
┌────────────┐
│   Client   │
└─────┬──────┘
      │ 1. POST /api/auth/login
      │    { username, password }
      ↓
┌─────────────────┐
│  Auth Controller│
└────────┬────────┘
         │ 2. Validate credentials
         ↓
┌─────────────────┐
│  Auth Service   │──→ Find user in UserModel
└────────┬────────┘    Compare password hash
         │
         │ 3. Generate JWT
         ↓
┌─────────────────┐
│   JWT Service   │──→ Sign token with secret
└────────┬────────┘    Set expiration
         │
         │ 4. Return token + user data
         ↓
┌────────────┐
│   Client   │──→ Store token in localStorage/cookie
└────────────┘    Include in future requests
```

### 3. RBAC Authorization Flow

```
Request: POST /api/employees
Headers: { Authorization: Bearer <token> }

         ↓
┌──────────────────┐
│ authenticate()   │──→ Verify JWT signature
│ middleware       │    Extract user from token
└────────┬─────────┘    Set req.user
         │
         ↓
┌──────────────────┐
│ authorize()      │──→ Check req.user.role
│ middleware       │    Compare with allowed roles
└────────┬─────────┘    Allow/Deny access
         │
         ↓ (if authorized)
┌──────────────────┐
│ Controller       │──→ Process request
└──────────────────┘
```

### 4. Validation Flow dengan Yup

```
Request Body:
{
  "username": "john",
  "email": "invalid-email"
}

         ↓
┌──────────────────┐
│ validate()       │──→ Load Yup schema
│ middleware       │    
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ Yup Schema       │──→ Validate each field
│ Validation       │    • username: ✓ (valid)
└────────┬─────────┘    • email: ✗ (invalid format)
         │
         ↓
┌──────────────────┐
│ Error Response   │
│ 400 Bad Request  │
│ {                │
│   errors: [      │
│     "Email must  │
│     be valid"    │
│   ]              │
│ }                │
└──────────────────┘
```

## 🎯 Design Decisions & Trade-offs

### 1. JSON File Storage vs Database

**Decision:** Menggunakan JSON files untuk development

**Pros:**
- ✅ Zero configuration - tidak perlu setup database
- ✅ Easy to inspect - file dapat dibuka langsung
- ✅ Quick prototyping - fast iteration
- ✅ No dependencies - tidak perlu install/run DB server
- ✅ Easy migration - struktur sudah prepared untuk ORM

**Cons:**
- ❌ Not scalable - slow dengan data besar
- ❌ No concurrent access handling - race conditions possible
- ❌ Limited querying - manual filtering
- ❌ No transactions - atomicity issues
- ❌ Production unsuitable - data loss risk

**Migration Path:**
```javascript
// Current (JSON)
await employeeModel.findAll();

// Future (Prisma/PostgreSQL)
await prisma.employee.findMany();

// Future (Mongoose/MongoDB)
await Employee.find();
```

### 2. JWT Authentication vs Session-based

**Decision:** JWT dengan stateless authentication

**Pros:**
- ✅ Stateless - no server-side session storage
- ✅ Scalable - works across multiple servers
- ✅ Mobile-friendly - easy untuk mobile apps
- ✅ Microservices ready - token dapat di-share

**Cons:**
- ❌ Token revocation complex - logout tetap valid sampai expire
- ❌ Larger payload - token size > session ID
- ❌ Cannot update claims - perlu re-login untuk role change

**Improvement:** Tambahkan refresh token mechanism

### 3. Yup Validation vs Joi vs Zod

**Decision:** Yup untuk schema validation

**Reasoning:**
- ✅ React ecosystem integration - consistent dengan frontend
- ✅ Async validation support
- ✅ Clear error messages
- ✅ Good TypeScript support
- ✅ Widespread adoption

**Alternative Comparison:**
```javascript
// Yup (chosen)
yup.string().email().required()

// Joi
Joi.string().email().required()

// Zod (newer, TypeScript-first)
z.string().email()
```

### 4. Layered Architecture vs Clean Architecture

**Decision:** Simple layered architecture (Routes → Controllers → Services → Models)

**Reasoning:**
- ✅ Easy to understand - clear separation
- ✅ Quick development - less boilerplate
- ✅ Sufficient untuk scope - tidak over-engineered
- ✅ Standard pattern - familiar untuk developers

**Trade-off:** Lebih complex Clean Architecture memberikan better testability dan dependency inversion, tapi adds overhead untuk small project.

### 5. Error Handling Strategy

**Decision:** Centralized error handler middleware + custom AppError class

**Implementation:**
```javascript
// Custom error
throw new AppError('Employee not found', 404);

// Caught by global handler
app.use(errorHandler);

// Consistent response
{
  success: false,
  message: 'Employee not found'
}
```

**Benefits:**
- ✅ Consistent error format
- ✅ Single place untuk error logic
- ✅ Easy debugging
- ✅ Development vs production modes

### 6. Pagination Strategy

**Decision:** Offset-based pagination (page & perPage)

**Pros:**
- ✅ Simple implementation
- ✅ Familiar UX - page numbers
- ✅ Random access - jump to any page

**Cons:**
- ❌ Performance issues - offset grows
- ❌ Duplicate/missing items - dengan concurrent writes

**Alternative:** Cursor-based pagination untuk scale
```javascript
// Current
?page=2&perPage=10

// Future (cursor-based)
?cursor=abc123&limit=10
```

## 🔐 Security Considerations

### 1. Password Security
- ✅ bcrypt hashing dengan 10 rounds
- ✅ Never store plain text
- ✅ Salted automatically

### 2. JWT Security
- ⚠️ Secret key di environment variable
- ⚠️ Token expiration set
- ❌ Missing: Refresh token
- ❌ Missing: Token blacklist untuk logout

### 3. Input Validation
- ✅ Yup validation semua inputs
- ✅ Sanitization otomatis
- ✅ Type coercion safe

### 4. CORS Configuration
- ⚠️ Development: Allow localhost
- ❌ Production: Need specific origins

### 5. Rate Limiting
- ❌ Not implemented - vulnerable to brute force
- 🔄 Future: express-rate-limit

## 📊 Performance Considerations

### Current Limitations

1. **File I/O Blocking**
   - Synchronous JSON read/write
   - Solution: Database dengan connection pooling

2. **No Caching**
   - Every request hits storage
   - Solution: Redis caching layer

3. **No Indexing**
   - Linear search untuk filtering
   - Solution: Database indexes

4. **Single Process**
   - No horizontal scaling
   - Solution: PM2 cluster mode atau K8s

### Optimization Opportunities

```javascript
// Current: Read entire file
const employees = await readEmployees();
const result = employees.filter(...);

// Future: Database query
const result = await prisma.employee.findMany({
  where: { ... },
  take: 10,
  skip: offset
});

// With caching
const cached = await redis.get(key);
if (cached) return cached;
// ... query dan cache result
```

## 🧪 Testing Strategy (Recommended)

### 1. Unit Tests
```javascript
// Services
describe('EmployeeService', () => {
  test('createEmployee validates uniqueness', async () => {
    // Test implementation
  });
});

// Validation schemas
describe('employeeValidation', () => {
  test('rejects invalid username', async () => {
    // Test Yup schema
  });
});
```

### 2. Integration Tests
```javascript
// API endpoints
describe('POST /api/employees', () => {
  test('admin can create employee', async () => {
    // Supertest implementation
  });
  
  test('user cannot create employee', async () => {
    // Test RBAC
  });
});
```

### 3. E2E Tests
```javascript
// Full user flows
describe('Employee Management Flow', () => {
  test('admin workflow: login → create → edit → delete', async () => {
    // Complete flow test
  });
});
```

## 🚀 Deployment Considerations

### Environment Setup

```bash
# Development
NODE_ENV=development
JWT_SECRET=dev-secret

# Staging
NODE_ENV=staging
JWT_SECRET=<strong-secret>

# Production
NODE_ENV=production
JWT_SECRET=<very-strong-secret>
DB_URL=postgresql://...
REDIS_URL=redis://...
```

### Production Checklist

- [ ] Environment variables secured
- [ ] JWT secret rotated
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database migration dari JSON
- [ ] Logging implemented
- [ ] Monitoring setup
- [ ] Error tracking (Sentry)
- [ ] Backup strategy

### Scaling Path

```
Phase 1: Single server + JSON (current)
         ↓
Phase 2: Single server + PostgreSQL
         ↓
Phase 3: Load balancer + Multiple servers + Redis cache
         ↓
Phase 4: Microservices + Message queue + Container orchestration
```

## 📝 Code Quality Metrics

### Maintainability
- ✅ Clear naming conventions
- ✅ Separation of concerns
- ✅ DRY principle followed
- ✅ Comments untuk complex logic
- ⚠️ Could improve: JSDoc comments

### Testability
- ✅ Pure functions di services
- ✅ Dependency injection ready
- ✅ Mockable data layer
- ⚠️ Missing: Actual tests

### Scalability
- ⚠️ Current: Single file storage
- ✅ Future ready: Easy to migrate
- ✅ Stateless design
- ✅ Horizontal scale ready (with DB)

## 🔄 Migration Guide

### From JSON to PostgreSQL

1. **Install dependencies**
```bash
npm install @prisma/client
npm install -D prisma
```

2. **Initialize Prisma**
```bash
npx prisma init
```

3. **Define schema**
```prisma
model Employee {
  id         String   @id @default(uuid())
  fullName   String
  username   String   @unique
  email      String   @unique
  phone      String
  position   String
  department String
  avatarUrl  String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

4. **Update Model Layer**
```javascript
// Before
const employees = await readEmployees();

// After
const employees = await prisma.employee.findMany();
```

5. **Migrate data**
```bash
node scripts/migrate-to-postgres.js
```

## 🎓 Learning Points

### Best Practices Implemented
1. ✅ Modular architecture
2. ✅ Middleware composition
3. ✅ Error handling patterns
4. ✅ Input validation
5. ✅ Authentication & authorization
6. ✅ RESTful API design

### Areas for Growth
1. 🔄 Testing coverage
2. 🔄 Performance optimization
3. 🔄 Advanced caching
4. 🔄 Monitoring & observability
5. 🔄 API documentation (Swagger)

---

**Note:** Dokumen ini adalah living document yang akan di-update seiring perkembangan project.
