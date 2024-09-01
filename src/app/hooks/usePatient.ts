import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axiosInstance from '../api/api';

// Define types fid: uuid("id").primaryKey().defaultRandom().unique(), // set as primary key

interface Patient {
    name: string;
    phoneNumber: number;
    age: number;
    address: string;
    todayTurn: number
}

export const usePatient = (): UseMutationResult< Error, any> => {
  const mutationResult = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post<any>('/api/create-patient', payload);
      return response.data;
    },
  });

  return mutationResult;
};