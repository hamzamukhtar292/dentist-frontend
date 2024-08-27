// src/app/dashboard/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';

const fetchUserData = async () => {
  const response = await axios.get('/api/user-data');
  return response.data;
};

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const { data, error, isLoading } = useQuery(['userData'], fetchUserData);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, </p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
