import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axiosInstance from '../api/api';

export const useStaff = (): UseMutationResult< Error, any> => {
  const mutationResult = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post<any>('/api/create-users', payload);
      return response.data;
    },
  });

  return mutationResult;
};