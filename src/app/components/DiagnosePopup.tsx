// src/components/Popup.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import cross from '../../../public/cross.svg'; // Adjust the path as needed
import { usePatient } from '../hooks/usePatient';
import { toast } from 'react-toastify';
import axiosInstance from '../api/api';
import { useQuery } from '@tanstack/react-query';
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  patientData?: any; // Make patientData optional
}

const DiagnosePopup: React.FC<PopupProps> = ({ isOpen, onClose, patientData }) => {
  const [diagnose, setDiagnose] = useState('');
  const [detailedDiagnose, setDetailedDiagnose] = useState('');
  const [treatment, setTreatment] = useState('');
  const [doctor, setDoctor] = useState('');
  const { mutate, data, error, status, isError, isSuccess } = usePatient();

  const fetchDoctorsData = async () => {
    const response = await axiosInstance.get(`${baseURL}/api/doctors`);
    return response.data;
  };

  // UseQuery for Fetching User Data
  const { isLoading: isDoctorLoading, isError: isDoctorError, data: doctorsData, error: doctorError } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctorsData,
  });
console.log({doctorsData});
  useEffect(() => {
    if (patientData) {
      setDiagnose(patientData.diagnose || '');
      setDetailedDiagnose(patientData.detailedDiagnose || '');
      setTreatment(patientData.treatment || '');
      setDoctor(patientData.doctor)
    }
  }, [patientData]); // Run this effect when patientData changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, diagnose, detailedDiagnose, treatment });
    toast.success("Added diagnose details");
    onClose()
  };

  if (isSuccess && data) {
    console.log(data);
  }

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
        <h2 className="text-2xl font-bold mb-4 text-main">Add Treatment</h2>
        <div className='w-full space-y-3'>
          <label htmlFor="phoneNumber" className="block w-full text-sm font-medium text-grey3 mb-2">
            Doctor detail
          </label>
          <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full p-3 rounded-md border-none bg-inputMain text-main"
          >
            <option value="" disabled>Select a doctor</option>
            {doctorsData.map((doctor:any) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
          <label htmlFor="address" className="block w-full text-sm font-medium text-grey3 mb-2">
            Diagnose
          </label>

          <input
            type="text"
            value={diagnose}
            onChange={(e) => setDiagnose(e.target.value)}
            placeholder="Diagnose"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
          />

          <label htmlFor="detailedDiagnose" className="block text-sm font-medium text-grey3 mb-2">
            Detailed Diagnose
          </label>
          <textarea
            value={detailedDiagnose}
            onChange={(e) => setDetailedDiagnose(e.target.value)}
            placeholder="Enter detailed diagnose"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
            rows={4}
          ></textarea>
          <label htmlFor="treatment" className="block text-sm font-medium text-grey3 mb-2">
            Treatment
          </label>
          <textarea
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Enter treatment details"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
            rows={4}
          ></textarea>
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="bg-grey2 text-white hover:bg-grey4 w-52 p-2 rounded mt-2"
          >
            Add treatment
          </button>
        </div>
      </div>
      </div>
      );
};

      export default DiagnosePopup;
