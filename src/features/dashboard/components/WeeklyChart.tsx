/**
 * ComparisonChart - Comparison line chart (Zigzag style)
 * 
 * Shows current period vs previous period appointments using Chart.js.
 * Adapts labels based on date range (week/month/year).
 * 
 * @feature dashboard
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Card, CardHeader, CardContent } from '../../../shared/ui';
import type { ChartData, ComparisonStats, DateRange } from '../api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyChartProps {
  data: ChartData & ComparisonStats;
  clinicName?: string;
  dateRange?: DateRange;
}

// Get labels based on date range
const getLabels = (dateRange: DateRange = 'this-week') => {
  switch (dateRange) {
    case 'this-week':
      return { current: 'This Week', previous: 'Last Week', title: 'Weekly Overview' };
    case 'this-month':
      return { current: 'This Month', previous: 'Last Month', title: 'Monthly Overview' };
    case 'this-year':
      return { current: 'This Year', previous: 'Last Year', title: 'Yearly Overview' };
    default:
      return { current: 'Current', previous: 'Previous', title: 'Overview' };
  }
};

export function WeeklyChart({ data, clinicName, dateRange = 'this-week' }: WeeklyChartProps) {
  const labels = getLabels(dateRange);

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: labels.current,
        data: data.current,
        borderColor: '#3F72AF', // Primary Blue
        backgroundColor: 'rgba(63, 114, 175, 0.1)',
        fill: true,
        tension: 0, // Zigzag - no curve
        pointRadius: 6,
        pointBackgroundColor: '#3F72AF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
      {
        label: labels.previous,
        data: data.previous,
        borderColor: '#2AB7A6', // Teal
        backgroundColor: 'rgba(42, 183, 166, 0.1)',
        fill: true,
        tension: 0, // Zigzag - no curve
        pointRadius: 6,
        pointBackgroundColor: '#2AB7A6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: "'Satoshi', sans-serif",
            size: 12,
            weight: 500,
          },
          color: '#64748b', // Works in both themes
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 45, 78, 0.95)',
        titleFont: {
          family: "'Satoshi', sans-serif",
          size: 13,
          weight: 600,
        },
        bodyFont: {
          family: "'Satoshi', sans-serif",
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: { dataset: { label?: string }; raw: unknown }) => 
            `${context.dataset.label}: ${context.raw} patients`,
        },
      },
      // Disable data labels on line chart
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Satoshi', sans-serif",
            size: 11,
            weight: 500,
          },
          color: '#64748b',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: "'Satoshi', sans-serif",
            size: 11,
          },
          color: '#64748b',
        },
      },
    },
  };

  const title = clinicName 
    ? `${labels.title} - ${clinicName}` 
    : labels.title;

  const changeIcon = data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→';
  const changeClass = data.trend === 'up' ? 'positive' : data.trend === 'down' ? 'negative' : '';

  return (
    <Card className="chart-card weekly-chart-card">
      <CardHeader 
        title={title}
        action={
          <div className="chart-summary">
            <span className="summary-item current">
              <span className="dot"></span>
              {labels.current}: {data.value}
            </span>
            <span className="summary-item previous">
              <span className="dot"></span>
              {labels.previous}: {data.previousValue}
            </span>
            <span className={`summary-change ${changeClass}`}>
              {changeIcon} {Math.abs(data.percentageChange)}%
            </span>
          </div>
        }
      />
      <CardContent>
        <div className="weekly-line-chart">
          <Line data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
