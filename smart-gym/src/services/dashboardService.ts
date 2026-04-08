import axiosClient from '../api/axiosClient';

export const getDashboardSummary = async () => {
    const response = await axiosClient.get('dashboard/summary');
    return response.data;
};

export const getQuickWorkouts = async () => {
    const response = await axiosClient.get('dashboard/quick-workouts');
    return response.data;
};
