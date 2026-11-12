/**
 * PÁGINA: Veículos
 * 
 * Gerencia o CRUD de veículos
 */

import { useState, useEffect } from 'react';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleForm from '../components/vehicles/VehicleForm';
import { loadData, addItem, updateItem, deleteItem, STORAGE_KEYS } from '../services/localStorageService';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = () => {
    setIsLoading(true);
    const storedVehicles = loadData(STORAGE_KEYS.VEHICLES);
    setVehicles(storedVehicles);
    setIsLoading(false);
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleNewVehicle = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        const updatedVehicles = updateItem(STORAGE_KEYS.VEHICLES, editingVehicle.id, vehicleData);
        setVehicles(updatedVehicles);
        showMessage('✅ Veículo atualizado com sucesso!', 'success');
      } else {
        const updatedVehicles = addItem(STORAGE_KEYS.VEHICLES, vehicleData);
        setVehicles(updatedVehicles);
        showMessage('✅ Veículo cadastrado com sucesso!', 'success');
      }
      
      setShowForm(false);
      setEditingVehicle(null);
    } catch (error) {
      showMessage('❌ Erro ao salvar veículo. Tente novamente.', 'error');
    }
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('⚠️ Tem certeza que deseja excluir este veículo?\nEsta ação não pode ser desfeita.')) {
      const updatedVehicles = deleteItem(STORAGE_KEYS.VEHICLES, id);
      setVehicles(updatedVehicles);
      showMessage('🗑️ Veículo removido com sucesso!', 'warning');
    }
  };

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-4 md:px-6 md:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">🚗 Veículos</h2>
            <p className="text-green-100 text-xs md:text-sm mt-1">
              Gerencie todos os veículos da sua oficina
            </p>
          </div>
          <button
            onClick={handleNewVehicle}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <span className="text-xl">+</span>
            Novo Veículo
          </button>
        </div>
      </div>
      
      <div className="px-4 py-3 md:px-6 md:py-4 bg-gray-50 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Buscar por placa, modelo ou marca..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>
          <div className="text-sm text-gray-600">
            📊 Total: {filteredVehicles.length} veículo(s)
            {searchTerm && ` | Filtrado de ${vehicles.length}`}
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
            <p className="text-gray-500 mt-2">Carregando veículos...</p>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚘</div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'Nenhum veículo encontrado' : 'Nenhum veículo cadastrado'}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchTerm ? 'Tente outro termo de busca' : 'Clique no botão "Novo Veículo" para começar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEditVehicle}
                onDelete={handleDeleteVehicle}
              />
            ))}
          </div>
        )}
      </div>
      
      {showForm && (
        <VehicleForm
          initialData={editingVehicle}
          onSubmit={handleSaveVehicle}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default Vehicles;