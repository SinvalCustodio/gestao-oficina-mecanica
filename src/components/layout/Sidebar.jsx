/**
 * COMPONENTE: Sidebar
 * 
 * Menu lateral de navegação
 * Responsivo: em mobile vira menu flutuante/hambúrguer
 */

import { useState } from 'react';

const Sidebar = ({ activePage, onPageChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Itens do menu
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', color: 'text-purple-600' },
    { id: 'clients', label: 'Clientes', icon: '👥', color: 'text-blue-600' },
    { id: 'vehicles', label: 'Veículos', icon: '🚗', color: 'text-green-600' },
    { id: 'serviceOrders', label: 'Ordens de Serviço', icon: '📝', color: 'text-yellow-600' },
    { id: 'reports', label: 'Relatórios', icon: '📈', color: 'text-red-600' },
  ];

  // Conteúdo do menu (reutilizado em desktop e mobile)
  const MenuContent = () => (
    <nav className="flex-1">
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => {
                onPageChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${activePage === item.id 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                  : 'hover:bg-gray-50 text-gray-700 hover:translate-x-1'
                }
              `}
            >
              <span className={`text-xl ${item.color}`}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      {/* Botão do menu mobile - aparece só em telas pequenas */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Sidebar para Desktop (LG e acima) */}
      <aside className="hidden lg:block w-64 bg-white shadow-lg flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-gray-700">Menu Principal</span>
          </div>
        </div>
        <div className="p-4">
          <MenuContent />
        </div>
      </aside>

      {/* Menu Mobile - aparece só em telas pequenas */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50 transform transition-transform duration-300">
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚗</span>
                <span className="font-bold text-gray-700">Menu</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-xl">✕</span>
              </button>
            </div>
            <div className="p-4">
              <MenuContent />
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;