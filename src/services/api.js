// src/services/api.js

const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const erroData = await response.json().catch(() => ({}));
    throw new Error(erroData.erro || 'Erro na comunicação com o servidor');
  }

  if (response.status === 204) return null;
  
  return response.json();
}

export const clienteService = {
  listar: () => request('/clientes'),
  criar: (cliente) => request('/clientes', { method: 'POST', body: JSON.stringify(cliente) }),
  atualizar: (id, cliente) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(cliente) }),
  excluir: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),
};