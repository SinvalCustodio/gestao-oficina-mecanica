import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children, userName, onLogout, activePage, pageTitle, onPageChange }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onPageChange={onPageChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="app-main">
        <Header
          userName={userName}
          pageTitle={pageTitle}
          onLogout={onLogout}
          onMenuToggle={() => setIsSidebarOpen((open) => !open)}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="workspace-content">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
