/**
 * COMPONENTE: ServiceOrderCard
 * 
 * Exibe as informações de uma Ordem de Serviço em formato de card
 */

const ServiceOrderCard = ({ order, onEdit, onDelete }) => {
  // Formatar data
  const formatDate = (timestamp) => {
    if (!timestamp) return '---';
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  // Formatar valor monetário
  const formatMoney = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Cor e texto do status
  const getStatusInfo = (status) => {
    switch(status) {
      case 'aberta':
        return { text: '🟡 Aberta', color: 'bg-yellow-100 text-yellow-700' };
      case 'andamento':
        return { text: '🔵 Em andamento', color: 'bg-blue-100 text-blue-700' };
      case 'concluida':
        return { text: '✅ Concluída', color: 'bg-green-100 text-green-700' };
      default:
        return { text: '❓ Desconhecido', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 py-3 bg-gray-800 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="font-bold">OS #{order.id}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color}`}>
            {statusInfo.text}
          </span>
        </div>
      </div>
      
      {/* Corpo */}
      <div className="p-4 space-y-2">
        {/* Cliente */}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">👤</span>
          <span className="text-sm font-medium">Cliente: {order.clientName || 'Não informado'}</span>
        </div>
        
        {/* Veículo */}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">🚗</span>
          <span className="text-sm">Veículo: {order.vehiclePlate || 'Não informado'}</span>
        </div>
        
        {/* Data de abertura */}
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>📅 Abertura: {formatDate(order.createdAt)}</span>
        </div>
        
        {/* Valor total */}
        <div className="flex items-center gap-2 text-gray-800 pt-2 border-t">
          <span className="text-sm font-bold">💰 Total:</span>
          <span className="text-lg font-bold text-green-600">{formatMoney(order.total || 0)}</span>
        </div>
      </div>
      
      {/* Botões */}
      <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
        <button
          onClick={() => onEdit(order)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(order.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

export default ServiceOrderCard;