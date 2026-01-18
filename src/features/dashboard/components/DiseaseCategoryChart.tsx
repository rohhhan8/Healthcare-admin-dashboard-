/**
 * DiseaseCategoryChart - Horizontal bar chart for disease categories
 * 
 * Shows patient distribution by disease/condition using Chart.js.
 * Includes data labels on bars for better visibility.
 * 
 * @feature dashboard
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';
import { Card, CardHeader, CardContent } from '../../../shared/ui';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface DiseaseDataItem {
  name: string;
  value: number;
}

interface DiseaseCategoryChartProps {
  data: DiseaseDataItem[];
}

// Theme-consistent color palette for condition chart
const CONDITION_COLORS: Record<string, string> = {
  Critical: '#112D4E',   // Navy
  Chronic: '#3F72AF',    // Primary Blue
  Acute: '#2AB7A6',      // Teal
  Flu: '#5A7A9A',        // Slate Blue
  Routine: '#4A9E8F',    // Muted Teal
};

export function DiseaseCategoryChart({ data }: DiseaseCategoryChartProps) {
  const totalPatients = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Patients',
        data: data.map(d => d.value),
        backgroundColor: data.map(d => CONDITION_COLORS[d.name] || '#3B82F6'),
        borderColor: data.map(d => CONDITION_COLORS[d.name] || '#3B82F6'),
        borderWidth: 0,
        borderRadius: 6,
        barThickness: 22,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        right: 40,
        left: 0,
        top: 0,
        bottom: 0
      },
    },
    plugins: {
      legend: {
        display: false,
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
        callbacks: {
          label: (context: { raw: unknown; dataIndex: number }) => {
            const item = data[context.dataIndex];
            const percentage = totalPatients > 0 
              ? Math.round((item.value / totalPatients) * 100) 
              : 0;
            return `${item.value} patients (${percentage}%)`;
          },
        },
      },
      // Data labels on bars
      datalabels: {
        anchor: 'end' as const,
        align: 'end' as const,
        offset: 4,
        font: {
          family: "'Satoshi', sans-serif",
          size: 11,
          weight: 600,
        },
        color: '#64748b', // Gray that works in both themes
        formatter: (value: number) => value,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Satoshi', sans-serif",
            size: 11,
            weight: 600,
          },
          color: '#94a3b8', // Slate gray - visible in both themes
          crossAlign: 'far' as const,
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="kpi-card disease-chart-card">
      <CardHeader 
        title="Patients by Condition" 
        action={<span className="chart-total">Total: {totalPatients}</span>}
      />
      <CardContent className="chart-content-fill">
        <div className="horizontal-bar-chart">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
