/**
 * AgeCostKPI - Average cost by age group treemap (INR)
 * 
 * Displays a treemap-style visualization of treatment costs by age group.
 * Uses API data with date range filtering.
 * 
 * @feature dashboard
 */

import { Card, CardHeader, CardContent } from '../../../shared/ui';
import type { AgeCostData } from '../api';

interface AgeCostKPIProps {
  data: AgeCostData[];
}

export function AgeCostKPI({ data }: AgeCostKPIProps) {
  // Calculate total for proportional sizing
  const totalPatients = data.reduce((sum, d) => sum + d.patientCount, 0);

  // Format cost as INR currency
  const formatCost = (cost: number) => {
    if (cost >= 100000) {
      return `₹${(cost / 100000).toFixed(1)}L`;
    } else if (cost >= 1000) {
      return `₹${(cost / 1000).toFixed(1)}K`;
    }
    return `₹${cost}`;
  };

  return (
    <Card className="kpi-card">
      <CardHeader title="Avg Treatment Cost by Age (INR)" />
      <CardContent>
        <div className="treemap-container">
          {data.map((item, index) => {
            // Calculate relative size based on patient count
            const sizePercent = totalPatients > 0 
              ? (item.patientCount / totalPatients) * 100 
              : 20;
            
            return (
              <div
                key={item.ageGroup}
                className={`treemap-item treemap-item-${index}`}
                style={{
                  backgroundColor: item.color,
                  flex: sizePercent > 20 ? '1 1 45%' : '1 1 30%',
                }}
              >
                <span className="treemap-label">{item.ageGroup}</span>
                <span className="treemap-value">{formatCost(item.avgCost)}</span>
                <span className="treemap-count">{item.patientCount} patients</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
