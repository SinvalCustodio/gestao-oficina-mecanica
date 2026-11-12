import { useState } from 'react';
import ServiceOrderCard from '../components/serviceOrders/ServiceOrderCard';
import ServiceOrderForm from '../components/serviceOrders/ServiceOrderForm';
import Icon from '../components/layout/Icon';
import { loadData, addItem, updateItem, deleteItem, STORAGE_KEYS } from '../services/localStorageService';

const ServiceOrders = () => {
  const [orders, setOrders] = useState(() => loadData(STORAGE_KEYS.SERVICE_ORDERS));
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (editingOrder) {
        setOrders(updateItem(STORAGE_KEYS.SERVICE_ORDERS, editingOrder.id, orderData));
        showMessage('Ordem de serviço atualizada com sucesso.');
      } else {
        setOrders(addItem(STORAGE_KEYS.SERVICE_ORDERS, orderData));
        showMessage('Ordem de serviço criada com sucesso.');
      }
      setShowForm(false);
      setEditingOrder(null);
    } catch {
      showMessage('Não foi possível salvar a ordem de serviço. Tente novamente.', 'error');
    }
  };

  const handleDeleteOrder = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.')) return;

    try {
      setOrders(deleteItem(STORAGE_KEYS.SERVICE_ORDERS, id));
      showMessage('Ordem de serviço removida com sucesso.', 'warning');
    } catch {
      showMessage('Não foi possível remover a ordem de serviço. Tente novamente.', 'error');
    }
  };

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredOrders = orders.filter((order) =>
    order.clientName?.toLowerCase().includes(normalizedSearch) ||
    order.vehiclePlate?.toLowerCase().includes(normalizedSearch)
  );
  const noticeClass = message.type === 'error' ? 'notice-error' : message.type === 'warning' ? 'notice-warning' : 'notice-success';

  return (
    <section className="page-shell">
      <header className="page-heading">
        <div className="page-heading-copy">
          <span className="page-heading-icon"><Icon name="clipboard" size={20} /></span>
          <div>
            <h1>Ordens de serviço</h1>
            <p>Acompanhe os serviços da abertura até a entrega.</p>
          </div>
        </div>
        <button
          className="action-primary"
          onClick={() => {
            setEditingOrder(null);
            setShowForm(true);
          }}
        >
          <Icon name="plus" size={17} /> Nova ordem
        </button>
      </header>

      <section className="order-overview" aria-label="Resumo das ordens de serviço">
        <div><span>Total de ordens</span><strong>{orders.length.toString().padStart(2, '0')}</strong></div>
        <div><span>Em aberto</span><strong>{orders.filter((order) => order.status !== 'concluida').length.toString().padStart(2, '0')}</strong></div>
        <div><span>Concluídas</span><strong>{orders.filter((order) => order.status === 'concluida').length.toString().padStart(2, '0')}</strong></div>
      </section>

      <div className="page-toolbar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Buscar por cliente ou placa..."
            aria-label="Buscar ordens de serviço"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <span className="page-count">Exibindo <strong>{filteredOrders.length}</strong> de <strong>{orders.length}</strong></span>
      </div>

      {message.text && <div className={`notice ${noticeClass}`} role="status">{message.text}</div>}

      <div className="page-content">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><Icon name={searchTerm ? 'search' : 'clipboard'} size={23} /></span>
            <h2>{searchTerm ? 'Nenhuma ordem encontrada' : 'Nenhuma ordem de serviço ainda'}</h2>
            <p>{searchTerm ? 'Tente outra busca ou limpe o filtro.' : 'Abra uma nova ordem para começar a acompanhar os serviços.'}</p>
            {searchTerm ? (
              <button className="action-secondary" onClick={() => setSearchTerm('')}>Limpar busca</button>
            ) : (
              <button className="action-primary" onClick={() => setShowForm(true)}><Icon name="plus" size={16} /> Criar ordem de serviço</button>
            )}
          </div>
        ) : (
          <div className="record-grid">
            {filteredOrders.map((order) => (
              <ServiceOrderCard
                key={order.id}
                order={order}
                onEdit={(item) => {
                  setEditingOrder(item);
                  setShowForm(true);
                }}
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
    </section>
  );
};

export default ServiceOrders;
