import Icon from '../layout/Icon';

const statusInfo = {
  ativo: { text: 'Ativo', className: '' },
  aguardando: { text: 'Aguardando', className: 'status-open' },
  manutencao: { text: 'Em serviço', className: 'status-progress' },
  concluido: { text: 'Concluído', className: 'status-done' }
};

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  const status = statusInfo[vehicle.status] || { text: 'Sem status', className: '' };
  const registeredAt = vehicle.createdAt
    ? new Date(vehicle.createdAt).toLocaleDateString('pt-BR')
    : null;

  return (
    <article className="record-card">
      <header className="record-card-top">
        <div className="record-card-identity">
          <span className="record-icon"><Icon name={vehicle.vehicleType === 'moto' ? 'activity' : vehicle.vehicleType === 'caminhao' ? 'truck' : 'vehicle'} size={17} /></span>
          <span className="record-title">{vehicle.placa?.toUpperCase() || 'Sem placa'}<small className="record-subtitle">{[vehicle.marca, vehicle.modelo].filter(Boolean).join(' ') || 'Modelo não informado'}</small></span>
        </div>
        <span className={`record-tag ${status.className}`}>{status.text}</span>
      </header>
      <div className="record-card-body">
        <div className="record-detail"><Icon name="wrench" size={14} /><span>{vehicle.marca || 'Marca não informada'}{vehicle.ano ? ` · ${vehicle.ano}` : ''}</span></div>
        {vehicle.cor && <div className="record-detail"><Icon name="spark" size={14} /><span>{vehicle.cor}</span></div>}
        <hr className="record-divider" />
        <div className="record-detail"><Icon name="user" size={14} /><span title={vehicle.clientName}>{vehicle.clientName || 'Cliente não vinculado'}</span></div>
        {registeredAt && <div className="record-detail"><Icon name="calendar" size={14} /><span>Cadastrado em {registeredAt}</span></div>}
      </div>
      <footer className="record-card-actions">
        <button className="action-quiet" onClick={() => onEdit(vehicle)}><Icon name="spark" size={13} /> Editar</button>
        <button className="action-danger" onClick={() => onDelete(vehicle.id)}><Icon name="trash" size={13} /> Excluir</button>
      </footer>
    </article>
  );
};

export default VehicleCard;
