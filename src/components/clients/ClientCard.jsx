import Icon from '../layout/Icon';

const ClientCard = ({ client, onEdit, onDelete }) => (
  <article className="record-card">
    <header className="record-card-top">
      <div className="record-card-identity">
        <span className="record-icon"><Icon name={client.tipo === 'PARTICULAR' ? 'user' : 'users'} size={16} /></span>
        <span className="record-title">{client.nome || 'Cliente sem nome'}<small className="record-subtitle">{client.tipo === 'PARTICULAR' ? 'Pessoa física' : 'Empresa / frota'}</small></span>
      </div>
      <span className="record-tag">#{client.id}</span>
    </header>
    <div className="record-card-body">
      <div className="record-detail"><Icon name="mail" size={14} /><span title={client.email}>{client.email || 'E-mail não informado'}</span></div>
      <div className="record-detail"><Icon name="phone" size={14} /><span>{client.telefone || 'Telefone não informado'}</span></div>
      {client.endereco && <div className="record-detail"><Icon name="pin" size={14} /><span title={client.endereco}>{client.endereco}</span></div>}
    </div>
    <footer className="record-card-actions">
      <button className="action-quiet" onClick={() => onEdit(client)}><Icon name="spark" size={13} /> Editar</button>
      <button className="action-danger" onClick={() => onDelete(client.id)}><Icon name="trash" size={13} /> Excluir</button>
    </footer>
  </article>
);

export default ClientCard;
