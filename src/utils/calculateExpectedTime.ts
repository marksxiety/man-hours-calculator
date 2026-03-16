import type { NewTask } from '@/types';
import { PERT_WEIGHT_DIVISOR } from './constants';

export const calculateExpectedTime = (task: NewTask): number => {
  const { optimistic, mostLikely, pessimistic } = task;
  const o = optimistic ?? 0;
  const m = mostLikely ?? 0;
  const p = pessimistic ?? 0;
  return (o + 4 * m + p) / PERT_WEIGHT_DIVISOR;
};