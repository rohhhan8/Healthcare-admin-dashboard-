/**
 * Typed Redux Hooks
 * 
 * Pre-typed versions of useDispatch and useSelector for type-safe Redux usage.
 * 
 * @architectural-rules
 * - Export only typed hooks
 * - Use throughout app instead of plain useDispatch/useSelector
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed dispatch hook
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Typed selector hook
export const useAppSelector = useSelector.withTypes<RootState>();
