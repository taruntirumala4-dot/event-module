# Event Module — Frontend Application

Modern React 19 + TypeScript + Vite + Tailwind CSS user interface for discovering events, registering, organizing events, and moderating submissions.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + custom modern glassmorphic theme tokens (`index.css`)
- **Routing**: React Router v7
- **HTTP Client**: Axios with JWT interceptors
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Dates**: date-fns

---

## Directory Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx            # Responsive navigation & role indicators
│   │   └── events/
│   │       ├── EventCard.tsx         # Event preview card with status/mode/capacity
│   │       ├── EventList.tsx         # Responsive grid with skeletons & empty state
│   │       ├── EventSearch.tsx       # Search bar with clear button
│   │       ├── EventFilter.tsx       # Category, mode, and date filter dropdowns
│   │       ├── EventDetails.tsx      # Comprehensive event page view
│   │       ├── EventForm.tsx         # Create / edit event form with validation
│   │       ├── EventRegistration.tsx # Register / cancel toggle button
│   │       ├── EventBookmark.tsx     # Save event heart / bookmark toggle
│   │       ├── EventStatusBadge.tsx  # Status badge component
│   │       └── EventPagination.tsx   # Pagination controls
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication state & localStorage token sync
│   ├── hooks/
│   │   └── useEvents.ts              # Event discovery, filtering & detail hooks
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx         # Login with quick demo credentials buttons
│   │   │   └── RegisterPage.tsx      # Student / Organizer registration
│   │   ├── events/
│   │   │   ├── EventsPage.tsx        # Discovery feed with search & filters
│   │   │   ├── EventDetailsPage.tsx  # Detail view with registration sidebar
│   │   │   ├── CreateEventPage.tsx   # Organizer creation wizard
│   │   │   ├── EditEventPage.tsx     # Organizer modification view
│   │   │   ├── MyEventsPage.tsx      # Student enrolled events list
│   │   │   ├── SavedEventsPage.tsx   # Student bookmarked events
│   │   │   └── EventRegistrationsPage.tsx # Attendee roster table
│   │   └── admin/
│   │       └── AdminEventsPage.tsx   # Moderation dashboard (Approve/Reject)
│   ├── services/
│   │   └── eventApi.ts               # Axios API service client
│   ├── types/
│   │   └── event.ts                  # TypeScript types & interfaces
│   ├── utils/
│   │   └── eventUtils.ts             # Helpers for dates, badges, and capacity
│   ├── App.tsx                       # Root router & layout wrapper
│   ├── index.css                     # Design tokens, fonts, and dark theme
│   └── main.tsx                      # Vite React entrypoint
├── package.json
└── vite.config.ts
```

---

## Setup & Running

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Verify `.env` has the backend API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Production
```bash
npm run build
```
Generates production-ready optimized assets in `dist/`.
