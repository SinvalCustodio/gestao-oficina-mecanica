import { useState } from 'react';
import Login from './pages/Login';
import MainLayout from './components/layout/MainLayout';
import Icon from './components/layout/Icon';
import Clients from './pages/Clients';
import Vehicles from './pages/Vehicles';
import ServiceOrders from './pages/ServiceOrders';
import {
  getCurrentUser,
  initializeLocalStorage,
  isAuthenticated,
  loadData,
  logoutUser,
  STORAGE_KEYS
} from './services/localStorageService';

const pageLabels = {
  dashboard: 'Visão geral',
  clients: 'Clientes',
  vehicles: 'Veículos',
  serviceOrders: 'Ordens de serviço',
  reports: 'Relatórios'
};

function App() {
  const [user, setUser] = useState(() => {
    initializeLocalStorage();
    return isAuthenticated() ? getCurrentUser() : null;
  });
  const [activePage, setActivePage] = useState('dashboard');

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const vehicles = loadData(STORAGE_KEYS.VEHICLES);
  const orders = loadData(STORAGE_KEYS.SERVICE_ORDERS);
  const openOrders = orders.filter((order) => order.status !== 'concluida');
  const completedOrders = orders.filter((order) => order.status === 'concluida');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <div className="dashboard-page">
            <section className="welcome-banner">
              <div className="welcome-copy">
                <span className="eyebrow eyebrow-light">
                  <Icon name="spark" size={14} />
                  SEU CENTRO DE OPERAÇÕES
                </span>
                <h1>Bom trabalho, {user.name?.split(' ')[0] || 'equipe'}.</h1>
                <p>Uma oficina bem gerenciada faz todo serviço avançar.</p>
                <button className="welcome-action" onClick={() => setActivePage('serviceOrders')}>
                  Acompanhar ordens
                  <Icon name="arrow" size={17} />
                </button>
              </div>
              <div className="welcome-art" aria-hidden="true">
                <div className="welcome-art-ring" />
                <Icon name="vehicle" size={118} />
                <span className="welcome-art-spark"><Icon name="wrench" size={25} /></span>
              </div>
              <span className="welcome-index" aria-hidden="true">01 / OFICINA</span>
            </section>

            <div className="section-heading">
              <div>
                <span className="eyebrow">ACOMPANHAMENTO</span>
                <h2>Panorama da oficina</h2>
              </div>
              <span className="live-indicator"><span /> Dados do espaço de trabalho</span>
            </div>

            <section className="metrics-grid" aria-label="Resumo da oficina">
              <article className="metric-card">
                <span className="metric-icon metric-icon-lime"><Icon name="clipboard" size={20} /></span>
                <span className="metric-label">Ordens em aberto</span>
                <strong className="metric-value">{openOrders.length.toString().padStart(2, '0')}</strong>
                <span className="metric-note">Aguardando ou em andamento</span>
              </article>
              <article className="metric-card">
                <span className="metric-icon metric-icon-orange"><Icon name="vehicle" size={20} /></span>
                <span className="metric-label">Veículos cadastrados</span>
                <strong className="metric-value">{vehicles.length.toString().padStart(2, '0')}</strong>
                <span className="metric-note">Na base da sua oficina</span>
              </article>
              <article className="metric-card">
                <span className="metric-icon metric-icon-blue"><Icon name="check" size={20} /></span>
                <span className="metric-label">Serviços concluídos</span>
                <strong className="metric-value">{completedOrders.length.toString().padStart(2, '0')}</strong>
                <span className="metric-note">Ordens finalizadas</span>
              </article>
            </section>

            <div className="section-heading section-heading-actions">
              <div>
                <span className="eyebrow">ACESSO RÁPIDO</span>
                <h2>O que vamos organizar?</h2>
              </div>
            </div>
            <section className="shortcut-grid" aria-label="Atalhos">
              <button className="shortcut-card" onClick={() => setActivePage('serviceOrders')}>
                <span className="shortcut-icon shortcut-icon-lime"><Icon name="clipboard" size={22} /></span>
                <span className="shortcut-copy"><strong>Ordens de serviço</strong><small>Gerencie serviços e acompanhe cada etapa.</small></span>
                <Icon name="arrow" size={18} className="shortcut-arrow" />
              </button>
              <button className="shortcut-card" onClick={() => setActivePage('vehicles')}>
                <span className="shortcut-icon shortcut-icon-orange"><Icon name="vehicle" size={22} /></span>
                <span className="shortcut-copy"><strong>Veículos</strong><small>Consulte e atualize os veículos cadastrados.</small></span>
                <Icon name="arrow" size={18} className="shortcut-arrow" />
              </button>
              <button className="shortcut-card" onClick={() => setActivePage('clients')}>
                <span className="shortcut-icon shortcut-icon-blue"><Icon name="users" size={22} /></span>
                <span className="shortcut-copy"><strong>Clientes</strong><small>Mantenha sua carteira sempre organizada.</small></span>
                <Icon name="arrow" size={18} className="shortcut-arrow" />
              </button>
            </section>
          </div>
        );
      case 'clients':
        return <Clients />;
      case 'vehicles':
        return <Vehicles />;
      case 'serviceOrders':
        return <ServiceOrders />;
      case 'reports':
        return (
          <section className="page-panel empty-state reports-empty">
            <span className="empty-icon"><Icon name="chart" size={28} /></span>
            <span className="eyebrow">EM PREPARAÇÃO</span>
            <h2>Relatórios da oficina</h2>
            <p>Este espaço está reservado para os indicadores e relatórios da operação.</p>
            <button className="action-secondary" onClick={() => setActivePage('dashboard')}>Voltar ao início</button>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout
      userName={user.name}
      activePage={activePage}
      pageTitle={pageLabels[activePage] || 'Oficina'}
      onLogout={handleLogout}
      onPageChange={setActivePage}
    >
      {renderContent()}
    </MainLayout>
  );
}

export default App;
