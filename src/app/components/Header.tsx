// src/components/Header.tsx
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import avatar from "../../../public/avatar.svg"
import logout from "../../../public/logout.svg"
import logo from "../../../public/logo.png"

interface HeaderProps {
  user: {
    name: string;
    email: string;
   
  };
}
const Header: React.FC<HeaderProps> = ({ user }) => {
  console.log({user});
    const router = useRouter();
    const pathname = usePathname();
  const handleLogout = () => {
    // Handle logout logic, like removing the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page or show a message
    window.location.href = '/login'; // Example: redirect to login page
  };

  const isCurrentRoute = (path: string) => {
    return pathname.includes(path); // Check if the current path includes the given route
  };

  return (
    <header 
    className="bg-base font-inter border-base3 xs:px-4 flex h-[72px] items-center justify-between border-b py-4 md:px-[50px]"
>
     
      <div className="flex items-center">
        <Image
          src={logo}// Replace with your actual logo path
          alt="Dental Clinic Logo"
          className="h-10 w-auto mr-4"
        />
        <h1 className="text-2xl text-main font-poppins font-semibold">Simle up</h1>
      </div>

      <nav className="hidden md:flex space-x-8 items-center ">
      <a 
          href="/dashboard"
          className={`text-primary ${isCurrentRoute('/dashboard') ? 'bg-base3 rounded-md px-3 py-1' : ''}`}
        >
          <h2 className={isCurrentRoute('/dashboard') ? 'text-main1 text-xl' : 'text-main text-xl'}>
            Dashboard
          </h2>
        </a>
        <a href="/about" 
                className={`text-primary ${isCurrentRoute('/about') ? 'bg-base3 rounded-md px-3 py-1' : ''}`}>
          <h3 className={isCurrentRoute('/about') ? 'text-main1 text-xl' : 'text-main text-xl'}>
          About
          </h3>

        </a>
        <a href="/services" 
         className={`text-primary ${isCurrentRoute('/services') ? 'bg-base3 rounded-md px-3 py-1' : ''}`}>
          <h3 className={isCurrentRoute('/services') ? 'text-main1 text-xl' : 'text-main text-xl'}>
          Services
          </h3>
        </a>
        <a href="/contact"
        className={`text-primary ${isCurrentRoute('/contact') ? 'bg-base3 rounded-md px-3 py-1' : ''}`}>
          <h3 className={isCurrentRoute('/contact') ? 'text-main1 text-xl' : 'text-main text-xl'}>
          Contact
          </h3>
        </a>
      </nav>

      <div
     className='flex flex-row items-center justify-center gap-x-3'
    >
        <Image
          src={avatar}
          alt="Avatar"
          className=" h-8 w-8 rounded-full"
        />
      <h2 className='text-grey3 text-body1'>
        {user.name}
      </h2>
      <button
        onClick={handleLogout}
        className=" h-9 w-9 rounded-full  flex items-center justify-center hover:bg-grey4"
      >
        <Image
          src={logout} // Replace with your actual logo path
          alt="Dental Clinic Logo"
          className="h-5 w-5"
        />
      </button>
    </div>
      
    </header>
  );
};

export default Header;
