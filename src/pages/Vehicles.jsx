import { useState } from 'react';
import VehicleCard from '../components/vehicles/VehicleCard';
import VehicleForm from '../components/vehicles/VehicleForm';
import Icon from '../components/layout/Icon';
import { loadData, addItem, updateItem, deleteItem, STORAGE_KEYS } from '../services/localStorageService';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(() => loadData(STORAGE_KEYS.VEHICLES));
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSaveVehicle = async (vehicleData) => {
    try {
      if (editingVehicle) {
        setVehicles(updateItem(STORAGE_KEYS.VEHICLES, editingVehicle.id, vehicleData));
        showMessage('Veículo atualizado com sucesso.');
      } else {
        setVehicles(addItem(STORAGE_KEYS.VEHICLES, vehicleData));
        showMessage('Veículo cadastrado com sucesso.');
      }
      setShowForm(false);
      setEditingVehicle(null);
    } catch {
      showMessage('Não foi possível salvar o veículo. Tente novamente.', 'error');
    }
  };

  const handleDeleteVehicle = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.')) return;

    try {
      setVehicles(deleteItem(STORAGE_KEYS.VEHICLES, id));
      showMessage('Veículo removido com sucesso.', 'warning');
    } catch {
      showMessage('Não foi possível remover o veículo. Tente novamente.', 'error');
    }
  };

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.placa?.toLowerCase().includes(normalizedSearch) ||
    vehicle.modelo?.toLowerCase().includes(normalizedSearch) ||
    vehicle.marca?.toLowerCase().includes(normalizedSearch)
  );
  const noticeClass = message.type === 'error' ? 'notice-error' : message.type === 'warning' ? 'notice-warning' : 'notice-success';

  return (
    <section className="page-shell">
      <header className="page-heading">
        <div className="page-heading-copy">
          <span className="page-heading-icon"><Icon name="vehicle" size={20} /></span>
          <div>
            <h1>Veículos</h1>
            <p>Tenha cada veículo e atendimento sempre à mão.</p>
          </div>
        </div>
        <button
          className="action-primary"
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
        >
          <Icon name="plus" size={17} /> Novo veículo
        </button>
      </header>

      <div className="page-toolbar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Buscar por placa, modelo ou marca..."
            aria-label="Buscar veículos"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <span className="page-count">Exibindo <strong>{filteredVehicles.length}</strong> de <strong>{vehicles.length}</strong></span>
      </div>

      {message.text && <div className={`notice ${noticeClass}`} role="status">{message.text}</div>}

      <div className="page-content">
        {filteredVehicles.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><Icon name={searchTerm ? 'search' : 'vehicle'} size={23} /></span>
            <h2>{searchTerm ? 'Nenhum veículo encontrado' : 'Sua garagem começa aqui'}</h2>
            <p>{searchTerm ? 'Tente outra busca ou limpe o filtro.' : 'Cadastre o primeiro veículo da sua oficina.'}</p>
            {searchTerm ? (
              <button className="action-secondary" onClick={() => setSearchTerm('')}>Limpar busca</button>
            ) : (
              <button className="action-primary" onClick={() => setShowForm(true)}><Icon name="plus" size={16} /> Cadastrar veículo</button>
            )}
          </div>
        ) : (
          <div className="record-grid">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={(item) => {
                  setEditingVehicle(item);
                  setShowForm(true);
                }}
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
    </section>
  );
};

export default Vehicles;
