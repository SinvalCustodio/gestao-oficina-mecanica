/**
 * COMPONENTE: ClientForm
 * Formulário para cadastrar ou editar um cliente conectado à API Spring Boot
 */

import { useState } from 'react';
import { validateEmail, validateRequired } from '../../utils/validators';
import { clienteService } from '../../services/api';
import Icon from '../layout/Icon';

const ClientForm = ({ initialData, onSubmit, onCancel }) => {
  // Estados do formulário (ajustados para os nomes que o Backend espera)
  const [formData, setFormData] = useState(() => ({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    telefone: initialData?.telefone || '',
    tipo: initialData?.tipo || 'PARTICULAR',
    endereco: initialData?.endereco || ''
  }));
  
  // Estados de validação e controle
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null); // Para erros vindos do Spring Boot

  // Atualiza um campo específico do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Valida todos os campos antes de enviar
  const validateForm = () => {
    const newErrors = {};
    
    const nameValidation = validateRequired(formData.nome, 'Nome');
    if (!nameValidation.isValid) newErrors.nome = nameValidation.message;
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.message;
    
    const phoneValidation = validateRequired(formData.telefone, 'Telefone');
    if (!phoneValidation.isValid) newErrors.telefone = phoneValidation.message;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia o formulário para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (initialData && initialData.id) {
        // Se está editando, chama o PUT
        await clienteService.atualizar(initialData.id, formData);
      } else {
        // Se é novo, chama o POST
        await clienteService.criar(formData);
      }
      
      // Se deu certo, avisa o componente pai (que vai fechar o modal e atualizar a lista)
      if (onSubmit) onSubmit();
      
    } catch (error) {
      // Se o backend retornar erro (ex: e-mail duplicado), mostramos a mensagem amigável
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="client-form-title">
        <div className="dialog-header">
          <span className="dialog-header-mark"><Icon name="users" size={18} /></span>
          <div>
            <h3 id="client-form-title">{initialData ? 'Editar cliente' : 'Novo cliente'}</h3>
            <p>Preencha os dados para manter tudo organizado.</p>
          </div>
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="dialog-form">
          
          {apiError && (
            <div className="form-error" role="alert">
              <span className="block sm:inline">{apiError}</span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          {/* Telefone */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Telefone *
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
          </div>
          
          {/* Tipo de Cliente */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Cliente
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="PARTICULAR">👤 Particular</option>
              <option value="EMPRESA">🏢 Empresa / Frota</option>
            </select>
          </div>
          
          {/* Endereço (opcional) */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Endereço (opcional)
            </label>
            <textarea
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade..."
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          {/* Botões */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="action-primary"
            >
              {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar cliente' : 'Salvar cliente')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="action-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;