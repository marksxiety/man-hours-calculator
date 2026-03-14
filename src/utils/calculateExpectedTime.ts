import type { NewTask } from '@/types';
import { PERT_WEIGHT_DIVISOR } from './constants';

export const calculateExpectedTime = (task: NewTask): number => {
  const { optimistic, mostLikely, pessimistic } = task;
  return (optimistic + 4 * mostLikely + pessimistic) / PERT_WEIGHT_DIVISOR;
};