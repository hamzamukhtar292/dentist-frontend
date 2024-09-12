// src/components/Popup.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import cross from '../../../public/cross.svg'; // Adjust the path as needed
import { usePatient } from '../hooks/usePatient';
import { toast } from 'react-toastify';
import { useEditPatient } from '../hooks/useEditPatient';
import { useQueryClient } from '@tanstack/react-query';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: any; // Make patientData optional
}

const EditPopup: React.FC<PopupProps> = ({ isOpen, onClose, patientData }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [todayTurn, setTodayTurn] = useState('');
  const { mutate, data, error, status, isError, isSuccess } = useEditPatient();
  const queryClient = useQueryClient();

  // UseEffect to set initial state values from patientData
  useEffect(() => {
    if (patientData) {
      setName(patientData.name || '');
      setAge(patientData.age || 0);
      setPhoneNumber(patientData.phoneNumber || '');
      setAddress(patientData.address || '');
      setTodayTurn(patientData.todayTurn || '');
    }
  }, [patientData]); // Run this effect when patientData changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({id:patientData.id, data:{name, age, phoneNumber, address, todayTurn }},{
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['today-patients'] });
      },
    });
    toast.success("Patient details updated");

  };

  if (!isOpen) return null;

  return (
    <div className="fixed font-inter inset-0 flex items-center justify-center backdrop-blur-md">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="xs:w-[345px] xs:px-[20px] xs:py-[20px] relative flex flex-col items-center justify-start gap-y-2 rounded-2xl border border-borderBase bg-base sm:w-[739px] lg:px-[40px] lg:py-[15px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="Close"
        >
          <Image src={cross} alt="Close" width={16} height={16} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-main">Edit Patient</h2>
        <div className='w-full space-y-3'>
          <label htmlFor="name" className="block text-sm font-medium text-grey3 mb-2">
            Enter patient's name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Patient name"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="age" className="block text-sm font-medium text-grey3 mb-2">
            Enter patient's age
          </label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            placeholder="Patient's age"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-grey3 mb-2">
            Enter patient phone number
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Patient's phone number"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="address" className="block text-sm font-medium text-grey3 mb-2">
            Enter patient's address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Patient's address"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="todayTurn" className="block text-sm font-medium text-grey3 mb-2">
            Enter patient's today turn
          </label>
          <input
            type="text"
            value={todayTurn}
            onChange={(e) => setTodayTurn(e.target.value)}
            placeholder="Patient's turn"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="bg-grey2 text-white hover:bg-grey4 w-52 p-2 rounded mt-2"
          >
            Edit Patient
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPopup;
