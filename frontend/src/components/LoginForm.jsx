// LoginForm.js
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';


const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { token,user, isAuthenticated, login, logout} = useAuth();
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, user } = await response.json();
        login(token, user);
        navigate('/');
      } else {
        const { error } = await response.json();
        alert(`Login failed: ${error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="bg-white p-8 shadow-md rounded-md w-96" onSubmit={handleLogin}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="w-full border border-gray-300 p-2 rounded-md"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
