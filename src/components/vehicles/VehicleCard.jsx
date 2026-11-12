/**
 * COMPONENTE: VehicleCard
 * 
 * Exibe as informações de um veículo em formato de card
 * Inclui botões de editar e deletar
 */

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  // Função para formatar a data de cadastro
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  // Retorna o ícone baseado no tipo do veículo
  const getVehicleIcon = (type) => {
    switch(type) {
      case 'carro': return '🚗';
      case 'moto': return '🏍️';
      case 'caminhao': return '🚛';
      default: return '🚙';
    }
  };

  // Retorna a cor baseada no status
  const getStatusColor = (status) => {
    switch(status) {
      case 'aguardando': return 'bg-blue-100 text-blue-700';
      case 'manutencao': return 'bg-yellow-100 text-yellow-700';
      case 'concluido': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Retorna o texto do status
  const getStatusText = (status) => {
    switch(status) {
      case 'aguardando': return '⏳ Aguardando serviço';
      case 'manutencao': return '🔧 Em manutenção';
      case 'concluido': return '✅ Serviço concluído';
      default: return '❓ Status desconhecido';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Cabeçalho do card */}
      <div className="px-4 py-3 bg-gray-800 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getVehicleIcon(vehicle.vehicleType)}</span>
            <span className="font-semibold">{vehicle.placa?.toUpperCase() || 'SEM PLACA'}</span>
          </div>
          {/* Status badge - usando as novas cores */}
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
            {getStatusText(vehicle.status)}
          </span>
        </div>
      </div>
      
      {/* Corpo do card */}
      <div className="p-4 space-y-2">
        {/* Modelo */}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">🏷️</span>
          <span className="text-sm font-medium">{vehicle.modelo || 'Modelo não informado'}</span>
        </div>
        
        {/* Marca e Ano */}
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">🔧</span>
          <span className="text-sm">{vehicle.marca || 'Marca não informada'} • {vehicle.ano || 'Ano não informado'}</span>
        </div>
        
        {/* Cor */}
        {vehicle.cor && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">🎨</span>
            <span className="text-sm">{vehicle.cor}</span>
          </div>
        )}
        
        {/* Cliente Dono */}
        <div className="flex items-center gap-2 text-gray-600 pt-2 border-t">
          <span className="text-sm">👤</span>
          <span className="text-sm truncate">Dono: {vehicle.clientName || 'Cliente não vinculado'}</span>
        </div>
        
        {/* Data de cadastro */}
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <span>📅 Cadastro: {formatDate(vehicle.createdAt)}</span>
        </div>
      </div>
      
      {/* Botões de ação */}
      <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
        <button
          onClick={() => onEdit(vehicle)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => onDelete(vehicle.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;