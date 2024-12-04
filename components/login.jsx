"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: ''});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (resp.ok) {
        const data = await resp.json();
        console.log('Login Success:', data);
        window.localStorage.setItem('auth', true)
        router.push("/admin")
      } else {
        const errorData = await resp.json();
        console.error('Login Error:', errorData.message);
        alert('Login failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Request Error:', error);
      alert('Something went wrong! Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[68vh] bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
