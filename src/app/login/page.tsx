/* eslint-disable react/jsx-no-undef */
"use client"
import React, { useEffect, useState } from 'react';
import { useLogin } from '../hooks/useAuth';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('john.doe@example.com');
  const [password, setPassword] = useState('hamza123');
  const { mutate, data, error, status, isError, isSuccess } = useLogin();
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect to the home page or dashboard if authenticated
    }
  }, [isAuthenticated, router]);


  // Redirect to dashboard after successful login
  if (isSuccess && data) {
    login(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    router.push('/dashboard');
  }

  return (
    <div className="flex font-poppins flex-col items-center justify-center min-h-screen bg-base">
      <div className="w-96 p-8 shadow-lg rounded-lg bg-base border border-borderBase">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col text-center justify-center items-center w-full">
            <h2 className="text-2xl font-bold text-textMain mb-8">Login</h2>
            <Image
              src="/logo.png" // Path to the logo in the public directory
              alt="Logo"
              width={150} // Adjust width as needed
              height={120} // Adjust height as needed
              className="mb-2" // Add margin bottom to separate logo from form
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-grey3 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-grey3 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 rounded-md border-none placeholder-textMain bg-inputMain text-main"
            />
          </div>
          <button
            className="w-full p-3 bg-grey6 text-white rounded-md transition"
            type="submit"
            disabled={status === "pending"}
          >
            {status === "pending" ? 'Logging in...' : 'Login'}
          </button>
          {isSuccess && <p>Login successful!</p>}
          {isError && <p className='text-error'>Error: {error?.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;