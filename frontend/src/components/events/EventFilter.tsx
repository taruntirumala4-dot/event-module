import React from 'react';
import { EventCategory, EventMode } from '../../types/event';
import { getCategoryLabel, getModeLabel, EVENT_CATEGORIES, EVENT_MODES } from '../../utils/eventUtils';
import { Filter, X } from 'lucide-react';

interface FilterState {
  category: EventCategory | '';
  mode: EventMode | '';
  location: string;
  date: string;
}

interface Props {
  filters: FilterState;
  onChange: (filters: Partial<FilterState>) => void;
  onClear: () => void;
}

const EventFilter: React.FC<Props> = ({ filters, onChange, onClear }) => {
  const hasFilters = filters.category || filters.mode || filters.location || filters.date;

  const selectStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    color: '#1e293b',
    padding: '0.5rem 0.75rem',
    fontSize: '0.8125rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  };

  return (
    <div
      style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569', fontSize: '0.875rem', fontWeight: 600 }}>
          <Filter size={15} />
          Filters
        </div>
        {hasFilters && (
          <button
            onClick={onClear}
            className="btn btn-secondary"
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.5rem' }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
        {/* Category */}
        <div>
          <label className="label">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value as EventCategory | '' })}
            style={selectStyle}
            className="input"
          >
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {getCategoryLabel(c)}
              </option>
            ))}
          </select>
        </div>

        {/* Mode */}
        <div>
          <label className="label">Mode</label>
          <select
            value={filters.mode}
            onChange={(e) => onChange({ mode: e.target.value as EventMode | '' })}
            style={selectStyle}
            className="input"
          >
            <option value="">All Modes</option>
            {EVENT_MODES.map((m) => (
              <option key={m} value={m}>
                {getModeLabel(m)}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="label">Location</label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="City or venue"
            className="input"
          />
        </div>

        {/* Date */}
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className="input"
          />
        </div>
      </div>
    </div>
  );
};

export default EventFilter;
