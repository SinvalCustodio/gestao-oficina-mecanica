/**
 * COMPONENTE: VehicleForm
 * 
 * Formulário para cadastrar ou editar um veículo
 */

import { useState, useEffect } from 'react';
import { validateRequired } from '../../utils/validators';
import { loadData, STORAGE_KEYS } from '../../services/localStorageService';

const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
    // Estados do formulário
    const [formData, setFormData] = useState({
        placa: '',
        modelo: '',
        marca: '',
        ano: '',
        cor: '',
        vehicleType: 'carro',
        status: 'ativo',
        clientId: '',
        clientName: ''
    });

    // Lista de clientes para vincular o veículo
    const [clients, setClients] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Carrega a lista de clientes
    useEffect(() => {
        const storedClients = loadData(STORAGE_KEYS.CLIENTS);
        setClients(storedClients);
    }, []);

    // Se tiver dados iniciais (edição), preenche o formulário
    useEffect(() => {
        if (initialData) {
            setFormData({
                placa: initialData.placa || '',
                modelo: initialData.modelo || '',
                marca: initialData.marca || '',
                ano: initialData.ano || '',
                cor: initialData.cor || '',
                vehicleType: initialData.vehicleType || 'carro',
                status: initialData.status || 'ativo',
                clientId: initialData.clientId || '',
                clientName: initialData.clientName || ''
            });
        }
    }, [initialData]);

    // Atualiza um campo específico do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpa o erro do campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Quando seleciona um cliente, preenche automaticamente o nome
    const handleClientChange = (e) => {
        const clientId = e.target.value;
        const selectedClient = clients.find(c => c.id.toString() === clientId);

        setFormData(prev => ({
            ...prev,
            clientId: clientId,
            clientName: selectedClient ? selectedClient.name : ''
        }));
    };

    // Valida todos os campos antes de enviar
    const validateForm = () => {
        const newErrors = {};

        const placaValidation = validateRequired(formData.placa, 'Placa');
        if (!placaValidation.isValid) newErrors.placa = placaValidation.message;

        const modeloValidation = validateRequired(formData.modelo, 'Modelo');
        if (!modeloValidation.isValid) newErrors.modelo = modeloValidation.message;

        const marcaValidation = validateRequired(formData.marca, 'Marca');
        if (!marcaValidation.isValid) newErrors.marca = marcaValidation.message;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Envia o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Prepara os dados para salvar
        const vehicleData = {
            ...formData,
            placa: formData.placa.toUpperCase(), // Placa sempre maiúscula
            updatedAt: Date.now()
        };

        // Se for novo veículo, adiciona createdAt
        if (!initialData) {
            vehicleData.createdAt = Date.now();
        } else {
            vehicleData.createdAt = initialData.createdAt;
            vehicleData.id = initialData.id;
        }

        await onSubmit(vehicleData);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto">
                {/* Cabeçalho */}
                <div className={`px-6 py-4 ${initialData ? 'bg-yellow-500' : 'bg-green-600'} text-white`}>
                    <h3 className="text-lg font-semibold">
                        {initialData ? '✏️ Editar Veículo' : '🚗 Novo Veículo'}
                    </h3>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Placa */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Placa * (sem espaços)
                        </label>
                        <input
                            type="text"
                            name="placa"
                            value={formData.placa}
                            onChange={handleChange}
                            placeholder="ABC1D23"
                            maxLength="8"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 uppercase"
                        />
                        {errors.placa && <p className="text-red-500 text-xs mt-1">{errors.placa}</p>}
                    </div>

                    {/* Modelo */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Modelo *
                        </label>
                        <input
                            type="text"
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                            placeholder="Ex: Civic, Onix, Fiesta..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.modelo && <p className="text-red-500 text-xs mt-1">{errors.modelo}</p>}
                    </div>

                    {/* Marca */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Marca *
                        </label>
                        <input
                            type="text"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            placeholder="Ex: Honda, Ford, Chevrolet..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca}</p>}
                    </div>

                    {/* Ano e Cor em linha */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Ano
                            </label>
                            <input
                                type="text"
                                name="ano"
                                value={formData.ano}
                                onChange={handleChange}
                                placeholder="2024"
                                maxLength="4"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Cor
                            </label>
                            <input
                                type="text"
                                name="cor"
                                value={formData.cor}
                                onChange={handleChange}
                                placeholder="Ex: Preto, Branco..."
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                    </div>

                    {/* Tipo do Veículo */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo do Veículo
                        </label>
                        <select
                            name="vehicleType"
                            value={formData.vehicleType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="carro">🚗 Carro</option>
                            <option value="moto">🏍️ Moto</option>
                            <option value="caminhao">🚛 Caminhão</option>
                        </select>
                    </div>

                    {/* Status do Veículo */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Status do Veículo
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="aguardando">⏳ Aguardando serviço</option>
                            <option value="manutencao">🔧 Em manutenção</option>
                            <option value="concluido">✅ Serviço concluído</option>
                        </select>
                    </div>

                    {/* Cliente Dono (opcional) */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Cliente Dono (opcional)
                        </label>
                        <select
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleClientChange}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">-- Selecione um cliente --</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 ${initialData ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50`}
                        >
                            {isSubmitting ? 'Salvando...' : (initialData ? '✏️ Atualizar' : '💾 Salvar')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;