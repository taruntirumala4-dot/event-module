# Event Module — Backend API Service

Node.js, Express, TypeScript, and Prisma service for campus event discovery, registration, and organizer management.

## Tech Stack
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript (strict mode)
- **Framework**: Express.js
- **ORM**: Prisma ORM
- **Database**: MySQL 5.5+ (InnoDB engine)
- **Security**: JWT (`jsonwebtoken`), Password Hashing (`bcryptjs`), Request Validation (`zod`), `helmet`, `cors`

---

## Directory Structure
```
backend/
├── prisma/
│   ├── schema.prisma               # Prisma data models & relations
│   ├── seed.ts                     # TypeScript database seeder
│   └── mysql55_schema_and_seed.sql # Pure MySQL 5.5 SQL DDL & demo seed
├── src/
│   ├── config/                     # Database URL & JWT configuration
│   ├── database/                   # PrismaClient singleton
│   ├── middleware/
│   │   ├── authMiddleware.ts       # JWT verification & role authorization
│   │   └── errorHandler.ts         # Global exception catcher
│   ├── modules/
│   │   ├── auth/                   # Register, login, me endpoints
│   │   ├── events/                 # Event CRUD, filters, registrations & bookmarks
│   │   └── admin/                  # Admin moderation endpoints
│   ├── app.ts                      # Express middleware setup
│   └── server.ts                   # Entrypoint bootstrap
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Environment Configuration
Create a `.env` file in `backend/` (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/event_module_db"
JWT_SECRET="super-secret-jwt-key-change-in-production-2026"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

---

## Setup & Running

### 1. Initialize Database
Using the **MySQL 5.5 Command Line Client**:
```sql
SOURCE c:/Users/tarun/OneDrive/ドキュメント/event/event-module/backend/prisma/mysql55_schema_and_seed.sql;
```

Or using Prisma:
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Runs `ts-node-dev` with live reload at `http://localhost:5000`.

### 4. Build for Production
```bash
npm run build
npm start
```
Compiles TypeScript into `dist/` and runs with Node.
