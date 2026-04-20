import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { UserInfoPage } from './pages/UserInfoPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [token, setToken] = useState(() => localStorage.getItem('fitro_token') ?? '');

  function handleLogin(newToken) {
    localStorage.setItem('fitro_token', newToken);
    setToken(newToken);
    setCurrentPage('admin');
  }

  function handleLogout() {
    localStorage.removeItem('fitro_token');
    setToken('');
    setCurrentPage('landing');
  }

  useEffect(() => {
    if (currentPage === 'admin' && !token) {
      setCurrentPage('login');
    }
  }, [currentPage, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#16203a] to-[#2d3a5a] text-white flex flex-col relative overflow-hidden font-sans">
      <Navbar
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        token={token}
        onLogout={handleLogout}
      />
      <div className="flex-grow flex items-center justify-center pt-20">
        {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
        {currentPage === 'login' && <LoginPage onLogin={handleLogin} />}
        {currentPage === 'userInfo' && <UserInfoPage />}
        {currentPage === 'admin' && token && <AdminPage token={token} />}
      </div>
    </div>
  );
}