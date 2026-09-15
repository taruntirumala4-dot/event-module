import { useState, useEffect, useCallback } from 'react';
import { eventApi } from '../services/eventApi';
import { Event, EventFilters, PaginatedEvents, Registration, Bookmark } from '../types/event';

// ─── useEvents (discovery with filters) ──────────────────────────────────────
export const useEvents = (initialFilters?: EventFilters) => {
  const [data, setData] = useState<PaginatedEvents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters || { page: 1, limit: 9 });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventApi.getEvents(filters);
      setData(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilters = (newFilters: Partial<EventFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page: number) => setFilters((prev) => ({ ...prev, page }));

  return { data, loading, error, filters, updateFilters, setPage, refetch: fetchEvents };
};

// ─── useEventDetails ──────────────────────────────────────────────────────────
export const useEventDetails = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await eventApi.getEventById(id);
      setEvent(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load event');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, setEvent, loading, error, refetch: fetchEvent };
};

// ─── useMyEvents (student registrations) ────────────────────────────────────
export const useMyEvents = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await eventApi.getMyEvents();
        setRegistrations(res.data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { registrations, loading, error };
};

// ─── useSavedEvents (student bookmarks) ─────────────────────────────────────
export const useSavedEvents = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getSavedEvents();
      setBookmarks(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { bookmarks, setBookmarks, loading, error, refetch: fetch };
};

// ─── useOrganizerEvents ───────────────────────────────────────────────────────
export const useOrganizerEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await eventApi.getOrganizerEvents();
      setEvents(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { events, setEvents, loading, error, refetch: fetch };
};
