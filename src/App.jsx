/**
 * COMPONENTE PRINCIPAL: App
 */

import { useState, useEffect } from 'react';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import Clients from './pages/Clients';
import Vehicles from './pages/Vehicles';
import ServiceOrders from './pages/ServiceOrders';
import { isAuthenticated, getCurrentUser, initializeLocalStorage, logoutUser } from './services/localStorageService';

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    initializeLocalStorage();
    
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              📋 Dashboard
            </h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Bem-vindo ao Sistema de Gestão da Oficina Mecânica
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div 
                onClick={() => setActivePage('clients')}
                className="bg-blue-50 p-3 md:p-4 rounded-lg text-center hover:bg-blue-100 cursor-pointer transition-colors"
              >
                <div className="text-xl md:text-2xl mb-1 md:mb-2">👥</div>
                <div className="font-semibold text-sm md:text-base">Clientes</div>
              </div>
              <div 
                onClick={() => setActivePage('vehicles')}
                className="bg-green-50 p-3 md:p-4 rounded-lg text-center hover:bg-green-100 cursor-pointer transition-colors"
              >
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🚗</div>
                <div className="font-semibold text-sm md:text-base">Veículos</div>
              </div>
              <div 
                onClick={() => setActivePage('serviceOrders')}
                className="bg-yellow-50 p-3 md:p-4 rounded-lg text-center hover:bg-yellow-100 cursor-pointer transition-colors"
              >
                <div className="text-xl md:text-2xl mb-1 md:mb-2">📝</div>
                <div className="font-semibold text-sm md:text-base">OS</div>
              </div>
              <div 
                onClick={() => setActivePage('reports')}
                className="bg-purple-50 p-3 md:p-4 rounded-lg text-center hover:bg-purple-100 cursor-pointer transition-colors"
              >
                <div className="text-xl md:text-2xl mb-1 md:mb-2">📊</div>
                <div className="font-semibold text-sm md:text-base">Relatórios</div>
              </div>
            </div>
          </div>
        );
      case 'clients':
        return <Clients />;
      case 'vehicles':
        return <Vehicles />;
      case 'serviceOrders':
        return <ServiceOrders />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Em desenvolvimento
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Esta página será implementada em breve.
            </p>
          </div>
        );
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `url('https://img.magnific.com/fotos-premium/uma-oficina-bem-organizada-com-ferramentas-e-armazenamento-para-varios-projetos_1286777-23676.jpg?semt=ais_hybrid&w=740&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="min-h-screen bg-black bg-opacity-40">
        <MainLayout
          userName={user.name}
          onLogout={handleLogout}
          activePage={activePage}
          onPageChange={handlePageChange}
        >
          {renderContent()}
        </MainLayout>
      </div>
    </div>
  );
}

export default App;