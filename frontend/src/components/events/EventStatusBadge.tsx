import React from 'react';
import { EventStatus } from '../../types/event';
import { getStatusLabel } from '../../utils/eventUtils';

interface Props {
  status: EventStatus;
  size?: 'sm' | 'md';
}

const EventStatusBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const config: Record<EventStatus, { bg: string; text: string; dot: string; border: string }> = {
    PENDING: {
      bg: '#fef3c7',
      text: '#92400e',
      dot: '#d97706',
      border: '#fde68a',
    },
    APPROVED: {
      bg: '#dcfce7',
      text: '#166534',
      dot: '#16a34a',
      border: '#bbf7d0',
    },
    REJECTED: {
      bg: '#fee2e2',
      text: '#991b1b',
      dot: '#dc2626',
      border: '#fecaca',
    },
  };

  const { bg, text, dot, border } = config[status];
  const fontSize = size === 'sm' ? '0.7rem' : '0.75rem';
  const padding = size === 'sm' ? '0.2rem 0.5rem' : '0.25rem 0.625rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        background: bg,
        color: text,
        fontSize,
        fontWeight: 600,
        padding,
        borderRadius: '9999px',
        border: `1px solid ${border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: dot,
          flexShrink: 0,
        }}
      />
      {getStatusLabel(status)}
    </span>
  );
};

export default EventStatusBadge;
