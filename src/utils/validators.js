/**
 * UTILITÁRIO DE VALIDAÇÕES
 * 
 * Este arquivo contém funções reutilizáveis para validar:
 * - Email (formato correto)
 * - Senha forte (letras maiúsculas, minúsculas, números)
 * - Campos obrigatórios (não podem estar vazios)
 * 
 * Todas as funções retornam um objeto com:
 * - isValid: boolean (true se válido, false se inválido)
 * - message: string (mensagem de erro, se houver)
 */

/**
 * VALIDAÇÃO DE EMAIL
 * 
 * Regras:
 * 1. Não pode ser vazio ou nulo
 * 2. Deve ter formato válido: algo@dominio.com
 * 
 * @param {string} email - O email a ser validado
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  // Verifica se o campo está vazio
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      message: '⚠️ O campo email é obrigatório'
    };
  }

  // Expressão regular para validar formato de email
  // Exemplos válidos: usuario@email.com, nome.sobrenome@empresa.com.br
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: '⚠️ Digite um email válido (exemplo: nome@email.com)'
    };
  }

  return {
    isValid: true,
    message: '✅ Email válido!'
  };
};

/**
 * VALIDAÇÃO DE SENHA FORTE
 * 
 * Regras:
 * 1. Não pode ser vazia
 * 2. Mínimo de 6 caracteres
 * 3. Pelo menos 1 letra maiúscula (A-Z)
 * 4. Pelo menos 1 letra minúscula (a-z)
 * 5. Pelo menos 1 número (0-9)
 * 
 * @param {string} password - A senha a ser validada
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  // Verifica se o campo está vazio
  if (!password || password.trim() === '') {
    return {
      isValid: false,
      message: '⚠️ O campo senha é obrigatório'
    };
  }

  // Verifica tamanho mínimo (6 caracteres)
  if (password.length < 6) {
    return {
      isValid: false,
      message: '⚠️ A senha deve ter no mínimo 6 caracteres'
    };
  }

  // Verifica se tem pelo menos 1 letra maiúscula
  const hasUpperCase = /[A-Z]/.test(password);
  if (!hasUpperCase) {
    return {
      isValid: false,
      message: '⚠️ A senha deve conter pelo menos 1 letra MAIÚSCULA'
    };
  }

  // Verifica se tem pelo menos 1 letra minúscula
  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    return {
      isValid: false,
      message: '⚠️ A senha deve conter pelo menos 1 letra minúscula'
    };
  }

  // Verifica se tem pelo menos 1 número
  const hasNumber = /[0-9]/.test(password);
  if (!hasNumber) {
    return {
      isValid: false,
      message: '⚠️ A senha deve conter pelo menos 1 NÚMERO'
    };
  }

  return {
    isValid: true,
    message: '✅ Senha forte!'
  };
};

/**
 * VALIDAÇÃO DE CAMPO OBRIGATÓRIO (genérico)
 * 
 * Útil para qualquer campo que não pode ficar vazio
 * 
 * @param {string} value - O valor a ser validado
 * @param {string} fieldName - Nome do campo (para a mensagem de erro)
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateRequired = (value, fieldName = 'Campo') => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      message: `⚠️ ${fieldName} é obrigatório`
    };
  }

  return {
    isValid: true,
    message: `✅ ${fieldName} preenchido!`
  };
};