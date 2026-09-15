# Event Module — User Flow & Journey Specifications

This document outlines the step-by-step user journeys and system state transitions across all supported roles: **Student**, **Organizer**, and **Administrator**.

---

## 1. Student Journey: Discovery to Registration

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Frontend App
    participant API as Backend Service
    participant DB as MySQL Database

    Student->>UI: Visits /events
    UI->>API: GET /api/events (filters, page 1)
    API->>DB: Query approved events with registration counts
    DB-->>API: Return events dataset
    API-->>UI: 200 OK + JSON
    UI-->>Student: Renders discovery grid with search & category pills

    Student->>UI: Selects an Event Card
    UI->>API: GET /api/events/:id
    API-->>UI: Full event object + registration status
    UI-->>Student: Displays Hero banner, capacity bar, date/time & "Register" button

    alt Student not logged in
        Student->>UI: Clicks "Register for Event"
        UI-->>Student: Prompts redirect to /login with state preservation
    else Student logged in
        Student->>UI: Clicks "Register Now"
        UI->>API: POST /api/events/:id/register (JWT)
        API->>DB: Check deadline & verify capacity < maxCapacity
        API->>DB: INSERT into registrations (studentId, eventId)
        DB-->>API: Success
        API-->>UI: 201 Created
        UI-->>Student: Toast "Successfully registered!" + button updates to "Registered (Click to Cancel)"
    end

    Student->>UI: Visits /my-events
    UI->>API: GET /api/events/my-events (JWT)
    API-->>UI: Array of registered events
    UI-->>Student: Displays enrolled events with dates and ticket status
```

---

## 2. Organizer Journey: Event Creation to Attendee Management

```mermaid
sequenceDiagram
    autonumber
    actor Organizer
    participant UI as Frontend App
    participant API as Backend Service
    participant DB as MySQL Database

    Organizer->>UI: Clicks "Create Event" (/events/create)
    UI-->>Organizer: Displays event form (Title, Category, Mode, Dates, Capacity, Banner URL)
    Organizer->>UI: Fills form and submits
    UI->>API: POST /api/events (Payload + JWT)
    API->>DB: INSERT INTO events (status='PENDING', organizerId=user.id)
    DB-->>API: Created event record
    API-->>UI: 201 Created (status: PENDING)
    UI-->>Organizer: Success notification: "Submitted for admin review!"

    Note over Organizer,API: Later, after event is Approved by Admin:
    Organizer->>UI: Visits /events/:id/registrations
    UI->>API: GET /api/events/:id/registrations
    API->>DB: SELECT student name, email, registeredAt
    DB-->>API: Attendee roster
    API-->>UI: 200 OK
    UI-->>Organizer: Renders attendee metrics & student registration table
```

---

## 3. Administrator Journey: Moderation & Approvals

```mermaid
sequenceDiagram
    autonumber
    actor Admin
    participant UI as Frontend App
    participant API as Backend Service
    participant DB as MySQL Database

    Admin->>UI: Navigates to /admin/events
    UI->>API: GET /api/admin/events (JWT)
    API-->>UI: List of all events across statuses (Pending, Approved, Rejected)
    UI-->>Admin: Displays moderation dashboard with live status cards

    Admin->>UI: Selects "Pending Review" tab
    UI-->>Admin: Lists unapproved events with organizer contact info

    alt Approve Event
        Admin->>UI: Clicks "Approve" button
        UI->>API: PATCH /api/admin/events/:id/approve
        API->>DB: UPDATE events SET status='APPROVED', rejectionReason=NULL
        DB-->>API: Updated record
        API-->>UI: 200 OK
        UI-->>Admin: Event badge transitions to "Approved"; immediately live on /events
    else Reject Event
        Admin->>UI: Clicks "Reject" button
        UI-->>Admin: Opens modal prompting for rejection reason
        Admin->>UI: Enters "Please upload a clearer venue layout map" & confirms
        UI->>API: PATCH /api/admin/events/:id/reject { reason: "..." }
        API->>DB: UPDATE events SET status='REJECTED', rejectionReason='...'
        DB-->>API: Updated record
        API-->>UI: 200 OK
        UI-->>Admin: Event marked "Rejected" with reason recorded
    end
```

---

## 4. Edge Cases & Validation Rules

| Scenario | Condition | System Behavior |
| :--- | :--- | :--- |
| **Capacity Reached** | Registrations count >= Event Capacity | Register button becomes disabled showing **"Event Full"**. Backend rejects any further registration attempts with HTTP `400 Bad Request`. |
| **Deadline Expired** | Current time > `registrationDeadline` | Register button shows **"Registration Closed"**. Backend validates timestamp and prevents enrollment. |
| **Duplicate Registration**| Student clicks register a second time | Uniqueness constraint `(studentId, eventId)` prevents duplicate rows; backend returns HTTP `409 Conflict`. |
| **Non-Student Registration**| Organizer or Admin tries to register | UI explains that only student accounts can enroll in events; redirects or encourages Student demo profile. |
| **Unauthorized Modification**| Organizer tries to edit another organizer's event | Backend checks `event.organizerId === req.user.id`; returns HTTP `403 Forbidden` if mismatched. |
| **Pending Event Discovery**| Unauthenticated user views `/events` | Only events with `status === 'APPROVED'` are returned in public discovery queries. |
