'use client';

import { useId, type ReactNode } from 'react';

export type DocumentVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface DocumentStatusBadgeProps {
  status: DocumentVerificationStatus;
  /** Shown in a hover/focus tooltip when status is REJECTED. */
  rejectionReason?: string;
  className?: string;
}

interface StatusConfig {
  label: string;
  badgeClass: string;
  icon: ReactNode;
}

const STATUS_CONFIG: Record<DocumentVerificationStatus, StatusConfig> = {
  PENDING: {
    label: 'Pending',
    badgeClass: 'badge-yellow',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
      </svg>
    ),
  },
  VERIFIED: {
    label: 'Verified',
    badgeClass: 'badge-green',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  REJECTED: {
    label: 'Rejected',
    badgeClass: 'badge-red',
    icon: (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

/**
 * Reusable badge mapping a document's verification status to a distinct
 * color/icon. When REJECTED with a `rejectionReason`, the badge shows the
 * reason in a hover (and keyboard-focus) tooltip.
 */
export default function DocumentStatusBadge({
  status,
  rejectionReason,
  className = '',
}: DocumentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const tooltipId = useId();
  const showTooltip = status === 'REJECTED' && Boolean(rejectionReason);

  return (
    <span className={`relative inline-flex ${showTooltip ? 'group' : ''} ${className}`}>
      <span
        className={config.badgeClass}
        aria-describedby={showTooltip ? tooltipId : undefined}
        tabIndex={showTooltip ? 0 : undefined}
      >
        {config.icon}
        {config.label}
      </span>

      {showTooltip && (
        <span
          id={tooltipId}
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-xs -translate-x-1/2
                     rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg
                     transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {rejectionReason}
          <span
            aria-hidden="true"
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"
          />
        </span>
      )}
    </span>
  );
}
