// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '../api/api';
import Header from '../components/Header';
import EditPopup from '../components/EditPopup';
import Image from 'next/image';
import plus from '../../../public/plus.svg';
import edit from '../../../public/edit.svg';
import AddStaff from '../components/AddStaff';
import Staff, { Patient } from '../types';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AboutPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login'); // Ensure the user is redirected to login if not authenticated
    }
  }, [isAuthenticated, router]);

  const fetchPatientsData = async () => {
    const response = await axiosInstance.get(`${baseURL}/api/patients`);
    return response.data;
  };

  // UseQuery for Fetching User Data
  const { isLoading: isPatientsLoading, isError: isPatientsError, data: patientsData, error: patientsError } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatientsData,
  });

  if ( isPatientsLoading) {
    return <span className='text-main'>Loading...</span>;
  }

  if (isPatientsError) {
    return <span className='text-error'>Error loading patients data: {patientsError.message}</span>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent the row click event from firing
    const patient = patientsData?.find((p: Patient) => p.id === id); // Find the patient by id
  };

  const handleRowClick = (id: string) => {
  };

  return (
    <>
      <Header />
      <div className="flex font-poppins flex-col min-h-screen bg-base2 py-4 px-10">
        <div className="flex flex-row justify-end">
          <button
            className="mb-4 p-2 bg-black w-52 text-xl text-main text-medium items-center flex justify-center gap-x-3 rounded"
          >
            <Image src={plus} alt="Add Patient" width={16} height={16} />
           Filter data
          </button>
        </div>
        <div className="w-full">
          <div className="flex flex-row items-center gap-x-5">
            <h2 className="text-xl mb-3 text-main">Total staff members</h2>
          </div>

          {patientsData?.length > 0 ? (
            <table className="min-w-full bg-base border border-borderBase">
              <thead>
                <tr className="border-b border-borderBase rounded-2xl text-left bg-grey1">
                  <th className="py-2 px-4">
                    <h3 className=" text-grey4">Name</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className=" text-grey4">Email</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className=" text-grey4">Address</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-grey4">Cell number</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className="text-grey4">Role</h3>
                  </th>
                  <th className="py-2 px-4">
                    <h3 className=" text-grey4">Edit</h3>
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientsData?.map((staff: Staff) => (
                  <tr key={staff.id} onClick={() => handleRowClick(staff.id)} className="border-b border-borderBase rounded-3xl">
                    <td className="py-2 px-4">
                      <h3 className="text-main">{staff.name}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{staff.email}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{staff.address}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{staff.phoneNumber}</h3>
                    </td>
                    <td className="py-2 px-4">
                      <h3 className="text-main">{staff.role}</h3>
                    </td>
                    <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleEdit(e, staff.id)} // Pass the event and id
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
      {/* <AddStaff isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {selectedPatient && (
        <EditPopup
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          patientData={selectedPatient} // Pass selected patient data
        />
      )} */}
    </>
  );
}
