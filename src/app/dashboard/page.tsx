// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '../api/api';
import Header from '../components/Header';
import Popup from '../components/Popup';
import EditPopup from '../components/EditPopup';
import DiagnosePopup from '../components/DiagnosePopup';
import Image from 'next/image';
import plus from '../../../public/plus.svg';
import edit from '../../../public/edit.svg';
import moment from 'moment';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface Patient {
  id: string;
  name: string;
  turnNumber: number;
  date: string;
  age: string;
  address: string;
  phoneNumber: number;
}

export default function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null); // State for the selected patient
  const [isDiagnose, setIsDiagnose] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null); // State for the selected patient ID

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Ensure the user is redirected to login if not authenticated
    }
  }, [isAuthenticated, router]);

  const userId = localStorage.getItem('userId');
  const fetchUserData = async () => {
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axiosInstance.get(`${baseURL}/api/user/${userId}`);
    return response.data;
  };

  // UseQuery for Fetching User Data
  const { isLoading: isUserLoading, isError: isUserError, data: userData, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    enabled: !!userId, // Only run if userId is available
  });

  const fetchPatients = async () => {
    const response = await axiosInstance.get(`${baseURL}/api/patients/today`);
    return response.data;
  };

  const { isLoading: isPatientsLoading, isError: isPatientsError, data: patientsData, error: patientsError } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
  });

  if (isUserLoading || isPatientsLoading) {
    return <span>Loading...</span>;
  }

  if (isUserError) {
    return <span>Error loading user data: {userError.message}</span>;
  }
  if (isPatientsError) {
    return <span>Error loading patients data: {patientsError.message}</span>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent the row click event from firing
    const patient = patientsData?.find((p: Patient) => p.id === id); // Find the patient by id
    setSelectedPatient(patient); // Set the selected patient data
    setOpenEdit(true);
  };

  const handleRowClick = (id: string) => {
    // Set the selected patient ID and open the diagnose popup
    setSelectedPatientId(id);
    setIsDiagnose(true);
  };

  return (
    <>
      <Header user={userData} />
      <div className="flex font-poppins flex-col min-h-screen bg-base2 py-4 px-10">
        <div className="flex flex-row justify-end">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="mb-4 p-2 bg-black w-52 text-xl text-main text-medium items-center flex justify-center gap-x-3 rounded"
          >
            <Image src={plus} alt="Add Patient" width={16} height={16} />
            Add Patient
          </button>
        </div>

        {/* Patients Table */}
        <div className="w-full">
          <div className="flex flex-row items-center gap-x-5">
            <h2 className="text-xl mb-3 text-main">Patients for Today:</h2>
            <h2 className="text-body1 mb-3 text-main1">{moment().format('MMMM Do YYYY')}</h2>
          </div>

          {patientsData?.length > 0 ? (
            <table className="min-w-full bg-base border border-borderBase">
              <thead>
                <tr className="border-b border-borderBase text-left">
                  <th className="py-2 px-4">
                    <h3 className="text-main text-grey4">Turn Number</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-main text-grey4">Name</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-main text-grey4">Age</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-main text-grey4">Address</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-main text-grey4">Cell number</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-main text-grey4">Edit</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientsData?.map((patient: Patient) => (
                  <tr key={patient.id} onClick={() => handleRowClick(patient.id)} className="border-b border-borderBase">
                    <td className="py-2 px-4">
                      <h3 className="text-main">{patient.turnNumber}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{patient.name}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{patient.age}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{patient.address}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{patient.phoneNumber}</h3>
                    </td>
                    <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleEdit(e, patient.id)} // Pass the event and id
                        className="p-1"
                        aria-label="Edit"
                      >
                        <Image src={edit} alt="Edit" width={20} height={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No patients for today.</p>
          )}
        </div>
      </div>

      {/* Add Patient Popup */}
      <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />

      {/* Edit Patient Popup */}
      {selectedPatient && (
        <EditPopup
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          patientData={selectedPatient} // Pass selected patient data
        />
      )}

      {/* Diagnose Popup */}
      <DiagnosePopup isOpen={isDiagnose} onClose={() => setIsDiagnose(false)} patientId={selectedPatientId} />
    </>
  );
}
