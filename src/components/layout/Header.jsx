/**
 * COMPONENTE: Header
 * 
 * Cabeçalho fixo do sistema - Responsivo
 */

const Header = ({ userName, onLogout }) => {
  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-30">
      <div className="px-4 py-3 md:px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl">🚗</span>
            <div>
              <h1 className="text-base md:text-xl font-bold">Oficina Mecânica</h1>
              <p className="text-xs text-blue-100 hidden sm:block">Sistema de Gestão</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden xs:block">
              <p className="text-xs md:text-sm font-semibold">{userName}</p>
              <p className="text-xs text-blue-100 hidden sm:block">Administrador</p>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs md:text-sm transition-colors flex items-center gap-1 md:gap-2"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;