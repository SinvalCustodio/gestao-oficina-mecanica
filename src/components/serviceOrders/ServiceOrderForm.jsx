/**
 * COMPONENTE: ServiceOrderForm
 * 
 * Formulário para criar/editar uma Ordem de Serviço
 */

import { useEffect, useState } from 'react';
import { loadData, STORAGE_KEYS } from '../../services/localStorageService';
import Icon from '../layout/Icon';
import { clienteService } from '../../services/api';

const ServiceOrderForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(() => ({
    clientId: initialData?.clientId || '',
    clientName: initialData?.clientName || '',
    vehicleId: initialData?.vehicleId || '',
    vehiclePlate: initialData?.vehiclePlate || '',
    vehicleModel: initialData?.vehicleModel || '',
    services: initialData?.services || [],
    parts: initialData?.parts || [],
    status: initialData?.status || 'aberta',
    total: initialData?.total || 0,
    description: initialData?.description || ''
  }));

  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [clientLoadError, setClientLoadError] = useState('');
  const [vehicles] = useState(() => loadData(STORAGE_KEYS.VEHICLES));
  const filteredVehicles = vehicles.filter((vehicle) =>
    formData.clientId && vehicle.clientId?.toString() === formData.clientId.toString()
  );
  const [newService, setNewService] = useState({ name: '', value: 0 });
  const [newPart, setNewPart] = useState({ name: '', value: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    clienteService.listar()
      .then((data) => {
        if (isCurrent) setClients(data);
      })
      .catch(() => {
        if (isCurrent) setClientLoadError('Não foi possível carregar os clientes. Verifique a conexão com o servidor.');
      })
      .finally(() => {
        if (isCurrent) setIsLoadingClients(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  // Quando seleciona um cliente, filtra os veículos daquele cliente
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const selectedClient = clients.find((client) => client.id?.toString() === clientId);
    
    setFormData(prev => ({
      ...prev,
      clientId: clientId,
      clientName: selectedClient?.nome || selectedClient?.name || '',
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

  // Submete o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const orderData = {
      ...formData,
      total: calculateTotal(),
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
    <div className="dialog-overlay">
      <div className="dialog-panel dialog-panel-wide" role="dialog" aria-modal="true" aria-labelledby="service-order-form-title">
        <div className="dialog-header">
          <span className="dialog-header-mark"><Icon name="clipboard" size={18} /></span>
          <div>
            <h3 id="service-order-form-title">{initialData ? 'Editar ordem de serviço' : 'Nova ordem de serviço'}</h3>
            <p>Registre o atendimento, os serviços e as peças utilizadas.</p>
          </div>
        </div>
        
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="dialog-form max-h-[70vh] overflow-y-auto">
          {/* Cliente */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cliente *
            </label>
            <select
              value={formData.clientId}
              onChange={handleClientChange}
              required
              disabled={isLoadingClients}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">
                {isLoadingClients ? 'Carregando clientes...' : '-- Selecione um cliente --'}
              </option>
              {formData.clientId && !clients.some((client) => client.id?.toString() === formData.clientId.toString()) && (
                <option value={formData.clientId}>{formData.clientName || 'Cliente vinculado'}</option>
              )}
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.nome || client.name}</option>
              ))}
            </select>
            {clientLoadError && <p className="form-error" role="alert">{clientLoadError}</p>}
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
          <div className="form-subsection">
            <h4 className="form-subsection-title">Serviços realizados</h4>
            <div className="form-entry-row">
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
                className="form-add-button"
              >
                +
              </button>
            </div>
            <div className="form-entry-list">
              {formData.services.map(service => (
                <div key={service.id} className="form-line-item">
                  <span>{service.name}</span>
                  <span>{formatMoney(service.value)}</span>
                  <button
                    type="button"
                    onClick={() => removeService(service.id)}
                    className="form-remove-button"
                    aria-label={`Remover serviço ${service.name}`}
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Peças */}
          <div className="form-subsection">
            <h4 className="form-subsection-title">Peças utilizadas</h4>
            <div className="form-entry-row">
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
                className="form-add-button"
              >
                +
              </button>
            </div>
            <div className="form-entry-list">
              {formData.parts.map(part => (
                <div key={part.id} className="form-line-item">
                  <span>{part.name}</span>
                  <span>{formatMoney(part.value)}</span>
                  <button
                    type="button"
                    onClick={() => removePart(part.id)}
                    className="form-remove-button"
                    aria-label={`Remover peça ${part.name}`}
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Total */}
          <div className="form-total">
            <div className="flex justify-between items-center">
              <span>Total da ordem</span>
              <strong>{formatMoney(calculateTotal())}</strong>
            </div>
          </div>
          
          {/* Botões */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="action-primary"
            >
              {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar ordem' : 'Salvar ordem')}
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

export default ServiceOrderForm;