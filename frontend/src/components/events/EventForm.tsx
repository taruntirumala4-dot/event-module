import React, { useState, useEffect } from 'react';
import { CreateEventForm, Event } from '../../types/event';
import { EVENT_CATEGORIES, EVENT_MODES, getCategoryLabel, getModeLabel } from '../../utils/eventUtils';
import { Loader2, ImageIcon, Info } from 'lucide-react';

interface Props {
  initialData?: Partial<Event>;
  onSubmit: (data: Partial<CreateEventForm>) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

const emptyForm: CreateEventForm = {
  title: '',
  description: '',
  category: '',
  image: '',
  venue: '',
  location: '',
  mode: '',
  startDate: '',
  endDate: '',
  startTime: '09:00',
  endTime: '17:00',
  registrationDeadline: '',
  capacity: '',
  eligibility: '',
  registrationLink: '',
};

const FormField: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, children }) => (
  <div>
    <label className="label">
      {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.375rem', marginBottom: 0 }}>{hint}</p>}
  </div>
);

const EventForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Event',
}) => {
  const [form, setForm] = useState<CreateEventForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
        image: initialData.image || '',
        venue: initialData.venue || '',
        location: initialData.location || '',
        mode: initialData.mode || '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 10) : '',
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : '',
        startTime: initialData.startTime || '09:00',
        endTime: initialData.endTime || '17:00',
        registrationDeadline: initialData.registrationDeadline
          ? initialData.registrationDeadline.slice(0, 10)
          : '',
        capacity: initialData.capacity || '',
        eligibility: initialData.eligibility || '',
        registrationLink: initialData.registrationLink || '',
      });
    }
  }, [initialData]);

  const set = (key: keyof CreateEventForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.mode) errs.mode = 'Mode is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errs.endDate = 'End date must not be before start date';
    if (!form.registrationDeadline) errs.registrationDeadline = 'Registration deadline is required';
    if (form.startDate && form.registrationDeadline && form.registrationDeadline > form.startDate)
      errs.registrationDeadline = 'Deadline must be on or before the event start date';
    if (!form.capacity || Number(form.capacity) <= 0)
      errs.capacity = 'Capacity must be a positive number';
    if (form.image && !/^https?:\/\//.test(form.image))
      errs.image = 'Image must be a valid URL starting with http:// or https://';
    if (form.registrationLink && !/^https?:\/\//.test(form.registrationLink))
      errs.registrationLink = 'Registration link must be a valid URL';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: Partial<CreateEventForm> = {
      ...form,
      capacity: Number(form.capacity),
    };

    await onSubmit(payload);
  };

  const inputStyle: React.CSSProperties = {};
  const sectionStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #DDE2F0',
    borderRadius: 14,
    padding: '1.75rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 18px rgba(11, 30, 74, 0.04)',
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      {/* Basic Info */}
      <div style={sectionStyle}>
        <h3 style={{ color: '#0B1E4A', margin: '0 0 1.25rem', fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Basic Information
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Event Title" required>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input"
              style={inputStyle}
              placeholder="e.g. AI & Machine Learning Workshop"
              id="event-title"
            />
            {errors.title && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.title}</p>}
          </FormField>

          <FormField label="Description" required>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="input"
              rows={5}
              placeholder="Describe your event in detail..."
              style={{ resize: 'vertical' }}
              id="event-description"
            />
            {errors.description && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.description}</p>}
          </FormField>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Category" required>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="input"
                id="event-category"
              >
                <option value="">Select category</option>
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{getCategoryLabel(c)}</option>
                ))}
              </select>
              {errors.category && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.category}</p>}
            </FormField>

            <FormField label="Mode" required>
              <select
                value={form.mode}
                onChange={(e) => set('mode', e.target.value)}
                className="input"
                id="event-mode"
              >
                <option value="">Select mode</option>
                {EVENT_MODES.map((m) => (
                  <option key={m} value={m}>{getModeLabel(m)}</option>
                ))}
              </select>
              {errors.mode && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.mode}</p>}
            </FormField>
          </div>

          <FormField label="Event Image URL" hint="Paste a publicly accessible image URL">
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
              <ImageIcon size={16} style={{ color: '#2E58D7', marginTop: '0.65rem', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                  id="event-image"
                />
                {errors.image && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.image}</p>}
              </div>
            </div>
            {form.image && /^https?:\/\//.test(form.image) && (
              <img
                src={form.image}
                alt="Preview"
                style={{ marginTop: '0.75rem', width: '100%', height: 140, objectFit: 'cover', borderRadius: '10px', border: '1px solid #DDE2F0' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </FormField>
        </div>
      </div>

      {/* Location & Date */}
      <div style={sectionStyle}>
        <h3 style={{ color: '#0B1E4A', margin: '0 0 1.25rem', fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Location & Schedule
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Location / City" required>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                className="input"
                placeholder="e.g. Mumbai, Maharashtra"
                id="event-location"
              />
              {errors.location && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.location}</p>}
            </FormField>
            <FormField label="Venue">
              <input
                type="text"
                value={form.venue}
                onChange={(e) => set('venue', e.target.value)}
                className="input"
                placeholder="e.g. Main Auditorium, Block A"
                id="event-venue"
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Start Date" required>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
                className="input"
                id="event-start-date"
              />
              {errors.startDate && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.startDate}</p>}
            </FormField>
            <FormField label="End Date" required>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
                className="input"
                id="event-end-date"
              />
              {errors.endDate && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.endDate}</p>}
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Start Time" required>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => set('startTime', e.target.value)}
                className="input"
                id="event-start-time"
              />
            </FormField>
            <FormField label="End Time" required>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
                className="input"
                id="event-end-time"
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Registration */}
      <div style={sectionStyle}>
        <h3 style={{ color: '#0B1E4A', margin: '0 0 1.25rem', fontSize: '1.0625rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Registration Details
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <FormField label="Registration Deadline" required>
              <input
                type="date"
                value={form.registrationDeadline}
                onChange={(e) => set('registrationDeadline', e.target.value)}
                className="input"
                id="event-deadline"
              />
              {errors.registrationDeadline && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.registrationDeadline}</p>}
            </FormField>
            <FormField label="Maximum Capacity" required>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => set('capacity', Number(e.target.value))}
                className="input"
                min={1}
                placeholder="e.g. 100"
                id="event-capacity"
              />
              {errors.capacity && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.capacity}</p>}
            </FormField>
          </div>

          <FormField label="Eligibility" hint="Leave blank if open to everyone">
            <input
              type="text"
              value={form.eligibility}
              onChange={(e) => set('eligibility', e.target.value)}
              className="input"
              placeholder="e.g. Open to all undergraduate students"
              id="event-eligibility"
            />
          </FormField>

          <FormField label="External Registration Link" hint="If participants should register on an external site">
            <input
              type="url"
              value={form.registrationLink}
              onChange={(e) => set('registrationLink', e.target.value)}
              className="input"
              placeholder="https://forms.google.com/..."
              id="event-reg-link"
            />
            {errors.registrationLink && <p style={{ color: '#9A2A2A', fontSize: '0.75rem', margin: '0.25rem 0 0', fontWeight: 600 }}>{errors.registrationLink}</p>}
          </FormField>
        </div>
      </div>

      {/* Info note */}
      <div
        style={{
          display: 'flex',
          gap: '0.625rem',
          background: '#EFF1F9',
          border: '1px solid #DDE2F0',
          borderRadius: 14,
          padding: '0.875rem 1rem',
          color: '#5B6487',
          fontSize: '0.8125rem',
          marginBottom: '1.5rem',
          fontWeight: 500,
        }}
      >
        <Info size={16} style={{ color: '#2E58D7', flexShrink: 0, marginTop: 1 }} />
        Your event will be submitted for admin review. Once approved, it will be visible to students.
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary"
        style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}
        id="submit-event-btn"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            Saving...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
};

export default EventForm;
