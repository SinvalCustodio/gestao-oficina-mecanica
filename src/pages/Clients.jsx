import { useCallback, useEffect, useState } from 'react';
import ClientCard from '../components/clients/ClientCard';
import ClientForm from '../components/clients/ClientForm';
import Icon from '../components/layout/Icon';
import { clienteService } from '../services/api';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = useCallback((text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }, []);

  const loadClients = useCallback(async () => {
    try {
      setClients(await clienteService.listar());
    } catch {
      showMessage('Não foi possível carregar os clientes. Verifique a conexão com o servidor.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    let isCurrent = true;
    clienteService.listar()
      .then((data) => {
        if (isCurrent) setClients(data);
      })
      .catch(() => {
        if (isCurrent) showMessage('Não foi possível carregar os clientes. Verifique a conexão com o servidor.', 'error');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [showMessage]);

  const handleNewClient = () => {
    setEditingClient(null);
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleSaveClient = () => {
    showMessage(editingClient ? 'Cliente atualizado com sucesso.' : 'Cliente cadastrado com sucesso.');
    setShowForm(false);
    setEditingClient(null);
    loadClients();
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) return;

    try {
      await clienteService.excluir(id);
      showMessage('Cliente removido com sucesso.', 'warning');
      loadClients();
    } catch {
      showMessage('Não foi possível excluir o cliente. Tente novamente.', 'error');
    }
  };

  const normalizedSearch = searchTerm.toLowerCase();
  const filteredClients = clients.filter((client) =>
    client.nome?.toLowerCase().includes(normalizedSearch) ||
    client.email?.toLowerCase().includes(normalizedSearch) ||
    client.telefone?.includes(searchTerm)
  );
  const noticeClass = message.type === 'error' ? 'notice-error' : message.type === 'warning' ? 'notice-warning' : 'notice-success';

  return (
    <section className="page-shell">
      <header className="page-heading">
        <div className="page-heading-copy">
          <span className="page-heading-icon"><Icon name="users" size={20} /></span>
          <div>
            <h1>Clientes</h1>
            <p>Seu relacionamento com cada cliente, em um só lugar.</p>
          </div>
        </div>
        <button className="action-primary" onClick={handleNewClient}><Icon name="plus" size={17} /> Novo cliente</button>
      </header>

      <div className="page-toolbar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Buscar por nome, e-mail ou telefone..."
            aria-label="Buscar clientes"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>
        <span className="page-count">Exibindo <strong>{filteredClients.length}</strong> de <strong>{clients.length}</strong></span>
      </div>

      {message.text && <div className={`notice ${noticeClass}`} role="status">{message.text}</div>}

      <div className="page-content">
        {isLoading ? (
          <div className="empty-state" aria-live="polite"><span className="eyebrow">AGUARDE UM INSTANTE</span><h2>Carregando clientes</h2></div>
        ) : filteredClients.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon"><Icon name={searchTerm ? 'search' : 'users'} size={23} /></span>
            <h2>{searchTerm ? 'Nenhum cliente encontrado' : 'Sua lista começa aqui'}</h2>
            <p>{searchTerm ? 'Tente outra busca ou limpe o filtro.' : 'Cadastre o primeiro cliente da sua oficina.'}</p>
            {searchTerm ? (
              <button className="action-secondary" onClick={() => setSearchTerm('')}>Limpar busca</button>
            ) : (
              <button className="action-primary" onClick={handleNewClient}><Icon name="plus" size={16} /> Cadastrar cliente</button>
            )}
          </div>
        ) : (
          <div className="record-grid">
            {filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} onEdit={handleEditClient} onDelete={handleDeleteClient} />
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
    </section>
  );
};

export default Clients;
