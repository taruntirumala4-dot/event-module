# Event Module Overview & Architecture

## 1. Executive Summary & Boundaries

The **Event Module** is an isolated, high-performance sub-system designed for modern campus student platforms. Its sole purpose is **Event Discovery and Lifecycle Management**.

### ⚠️ Strict Architectural Boundaries
To guarantee modularity, maintainability, and clean domain isolation:
- **Included**: Event discovery, event search, multi-factor filtering, full event detail view, event registration, attendee management, bookmarks/saved events, event authoring/editing/deletion, and administrative approval moderation.
- **Excluded**: Internships, job boards, scholarships, general competitive programming, standalone hackathons, online course tracks, and college directories.

---

## 2. Core Capabilities & Feature Matrix

| Role | Capabilities | Primary Views / Endpoints |
| :--- | :--- | :--- |
| **All / Guest** | Browse approved events, search by keyword, filter by category/mode/location/date, view details | `/events`, `/events/:id`, `/login`, `/register` |
| **Student** | Register for events, cancel registration, view personal registered events, bookmark & unbookmark events | `/my-events`, `/saved-events`, `POST /events/:id/register`, `POST /events/:id/bookmark` |
| **Organizer** | Create events, upload banners, edit own events, view attendee list for hosted events, delete own events | `/events/create`, `/events/:id/edit`, `/events/:id/registrations`, `GET /events/:id/registrations` |
| **Administrator**| Oversee all events (Pending, Approved, Rejected), approve pending submissions, reject with feedback, manage any event | `/admin/events`, `PATCH /admin/events/:id/approve`, `PATCH /admin/events/:id/reject` |

---

## 3. Technology Stack & Architectural Decisions

### Frontend
- **Framework**: React 19 + TypeScript with Vite 8.
- **Styling**: Modern CSS design system + Tailwind CSS utilities with dark-mode glassmorphic aesthetics.
- **Icons & UI**: Lucide React for consistent icons, `react-hot-toast` for notifications.
- **State & Routing**: React Router v7 with role-aware route navigation and Auth Context for token persistence.

### Backend
- **Framework**: Express.js with TypeScript (`strict: true`).
- **Validation**: Zod schema validation on request payload, query parameters, and route parameters.
- **Security**: JWT authentication, `bcryptjs` password hashing (10 rounds), Helmet security headers, CORS origin filtering.
- **Database Access**: Prisma ORM with MySQL client + native MySQL 5.5 DDL compatibility.

### Database
- **Engine**: MySQL 5.5+ compatible (InnoDB engine, utf8 collation).
- **Key Identifiers**: Standard 36-character UUID strings (`VARCHAR(36)`) to stay well within MySQL 5.5's 767-byte index constraint on utf8/utf8mb4.
- **Relationships**: Foreign key constraints with `ON DELETE CASCADE` and targeted B-Tree indexes on query columns.

---

## 4. Directory Architecture

```
event-module/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma                  # Prisma ORM schema
│   │   ├── seed.ts                        # TypeScript database seeder
│   │   └── mysql55_schema_and_seed.sql    # Pure SQL DDL & Seed for MySQL 5.5 CLI
│   ├── src/
│   │   ├── config/                        # Database & environment configuration
│   │   ├── database/                      # Prisma service singleton
│   │   ├── middleware/                    # Auth, role authorization, error handling
│   │   ├── modules/
│   │   │   ├── auth/                      # Authentication routes & controllers
│   │   │   ├── events/                    # Event discovery, CRUD, registration & bookmarks
│   │   │   └── admin/                     # Admin moderation & approval workflow
│   │   ├── app.ts                         # Express app middleware configuration
│   │   └── server.ts                      # HTTP server bootstrap
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                    # Navbar, Footer
│   │   │   └── events/                    # EventCard, EventList, EventSearch, EventFilter,
│   │   │                                  # EventDetails, EventForm, EventRegistration,
│   │   │                                  # EventBookmark, EventStatusBadge, EventPagination
│   │   ├── context/                       # AuthContext (user, login, logout, token)
│   │   ├── hooks/                         # useEvents, useEventDetails, useMyEvents, useSavedEvents
│   │   ├── pages/
│   │   │   ├── auth/                      # LoginPage, RegisterPage
│   │   │   ├── events/                    # EventsPage, EventDetailsPage, CreateEventPage,
│   │   │   │                              # EditEventPage, MyEventsPage, SavedEventsPage,
│   │   │   │                              # EventRegistrationsPage
│   │   │   └── admin/                     # AdminEventsPage (moderation dashboard)
│   │   ├── services/                      # Axios eventApi & adminApi clients
│   │   ├── types/                         # TypeScript models, enums & API response types
│   │   ├── utils/                         # Date formatters, badge colors, capacity helpers
│   │   ├── App.tsx                        # Router layout & page routes
│   │   ├── index.css                      # Master design tokens & theme classes
│   │   └── main.tsx
│   ├── package.json
│   └── README.md
│
└── docs/
    ├── EVENT_MODULE.md                    # Module overview & architecture (this file)
    ├── API_DOCUMENTATION.md               # Complete REST API specification
    ├── DATABASE_SCHEMA.md                 # Entity relationship diagrams & table definitions
    └── USER_FLOW.md                       # Detailed user journeys & state transitions
```
