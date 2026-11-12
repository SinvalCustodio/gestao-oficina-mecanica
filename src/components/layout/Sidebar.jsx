import Icon from './Icon';

const menuSections = [
  {
    label: 'ESPAÇO DE TRABALHO',
    items: [
      { id: 'dashboard', label: 'Visão geral', icon: 'chart' },
      { id: 'serviceOrders', label: 'Ordens de serviço', icon: 'clipboard', badge: 'OS' },
      { id: 'vehicles', label: 'Veículos', icon: 'vehicle' }
    ]
  },
  {
    label: 'RELACIONAMENTO',
    items: [{ id: 'clients', label: 'Clientes', icon: 'users' }]
  },
  {
    label: 'ACOMPANHAMENTO',
    items: [{ id: 'reports', label: 'Relatórios', icon: 'activity' }]
  }
];

const Sidebar = ({ activePage, onPageChange, isOpen, onClose }) => {
  return (
    <>
      <button
        className={`sidebar-scrim ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-label="Fechar menu"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
      />
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand-row">
          <a
            className="brand-lockup"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onPageChange('dashboard');
              onClose();
            }}
          >
            <span className="brand-mark"><Icon name="wrench" size={20} /></span>
            <span className="brand-type"><strong>garagem<span>+</span></strong><small>GESTÃO AUTOMOTIVA</small></span>
          </a>
          <button className="sidebar-close-button" onClick={onClose} aria-label="Fechar menu">
            <Icon name="x" size={19} />
          </button>
        </div>

        <div className="sidebar-workspace">
          <span className="workspace-symbol"><Icon name="vehicle" size={17} /></span>
          <span className="workspace-copy"><strong>Minha oficina</strong><small>Painel de gestão</small></span>
          <span className="workspace-menu" aria-hidden="true">•••</span>
        </div>

        <nav className="sidebar-navigation" aria-label="Menu principal">
          {menuSections.map((section) => (
            <div key={section.label}>
              <p className="nav-section-label">{section.label}</p>
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    onClose();
                  }}
                  className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
                  aria-current={activePage === item.id ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                  {activePage === item.id && <span className="nav-active-mark" />}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon"><Icon name="spark" size={18} /></span>
            <strong>O serviço nunca para.</strong>
            <p>Uma gestão mais simples começa com a oficina organizada.</p>
            <button onClick={() => {
              onPageChange('dashboard');
              onClose();
            }}>Explorar painel <Icon name="arrow" size={14} /></button>
          </div>
          <div className="sidebar-footer">
            <span className="footer-status"><span /> Sessão autenticada</span>
            <span>GARAGEM+ <span>·</span> v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
