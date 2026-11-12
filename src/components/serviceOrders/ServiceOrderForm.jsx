/**
 * COMPONENTE: ServiceOrderForm
 * 
 * Formulário para criar/editar uma Ordem de Serviço
 */

import { useState, useEffect } from 'react';
import { loadData, STORAGE_KEYS } from '../../services/localStorageService';

const ServiceOrderForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    vehicleId: '',
    vehiclePlate: '',
    vehicleModel: '',
    services: [],
    parts: [],
    status: 'aberta',
    total: 0,
    description: ''
  });
  
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [newService, setNewService] = useState({ name: '', value: 0 });
  const [newPart, setNewPart] = useState({ name: '', value: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    const storedClients = loadData(STORAGE_KEYS.CLIENTS);
    const storedVehicles = loadData(STORAGE_KEYS.VEHICLES);
    setClients(storedClients);
    setVehicles(storedVehicles);
  }, []);

  // Preenche formulário se for edição - CORRIGIDO
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Se tem cliente selecionado, filtra os veículos daquele cliente
      if (initialData.clientId) {
        const clientVehicles = vehicles.filter(v => v.clientId?.toString() === initialData.clientId.toString());
        setFilteredVehicles(clientVehicles);
      }
    }
  }, [initialData, vehicles]); // Adicionado 'vehicles' como dependência

  // Quando seleciona um cliente, filtra os veículos daquele cliente
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const selectedClient = clients.find(c => c.id.toString() === clientId);
    
    // Filtra veículos do cliente selecionado
    const clientVehicles = vehicles.filter(v => v.clientId?.toString() === clientId);
    setFilteredVehicles(clientVehicles);
    
    setFormData(prev => ({
      ...prev,
      clientId: clientId,
      clientName: selectedClient?.name || '',
      vehicleId: '',
      vehiclePlate: '',
      vehicleModel: ''
    }));
  };

  // Quando seleciona um veículo
  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const selectedVehicle = filteredVehicles.find(v => v.id.toString() === vehicleId);
    
    setFormData(prev => ({
      ...prev,
      vehicleId: vehicleId,
      vehiclePlate: selectedVehicle?.placa || '',
      vehicleModel: `${selectedVehicle?.marca || ''} ${selectedVehicle?.modelo || ''}`
    }));
  };

  // Adiciona serviço à lista
  const addService = () => {
    if (newService.name && newService.value > 0) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, { ...newService, id: Date.now() }]
      }));
      setNewService({ name: '', value: 0 });
    }
  };

  // Remove serviço da lista
  const removeService = (id) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  // Adiciona peça à lista
  const addPart = () => {
    if (newPart.name && newPart.value > 0) {
      setFormData(prev => ({
        ...prev,
        parts: [...prev.parts, { ...newPart, id: Date.now() }]
      }));
      setNewPart({ name: '', value: 0 });
    }
  };

  // Remove peça da lista
  const removePart = (id) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter(p => p.id !== id)
    }));
  };

  // Calcula total automaticamente
  const calculateTotal = () => {
    const servicesTotal = formData.services.reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
    const partsTotal = formData.parts.reduce((sum, p) => sum + (parseFloat(p.value) || 0), 0);
    return servicesTotal + partsTotal;
  };

  // Atualiza total sempre que serviços ou peças mudam
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      total: calculateTotal()
    }));
  }, [formData.services, formData.parts]);

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const orderData = {
      ...formData,
      updatedAt: Date.now()
    };
    
    if (!initialData) {
      orderData.createdAt = Date.now();
    } else {
      orderData.createdAt = initialData.createdAt;
      orderData.id = initialData.id;
    }
    
    await onSubmit(orderData);
    setIsSubmitting(false);
  };

  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        {/* Cabeçalho */}
        <div className={`px-6 py-4 ${initialData ? 'bg-yellow-500' : 'bg-blue-600'} text-white`}>
          <h3 className="text-lg font-semibold">
            {initialData ? '✏️ Editar Ordem de Serviço' : '📝 Nova Ordem de Serviço'}
          </h3>
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Cliente */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cliente *
            </label>
            <select
              value={formData.clientId}
              onChange={handleClientChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Selecione um cliente --</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          
          {/* Veículo */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Veículo *
            </label>
            <select
              value={formData.vehicleId}
              onChange={handleVehicleChange}
              required
              disabled={!formData.clientId}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            >
              <option value="">-- Selecione um veículo --</option>
              {filteredVehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.placa} - {vehicle.marca} {vehicle.modelo}
                </option>
              ))}
            </select>
            {!formData.clientId && (
              <p className="text-xs text-gray-500 mt-1">⚠️ Primeiro selecione um cliente</p>
            )}
            {formData.clientId && filteredVehicles.length === 0 && (
              <p className="text-xs text-red-500 mt-1">⚠️ Este cliente não possui veículos cadastrados</p>
            )}
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="aberta">🟡 Aberta</option>
              <option value="andamento">🔵 Em andamento</option>
              <option value="concluida">✅ Concluída</option>
            </select>
          </div>
          
          {/* Descrição */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Descrição do Serviço
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
              placeholder="Descreva os serviços a serem realizados..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          {/* Serviços */}
          <div className="border-t pt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              🔧 Serviços Realizados
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nome do serviço"
                value={newService.name}
                onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor"
                value={newService.value}
                onChange={(e) => setNewService(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                className="w-28 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addService}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                +
              </button>
            </div>
            <div className="space-y-1">
              {formData.services.map(service => (
                <div key={service.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{service.name}</span>
                  <span>{formatMoney(service.value)}</span>
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Peças */}
          <div className="border-t pt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              🔩 Peças Utilizadas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nome da peça"
                value={newPart.name}
                onChange={(e) => setNewPart(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Valor"
                value={newPart.value}
                onChange={(e) => setNewPart(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                className="w-28 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={addPart}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                +
              </button>
            </div>
            <div className="space-y-1">
              {formData.parts.map(part => (
                <div key={part.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span>{part.name}</span>
                  <span>{formatMoney(part.value)}</span>
                  <button
                    type="button"
                    onClick={() => removePart(part.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Total */}
          <div className="border-t pt-4 bg-gray-50 -mx-6 px-6 py-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">💰 TOTAL DA OS:</span>
              <span className="text-2xl font-bold text-green-600">{formatMoney(formData.total)}</span>
            </div>
          </div>
          
          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : (initialData ? '✏️ Atualizar' : '💾 Salvar OS')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderForm;