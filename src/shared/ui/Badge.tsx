/**
 * Badge - Shared badge component
 * 
 * Status badges for displaying states.
 * 
 * @shared
 */

interface BadgeProps {
  status: 'confirmed' | 'pending' | 'cancelled' | 'success' | 'warning' | 'danger';
  children: string;
}

export function Badge({ status, children }: BadgeProps) {
  return (
    <span className={`badge badge-${status}`}>
      {children}
    </span>
  );
}
