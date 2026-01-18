/**
 * Input - Shared input components
 * 
 * Reusable input elements.
 * 
 * @shared
 */

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

// ==========================================
// Search Input
// ==========================================

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
}

export function SearchInput({ icon, className = '', ...props }: SearchInputProps) {
  return (
    <div className={`search-container ${className}`}>
      {icon}
      <input type="text" className="search-input" {...props} />
    </div>
  );
}

// ==========================================
// Select
// ==========================================

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
}

export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <select className={`select ${className}`} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
