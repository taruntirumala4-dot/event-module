import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total: number;
  limit: number;
}

const EventPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange, total, limit }) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btnStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    width: 38,
    height: 38,
    borderRadius: '999px',
    border: active ? 'none' : '1px solid #DDE2F0',
    background: active ? '#2E58D7' : '#FFFFFF',
    color: active ? '#FFFFFF' : disabled ? '#7C849E' : '#0B1E4A',
    fontWeight: 700,
    fontSize: '0.875rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    boxShadow: active ? '0 4px 12px rgba(46, 88, 215, 0.25)' : '0 2px 6px rgba(11, 30, 74, 0.04)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '2rem' }}>
      <p style={{ color: '#5B6487', fontSize: '0.8125rem', margin: 0 }}>
        Showing <strong style={{ color: '#0B1E4A' }}>{start}–{end}</strong> of{' '}
        <strong style={{ color: '#0B1E4A' }}>{total}</strong> events
      </p>
      <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={btnStyle(false, currentPage === 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} style={{ color: '#475569', padding: '0 0.25rem' }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              style={btnStyle(p === currentPage)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={btnStyle(false, currentPage === totalPages)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default EventPagination;
