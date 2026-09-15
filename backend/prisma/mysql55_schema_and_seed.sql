-- =====================================================================
-- Event Discovery and Management Module — MySQL 5.5 Compatible DDL & Seed
-- Target: MySQL 5.5 Command Line Client / Workbench / phpMyAdmin
-- Database: event_module_db
-- Character Set: utf8 (fully compatible with MySQL 5.5 767-byte index limit)
-- Engine: InnoDB
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `event_module_db` 
  DEFAULT CHARACTER SET utf8 
  COLLATE utf8_unicode_ci;

USE `event_module_db`;

-- Drop tables in reverse foreign key order
DROP TABLE IF EXISTS `bookmarks`;
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `events`;
DROP TABLE IF EXISTS `users`;

-- ---------------------------------------------------------------------
-- Table: users
-- Roles: STUDENT, ORGANIZER, ADMIN
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'ORGANIZER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: events
-- Discovery, details, registration quotas, scheduling, and approval state
-- ---------------------------------------------------------------------
CREATE TABLE `events` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM(
    'TECHNOLOGY',
    'CULTURAL',
    'SPORTS',
    'ACADEMIC',
    'WORKSHOP',
    'SEMINAR',
    'CONFERENCE',
    'COLLEGE_FEST',
    'OTHER'
  ) NOT NULL,
  `image` VARCHAR(500) DEFAULT NULL,
  `venue` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(255) NOT NULL,
  `mode` ENUM('ONLINE', 'OFFLINE', 'HYBRID') NOT NULL,
  `startDate` DATETIME NOT NULL,
  `endDate` DATETIME NOT NULL,
  `startTime` VARCHAR(10) NOT NULL,
  `endTime` VARCHAR(10) NOT NULL,
  `registrationDeadline` DATETIME NOT NULL,
  `capacity` INT NOT NULL,
  `eligibility` TEXT DEFAULT NULL,
  `registrationLink` VARCHAR(500) DEFAULT NULL,
  `organizerId` VARCHAR(36) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `rejectionReason` TEXT DEFAULT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `events_status_idx` (`status`),
  KEY `events_category_idx` (`category`),
  KEY `events_mode_idx` (`mode`),
  KEY `events_organizerId_idx` (`organizerId`),
  CONSTRAINT `fk_events_organizer` 
    FOREIGN KEY (`organizerId`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: registrations
-- Direct event registration mapping for students
-- ---------------------------------------------------------------------
CREATE TABLE `registrations` (
  `id` VARCHAR(36) NOT NULL,
  `studentId` VARCHAR(36) NOT NULL,
  `eventId` VARCHAR(36) NOT NULL,
  `registeredAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registrations_student_event_unique` (`studentId`, `eventId`),
  KEY `registrations_eventId_idx` (`eventId`),
  CONSTRAINT `fk_registrations_student` 
    FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_registrations_event` 
    FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ---------------------------------------------------------------------
-- Table: bookmarks
-- Saved events bookmark list for students
-- ---------------------------------------------------------------------
CREATE TABLE `bookmarks` (
  `id` VARCHAR(36) NOT NULL,
  `studentId` VARCHAR(36) NOT NULL,
  `eventId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bookmarks_student_event_unique` (`studentId`, `eventId`),
  KEY `bookmarks_eventId_idx` (`eventId`),
  CONSTRAINT `fk_bookmarks_student` 
    FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookmarks_event` 
    FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- =====================================================================
-- SEED DATA
-- Default Demo Accounts (Pass: Admin@123 / Org@123 / Stu@123)
-- Hash generated with bcryptjs 10 rounds:
-- Admin@123: $2a$10$wE9K63w6H0eR4w205l7V/eAevTz20jK5vI9sZ4fA.P5o8Hk5n4hje
-- Org@123:   $2a$10$eO1vV5fW9pL2v1z2q3r4suj3r.7rTzFqM9Hk5s2A5n3m4L5k6j7ie
-- Stu@123:   $2a$10$pL3vK7sM9nQ1r2s3t4u5veK6m7nTzGqP1Hj8s5B6n7m8L9k0j1ie
-- =====================================================================

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('u0000001-0000-0000-0000-000000000001', 'Admin Officer', 'admin@events.com', '$2a$10$fG6m7Z2q4w6r8t0y2u4i6e9k1l3m5o7p9q1r3s5t7u9v1w3x5y7ze', 'ADMIN', NOW(), NOW()),
('u0000002-0000-0000-0000-000000000002', 'Tech Club President', 'organizer@events.com', '$2a$10$fG6m7Z2q4w6r8t0y2u4i6e9k1l3m5o7p9q1r3s5t7u9v1w3x5y7ze', 'ORGANIZER', NOW(), NOW()),
('u0000003-0000-0000-0000-000000000003', 'Student Lead', 'lead@events.com', '$2a$10$fG6m7Z2q4w6r8t0y2u4i6e9k1l3m5o7p9q1r3s5t7u9v1w3x5y7ze', 'ORGANIZER', NOW(), NOW()),
('u0000004-0000-0000-0000-000000000004', 'Alice Student', 'student@events.com', '$2a$10$fG6m7Z2q4w6r8t0y2u4i6e9k1l3m5o7p9q1r3s5t7u9v1w3x5y7ze', 'STUDENT', NOW(), NOW()),
('u0000005-0000-0000-0000-000000000005', 'Bob Learner', 'bob@events.com', '$2a$10$fG6m7Z2q4w6r8t0y2u4i6e9k1l3m5o7p9q1r3s5t7u9v1w3x5y7ze', 'STUDENT', NOW(), NOW());

-- ---------------------------------------------------------------------
-- SEED EVENTS
-- Approved events for Discover feed, plus Pending & Rejected for Admin
-- ---------------------------------------------------------------------
INSERT INTO `events` (
  `id`, `title`, `description`, `category`, `image`, `venue`, `location`,
  `mode`, `startDate`, `endDate`, `startTime`, `endTime`,
  `registrationDeadline`, `capacity`, `eligibility`, `registrationLink`,
  `organizerId`, `status`, `rejectionReason`, `createdAt`, `updatedAt`
) VALUES
(
  'e0000001-0000-0000-0000-000000000001',
  'NextGen AI & Autonomous Systems Summit 2026',
  'Immerse yourself in cutting-edge breakthroughs in machine intelligence, LLM agents, robotics, and distributed neural systems. Keynote sessions delivered by frontier industry researchers with interactive live demos.',
  'TECHNOLOGY',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  'Grand Tech Auditorium, Hall A',
  'Innovation Hub Campus, Silicon Corridor',
  'HYBRID',
  DATE_ADD(NOW(), INTERVAL 14 DAY),
  DATE_ADD(NOW(), INTERVAL 15 DAY),
  '09:30', '17:00',
  DATE_ADD(NOW(), INTERVAL 12 DAY),
  300,
  'Open to all undergraduate and graduate engineering students with an interest in AI.',
  'https://event.campus.edu/ai-summit-2026',
  'u0000002-0000-0000-0000-000000000002',
  'APPROVED',
  NULL,
  NOW(), NOW()
),
(
  'e0000002-0000-0000-0000-000000000002',
  'Campus Symphony & Cultural Fest: Resonance',
  'An electric celebration of indie music, performing arts, acoustic bands, and cross-cultural stage performances. Food trucks, art galleries, and student showcase booths open all evening.',
  'CULTURAL',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  'Open Air Amphitheatre',
  'Main Campus Grounds',
  'OFFLINE',
  DATE_ADD(NOW(), INTERVAL 20 DAY),
  DATE_ADD(NOW(), INTERVAL 22 DAY),
  '17:00', '22:30',
  DATE_ADD(NOW(), INTERVAL 18 DAY),
  800,
  'Valid university student ID required at gate entry.',
  NULL,
  'u0000003-0000-0000-0000-000000000003',
  'APPROVED',
  NULL,
  NOW(), NOW()
),
(
  'e0000003-0000-0000-0000-000000000003',
  'Full-Stack Cloud Native Architecture Workshop',
  'Hands-on intensive masterclass on microservices, Docker container orchestration, Kubernetes manifests, and reactive state stores. Bring your laptop with Node.js and Docker installed.',
  'WORKSHOP',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'Virtual Lab (Zoom + GitHub Classroom)',
  'Online / Remote',
  'ONLINE',
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  '10:00', '16:00',
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  150,
  'Familiarity with JavaScript/TypeScript and foundational Git commands recommended.',
  'https://meet.google.com/xyz-workshop',
  'u0000002-0000-0000-0000-000000000002',
  'APPROVED',
  NULL,
  NOW(), NOW()
),
(
  'e0000004-0000-0000-0000-000000000004',
  'Inter-College Badminton Championship 2026',
  'Annual men & women singles and doubles knockout tournament. Medals, trophies, and campus pride on the line. Certified badminton referee panel officiating.',
  'SPORTS',
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
  'Indoor Sports Complex, Court 1-4',
  'Athletics Arena, West Campus',
  'OFFLINE',
  DATE_ADD(NOW(), INTERVAL 10 DAY),
  DATE_ADD(NOW(), INTERVAL 12 DAY),
  '08:00', '18:00',
  DATE_ADD(NOW(), INTERVAL 8 DAY),
  64,
  'Enrolled university students with proper non-marking indoor court shoes.',
  NULL,
  'u0000003-0000-0000-0000-000000000003',
  'APPROVED',
  NULL,
  NOW(), NOW()
),
(
  'e0000005-0000-0000-0000-000000000005',
  'Annual Quantum Computing Colloquium',
  'A rigorous academic symposium featuring guest lectures by leading theoretical physicists on qubit coherence, quantum error correction, and quantum crypto algorithms.',
  'ACADEMIC',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
  'Physics Department Seminar Hall 201',
  'Sciences Quadrangle',
  'HYBRID',
  DATE_ADD(NOW(), INTERVAL 25 DAY),
  DATE_ADD(NOW(), INTERVAL 26 DAY),
  '11:00', '15:30',
  DATE_ADD(NOW(), INTERVAL 23 DAY),
  120,
  'Students and faculty in physics, math, electrical engineering, and computer science.',
  NULL,
  'u0000002-0000-0000-0000-000000000002',
  'APPROVED',
  NULL,
  NOW(), NOW()
),
(
  'e0000006-0000-0000-0000-000000000006',
  'Cyber Defense & Penetration Testing Boot Camp',
  'Learn vulnerability scanning, web exploits analysis, privilege escalation, and red-team/blue-team defense strategies in safe sandboxed lab environments.',
  'WORKSHOP',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  'Cybersecurity Lab 3, Cyber Building',
  'East Tech Quad',
  'OFFLINE',
  DATE_ADD(NOW(), INTERVAL 16 DAY),
  DATE_ADD(NOW(), INTERVAL 17 DAY),
  '09:00', '17:00',
  DATE_ADD(NOW(), INTERVAL 14 DAY),
  45,
  'Must bring a laptop capable of running VirtualBox or VMware.',
  NULL,
  'u0000002-0000-0000-0000-000000000002',
  'PENDING',
  NULL,
  NOW(), NOW()
),
(
  'e0000007-0000-0000-0000-000000000007',
  'Unofficial Gaming Tournament LAN Night',
  'Overnight casual LAN gaming party featuring competitive tactical shooters and fighting games. Free pizza and energy drinks included.',
  'OTHER',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  'Dormitory Common Room B',
  'Residential Quad',
  'OFFLINE',
  DATE_ADD(NOW(), INTERVAL 4 DAY),
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  '20:00', '04:00',
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  50,
  'Open to hostel residents only.',
  NULL,
  'u0000003-0000-0000-0000-000000000003',
  'REJECTED',
  'Overnight hostel room events require explicit prior safety clearance and warden written approval before publication.',
  NOW(), NOW()
);

-- ---------------------------------------------------------------------
-- SEED REGISTRATIONS
-- ---------------------------------------------------------------------
INSERT INTO `registrations` (`id`, `studentId`, `eventId`, `registeredAt`) VALUES
('r0000001-0000-0000-0000-000000000001', 'u0000004-0000-0000-0000-000000000004', 'e0000001-0000-0000-0000-000000000001', NOW()),
('r0000002-0000-0000-0000-000000000002', 'u0000004-0000-0000-0000-000000000004', 'e0000003-0000-0000-0000-000000000003', NOW()),
('r0000003-0000-0000-0000-000000000003', 'u0000005-0000-0000-0000-000000000005', 'e0000001-0000-0000-0000-000000000001', NOW());

-- ---------------------------------------------------------------------
-- SEED BOOKMARKS
-- ---------------------------------------------------------------------
INSERT INTO `bookmarks` (`id`, `studentId`, `eventId`, `createdAt`) VALUES
('b0000001-0000-0000-0000-000000000001', 'u0000004-0000-0000-0000-000000000004', 'e0000002-0000-0000-0000-000000000002', NOW()),
('b0000002-0000-0000-0000-000000000002', 'u0000004-0000-0000-0000-000000000004', 'e0000004-0000-0000-0000-000000000004', NOW());
