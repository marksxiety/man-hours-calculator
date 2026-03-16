import type { NewTask } from '@/types';
import { PERT_SIGMA_DIVISOR } from './constants';

export const calculateStandardDeviation = (task: NewTask): number => {
  const { optimistic, pessimistic } = task;
  const o = optimistic ?? 0;
  const p = pessimistic ?? 0;
  return (p - o) / PERT_SIGMA_DIVISOR;
};