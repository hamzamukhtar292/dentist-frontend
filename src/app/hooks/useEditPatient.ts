import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axiosInstance from '../api/api';

export const useEditPatient = (): UseMutationResult<any, Error, any> => {
  const mutationResult = useMutation({
    mutationFn: async (payload: { id: string; data: any }) => {
      const { id, data } = payload;
      console.log({data});
      const response = await axiosInstance.put<any>(`/api/patient/${id}`, data);
      return response.data;
    },
  });

  return mutationResult;
};
