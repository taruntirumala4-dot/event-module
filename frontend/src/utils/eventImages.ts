// Event Module Image Mapping
// Only event-related images strictly from the specified set are used.

export const EVENT_DISCOVERY_IMAGES = [
  '/images/events/event-01.jpg',
  '/images/events/event-02.jpg',
  '/images/events/event-03.jpg',
  '/images/events/event-04.jpg',
  '/images/events/event-05.jpg',
  '/images/events/event-06.jpg',
  '/images/events/event-07.jpg',
] as const;

export const FEATURED_EVENT_IMAGES = [
  '/images/events/event-08.jpg',
  '/images/events/event-09.jpg',
  '/images/events/event-10.jpg',
] as const;

export const EVENT_DETAILS_HERO_IMAGES = [
  '/images/events/event-11.jpg',
  '/images/events/event-12.jpg',
  '/images/events/event-13.jpg',
] as const;

export const ORGANIZER_EVENT_IMAGES = [
  '/images/events/event-14.jpg',
  '/images/events/event-15.jpg',
] as const;

export const EVENT_PLACEHOLDER_IMAGE = '/images/events/event-placeholder.jpg';

export interface EventImageOption {
  id: string;
  label: string;
  path: string;
  category: 'discovery' | 'featured' | 'hero' | 'organizer';
}

export const ALL_EVENT_IMAGES: EventImageOption[] = [
  { id: 'event-01', label: 'Tech & Code Workshop', path: '/images/events/event-01.jpg', category: 'discovery' },
  { id: 'event-02', label: 'Cultural & Music Fest', path: '/images/events/event-02.jpg', category: 'discovery' },
  { id: 'event-03', label: 'Web Dev & Engineering', path: '/images/events/event-03.jpg', category: 'discovery' },
  { id: 'event-04', label: 'Sports & Athletics', path: '/images/events/event-04.jpg', category: 'discovery' },
  { id: 'event-05', label: 'Blockchain & Conference', path: '/images/events/event-05.jpg', category: 'discovery' },
  { id: 'event-06', label: 'Creative & Photography', path: '/images/events/event-06.jpg', category: 'discovery' },
  { id: 'event-07', label: 'Campus Hackathon & Team', path: '/images/events/event-07.jpg', category: 'discovery' },
  { id: 'event-08', label: 'Featured: Annual Tech Expo', path: '/images/events/event-08.jpg', category: 'featured' },
  { id: 'event-09', label: 'Featured: Leadership Summit', path: '/images/events/event-09.jpg', category: 'featured' },
  { id: 'event-10', label: 'Featured: Campus Grand Gala', path: '/images/events/event-10.jpg', category: 'featured' },
  { id: 'event-11', label: 'Hero: Developer Keynote', path: '/images/events/event-11.jpg', category: 'hero' },
  { id: 'event-12', label: 'Hero: Innovation Showcase', path: '/images/events/event-12.jpg', category: 'hero' },
  { id: 'event-13', label: 'Hero: Tech Arena Stage', path: '/images/events/event-13.jpg', category: 'hero' },
  { id: 'event-14', label: 'Organizer: Venture Showcase', path: '/images/events/event-14.jpg', category: 'organizer' },
  { id: 'event-15', label: 'Organizer: UI/UX Masterclass', path: '/images/events/event-15.jpg', category: 'organizer' },
];

/**
 * Resolves an event's image. If null/undefined or invalid, returns an assigned
 * image from the curated event pool based on event id or index.
 */
export const getEventImage = (image?: string | null, fallbackIndex: number = 0): string => {
  if (image && image.trim().length > 0) {
    return image;
  }
  return EVENT_DISCOVERY_IMAGES[fallbackIndex % EVENT_DISCOVERY_IMAGES.length];
};
