/**
 * PÁGINA: Ordens de Serviço
 * 
 * Gerencia o CRUD de Ordens de Serviço
 */

import { useState, useEffect } from 'react';
import ServiceOrderCard from '../components/serviceOrders/ServiceOrderCard';
import ServiceOrderForm from '../components/serviceOrders/ServiceOrderForm';
import { loadData, addItem, updateItem, deleteItem, STORAGE_KEYS } from '../services/localStorageService';

const ServiceOrders = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setIsLoading(true);
    const storedOrders = loadData(STORAGE_KEYS.SERVICE_ORDERS);
    setOrders(storedOrders);
    setIsLoading(false);
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleNewOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (editingOrder) {
        const updatedOrders = updateItem(STORAGE_KEYS.SERVICE_ORDERS, editingOrder.id, orderData);
        setOrders(updatedOrders);
        showMessage('✅ OS atualizada com sucesso!', 'success');
      } else {
        const updatedOrders = addItem(STORAGE_KEYS.SERVICE_ORDERS, orderData);
        setOrders(updatedOrders);
        showMessage('✅ OS criada com sucesso!', 'success');
      }
      
      setShowForm(false);
      setEditingOrder(null);
    } catch (error) {
      showMessage('❌ Erro ao salvar OS. Tente novamente.', 'error');
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm('⚠️ Tem certeza que deseja excluir esta Ordem de Serviço?\nEsta ação não pode ser desfeita.')) {
      const updatedOrders = deleteItem(STORAGE_KEYS.SERVICE_ORDERS, id);
      setOrders(updatedOrders);
      showMessage('🗑️ OS removida com sucesso!', 'warning');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOS = orders.length;
  const totalAbertas = orders.filter(o => o.status === 'aberta').length;
  const totalConcluidas = orders.filter(o => o.status === 'concluida').length;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-4 py-4 md:px-6 md:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">📝 Ordens de Serviço</h2>
            <p className="text-yellow-100 text-xs md:text-sm mt-1">
              Gerencie as ordens de serviço da oficina
            </p>
          </div>
          <button
            onClick={handleNewOrder}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span className="text-xl">+</span>
            Nova OS
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-800">{totalOS}</div>
          <div className="text-xs text-gray-500">Total de OS</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-yellow-600">{totalAbertas}</div>
          <div className="text-xs text-gray-500">Em aberto</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-green-600">{totalConcluidas}</div>
          <div className="text-xs text-gray-500">Concluídas</div>
        </div>
      </div>
      
      <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por cliente ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
          <div className="text-sm text-gray-600">
            📋 Exibindo {filteredOrders.length} de {totalOS} OS
          </div>
        </div>
      </div>
      
      {message.text && (
        <div className={`px-4 md:px-6 py-3 text-sm ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-3xl">⏳</div>
            <p className="text-gray-500 mt-2">Carregando ordens de serviço...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhuma OS encontrada' : 'Nenhuma OS cadastrada'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Tente outro termo de busca' : 'Clique em "Nova OS" para começar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <ServiceOrderCard
                key={order.id}
                order={order}
                onEdit={handleEditOrder}
                onDelete={handleDeleteOrder}
              />
            ))}
          </div>
        )}
      </div>
      
      {showForm && (
        <ServiceOrderForm
          initialData={editingOrder}
          onSubmit={handleSaveOrder}
          onCancel={() => {
            setShowForm(false);
            setEditingOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default ServiceOrders;