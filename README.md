# Event Module — Campus Student Platform

> **Production-Oriented Event Discovery and Lifecycle Management System**  
> Specifically isolated to the **Event Module** without dependencies on internships, jobs, scholarships, or general courses.

---

## 🌟 Key Features

1. **Event Discovery & Exploration**:
   - Modern grid layout with live capacity indicators, mode badges, and date schedules.
   - Real-time search with debounce on event titles, descriptions, and venues.
   - Multi-parameter filtering across 9 categories (`TECHNOLOGY`, `CULTURAL`, `SPORTS`, `WORKSHOP`, etc.) and 3 delivery modes (`ONLINE`, `OFFLINE`, `HYBRID`).
   - Server-side pagination and skeleton loading states.

2. **Event Details & Enrollment**:
   - High-resolution hero image banners with countdown alerts and capacity progress bars.
   - Instant registration with deadline checks, capacity limits, and duplicate-prevention locks.
   - Cancel registration option directly from the event page.
   - One-click event bookmarking with optimistic UI updates.

3. **Organizer Management Tools**:
   - Event creation wizard with category, mode, schedule, venue, and registration deadline validation.
   - Owner event modification and deletion controls.
   - Live attendee roster table (`/events/:id/registrations`) with student contact information and registration timestamps.

4. **Administrative Moderation Dashboard**:
   - Overview metrics: Total Events, Pending Review, Approved, and Rejected.
   - Status filtering tabs and search for quick audits.
   - One-click approval and instant publication to public feed.
   - Rejection feedback modal with recorded reasons for organizers.

---

## 📂 Project Architecture

```
event-module/
├── backend/                  # Node.js + Express + TypeScript + Prisma
│   ├── prisma/
│   │   ├── schema.prisma               # Prisma ORM MySQL schema
│   │   ├── seed.ts                     # TypeScript database seeder
│   │   └── mysql55_schema_and_seed.sql # Pure MySQL 5.5 CLI DDL & Seed
│   └── src/                            # Express controllers, routes & middleware
├── frontend/                 # React 19 + TypeScript + Tailwind CSS + Vite 8
│   ├── src/
│   │   ├── components/events/          # Modular event discovery & detail components
│   │   ├── pages/                      # Role-tailored views (Discover, Admin, Auth)
│   │   └── services/                   # Axios API services
└── docs/                     # Comprehensive system documentation
    ├── EVENT_MODULE.md                 # Architecture, capabilities & boundaries
    ├── API_DOCUMENTATION.md            # REST API endpoints, schemas & error codes
    ├── DATABASE_SCHEMA.md              # Tables, relationships, indexes & Mermaid ERD
    └── USER_FLOW.md                    # Sequence diagrams & edge-case specifications
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (MySQL 5.5+)

#### Option A: Using MySQL 5.5 Command Line Client (Recommended for MySQL 5.5)
Open your **MySQL 5.5 Command Line Client**, enter your root password, and run:

```sql
SOURCE c:/Users/tarun/OneDrive/ドキュメント/event/event-module/backend/prisma/mysql55_schema_and_seed.sql;
```

This single command will:
- Create the `event_module_db` database with `utf8` character set and InnoDB engine.
- Create all 4 tables (`users`, `events`, `registrations`, `bookmarks`) with explicit UUID foreign keys.
- Populate demo accounts (Admin, Organizer, Students) and 7 realistic campus events.

#### Option B: Using Prisma (for standard Node environments)
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
```

---

### 2. Backend Setup

1. Open a terminal in `event-module/backend`:
   ```bash
   cd backend
   npm install
   ```

2. Verify `.env` file configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/event_module_db"
   JWT_SECRET="super-secret-jwt-key-change-in-production-2026"
   JWT_EXPIRES_IN="7d"
   FRONTEND_URL="http://localhost:5173"
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   *The backend server will launch at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a terminal in `event-module/frontend`:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will launch at `http://localhost:5173`.*

---

## 🔑 Demo User Accounts

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@events.com` | `Admin@123` | Moderate events, approve/reject submissions, force delete |
| **Organizer** | `organizer@events.com` | `Org@123` | Create & edit events, inspect attendee registrations |
| **Student 1** | `student@events.com` | `Stu@123` | Register for events, bookmark events, view enrolled list |
| **Student 2** | `bob@events.com` | `Stu@123` | Register for events, bookmark events |

---

## 📖 In-Depth Documentation

- 📘 [Module Overview & Architecture](file:///c:/Users/tarun/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/event/event-module/docs/EVENT_MODULE.md)
- 📗 [REST API Specification](file:///c:/Users/tarun/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/event/event-module/docs/API_DOCUMENTATION.md)
- 📙 [Database Schema & ER Diagrams](file:///c:/Users/tarun/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/event/event-module/docs/DATABASE_SCHEMA.md)
- 📕 [User Flows & Journey Diagrams](file:///c:/Users/tarun/OneDrive/%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88/event/event-module/docs/USER_FLOW.md)
