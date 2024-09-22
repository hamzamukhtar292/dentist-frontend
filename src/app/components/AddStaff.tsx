// src/components/Popup.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import cross from '../../../public/cross.svg'; // Adjust the path as needed
import { toast } from 'react-toastify';
import { useStaff } from '../hooks/useStaff';
interface StaffProps{
  isOpen: boolean;
  onClose: () => void;
}

const AddStaff: React.FC<StaffProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [personStatus, setPersonStatus] = useState('');
  const [role, setRole] = useState('');

  const { mutate, data, error, status, isError, isSuccess } = useStaff();


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, email, phoneNumber, address, personStatus, role });
    onClose();
    toast.success("Added staff member added");
    setAddress("")
    setEmail("")
    setName("")
    setPersonStatus("")
    setRole("")
    setPhoneNumber("")
  };

  if (isSuccess && data) {
    console.log(data);
    console.log(data);

  }

  if (!isOpen) return null;

  return (
    <div className="fixed font-inter inset-0 flex items-center justify-center backdrop-blur-md">
    <div className="absolute inset-0 bg-black opacity-20"></div>
    <div
      className="xs:w-[345px] xs:px-[20px] xs:py-[20px] relative flex flex-col items-center justify-start gap-y-2 rounded-2xl border border-borderBase bg-base sm:w-[739px] lg:px-[40px] lg:py-[15px]"
    >
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          aria-label="Close"
        >
          <Image src={cross} alt="Close" width={16} height={16} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-main">Add New Patient</h2>
       <div className='w-full space-y-3'>
       <label htmlFor="email" className="block text-sm font-medium text-grey3 mb-2">
              Enter staff name
            </label>
            <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Patient name"
          className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"

        />
         <label htmlFor="email" className="block text-sm font-medium text-grey3 mb-2">
              Enter staff email
            </label>
            <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Staff age"
          className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"

        />

<label htmlFor="email" className="block text-sm font-medium text-grey3 mb-2">
              Enter staff phone number
            </label>

        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Staff phone number"
          className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"

        />
        <label htmlFor="email" className="block text-sm font-medium text-grey3 mb-2">
              Enter staff address
            </label>
            <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Staff address"
          className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"

        />
         <label htmlFor="status" className="block text-sm font-medium text-grey3 mb-2">
              Enter staff status
            </label>
            <select
            value={personStatus}
            onChange={(e) => setPersonStatus(e.target.value)}
            className="w-full p-3 rounded-md border-none bg-inputMain text-main"
          >
            <option value="">Select status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
            <label htmlFor="status" className="block text-sm font-medium text-grey3 mb-2">
              Enter staff role
            </label>
            <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-md border-none bg-inputMain text-main"
          >
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="STAFF">Nurse</option>
          </select>
       </div>
       <div>
       <button
          onClick={handleSubmit}
          className="bg-grey2 text-white hover:bg-grey4 w-52 p-2 rounded mt-2"
        >
          Add staff
        </button>
       </div>
      </div>
    </div>

  );
};

export default AddStaff;
