/**
 * COMPONENTE: LoginForm
 * 
 * Formulário de login com:
 * - Validação de email e senha forte
 * - Botão "olhinho" para mostrar/esconder a senha
 * - Feedback visual em tempo real
 */

import { useState } from 'react';
import { validateEmail, validatePassword } from '../../utils/validators';
import { loginUser, initializeLocalStorage } from '../../services/localStorageService';

// Ícone de usuário
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// Ícone de cadeado
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);


// 👁️‍🗨️ Ícone "Olho fechado" (esconder senha)
const EyeOpenIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// 👁️ Ícone "Olho aberto" (mostrar senha)
const EyeClosedIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estado para controlar se a senha está visível ou não
  const [showPassword, setShowPassword] = useState(false);

  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '' });
  const [passwordValidation, setPasswordValidation] = useState({ isValid: false, message: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValidation(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValidation(validatePassword(value));
  };

  // Função para alternar a visibilidade da senha
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!emailValidation.isValid) {
      setLoginError('❌ Por favor, corrija o email antes de continuar');
      return;
    }

    if (!passwordValidation.isValid) {
      setLoginError('❌ Por favor, corrija a senha antes de continuar');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginUser(email, password);

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setLoginError(result.message);
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://img.magnific.com/fotos-premium/uma-oficina-bem-organizada-com-ferramentas-e-armazenamento-para-varios-projetos_1286777-23676.jpg?semt=ais_hybrid&w=740&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Cabeçalho */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <div className="flex justify-center mb-3">
            <span className="text-5xl">🚗</span>
          </div>
          <h1 className="text-2xl font-bold">Oficina Mecânica</h1>
          <p className="text-blue-100 text-sm mt-1">Sistema de Gestão</p>
        </div>

        {/* Corpo do formulário */}
        <div className="p-6">
          {/* Dica do usuário padrão */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-800 text-center">
              🔑 Usuário padrão: <strong>admin@oficina.com</strong>
              <br />
              🔒 Senha: <strong>Admin123</strong>
            </p>
          </div>

          {loginError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {loginError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <span className="flex items-center gap-2">
                  <UserIcon />
                  Email
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Digite seu email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {emailValidation.message && (
                <p className={`text-xs mt-1 ${emailValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                  {emailValidation.message}
                </p>
              )}
            </div>

            {/* Campo Senha COM OLHINHO */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                <span className="flex items-center gap-2">
                  <LockIcon />
                  Senha
                </span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}  // Alterna entre texto e senha
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                />
                {/* Botão do olhinho */}
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  title={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                </button>
              </div>
              {passwordValidation.message && (
                <p className={`text-xs mt-1 ${passwordValidation.isValid ? 'text-green-600' : 'text-red-500'}`}>
                  {passwordValidation.message}
                </p>
              )}

              {/* Lista de requisitos da senha */}
              <div className="mt-2 text-xs text-gray-500">
                <p>📌 A senha deve conter:</p>
                <ul className="list-disc list-inside ml-2">
                  <li className={password.length >= 6 ? 'text-green-600' : ''}>
                    {password.length >= 6 ? '✅' : '❌'} Mínimo 6 caracteres
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                    {/[A-Z]/.test(password) ? '✅' : '❌'} Letra MAIÚSCULA
                  </li>
                  <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                    {/[a-z]/.test(password) ? '✅' : '❌'} Letra minúscula
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                    {/[0-9]/.test(password) ? '✅' : '❌'} Número
                  </li>
                </ul>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : '🔐 Entrar no Sistema'}
            </button>
          </form>
        </div>

        {/* Rodapé */}
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500">
          Sistema de Gestão de Oficina Mecânica v1.0
        </div>
      </div>
    </div>
  );
};

export default LoginForm;