/**
 * Table - Shared table component
 * 
 * Reusable data table with columns and data.
 * 
 * @shared
 */

import type { ReactNode } from 'react';

// ==========================================
// Types
// ==========================================

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
}

// ==========================================
// Component
// ==========================================

export function Table<T>({
  columns,
  data,
  keyField,
}: TableProps<T>) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={String(row[keyField])}>
            {columns.map((col) => {
              return (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? '')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
