/**
 * PÁGINA: Login
 * 
 * Esta é a página de login do sistema.
 * Ela é responsável por:
 * 1. Renderizar o formulário de login (componente LoginForm)
 * 2. Lidar com o sucesso do login (redirecionar para o Dashboard)
 * 3. Inicializar o localStorage quando a página carrega
 */

import { useEffect } from 'react';
import LoginForm from '../components/auth/LoginForm';
import { initializeLocalStorage } from '../services/localStorageService';

const Login = ({ onLogin }) => {
  /**
   * useEffect é executado quando a página é carregada
   * Aqui inicializamos o localStorage com os dados padrão
   */
  useEffect(() => {
    // Inicializa o banco de dados local (cria usuário padrão se não existir)
    initializeLocalStorage();
  }, []); // O array vazio [] significa "executa apenas uma vez"

  /**
   * Função chamada quando o login é bem-sucedido
   * Recebe os dados do usuário e repassa para o App.jsx
   */
  const handleLoginSuccess = (userData) => {
    console.log('✅ Login bem-sucedido:', userData.email);
    // Chama a função passada pelo App.jsx para atualizar o estado de autenticação
    onLogin(userData);
  };

  return (
    <div>
      {/* Renderiza o formulário de login e passa a função de callback */}
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login;