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
    <div className="min-h-screen bg-[#EFF1F9] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE2F0] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#FFE2EB] text-[#C1205B]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E4A] tracking-tight">
                  Event Moderation & Approvals
                </h1>
                <p className="text-sm text-[#5B6487] mt-0.5">
                  Review submitted campus events, inspect details, approve publications, or provide rejection feedback.
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="self-start md:self-auto btn btn-secondary text-xs px-4 py-2"
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
                ? 'bg-[#FFFFFF] border-[#2E58D7] ring-2 ring-[#2E58D7]/20 shadow-md'
                : 'bg-[#FFFFFF] border-[#DDE2F0] hover:border-[#7AD9E8] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5B6487]">Total Events</span>
              <Layers className="w-5 h-5 text-[#2E58D7]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1E4A] mt-2">{totalCount}</div>
            <span className="text-[11px] text-[#9199B5] mt-1 block">All registered event listings</span>
          </div>

          <div
            onClick={() => setActiveTab('PENDING')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'PENDING'
                ? 'bg-[#FFFFFF] border-[#F59E0B] ring-2 ring-[#F59E0B]/20 shadow-md'
                : 'bg-[#FFFFFF] border-[#DDE2F0] hover:border-[#7AD9E8] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Pending Review</span>
              <Clock className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#B45309] mt-2">{pendingCount}</div>
            <span className="text-[11px] text-[#5B6487] mt-1 block">Awaiting admin moderation</span>
          </div>

          <div
            onClick={() => setActiveTab('APPROVED')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'APPROVED'
                ? 'bg-[#FFFFFF] border-[#10B981] ring-2 ring-[#10B981]/20 shadow-md'
                : 'bg-[#FFFFFF] border-[#DDE2F0] hover:border-[#7AD9E8] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#047857]">Approved</span>
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#047857] mt-2">{approvedCount}</div>
            <span className="text-[11px] text-[#5B6487] mt-1 block">Live on discover feed</span>
          </div>

          <div
            onClick={() => setActiveTab('REJECTED')}
            className={`cursor-pointer p-5 rounded-2xl border transition-all ${
              activeTab === 'REJECTED'
                ? 'bg-[#FFFFFF] border-[#9A2A2A] ring-2 ring-[#9A2A2A]/20 shadow-md'
                : 'bg-[#FFFFFF] border-[#DDE2F0] hover:border-[#7AD9E8] shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#9A2A2A]">Rejected</span>
              <XCircle className="w-5 h-5 text-[#9A2A2A]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#9A2A2A] mt-2">{rejectedCount}</div>
            <span className="text-[11px] text-[#5B6487] mt-1 block">Returned with feedback</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center bg-[#FFFFFF] p-1.5 rounded-full border border-[#DDE2F0] shadow-sm w-full sm:w-auto">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab
                    ? 'bg-[#2E58D7] text-white shadow-sm'
                    : 'text-[#5B6487] hover:text-[#0B1E4A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9199B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, host..."
              className="w-full pl-9.5 pr-4 py-2 bg-[#FFFFFF] border border-[#DDE2F0] rounded-full text-xs text-[#0B1E4A] placeholder-[#9199B5] focus:outline-none focus:border-[#2E58D7] transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Events Table / Card Feed */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5B6487]">
            <Loader2 className="w-8 h-8 animate-spin text-[#2E58D7] mb-3" />
            <p className="text-sm">Loading events for moderation...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#DDE2F0] rounded-2xl p-12 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-[#9199B5] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0B1E4A]">No events found</h3>
            <p className="text-sm text-[#5B6487] mt-1 max-w-md mx-auto">
              No events matched the selected status tab and search criteria.
            </p>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] border border-[#DDE2F0] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[#DDE2F0] bg-[#F7F8FC] text-[#5B6487] text-xs font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Category & Mode</th>
                    <th className="py-3.5 px-4">Organizer</th>
                    <th className="py-3.5 px-4">Schedule</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ECEFF8]">
                  {filteredEvents.map((ev) => {
                    const isActing = actionLoadingId === ev.id;

                    return (
                      <tr key={ev.id} className="hover:bg-[#F9FAFD] transition-colors group">
                        {/* Event Title & Image */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#EFF1F9] flex-shrink-0 overflow-hidden border border-[#DDE2F0]">
                              {ev.image ? (
                                <img
                                  src={ev.image}
                                  alt={ev.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#EEF2FF] text-[#2E58D7] font-bold text-sm">
                                  {ev.title.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <Link
                                to={`/events/${ev.id}`}
                                className="font-bold text-[#0B1E4A] hover:text-[#2E58D7] transition-colors line-clamp-1 text-sm"
                              >
                                {ev.title}
                              </Link>
                              <p className="text-xs text-[#5B6487] line-clamp-1 mt-0.5">
                                {ev.description}
                              </p>
                              {ev.rejectionReason && ev.status === 'REJECTED' && (
                                <p className="text-[11px] text-[#9A2A2A] mt-1 italic font-medium">
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
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
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
                            <p className="font-semibold text-[#0B1E4A] text-xs">
                              {ev.organizer?.name || 'Unknown Host'}
                            </p>
                            <p className="text-[11px] text-[#5B6487]">{ev.organizer?.email}</p>
                          </div>
                        </td>

                        {/* Schedule */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-[#0B1E4A]">
                          <div className="font-medium">{formatDate(ev.startDate)}</div>
                          <div className="text-[11px] text-[#5B6487]">
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
                              className="p-1.5 rounded-lg text-[#5B6487] hover:text-[#0B1E4A] hover:bg-[#EFF1F9] transition-colors"
                              title="View Event Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            {/* Approve button */}
                            {ev.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleApprove(ev.id)}
                                disabled={isActing}
                                className="p-1.5 rounded-lg text-[#047857] hover:bg-[#ECFDF5] border border-[#A7F3D0] transition-colors"
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
                                className="p-1.5 rounded-lg text-[#B45309] hover:bg-[#FEF3C7] border border-[#FDE68A] transition-colors"
                                title="Reject Event"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(ev.id, ev.title)}
                              disabled={isActing}
                              className="p-1.5 rounded-lg text-[#9A2A2A] hover:bg-[#FFE2EB] border border-[#FECDD3] transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#091838]/60 backdrop-blur-sm">
          <div className="bg-[#FFFFFF] border border-[#DDE2F0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFE2EB] text-[#9A2A2A]">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0B1E4A]">Reject Event Submission</h3>
                <p className="text-xs text-[#5B6487]">Provide feedback so the organizer can revise.</p>
              </div>
            </div>

            <div className="bg-[#EFF1F9] p-3 rounded-xl border border-[#DDE2F0] text-xs">
              <span className="text-[#5B6487]">Event: </span>
              <span className="text-[#0B1E4A] font-bold">{rejectingEvent.title}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1E4A] mb-1.5">
                Rejection Reason / Required Changes
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Please clarify the venue room number and upload a clearer banner image..."
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#DDE2F0] rounded-xl text-xs text-[#0B1E4A] placeholder-[#9199B5] focus:outline-none focus:border-[#2E58D7]"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectingEvent(null)}
                className="btn btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={Boolean(actionLoadingId)}
                className="btn text-white text-xs px-4 py-2"
                style={{ backgroundColor: '#9A2A2A', borderRadius: 999 }}
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
