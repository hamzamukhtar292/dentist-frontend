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
import Staff from '../types';
import EditStaff from '../components/EditStaff';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export default function AboutPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null); // State for the selected patient
  const [isDiagnose, setIsDiagnose] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null); // State for the selected patient ID

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

  const fetchStaff = async () => {
    const response = await axiosInstance.get(`${baseURL}/api/users`);
    return response.data;
  };

  const { isLoading: isPatientsLoading, isError: isPatientsError, data: staffData, error: patientsError } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff,
  });

  if (isUserLoading || isPatientsLoading) {
    return <span className='text-main'>Loading...</span>;
  }

  if (isUserError) {
    return <span className='text-error'>Error loading user data: {userError.message}</span>;
  }
  if (isPatientsError) {
    return <span className='text-error'>Error loading patients data: {patientsError.message}</span>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent the row click event from firing
    const staff = staffData?.find((p: Staff) => p.id === id); // Find the patient by id
    setSelectedStaff(staff); // Set the selected patient data
    setOpenEdit(true);
  };

  const handleRowClick = (id: string) => {
    setSelectedStaffId(id);
    setIsDiagnose(true);
  };
  return (
    <>
      <Header />
      <div className="flex font-poppins flex-col min-h-screen bg-base2 py-4 px-10">
        <div className="flex flex-row justify-end">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="mb-4 p-2 bg-black w-52 text-xl text-main text-medium items-center flex justify-center gap-x-3 rounded"
          >
            <Image src={plus} alt="Add Patient" width={16} height={16} />
            Add Staff
          </button>
        </div>
        {/* Patients Table */}
        <div className="w-full">
          <div className="flex flex-row items-center gap-x-5">
            <h2 className="text-xl mb-3 text-main">Total staff members</h2>
          </div>

          {staffData?.length > 0 ? (
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
                {staffData?.map((staff: Staff) => (
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
            <p>No data found</p>
          )}
        </div>
      </div>
      <AddStaff isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      {selectedStaff && (
        <EditStaff
          isOpen={openEdit}
          onClose={() => setOpenEdit(false)}
          staffData={selectedStaff} // Pass selected patient data
        />
      )}
    </>
  );
}
