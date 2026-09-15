/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const EventCategory = {
  TECHNOLOGY: 'TECHNOLOGY',
  CULTURAL: 'CULTURAL',
  SPORTS: 'SPORTS',
  ACADEMIC: 'ACADEMIC',
  WORKSHOP: 'WORKSHOP',
  SEMINAR: 'SEMINAR',
  CONFERENCE: 'CONFERENCE',
  COLLEGE_FEST: 'COLLEGE_FEST',
  OTHER: 'OTHER',
} as const;

const EventMode = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  HYBRID: 'HYBRID',
} as const;

const EventStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data in order
  await prisma.bookmark.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // ─── USERS ──────────────────────────────────────────────────────────────
  const hashedAdmin = await bcrypt.hash('Admin@123', 10);
  const hashedOrg = await bcrypt.hash('Org@123', 10);
  const hashedStudent1 = await bcrypt.hash('Stu@123', 10);
  const hashedStudent2 = await bcrypt.hash('Stu@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@events.com',
      password: hashedAdmin,
      role: "ADMIN" as const,
    },
  });

  const organizer = await prisma.user.create({
    data: {
      name: 'Event Organizer',
      email: 'organizer@events.com',
      password: hashedOrg,
      role: "ORGANIZER" as const,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Alice Student',
      email: 'student@events.com',
      password: hashedStudent1,
      role: "STUDENT" as const,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Bob Learner',
      email: 'bob@events.com',
      password: hashedStudent2,
      role: "STUDENT" as const,
    },
  });

  console.log('✅ Users created');

  // ─── EVENTS ─────────────────────────────────────────────────────────────
  const event1 = await prisma.event.create({
    data: {
      title: 'AI & Machine Learning Workshop',
      description:
        'An immersive hands-on workshop covering the fundamentals of Artificial Intelligence and Machine Learning. Participants will build real-world ML models using Python, scikit-learn, and TensorFlow. Sessions include supervised learning, neural networks, and model deployment.',
      category: "TECHNOLOGY",
      image: '/images/events/event-01.jpg',
      venue: 'Tech Auditorium, Block A',
      location: 'IIT Bombay, Mumbai',
      mode: "OFFLINE",
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-16'),
      startTime: '09:00',
      endTime: '17:00',
      registrationDeadline: new Date('2026-10-10'),
      capacity: 100,
      eligibility: 'Open to all undergraduate and postgraduate students with basic Python knowledge.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'College Cultural Fest 2026',
      description:
        'The grandest cultural celebration of the year! A two-day extravaganza featuring music, dance, drama, art exhibitions, and celebrity performances. Students from 50+ colleges are expected to participate in various competitions and showcases.',
      category: "COLLEGE_FEST",
      image: '/images/events/event-02.jpg',
      venue: 'Main Campus Grounds',
      location: 'Delhi University, New Delhi',
      mode: "OFFLINE",
      startDate: new Date('2026-11-01'),
      endDate: new Date('2026-11-02'),
      startTime: '10:00',
      endTime: '22:00',
      registrationDeadline: new Date('2026-10-25'),
      capacity: 500,
      eligibility: 'Open to all college students. Team and individual events available.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Web Development Seminar: From Zero to Full Stack',
      description:
        'A comprehensive online seminar covering modern web development practices. Topics include HTML5, CSS3, JavaScript ES2024, React, Node.js, REST APIs, and deployment on cloud platforms. Expert industry speakers will share insights on career paths and real-world projects.',
      category: "SEMINAR",
      image: '/images/events/event-03.jpg',
      venue: 'Online — Zoom',
      location: 'Online',
      mode: "ONLINE",
      startDate: new Date('2026-10-20'),
      endDate: new Date('2026-10-20'),
      startTime: '11:00',
      endTime: '16:00',
      registrationDeadline: new Date('2026-10-18'),
      capacity: 300,
      eligibility: 'Open to all. Beginners and intermediate learners welcome.',
      registrationLink: 'https://zoom.us/meeting/register/sample',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event4 = await prisma.event.create({
    data: {
      title: 'Inter-College Sports Meet 2026',
      description:
        'Annual inter-college sports tournament featuring athletics, cricket, football, basketball, badminton, and swimming. Compete against top athletes from universities across the state. Prizes worth ₹2,00,000 to be won!',
      category: EventCategory.SPORTS,
      image: '/images/events/event-04.jpg',
      venue: 'University Sports Complex',
      location: 'VIT University, Vellore',
      mode: "OFFLINE",
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-11-12'),
      startTime: '08:00',
      endTime: '18:00',
      registrationDeadline: new Date('2026-11-01'),
      capacity: 200,
      eligibility: 'Open to students currently enrolled in any recognized college/university.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event5 = await prisma.event.create({
    data: {
      title: 'Blockchain & Web3 Summit',
      description:
        'A flagship summit bringing together blockchain developers, researchers, and enthusiasts. Keynote talks, panel discussions, and a hackathon track. Learn about DeFi, NFTs, smart contracts, and decentralized architectures.',
      category: EventCategory.CONFERENCE,
      image: '/images/events/event-05.jpg',
      venue: 'Convention Centre, Hall 3',
      location: 'Bengaluru International Exhibition Centre, Bengaluru',
      mode: EventMode.HYBRID,
      startDate: new Date('2026-12-05'),
      endDate: new Date('2026-12-06'),
      startTime: '09:30',
      endTime: '18:30',
      registrationDeadline: new Date('2026-11-28'),
      capacity: 250,
      eligibility: 'Open to engineering students, developers, and tech enthusiasts.',
      registrationLink: '',
      organizerId: organizer.id,
      status: EventStatus.PENDING,
    },
  });

  const event6 = await prisma.event.create({
    data: {
      title: 'Photography & Visual Storytelling Workshop',
      description:
        'Master the art of visual storytelling through photography. This hands-on workshop covers composition, lighting, street photography, portrait photography, and post-processing in Adobe Lightroom. All skill levels welcome.',
      category: EventCategory.WORKSHOP,
      image: '/images/events/event-06.jpg',
      venue: 'Arts & Media Building, Room 201',
      location: 'Symbiosis International University, Pune',
      mode: "OFFLINE",
      startDate: new Date('2026-10-28'),
      endDate: new Date('2026-10-28'),
      startTime: '10:00',
      endTime: '17:00',
      registrationDeadline: new Date('2026-10-22'),
      capacity: 40,
      eligibility: 'Open to all. Bring your own camera (DSLR, mirrorless, or smartphone).',
      registrationLink: '',
      organizerId: organizer.id,
      status: EventStatus.REJECTED,
      rejectionReason: 'Venue capacity documentation missing. Please resubmit with venue approval letter.',
    },
  });

  const event7 = await prisma.event.create({
    data: {
      title: 'National Collegiate Hackathon & DevFest',
      description:
        'A 36-hour non-stop hackathon challenging student innovators to build impactful solutions for smart cities, healthcare, and education. Mentorship from top industry engineers and cash prizes.',
      category: EventCategory.ACADEMIC,
      image: '/images/events/event-07.jpg',
      venue: 'Innovation Hub, 4th Floor',
      location: 'BITS Pilani, Hyderabad Campus',
      mode: "OFFLINE",
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-11-22'),
      startTime: '09:00',
      endTime: '21:00',
      registrationDeadline: new Date('2026-11-15'),
      capacity: 350,
      eligibility: 'College student teams of 2 to 4 members.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event8 = await prisma.event.create({
    data: {
      title: 'Annual Technology Expo & Innovation Summit',
      description:
        'The premier university technology expo showcasing cutting-edge student projects, hardware prototypes, AI breakthroughs, and aerospace engineering exhibits with over 5,000 attendees.',
      category: "TECHNOLOGY",
      image: '/images/events/event-08.jpg',
      venue: 'Grand Exhibition Hall',
      location: 'IIT Madras, Chennai',
      mode: "OFFLINE",
      startDate: new Date('2026-12-10'),
      endDate: new Date('2026-12-12'),
      startTime: '10:00',
      endTime: '19:00',
      registrationDeadline: new Date('2026-12-01'),
      capacity: 800,
      eligibility: 'Open to all students and tech professionals.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event9 = await prisma.event.create({
    data: {
      title: 'Global Youth Leadership & Entrepreneurship Summit',
      description:
        'Connecting aspiring founders with global venture capitalists, policy leaders, and unicorn founders. Interactive panels, pitch firesides, and high-impact networking sessions.',
      category: "SEMINAR",
      image: '/images/events/event-09.jpg',
      venue: 'Auditorium 1, Management Block',
      location: 'IIM Ahmedabad, Gujarat',
      mode: EventMode.HYBRID,
      startDate: new Date('2026-11-25'),
      endDate: new Date('2026-11-26'),
      startTime: '09:00',
      endTime: '17:30',
      registrationDeadline: new Date('2026-11-18'),
      capacity: 450,
      eligibility: 'Undergraduate and graduate students with startup aspirations.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event10 = await prisma.event.create({
    data: {
      title: 'Campus Music, Performing Arts & Light Gala',
      description:
        'A night of rhythm, theater, orchestral harmony, and laser light displays. Featuring performances by collegiate bands and international guest artists.',
      category: EventCategory.CULTURAL,
      image: '/images/events/event-10.jpg',
      venue: 'Open Air Amphitheatre',
      location: 'St. Xavier’s College, Mumbai',
      mode: "OFFLINE",
      startDate: new Date('2026-12-18'),
      endDate: new Date('2026-12-19'),
      startTime: '17:00',
      endTime: '23:00',
      registrationDeadline: new Date('2026-12-12'),
      capacity: 1200,
      eligibility: 'Open to all university students with valid ID.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event11 = await prisma.event.create({
    data: {
      title: 'Developer Keynote: Next-Gen AI and Cloud Systems',
      description:
        'Deep dive into high-throughput cloud infrastructure, GPU cluster orchestration, and serverless architectures tailored for machine learning workloads.',
      category: EventCategory.CONFERENCE,
      image: '/images/events/event-11.jpg',
      venue: 'Plenary Hall',
      location: 'Hyderabad International Convention Centre',
      mode: EventMode.HYBRID,
      startDate: new Date('2026-12-02'),
      endDate: new Date('2026-12-02'),
      startTime: '10:00',
      endTime: '16:00',
      registrationDeadline: new Date('2026-11-26'),
      capacity: 500,
      eligibility: 'Open to computer science students and engineers.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event12 = await prisma.event.create({
    data: {
      title: 'National Robotics & Autonomous Systems Championship',
      description:
        'Battle of the bots! High-stakes robotics competitions including autonomous maze navigation, drone racing, and robotic combat arenas.',
      category: "TECHNOLOGY",
      image: '/images/events/event-12.jpg',
      venue: 'Indoor Sports Arena',
      location: 'IIT Delhi, New Delhi',
      mode: "OFFLINE",
      startDate: new Date('2026-12-22'),
      endDate: new Date('2026-12-23'),
      startTime: '08:30',
      endTime: '19:00',
      registrationDeadline: new Date('2026-12-15'),
      capacity: 600,
      eligibility: 'Student robotics clubs and engineering teams.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event13 = await prisma.event.create({
    data: {
      title: 'AI in Healthcare & Biomedical Sciences Symposium',
      description:
        'Exploring machine vision diagnostics, genomic sequence modeling, and medical robotic surgeries presented by leading researchers and clinicians.',
      category: "SEMINAR",
      image: '/images/events/event-13.jpg',
      venue: 'Medical Sciences Auditorium',
      location: 'AIIMS, New Delhi',
      mode: "ONLINE",
      startDate: new Date('2026-11-28'),
      endDate: new Date('2026-11-28'),
      startTime: '13:00',
      endTime: '18:00',
      registrationDeadline: new Date('2026-11-24'),
      capacity: 350,
      eligibility: 'Biomedical, biotechnology, and computer science students.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event14 = await prisma.event.create({
    data: {
      title: 'Startup Pitch Showcase & Seed Venture Fair',
      description:
        'Student-founded startups pitch live in front of angel investors and accelerator directors with over ₹50 Lakhs in initial grant pool commitments.',
      category: EventCategory.WORKSHOP,
      image: '/images/events/event-14.jpg',
      venue: 'Startup Incubation Centre',
      location: 'IIT Kharagpur, West Bengal',
      mode: "OFFLINE",
      startDate: new Date('2026-12-14'),
      endDate: new Date('2026-12-15'),
      startTime: '10:00',
      endTime: '17:00',
      registrationDeadline: new Date('2026-12-08'),
      capacity: 150,
      eligibility: 'Student entrepreneurs and registered campus startups.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  const event15 = await prisma.event.create({
    data: {
      title: 'Product Design & UI/UX Design System Masterclass',
      description:
        'An intensive masterclass on building accessible, scalable design systems, token hierarchies, and interactive micro-animations using Figma and CSS.',
      category: EventCategory.WORKSHOP,
      image: '/images/events/event-15.jpg',
      venue: 'Design Studio Lab 3',
      location: 'National Institute of Design (NID), Ahmedabad',
      mode: "OFFLINE",
      startDate: new Date('2026-11-18'),
      endDate: new Date('2026-11-19'),
      startTime: '10:00',
      endTime: '16:00',
      registrationDeadline: new Date('2026-11-12'),
      capacity: 60,
      eligibility: 'Design, media, and frontend development students.',
      registrationLink: '',
      organizerId: organizer.id,
      status: "APPROVED",
    },
  });

  console.log('✅ Events created');

  // ─── REGISTRATIONS ───────────────────────────────────────────────────────
  await prisma.registration.create({
    data: {
      studentId: student1.id,
      eventId: event1.id,
    },
  });

  await prisma.registration.create({
    data: {
      studentId: student1.id,
      eventId: event3.id,
    },
  });

  await prisma.registration.create({
    data: {
      studentId: student2.id,
      eventId: event1.id,
    },
  });

  await prisma.registration.create({
    data: {
      studentId: student2.id,
      eventId: event2.id,
    },
  });

  console.log('✅ Registrations created');

  // ─── BOOKMARKS ──────────────────────────────────────────────────────────
  await prisma.bookmark.create({
    data: { studentId: student1.id, eventId: event2.id },
  });

  await prisma.bookmark.create({
    data: { studentId: student1.id, eventId: event4.id },
  });

  console.log('✅ Bookmarks created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('─────────────────────────────────────────');
  console.log('🔑 Login Credentials:');
  console.log('   Admin:     admin@events.com     / Admin@123');
  console.log('   Organizer: organizer@events.com / Org@123');
  console.log('   Student 1: student@events.com   / Stu@123');
  console.log('   Student 2: bob@events.com       / Stu@123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
