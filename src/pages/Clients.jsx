/**
 * PÁGINA: Clientes
 * 
 * Gerencia o CRUD (Create, Read, Update, Delete) de clientes
 * Conectado à API Spring Boot
 */

import { useState, useEffect } from 'react';
import ClientCard from '../components/clients/ClientCard';
import ClientForm from '../components/clients/ClientForm';
import { clienteService } from '../services/api'; // Importando nossa API

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Carrega os clientes quando a tela abre
  useEffect(() => {
    loadClients();
  }, []);

  // Função que busca os dados da API
  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await clienteService.listar();
      setClients(data);
    } catch (error) {
      showMessage('❌ Erro ao carregar clientes. O backend está rodando?', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  // Chamado pelo ClientForm quando o formulário é submetido com sucesso
  const handleSaveClient = async () => {
    showMessage(editingClient ? '✅ Cliente atualizado com sucesso!' : '✅ Cliente cadastrado com sucesso!', 'success');
    setShowForm(false);
    setEditingClient(null);
    loadClients(); // Recarrega a lista para mostrar a atualização
  };

  // Função para excluir cliente
  const handleDeleteClient = async (id) => {
    if (window.confirm('⚠️ Tem certeza que deseja excluir este cliente?\nEsta ação não pode ser desfeita.')) {
      try {
        await clienteService.excluir(id);
        showMessage('🗑️ Cliente removido com sucesso!', 'warning');
        loadClients(); // Recarrega a lista
      } catch (error) {
        showMessage('❌ Erro ao excluir cliente.', 'error');
      }
    }
  };

  // Filtro de busca adaptado para os nomes em português do Backend (nome, email, telefone)
  const filteredClients = clients.filter(client =>
    client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.telefone && client.telefone.includes(searchTerm))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 md:px-6 md:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">👥 Clientes</h2>
            <p className="text-blue-100 text-xs md:text-sm mt-1">
              Gerencie todos os clientes da sua oficina
            </p>
          </div>
          <button
            onClick={handleNewClient}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span className="text-xl">+</span>
            Novo Cliente
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>
          <div className="text-sm text-gray-600">
            📊 Total: {filteredClients.length} cliente(s)
            {searchTerm && ` | Filtrado de ${clients.length}`}
          </div>
        </div>
      </div>
      
      {message.text && (
        <div className={`px-4 md:px-6 py-3 text-sm ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 
          message.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-3xl">⏳</div>
            <p className="text-gray-500 mt-2">Carregando clientes...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Tente outro termo de busca' : 'Clique no botão "Novo Cliente" para começar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client} // O ClientCard vai receber o cliente (com nome, email, etc.)
                onEdit={handleEditClient}
                onDelete={handleDeleteClient}
              />
            ))}
          </div>
        )}
      </div>
      
      {showForm && (
        <ClientForm
          initialData={editingClient}
          onSubmit={handleSaveClient}
          onCancel={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clients;