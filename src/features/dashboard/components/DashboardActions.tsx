/**
 * DashboardActions - Title row with date range selector
 * 
 * Contains title, date range selector (Week/Month/Year), and export buttons.
 * 
 * @feature dashboard
 */

import { Button, DocumentIcon, DownloadIcon } from '../../../shared/ui';

// Date Range type
type DateRange = 'this-week' | 'this-month' | 'this-year';

interface DashboardActionsProps {
  dateRange: DateRange;
  onDateRangeChange: (value: DateRange) => void;
  onExportCSV: () => void;
  onDownloadReport: () => void;
}

const DATE_RANGE_OPTIONS: { value: DateRange; label: string }[] = [
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'this-year', label: 'This Year' },
];

export function DashboardActions({
  dateRange,
  onDateRangeChange,
  onExportCSV,
  onDownloadReport,
}: DashboardActionsProps) {
  return (
    <div className="dashboard-title-row">
      <h1 className="page-title">Dashboard</h1>
      <div className="dashboard-actions">
        {/* Date Range Tabs */}
        <div className="date-range-tabs">
          {DATE_RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`date-range-tab ${dateRange === option.value ? 'active' : ''}`}
              onClick={() => onDateRangeChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <Button variant="secondary" icon={<DocumentIcon />} onClick={onExportCSV}>
          Export CSV
        </Button>
        <Button variant="primary" icon={<DownloadIcon />} onClick={onDownloadReport}>
          Download Report
        </Button>
      </div>
    </div>
  );
}
