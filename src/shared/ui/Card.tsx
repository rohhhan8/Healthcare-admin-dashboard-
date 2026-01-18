/**
 * Card - Shared card component
 * 
 * Reusable card container with optional header.
 * 
 * @shared
 */

import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className="card-header">
      <h3>{title}</h3>
      {action}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={`card-content ${className}`}>
      {children}
    </div>
  );
}
