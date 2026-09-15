import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/eventApi';
import { Event } from '../../types/event';
import EventStatusBadge from '../../components/events/EventStatusBadge';
import {
  formatDate,
  formatTime,
  getCategoryLabel,
  getCategoryColor,
  getModeLabel,
  getModeColor,
} from '../../utils/eventUtils';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  Search,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';

const AdminEventsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Reject modal state
  const [rejectingEvent, setRejectingEvent] = useState<Event | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      toast.error('Access restricted to administrators');
      navigate('/events');
      return;
    }
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch events for moderation');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await adminApi.approveEvent(id);
      if (res.success && res.data) {
        toast.success('Event approved successfully');
        setEvents((prev) => prev.map((ev) => (ev.id === id ? res.data : ev)));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to approve event');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenReject = (event: Event) => {
    setRejectingEvent(event);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectingEvent) return;
    if (!rejectionReason.trim()) {
      toast.error('Please specify a reason for rejection');
      return;
    }

    setActionLoadingId(rejectingEvent.id);
    try {
      const res = await adminApi.rejectEvent(rejectingEvent.id, rejectionReason.trim());
      if (res.success && res.data) {
        toast.success('Event rejected');
        setEvents((prev) => prev.map((ev) => (ev.id === rejectingEvent.id ? res.data : ev)));
        setRejectingEvent(null);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reject event');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    setActionLoadingId(id);
    try {
      const res = await adminApi.deleteEvent(id);
      if (res.success) {
        toast.success('Event deleted');
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter and search
  const filteredEvents = events.filter((ev) => {
    const matchesTab = activeTab === 'ALL' ? true : ev.status === activeTab;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.organizer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.location && ev.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const totalCount = events.length;
  const pendingCount = events.filter((e) => e.status === 'PENDING').length;
  const approvedCount = events.filter((e) => e.status === 'APPROVED').length;
  const rejectedCount = events.filter((e) => e.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-[#0f0f1a] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Event Moderation & Approvals
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  Review submitted campus events, inspect details, approve publications, or provide rejection feedback.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="self-start md:self-auto btn bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs px-4 py-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh List'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab('ALL')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'ALL'
                ? 'bg-indigo-950/40 border-indigo-500/50 ring-2 ring-indigo-500/20'
                : 'bg-[#1a1a2e]/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Events</span>
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2">{totalCount}</div>
            <span className="text-[11px] text-slate-400 mt-1 block">All registered event listings</span>
          </div>

          <div
            onClick={() => setActiveTab('PENDING')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'PENDING'
                ? 'bg-amber-950/40 border-amber-500/50 ring-2 ring-amber-500/20'
                : 'bg-[#1a1a2e]/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Pending Review</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-2">{pendingCount}</div>
            <span className="text-[11px] text-amber-400/80 mt-1 block">Awaiting admin moderation</span>
          </div>

          <div
            onClick={() => setActiveTab('APPROVED')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'APPROVED'
                ? 'bg-emerald-950/40 border-emerald-500/50 ring-2 ring-emerald-500/20'
                : 'bg-[#1a1a2e]/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Approved</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2">{approvedCount}</div>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">Live on discover feed</span>
          </div>

          <div
            onClick={() => setActiveTab('REJECTED')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'REJECTED'
                ? 'bg-rose-950/40 border-rose-500/50 ring-2 ring-rose-500/20'
                : 'bg-[#1a1a2e]/70 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Rejected</span>
              <XCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-300 mt-2">{rejectedCount}</div>
            <span className="text-[11px] text-rose-400/80 mt-1 block">Returned with feedback</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#1a1a2e] p-1 rounded-xl border border-white/10 w-full sm:w-auto">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, host..."
              className="w-full pl-9.5 pr-4 py-2 bg-[#1a1a2e] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Events Table / Card Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
            <p className="text-sm">Loading events for moderation...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#1a1a2e]/50 border border-white/10 rounded-2xl p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No events found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
              No events matched the selected status tab and search criteria.
            </p>
          </div>
        ) : (
          <div className="bg-[#1a1a2e]/60 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Category & Mode</th>
                    <th className="py-3.5 px-4">Organizer</th>
                    <th className="py-3.5 px-4">Schedule</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredEvents.map((ev) => {
                    const isActing = actionLoadingId === ev.id;

                    return (
                      <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* Event Title & Image */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden border border-white/10">
                              {ev.image ? (
                                <img
                                  src={ev.image}
                                  alt={ev.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-950/50 text-indigo-400 font-bold text-sm">
                                  {ev.title.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <Link
                                to={`/events/${ev.id}`}
                                className="font-semibold text-white hover:text-indigo-400 transition-colors line-clamp-1 text-sm"
                              >
                                {ev.title}
                              </Link>
                              <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                {ev.description}
                              </p>
                              {ev.rejectionReason && ev.status === 'REJECTED' && (
                                <p className="text-[11px] text-rose-400 mt-1 italic">
                                  Note: {ev.rejectionReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Mode */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(
                                ev.category
                              )}`}
                            >
                              {getCategoryLabel(ev.category)}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getModeColor(
                                ev.mode
                              )}`}
                            >
                              {getModeLabel(ev.mode)}
                            </span>
                          </div>
                        </td>

                        {/* Organizer */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-slate-200 text-xs">
                              {ev.organizer?.name || 'Unknown Host'}
                            </p>
                            <p className="text-[11px] text-slate-500">{ev.organizer?.email}</p>
                          </div>
                        </td>

                        {/* Schedule */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-300">
                          <div>{formatDate(ev.startDate)}</div>
                          <div className="text-[11px] text-slate-500">
                            {formatTime(ev.startTime)} - {formatTime(ev.endTime)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <EventStatusBadge status={ev.status} />
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View detail button */}
                            <Link
                              to={`/events/${ev.id}`}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                              title="View Event Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Approve button */}
                            {ev.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleApprove(ev.id)}
                                disabled={isActing}
                                className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                                title="Approve Event"
                              >
                                {isActing ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {/* Reject button */}
                            {ev.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleOpenReject(ev)}
                                disabled={isActing}
                                className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                                title="Reject Event"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(ev.id, ev.title)}
                              disabled={isActing}
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reject Event Submission</h3>
                <p className="text-xs text-slate-400">Provide feedback so the organizer can revise.</p>
              </div>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-400">Event: </span>
              <span className="text-white font-medium">{rejectingEvent.title}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Rejection Reason / Required Changes
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please clarify the venue room number and upload a clearer banner image..."
                className="w-full px-3.5 py-2.5 bg-[#0f0f1a] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectingEvent(null)}
                className="btn bg-white/5 hover:bg-white/10 text-slate-300 text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={Boolean(actionLoadingId)}
                className="btn bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 py-2"
              >
                {actionLoadingId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
