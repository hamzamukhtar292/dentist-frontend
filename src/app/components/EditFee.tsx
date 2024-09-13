// src/components/Popup.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import cross from '../../../public/cross.svg'; // Adjust the path as needed
import { usePatient } from '../hooks/usePatient';
import { toast } from 'react-toastify';
import { useEditPatient } from '../hooks/useEditPatient';
import { useQueryClient } from '@tanstack/react-query';
import { useFee } from '../hooks/useFee';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: any; // Make patientData optional
}

const EditFee: React.FC<PopupProps> = ({ isOpen, onClose, patientData }) => {
  const [checkupFee, setCheckupFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [initialAmount, setInitialAmount] = useState(0);
  const { mutate, data, error, status, isError, isSuccess } = useFee();
  const queryClient = useQueryClient();

  // UseEffect to set initial state values from patientData
  useEffect(() => {
    if (patientData) {
      setCheckupFee(patientData.checkUpFee || 0);
      setTotalAmount(patientData.totalAmount || 0);
      setRemainingAmount(patientData.amountRemaining || 0);
      setInitialAmount(patientData.initialAmountPaid || 0);
    }
  }, [patientData]); // Run this effect when patientData changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({patientId:patientData.id, checkUpFee:checkupFee, totalAmount, amountRemaining:remainingAmount, initialAmountPaid:initialAmount },{
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
        <h2 className="text-2xl font-bold mb-4 text-main">Fee Details</h2>
        <div className='w-full space-y-3'>
          <label htmlFor="name" className="block text-sm font-medium text-grey3 mb-2">
            Enter checkup fee
          </label>
          <input
            type="text"
            value={checkupFee}
            onChange={(e) => setCheckupFee(Number(e.target.value))}
            placeholder="Checkup fee"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="age" className="block text-sm font-medium text-grey3 mb-2">
            Enter total treatment amount
          </label>
          <input
            type="text"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            placeholder="Total amount"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-grey3 mb-2">
            Enter initial amount paid
          </label>
          <input
            type="text"
            value={initialAmount}
            onChange={(e) => setInitialAmount(Number(e.target.value))}
            placeholder="Initial amount"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
          <label htmlFor="address" className="block text-sm font-medium text-grey3 mb-2">
            Enter remaining amount
          </label>
          <input
            type="Remaining amount"
            value={remainingAmount}
            onChange={(e) => setRemainingAmount(Number(e.target.value))}
            placeholder="Patient's address"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />
        </div>
        <div>
          <button
            onClick={handleSubmit}
            className="bg-grey2 text-white hover:bg-grey4 w-52 p-2 rounded mt-2"
          >
            Edit patient fee
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFee;
