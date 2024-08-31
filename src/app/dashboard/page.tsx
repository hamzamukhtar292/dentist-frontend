// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '../api/api';
import Header from '../components/Header';
import Popup from '../components/Popup';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
import Image from 'next/image';
import plus from '../../../public/plus.svg'; 
interface Patient {
  id: string;
  name: string;
  turnNumber: number;
  date: string; // Assuming you have a date field to filter by today's date
}

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [newPatientName, setNewPatientName] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Ensure the user is redirected to login if not authenticated
    }
  }, [isAuthenticated, router]);

  const userId = localStorage.getItem("userId")
  const fetchUserData = async () => {
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axiosInstance.get(`${baseURL}/api/user/${userId}`);
    return response.data;
  };
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    enabled: !!userId,
  })
  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // const fetchPatients = async () => {
  //   const response = await axiosInstance.get(`${baseURL}/api/patients`);
  //   return response.data;
  // };

  // const { isPending, isError, data, error } = useQuery({
  //   queryKey: ['patients'],
  //   queryFn: fetchPatients,
  // });

  // const addPatientMutation = useMutation(
  //   async (patientData: { name: string; age: number; phoneNumber: string; address: string }) => {
  //     const response = await axiosInstance.post(`${baseURL}/api/patients`, patientData);
  //     return response.data;
  //   },
  //   {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(['patients']);
  //       setIsPopupOpen(false); // Close the popup after successful addition
  //     },
  //   }
  // );

  const handleAddPatient = (patientData: { name: string; age: number; phoneNumber: string; address: string }) => {
    // addPatientMutation.mutate(patientData);
  };

  // if (isPending) {
  //   return <span>Loading...</span>;
  // }

  // if (isError) {
  //   return <span>Error: {error.message}</span>;
  // }

  if (!isAuthenticated) {
    return null;
  }

  // Filter patients for today
  const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  // const patientsToday = data?.filter((patient: Patient) => patient.date === today) || [];

  return (
    <>
      <Header  user={data}/>
      <div className="flex font-poppins flex-col items-center justify-center min-h-screen bg-base2 p-4">
        <h1 className="text-2xl mb-4">Dashboard</h1>
        <p className="mb-4">Welcome, </p>
        
        <button
          onClick={() => setIsPopupOpen(true)}
          className="mb-4 p-2 bg-black w-52 text-xl text-white text-medium items-center flex justify-center gap-x-3 rounded"
        >
          <Image src={plus} alt="Close" width={16} height={16} />

          Add Patient
        </button>

        {/* Patients Table */}
        <div className="w-full max-w-4xl">
          <h2 className="text-xl mb-2">Patients for Today</h2>
          {/* {patientsToday.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Turn Number</th>
                </tr>
              </thead>
              <tbody>
                {patientsToday.map((patient: Patient) => (
                  <tr key={patient.id}>
                    <td className="py-2 px-4 border-b">{patient.name}</td>
                    <td className="py-2 px-4 border-b">{patient.turnNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No patients for today.</p>
          )} */}
        </div>
       
      </div>

      <Popup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        onAddPatient={handleAddPatient} 
      />
    </>
  );
}
