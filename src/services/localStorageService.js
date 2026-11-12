/**
 * SERVIÇO DE LOCALSTORAGE
 * 
 * Este arquivo é responsável por todas as operações de persistência de dados.
 * Usamos o localStorage do navegador para salvar os dados localmente.
 * 
 * Vantagens do localStorage:
 * - Os dados persistem mesmo após fechar o navegador
 * - Não precisa de backend/servidor
 * - Fácil de usar e rápido
 * 
 * OBS: Para este projeto, vamos simular uma autenticação simples.
 * O usuário padrão será:
 * - Email: admin@oficina.com
 * - Senha: Admin123
 */

// Chaves (keys) usadas para salvar os dados no localStorage
// Usamos chaves diferentes para cada tipo de dado
const STORAGE_KEYS = {
  USER: '@OficinaMecanica:user',        // Dados do usuário logado
  CLIENTS: '@OficinaMecanica:clients',  // Lista de clientes
  VEHICLES: '@OficinaMecanica:vehicles', // Lista de veículos
  SERVICE_ORDERS: '@OficinaMecanica:orders' // Lista de ordens de serviço
};

/**
 * USUÁRIO PADRÃO PARA TESTE
 * 
 * Email: admin@oficina.com
 * Senha: Admin123
 * 
 * Esta senha atende aos requisitos:
 * ✅ Letra maiúscula (A)
 * ✅ Letras minúsculas (dmin)
 * ✅ Números (123)
 * ✅ Mínimo 6 caracteres
 */
const DEFAULT_USER = {
  id: 1,
  name: 'Administrador',
  email: 'admin@oficina.com',
  password: 'Admin123', // Em um app real, isso seria criptografado!
  role: 'admin'
};

/**
 * INICIALIZA O BANCO DE DADOS LOCAL
 * 
 * Verifica se já existe um usuário cadastrado.
 * Se não existir, cria o usuário padrão.
 * 
 * Esta função deve ser chamada quando o app iniciar.
 */
export const initializeLocalStorage = () => {
  // Verifica se já existe um usuário salvo
  const existingUser = localStorage.getItem(STORAGE_KEYS.USER);
  
  if (!existingUser) {
    // Se não existe, salva o usuário padrão
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
    console.log('✅ Banco de dados inicializado com usuário padrão');
  }
  
  // Inicializa lista de clientes vazia se não existir
  const existingClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!existingClients) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
  }
  
  // Inicializa lista de veículos vazia se não existir
  const existingVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
  if (!existingVehicles) {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify([]));
  }
  
  // Inicializa lista de ordens de serviço vazia se não existir
  const existingOrders = localStorage.getItem(STORAGE_KEYS.SERVICE_ORDERS);
  if (!existingOrders) {
    localStorage.setItem(STORAGE_KEYS.SERVICE_ORDERS, JSON.stringify([]));
  }
};

/**
 * LOGIN DO USUÁRIO
 * 
 * Verifica se o email e senha correspondem ao usuário salvo.
 * 
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Object} { success: boolean, message: string, user: Object }
 */
export const loginUser = (email, password) => {
  // Busca o usuário salvo no localStorage
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  
  if (!storedUser) {
    return {
      success: false,
      message: '❌ Nenhum usuário encontrado. Reinicie o sistema.',
      user: null
    };
  }
  
  const user = JSON.parse(storedUser);
  
    // Verifica se o email e senha correspondem
  if (user.email === email && user.password === password) {
    // Cria uma sessão sem a senha (por segurança)
    const userSession = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isLoggedIn: true  // <-- Esta linha é importante
    };
    
    // Salva a sessão no localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userSession));
    
    return {
      success: true,
      message: '✅ Login realizado com sucesso!',
      user: userSession
    };
  }
  
  return {
    success: false,
    message: '❌ Email ou senha incorretos. Tente novamente.',
    user: null
  };
};

/**
 * VERIFICA SE O USUÁRIO ESTÁ LOGADO
 * 
 * @returns {boolean} - true se estiver logado, false caso contrário
 */
export const isAuthenticated = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (!user) return false;
  
  const userData = JSON.parse(user);
  // Verifica se existe a propriedade isLoggedIn e se é true
  return userData.isLoggedIn === true;
};

/**
 * OBTÉM OS DADOS DO USUÁRIO LOGADO
 * 
 * @returns {Object|null} - Dados do usuário ou null se não estiver logado
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (!user) return null;
  
  const userData = JSON.parse(user);
  // Só retorna o usuário se estiver logado
  if (userData.isLoggedIn === true) {
    return userData;
  }
  return null;
};

/**
 * LOGOUT DO USUÁRIO
 * 
 * Remove completamente a sessão do usuário
 * Mantém apenas o usuário padrão salvo, mas sem estar logado
 */
export const logoutUser = () => {
  // Salva o usuário padrão SEM a flag isLoggedIn
  const defaultUserWithoutSession = {
    id: DEFAULT_USER.id,
    name: DEFAULT_USER.name,
    email: DEFAULT_USER.email,
    password: DEFAULT_USER.password,
    role: DEFAULT_USER.role
    // NÃO tem a propriedade isLoggedIn
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUserWithoutSession));
};

/**
 * ==================== FUNÇÕES GENÉRICAS PARA CRUD ====================
 * 
 * As funções abaixo serão usadas para gerenciar clientes, veículos e ordens de serviço
 */

/**
 * SALVA UM ITEM NO LOCALSTORAGE
 * 
 * @param {string} key - Chave onde salvar (ex: STORAGE_KEYS.CLIENTS)
 * @param {Array} data - Array de dados a ser salvo
 */
export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * CARREGA UM ITEM DO LOCALSTORAGE
 * 
 * @param {string} key - Chave a ser carregada
 * @returns {Array} - Array com os dados (vazio se não existir)
 */
export const loadData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

/**
 * ADICIONA UM NOVO ITEM
 * 
 * @param {string} key - Chave onde adicionar
 * @param {Object} newItem - Novo item a ser adicionado
 * @returns {Array} - Lista atualizada
 */
export const addItem = (key, newItem) => {
  const currentData = loadData(key);
  // Gera um ID automático baseado no timestamp + random
  const itemWithId = {
    ...newItem,
    id: Date.now() + Math.floor(Math.random() * 1000)
  };
  const updatedData = [...currentData, itemWithId];
  saveData(key, updatedData);
  return updatedData;
};

/**
 * ATUALIZA UM ITEM EXISTENTE
 * 
 * @param {string} key - Chave onde está o item
 * @param {number} id - ID do item a ser atualizado
 * @param {Object} updatedItem - Dados atualizados
 * @returns {Array} - Lista atualizada
 */
export const updateItem = (key, id, updatedItem) => {
  const currentData = loadData(key);
  const updatedData = currentData.map(item => 
    item.id === id ? { ...item, ...updatedItem } : item
  );
  saveData(key, updatedData);
  return updatedData;
};

/**
 * DELETA UM ITEM
 * 
 * @param {string} key - Chave onde está o item
 * @param {number} id - ID do item a ser deletado
 * @returns {Array} - Lista atualizada
 */
export const deleteItem = (key, id) => {
  const currentData = loadData(key);
  const updatedData = currentData.filter(item => item.id !== id);
  saveData(key, updatedData);
  return updatedData;
};

// Exporta as chaves para serem usadas em outros arquivos
export { STORAGE_KEYS };