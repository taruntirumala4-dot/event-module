import React from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const EventSearch: React.FC<Props> = ({
  value,
  onChange,
  placeholder = 'Search events by title, description or location...',
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <Search
        size={16}
        style={{
          position: 'absolute',
          left: '0.875rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#7C849E',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input"
        style={{
          paddingLeft: '2.5rem',
          paddingRight: value ? '2.5rem' : '0.875rem',
          borderRadius: '999px',
          background: '#FFFFFF',
          border: '1px solid #DDE2F0',
          boxShadow: '0 2px 8px rgba(11, 30, 74, 0.04)',
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#7C849E',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
          }}
          aria-label="Clear search"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default EventSearch;
