/**
 * StatCardWithSparkline - Enhanced stat card with mini trend chart
 * 
 * Displays stat value with an animated count-up effect and optional sparkline.
 * 
 * @shared ui
 */

import { useEffect, useState, useRef, type ReactNode } from 'react';
import { Card } from './Card';

interface SparklineData {
  values: number[];
  labels?: string[];
}

interface StatCardWithSparklineProps {
  icon: ReactNode;
  iconColor: 'primary' | 'success' | 'warning' | 'purple';
  label: string;
  value: number;
  description?: string;
  sparklineData?: SparklineData;
  showSparkline?: boolean;
}

// Count-up animation hook
function useCountUp(target: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));
      
      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrame.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [target, duration]);

  return count;
}

// Mini sparkline SVG component - zigzag style
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const height = 80;
  const width = 300;
  const paddingX = 0;
  const paddingY = 10;
  
  // Generate zigzag path using straight lines
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - paddingX * 2) + paddingX;
    const y = height - ((value - min) / range) * (height - paddingY * 2) - paddingY;
    return { x, y };
  });
  
  // Create straight line path (zigzag)
  const linePath = points.map((p, i) => 
    i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`
  ).join(' ');
  
  // Area path (closes to bottom)
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  
  const gradientId = `sparkGrad-${color.replace('#', '')}`;

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="sparkline-svg-improved"
      preserveAspectRatio="none"
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="60%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
      />
      
      {/* Line - zigzag */}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Color mapping
const COLOR_MAP: Record<string, string> = {
  primary: '#3F72AF',
  success: '#2AB7A6',
  warning: '#5A7A9A',
  purple: '#112D4E',
};

export function StatCardWithSparkline({
  icon,
  iconColor,
  label,
  value,
  description,
  sparklineData,
  showSparkline = false,
}: StatCardWithSparklineProps) {
  const animatedValue = useCountUp(value);
  const sparkColor = COLOR_MAP[iconColor] || '#3F72AF';

  return (
    <Card className="stat-card stat-card-with-chart">
      {/* Top Row: Label + Small Icon */}
      <div className="stat-chart-header">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon-mini ${iconColor}-icon-mini`}>{icon}</span>
      </div>
      
      {/* Value + Description */}
      <div className="stat-chart-value">
        <span className="stat-value-large animated-value">{animatedValue.toLocaleString()}</span>
        {description && <span className="stat-description-inline">{description}</span>}
      </div>
      
      {/* Full-width Sparkline at Bottom */}
      {showSparkline && sparklineData && (
        <div className="stat-sparkline-full">
          <Sparkline data={sparklineData.values} color={sparkColor} />
        </div>
      )}
    </Card>
  );
}

// Simple count-up only card (for Staff/Clinics)
interface StatCardWithCountUpProps {
  icon: ReactNode;
  iconColor: 'primary' | 'success' | 'warning' | 'purple';
  label: string;
  value: number;
  description?: string;
}

export function StatCardWithCountUp({
  icon,
  iconColor,
  label,
  value,
  description,
}: StatCardWithCountUpProps) {
  const animatedValue = useCountUp(value);
  const iconColorClass = `stat-icon ${iconColor}-icon`;

  return (
    <Card className="stat-card stat-card-animated">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <span className={iconColorClass}>{icon}</span>
      </div>
      <div className="stat-value animated-value">{animatedValue.toLocaleString()}</div>
      {description && <p className="stat-description">{description}</p>}
    </Card>
  );
}
