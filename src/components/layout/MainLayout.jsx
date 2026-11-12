/**
 * COMPONENTE: MainLayout
 * 
 * Layout principal que combina Header + Sidebar + Conteúdo
 * Totalmente responsivo
 */

import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children, userName, onLogout, activePage, onPageChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userName={userName} onLogout={onLogout} />
      
      <div className="flex flex-1">
        <Sidebar 
          activePage={activePage} 
          onPageChange={onPageChange} 
        />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto mt-14 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;