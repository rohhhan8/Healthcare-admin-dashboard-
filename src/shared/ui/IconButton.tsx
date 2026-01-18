/**
 * IconButton - Shared icon button component
 * 
 * Button containing only an icon with optional badge.
 * 
 * @shared
 */

import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  badge?: number;
  'aria-label': string;
}

export function IconButton({ icon, badge, className = '', ...props }: IconButtonProps) {
  return (
    <button className={`icon-btn ${className}`} {...props}>
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="notification-badge">{badge}</span>
      )}
    </button>
  );
}
