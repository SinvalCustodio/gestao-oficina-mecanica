import Icon from './Icon';

const Header = ({ userName, pageTitle, onLogout, onMenuToggle, isSidebarOpen }) => (
  <header className="topbar">
    <div className="topbar-leading">
    <button className="mobile-menu-button" onClick={onMenuToggle} aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}>
        <Icon name="menu" size={21} />
      </button>
      <div className="topbar-breadcrumb">
        <span>Oficina</span>
        <Icon name="chevron" size={14} />
        <strong>{pageTitle}</strong>
      </div>
    </div>
    <div className="topbar-actions">
      <span className="workspace-status"><span /> Sessão ativa</span>
      <span className="topbar-divider" />
      <div className="profile-chip">
        <span className="profile-avatar">{userName?.trim()?.charAt(0)?.toUpperCase() || 'A'}</span>
        <span className="profile-name">{userName}</span>
      </div>
      <button className="logout-button" onClick={onLogout} aria-label="Sair da conta" title="Sair">
        <Icon name="logout" size={18} />
      </button>
    </div>
  </header>
);

export default Header;
