/**
 * AppointmentsTable - Scrollable appointments list with clinic name
 * 
 * Table showing appointments with patient, doctor, clinic, and status.
 * 
 * @feature dashboard
 */

import { Card, CardHeader, Badge, Button } from '../../../shared/ui';
import type { Appointment } from '../api';

interface AppointmentsTableProps {
  data: Appointment[];
  onViewAll?: () => void;
}

export function AppointmentsTable({ 
  data, 
  onViewAll,
}: AppointmentsTableProps) {
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get short clinic name
  const getShortClinicName = (clinicName: string) => {
    return clinicName.split(' ').slice(0, 2).join(' ');
  };

  // Status badge mapping
  const getStatusBadge = (status: Appointment['status']) => {
    const statusMap: Record<string, 'confirmed' | 'pending' | 'cancelled'> = {
      'Completed': 'confirmed',
      'Scheduled': 'pending',
      'Cancelled': 'cancelled',
    };
    return statusMap[status] || 'pending';
  };

  return (
    <Card className="table-card appointments-card">
      <CardHeader
        title="Appointment List"
        action={
          <div className="table-actions">
            <span className="record-count">{data.length} records</span>
            {onViewAll && (
              <Button variant="link" onClick={onViewAll}>
                View All
              </Button>
            )}
          </div>
        }
      />
      <div className="appointments-table-container">
        <table className="data-table appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Clinic</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((appointment) => (
              <tr key={appointment.id}>
                <td className="patient-cell">
                  <span className="patient-name">{appointment.patientName}</span>
                </td>
                <td className="doctor-cell">{appointment.doctorName}</td>
                <td className="clinic-cell">
                  <span className="clinic-tag">{getShortClinicName(appointment.clinicName)}</span>
                </td>
                <td className="date-cell">{formatDate(appointment.date)}</td>
                <td className="status-cell">
                  <Badge status={getStatusBadge(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
