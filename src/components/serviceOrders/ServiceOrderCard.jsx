import Icon from '../layout/Icon';

const statusInfo = {
  aberta: { text: 'Aberta', className: 'status-open' },
  andamento: { text: 'Em andamento', className: 'status-progress' },
  concluida: { text: 'Concluída', className: 'status-done' }
};

const ServiceOrderCard = ({ order, onEdit, onDelete }) => {
  const status = statusInfo[order.status] || { text: 'Sem status', className: '' };
  const formatMoney = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  const openedAt = order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : 'Data não informada';

  return (
    <article className="record-card">
      <header className="record-card-top">
        <div className="record-card-identity">
          <span className="record-icon"><Icon name="clipboard" size={16} /></span>
          <span className="record-title">Ordem #{order.id}<small className="record-subtitle">{openedAt}</small></span>
        </div>
        <span className={`record-tag ${status.className}`}>{status.text}</span>
      </header>
      <div className="record-card-body">
        <div className="record-detail"><Icon name="user" size={14} /><span title={order.clientName}> {order.clientName || 'Cliente não informado'}</span></div>
        <div className="record-detail"><Icon name="vehicle" size={14} /><span>{order.vehiclePlate || 'Veículo não informado'}</span></div>
        <hr className="record-divider" />
        <div className="record-detail"><Icon name="clipboard" size={14} /><span>Total do serviço</span><strong className="record-amount">{formatMoney(order.total)}</strong></div>
      </div>
      <footer className="record-card-actions">
        <button className="action-quiet" onClick={() => onEdit(order)}><Icon name="spark" size={13} /> Editar</button>
        <button className="action-danger" onClick={() => onDelete(order.id)}><Icon name="trash" size={13} /> Excluir</button>
      </footer>
    </article>
  );
};

export default ServiceOrderCard;
