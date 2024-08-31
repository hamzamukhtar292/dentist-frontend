import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axiosInstance from '../api/api';

// Define types for the responses and request payloads
interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface LoginResponse {
  token: string;
  userId: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const useLogin = (): UseMutationResult<LoginResponse, Error, LoginPayload> => {
  const mutationResult = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', payload);
      return response.data;
    },
  });

  return mutationResult;
};