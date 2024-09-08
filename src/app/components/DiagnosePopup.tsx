import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import cross from '../../../public/cross.svg'; // Adjust the path as needed
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/api';
import { useEditPatient } from '../hooks/useEditPatient';
import { toast } from 'react-toastify';
import moment from 'moment'; // Import moment for date formatting
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
; (pdfMake as any).vfs = pdfFonts.pdfMake.vfs
// @ts-ignore
pdfMake.fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
            'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },
}
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
  const queryClient = useQueryClient();

  const fetchDoctorsData = async () => {
    const response = await axiosInstance.get(`${baseURL}/api/doctors`);
    return response.data;
  };

  const { isLoading: isDoctorLoading, data: doctorsData } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctorsData,
  });

  const { mutate, isPending: isEditing, isError, isSuccess } = useEditPatient();

  useEffect(() => {
    if (patientData) {
      setDiagnose(patientData.diagnose || '');
      setDetailedDiagnose(patientData.detailedDiagnose || '');
      setTreatment(patientData.treatment || '');
      setDoctor(patientData.doctor || '');
    }
  }, [patientData]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        id: patientData.id,
        data: {
          doctor,
          diagnose,
          detailedDiagnose,
          treatment,
        },
      },
      {
        onSuccess: () => {
          toast.success('Diagnose details updated successfully');
          onClose(); // Close popup after success
          queryClient.invalidateQueries({ queryKey: ['today-patients'] });

          // Generate PDF after successful update
          generatePDF(patientData);
        },
        onError: () => {
          toast.error('Failed to update diagnose details');
        },
      }
);
  }
  const handleSavePrint = (e: React.FormEvent) => {
    e.preventDefault();

    mutate(
      {
        id: patientData.id,
        data: {
          doctor,
          diagnose,
          detailedDiagnose,
          treatment,
        },
      },
      {
        onSuccess: () => {
          toast.success('Diagnose details updated successfully');
          onClose(); // Close popup after success

          // Generate PDF after successful update
          generatePDF(patientData);
          // queryClient.invalidateQueries({ queryKey: ['today-patients'] });

        },
        onError: () => {
          toast.error('Failed to update diagnose details');
        },
      }
    );
  };

  const generatePDF = (patientData: any) => {
    if (patientData) {
      // Format today's date
      const todayDate = moment().format('MMMM D, YYYY');
  
      // Define the PDF document structure
      const docDefinition = {
        pageOrientation: 'portrait',
        content: [
          {
            text: 'Simple Up Dental Clinic',
            style: 'header',
            alignment: 'center',
            margin: [0, 20, 0, 10], // Top and bottom margin
          },
          {
            text: 'Address: Shadiwal Road, Khojianwali, Gujrat',
            style: 'address',
            alignment: 'center',
            margin: [0, 0, 0, 10], // Top and bottom margin
          },
          {
            text: `Phone number: ${patientData.phoneNumber || ''}`,
            style: 'phone',
            alignment: 'center',
            margin: [0, 0, 0, 10], // Top and bottom margin
          },
          {
            text: `Date: ${todayDate}`,
            style: 'date',
            alignment: 'right',
            margin: [0, 0, 20, 20], // Right margin
          },
          {
            text: 'Patient Details',
            style: 'subheader',
            margin: [0, 20, 0, 10],
          },
          {
            columns: [
              {
                width: 'auto',
                text: [
                  { text: 'Patient Name: ', style: 'label' },
                  { text: patientData.name || '', style: 'value' },
                ],
                margin: [0, 0, 20, 10],
              },
              {
                width: 'auto',
                text: [
                  { text: 'Age: ', style: 'label' },
                  { text: patientData.age || '', style: 'value' },
                ],
                margin: [0, 0, 20, 10],
              },
              {
                width: 'auto',
                text: [
                  { text: 'Phone Number: ', style: 'label' },
                  { text: patientData.phoneNumber || '', style: 'value' },
                ],
                margin: [0, 0, 20, 10],
              },
              {
                width: 'auto',
                text: [
                  { text: 'Address: ', style: 'label' },
                  { text: patientData.address || '', style: 'value' },
                ],
                margin: [0, 0, 20, 10],
              },
            ],
          },
          {
            text: [
              { text: 'Diagnose: ', style: 'label' },
              { text: patientData.diagnose || '', style: 'value' },
              { text: '\n\n', margin: [10, 0, 0, 10] },
              { text: 'Detailed Diagnose: ', style: 'label' },
              { text: patientData.detailedDiagnose || '', style: 'value' },
              { text: '\n\n', margin: [10, 0, 0, 10] },
              { text: 'Status: ', style: 'label' },
              { text: patientData.status || 'Active', style: 'value' },
              { text: '\n\n', margin: [10, 0, 0, 10] },
              { text: 'Treatment: ', style: 'label' },
              { text: patientData.treatment || '', style: 'value' },
            ],
            margin: [0, 10, 0, 20],
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          address: {
            fontSize: 12,
          },
          phone: {
            fontSize: 12,
          },
          date: {
            fontSize: 12,
            margin: [0, 0, 20, 0],
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 20, 0, 10],
          },
          label: {
            fontSize: 12,
            bold: true,
          },
          value: {
            fontSize: 12,
          },
        },
      };
  
      //ts-ignore
      pdfMake.createPdf(docDefinition).print();
    } else {
      console.log('No patient data found for generating the PDF.');
    }
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
        <h2 className="text-2xl font-bold mb-4 text-main">Add Treatment</h2>
        <div className="w-full space-y-3">
          <label htmlFor="doctor" className="block w-full text-sm font-medium text-grey3 mb-2">
            Doctor detail
          </label>
          <select
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="w-full p-3 rounded-md border-none bg-inputMain text-main"
            disabled={isDoctorLoading}
          >
            <option value="" disabled>
              {isDoctorLoading ? 'Loading doctors...' : 'Select a doctor'}
            </option>
            {doctorsData?.map((doctor: any) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>

          <label htmlFor="diagnose" className="block text-sm font-medium text-grey3 mb-2">
            Diagnose
          </label>
          <input
            id="diagnose"
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
            id="detailedDiagnose"
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
            id="treatment"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Enter treatment details"
            className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
            rows={4}
          ></textarea>
        </div>

        <div className='gap-x-3 flex'>
          <button
            onClick={handleSubmit}
            className="bg-grey2 text-white hover:bg-grey3 w-52 p-2 rounded mt-2"
            disabled={isEditing} // Disable the button while editing
          >
            {isEditing ? 'Updating...' : 'Save Treatment'}
          </button>
          <button
            onClick={handleSavePrint}
            className="bg-grey2 text-white hover:bg-grey3 w-52 p-2 rounded mt-2"
            disabled={isEditing} // Disable the button while editing
          >
            {isEditing ? 'Updating...' : 'Save & Print Treatment'}
          </button>
        </div>

        {isError && <p className="text-red-500">Failed to update treatment</p>}
        {isSuccess && <p className="text-green-500">Treatment updated successfully!</p>}
      </div>
    </div>
  );
};

export default DiagnosePopup;
