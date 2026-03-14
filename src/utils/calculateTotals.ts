import type { PERTTaskResult } from '@/types';

export const calculateTotalVariance = (tasks: PERTTaskResult[]): number => {
    const total = tasks.reduce((sum, task) => sum + (task.variance || 0), 0);
    return Number(total.toFixed(3));
};

export const calculateTotalExpectedTime = (tasks: PERTTaskResult[]): number => {
    const total = tasks.reduce((sum, task) => sum + (task.expectedTime || 0), 0);
    return Number(total.toFixed(3));
};