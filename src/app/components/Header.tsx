import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import avatar from '../../../public/avatar.svg';
import logout from '../../../public/logout.svg';
import logo from '../../../public/logo.png';
import axiosInstance from '../api/api';
import { useQuery } from '@tanstack/react-query'; // Ensure you import useQuery
import { toast } from 'react-toastify';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const Header: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Ensure that we're accessing localStorage on the client side only
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
    }
  }, []);

  const fetchUserData = async () => {
    if (!userId) {
      throw new Error('User ID not found');
    }
    const response = await axiosInstance.get(`${baseURL}/api/user/${userId}`);
    return response.data;
  };

  const { isLoading: isUserLoading, isError: isUserError, data: userData, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserData,
    enabled: !!userId, // Only fetch user data if userId is available
  });

  const handleLogout = () => {
    // Handle logout logic, like removing the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success('You have been logged out successfully');
    router.push('/login'); // Redirect to login page
  };

  const isCurrentRoute = (path: string) => {
    return pathname.includes(path); // Check if the current path includes the given route
  };

  if (isUserLoading) return <div>Loading...</div>;
  if (isUserError) return <div>Error fetching user data: {userError?.message}</div>;

  return (
    <header className="bg-base font-inter border-base3 xs:px-4 flex h-[72px] items-center justify-between border-b py-4 md:px-[40px]">
      <div className="flex items-center">
        <Image src={logo} alt="Dental Clinic Logo" className="h-10 w-auto mr-4" />
        <h1 className="text-2xl text-main font-poppins font-semibold">Smile Up</h1>
      </div>

      <nav className="hidden md:flex space-x-8 items-center">
  <a 
    href="/dashboard" 
    className={`text-primary px-3 py-1 rounded-md ${isCurrentRoute('/dashboard') ? 'bg-base3 rounded-md px-3 py-1' : ''} hover:bg-grey2`}
  >
    <h2 className={isCurrentRoute('/dashboard') ? 'text-main1 text-xl' : 'text-main text-xl'}>Dashboard</h2>
  </a>
  <a 
    href="/staff" 
    className={`text-primary px-3 py-1 rounded-md ${isCurrentRoute('/staff') ? 'bg-base3 rounded-md px-3 py-1' : ''} hover:bg-grey2`}
  >
    <h3 className={isCurrentRoute('/staff') ? 'text-main1 text-xl' : 'text-main text-xl'}>Staff</h3>
  </a>
  <a 
    href="/patients" 
    className={`text-primary px-3 py-1 rounded-md ${isCurrentRoute('/patients') ? 'bg-base3 rounded-md px-3 py-1' : ''} hover:bg-grey2 `}
  >
    <h3 className={isCurrentRoute('/patients') ? 'text-main1 text-xl' : 'text-main text-xl '}>Patients</h3>
  </a>
</nav>

      <div className="flex flex-row items-center justify-center gap-x-3">
        <Image src={avatar} alt="Avatar" className="h-8 w-8 rounded-full" />
        <h2 className="text-grey3 text-body1">{userData?.name || 'Guest'}</h2>
        <button onClick={handleLogout} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-grey4">
          <Image src={logout} alt="Logout Icon" className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
