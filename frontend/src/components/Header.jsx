// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header = () => {
    const { token,user, isAuthenticated, login, logout} = useAuth();
    const handleLogout = async () => {
      logout();
      try {
        const response = await fetch('http://localhost:5000/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.ok) {
          console.log('Logout successful');
        } else {
          const { error } = await response.json();
          console.error(`Logout failed: ${error}`);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">Chocolate Corner</div>
      <div>
        {isAuthenticated ? (
          <div>
          Welcome, {user.username}!
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full ml-4"
          >
            Logout
          </button>
        </div>
        ) : (
          <div className="flex space-x-4">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
