/**
 * RatingGauge - Animated rating gauge meter
 * 
 * Displays a large speedometer-style gauge with animated filled arc.
 * Takes up full component space.
 * 
 * @feature dashboard
 */

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '../../../shared/ui';

interface RatingGaugeProps {
  rating: number;
  maxRating?: number;
}

export function RatingGauge({ rating, maxRating = 5 }: RatingGaugeProps) {
  const [animatedRating, setAnimatedRating] = useState(0);

  // Animate the rating on mount and when it changes
  useEffect(() => {
    setAnimatedRating(0);
    const timer = setTimeout(() => {
      setAnimatedRating(rating);
    }, 100);
    return () => clearTimeout(timer);
  }, [rating]);

  // Determine rating label
  const getRatingLabel = (r: number) => {
    if (r >= 4.5) return 'Excellent';
    if (r >= 3.5) return 'Good';
    if (r >= 2.5) return 'Average';
    return 'Poor';
  };

  // Get color based on rating
  const getRatingColor = (r: number) => {
    if (r >= 4.5) return '#2AB7A6'; // Teal
    if (r >= 3.5) return '#3F72AF'; // Primary blue
    if (r >= 2.5) return '#F5CA7B'; // Yellow
    return '#112D4E'; // Navy
  };

  const currentColor = getRatingColor(animatedRating);

  return (
    <Card className="kpi-card rating-gauge-card">
      <CardHeader title="Overall Rating" />
      <CardContent className="chart-content-fill gauge-content">
        <div className="gauge-container-large">
          <svg viewBox="0 0 200 120" className="gauge-svg-large">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gaugeGradientLarge" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#112D4E" />
                <stop offset="50%" stopColor="#3F72AF" />
                <stop offset="100%" stopColor="#2AB7A6" />
              </linearGradient>
            </defs>
            
            {/* Background track (semi-circle) */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="var(--color-surface-alt, #e5e7eb)"
              strokeWidth="20"
              strokeLinecap="round"
            />
            
            {/* Animated filled arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradientLarge)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (animatedRating / maxRating) * 251.2}
              className="gauge-fill"
            />
            
            {/* Ticks (inner marks) */}
            {[1, 2, 3, 4].map((tick) => {
              const angle = (tick / 5) * Math.PI;
              const x1 = 100 - 68 * Math.cos(angle);
              const y1 = 100 - 68 * Math.sin(angle);
              const x2 = 100 - 75 * Math.cos(angle);
              const y2 = 100 - 75 * Math.sin(angle);
              return (
                <line
                  key={tick}
                  x1={x1} y1={y1}
                  x2={x2} y2={y2}
                  stroke="white"
                  strokeWidth="2"
                  opacity="0.5"
                />
              );
            })}

            {/* Needle */}
            <line
              x1="100" y1="100"
              x2="20" y2="100"
              stroke="#112D4E"
              strokeWidth="4"
              strokeLinecap="round"
              className="gauge-needle-large"
              style={{
                transformOrigin: '100px 100px',
                transform: `rotate(${(animatedRating / maxRating) * 180}deg)`
              }}
            />
            
            {/* Needle Center Cap */}
            <circle cx="100" cy="100" r="8" fill="#112D4E" />
          </svg>
          
          {/* Centered Value */}
          <div className="gauge-value-large">
            <span className="rating-number-large" style={{ color: currentColor }}>
              {animatedRating.toFixed(1)}
            </span>
            <span className="rating-max-large">/ {maxRating}</span>
          </div>
          <div className="gauge-label-large" style={{ color: currentColor }}>
            {getRatingLabel(animatedRating)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
