# Event Module — API Documentation

**Base URL**: `http://localhost:5000/api`  
**Data Format**: `application/json`  
**Authentication Header**: `Authorization: Bearer <JWT_TOKEN>`

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "events": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 9,
      "total": 24,
      "totalPages": 3
    }
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error explanation",
  "errors": { ... }
}
```

---

## 1. Authentication Endpoints

### Register User
- **Endpoint**: `POST /auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Alex Johnson",
  "email": "alex@campus.edu",
  "password": "Password@123",
  "role": "STUDENT" // or "ORGANIZER"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "u0000001-...",
      "name": "Alex Johnson",
      "email": "alex@campus.edu",
      "role": "STUDENT"
    }
  }
}
```

### Login User
- **Endpoint**: `POST /auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "alex@campus.edu",
  "password": "Password@123"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "u0000001-...",
      "name": "Alex Johnson",
      "email": "alex@campus.edu",
      "role": "STUDENT"
    }
  }
}
```

### Get Current Profile
- **Endpoint**: `GET /auth/me`
- **Access**: Authenticated (`STUDENT`, `ORGANIZER`, `ADMIN`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "u0000001-...",
    "name": "Alex Johnson",
    "email": "alex@campus.edu",
    "role": "STUDENT"
  }
}
```

---

## 2. Event Discovery & Public Endpoints

### Discover & Filter Events
- **Endpoint**: `GET /events`
- **Access**: Public
- **Query Parameters**:
  - `search` (string): Keyword matching in title, description, or location.
  - `category` (enum): `TECHNOLOGY`, `CULTURAL`, `SPORTS`, `ACADEMIC`, `WORKSHOP`, `SEMINAR`, `CONFERENCE`, `COLLEGE_FEST`, `OTHER`.
  - `mode` (enum): `ONLINE`, `OFFLINE`, `HYBRID`.
  - `location` (string): City or venue name substring.
  - `date` (ISO date string): Filter events occurring on or after date.
  - `page` (number, default: 1)
  - `limit` (number, default: 9)
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "e0000001-...",
        "title": "NextGen AI & Autonomous Systems Summit 2026",
        "description": "Immerse yourself in cutting-edge breakthroughs...",
        "category": "TECHNOLOGY",
        "image": "https://images.unsplash.com/...",
        "venue": "Grand Tech Auditorium, Hall A",
        "location": "Innovation Hub Campus",
        "mode": "HYBRID",
        "startDate": "2026-10-01T09:30:00.000Z",
        "endDate": "2026-10-02T17:00:00.000Z",
        "startTime": "09:30",
        "endTime": "17:00",
        "registrationDeadline": "2026-09-28T23:59:59.000Z",
        "capacity": 300,
        "eligibility": "Open to all engineering students.",
        "registrationLink": null,
        "status": "APPROVED",
        "organizer": {
          "id": "u0000002-...",
          "name": "Tech Club President",
          "email": "organizer@events.com"
        },
        "_count": {
          "registrations": 48
        },
        "isRegistered": false,
        "isBookmarked": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 9,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

### Get Single Event Details
- **Endpoint**: `GET /events/:id`
- **Access**: Public
- **Response (200 OK)**: Complete event object including capacity stats and user registration status if authenticated.

---

## 3. Organizer Endpoints

### Create New Event
- **Endpoint**: `POST /events`
- **Access**: `ORGANIZER`, `ADMIN`
- **Request Body**:
```json
{
  "title": "Hack the Future 2026",
  "description": "Annual 24-hour campus event focusing on sustainable computing solutions.",
  "category": "TECHNOLOGY",
  "image": "https://images.unsplash.com/...",
  "venue": "Campus Lab 3",
  "location": "Main Campus",
  "mode": "OFFLINE",
  "startDate": "2026-11-15T09:00:00.000Z",
  "endDate": "2026-11-16T17:00:00.000Z",
  "startTime": "09:00",
  "endTime": "17:00",
  "registrationDeadline": "2026-11-10T23:59:59.000Z",
  "capacity": 100,
  "eligibility": "Registered university students."
}
```
- **Response (201 Created)**: Event object created with status `PENDING` (awaiting admin review).

### Update Event
- **Endpoint**: `PATCH /events/:id`
- **Access**: `ORGANIZER` (must own event) or `ADMIN`
- **Request Body**: Partial event fields to update.
- **Response (200 OK)**: Updated event object.

### Delete Event
- **Endpoint**: `DELETE /events/:id`
- **Access**: `ORGANIZER` (must own event) or `ADMIN`
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

### Get Organizer's Events
- **Endpoint**: `GET /events/organizer/my-events`
- **Access**: `ORGANIZER`, `ADMIN`
- **Response (200 OK)**: List of all events created by the logged-in organizer.

### Get Event Attendees / Registrations
- **Endpoint**: `GET /events/:id/registrations`
- **Access**: `ORGANIZER` (must own event) or `ADMIN`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "r0000001-...",
      "registeredAt": "2026-09-15T12:00:00.000Z",
      "student": {
        "id": "u0000004-...",
        "name": "Alice Student",
        "email": "student@events.com"
      }
    }
  ]
}
```

---

## 4. Student Registration & Bookmarks Endpoints

### Register for Event
- **Endpoint**: `POST /events/:id/register`
- **Access**: `STUDENT`
- **Validation**: Enforces registration deadline, capacity limit, and duplicate registration prevention.
- **Response (201 Created)**: Registration record.

### Cancel Registration
- **Endpoint**: `DELETE /events/:id/register`
- **Access**: `STUDENT`
- **Response (200 OK)**: Cancellation confirmation message.

### Get Student's Registered Events
- **Endpoint**: `GET /events/my-events`
- **Access**: `STUDENT`
- **Response (200 OK)**: Array of registration objects containing full event payload.

### Bookmark Event
- **Endpoint**: `POST /events/:id/bookmark`
- **Access**: `STUDENT`
- **Response (201 Created)**: Bookmark record.

### Remove Bookmark
- **Endpoint**: `DELETE /events/:id/bookmark`
- **Access**: `STUDENT`
- **Response (200 OK)**: Removal confirmation message.

### Get Saved Bookmarks
- **Endpoint**: `GET /events/saved`
- **Access**: `STUDENT`
- **Response (200 OK)**: Array of bookmarked events.

---

## 5. Admin Moderation Endpoints

### List All Events for Moderation
- **Endpoint**: `GET /admin/events`
- **Access**: `ADMIN`
- **Query Parameters**: `status` (`PENDING`, `APPROVED`, `REJECTED`, or undefined for all).
- **Response (200 OK)**: Array of events with organizer and attendee count metadata.

### Approve Event
- **Endpoint**: `PATCH /admin/events/:id/approve`
- **Access**: `ADMIN`
- **Response (200 OK)**: Event status set to `APPROVED` and cleared rejection reason.

### Reject Event
- **Endpoint**: `PATCH /admin/events/:id/reject`
- **Access**: `ADMIN`
- **Request Body**:
```json
{
  "reason": "Please provide venue security clearance documents."
}
```
- **Response (200 OK)**: Event status set to `REJECTED` with reason recorded.

### Force Delete Event
- **Endpoint**: `DELETE /admin/events/:id`
- **Access**: `ADMIN`
- **Response (200 OK)**: Event and all associated registrations/bookmarks removed.
