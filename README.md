# 🚗 Sistema de Gestão de Oficina Mecânica

Sistema completo para gerenciamento de oficina mecânica, desenvolvido com React e Vite.

## 📋 Funcionalidades

- ✅ **Autenticação de usuário** (login com validação de email e senha forte)
- ✅ **CRUD de Clientes** (Cadastrar, Listar, Editar, Excluir)
- ✅ **CRUD de Veículos** (Cadastrar, Listar, Editar, Excluir)
- ✅ **CRUD de Ordens de Serviço** (Cadastrar, Listar, Editar, Excluir)
- ✅ **Persistência de dados** com LocalStorage
- ✅ **Design responsivo** com Tailwind CSS (funciona em celular, tablet e desktop)
- ✅ **Interface moderna** com menu lateral responsivo (hambúrguer no mobile)

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| React 18 | Biblioteca para construção da interface |
| Vite | Build tool e servidor de desenvolvimento |
| Tailwind CSS | Framework de CSS para estilização |
| LocalStorage | Persistência de dados no navegador |

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/gestao-oficina-mecanica.git

# 2. Acesse a pasta do projeto
cd gestao-oficina-mecanica

# 3. Instale as dependências
npm install

# 4. Execute o projeto
npm run dev

# 5. Acesse no navegador
# http://localhost:5173




# ESTRUTURA DO PROJETO #
text
src/
├── components/
│   ├── auth/          # Componentes de autenticação (LoginForm)
│   ├── clients/       # Componentes de clientes (ClientCard, ClientForm)
│   ├── layout/        # Layout (Header, Sidebar, MainLayout)
│   ├── vehicles/      # Componentes de veículos (VehicleCard, VehicleForm)
│   └── serviceOrders/ # Componentes de OS (ServiceOrderCard, ServiceOrderForm)
├── pages/             # Páginas da aplicação
├── services/          # Serviços (LocalStorage)
├── utils/             # Utilitários (validações de email e senha)
└── hooks/             # Hooks personalizados


________________________________________________________________________

           # FUNCIONALIDADES DETALHADAS #

        # Login
Validação de email em tempo real

Validação de senha forte (maiúscula, minúscula, número, 6+ caracteres)

Botão "olhinho" para mostrar/esconder senha

Mensagens de erro amigáveis
__________________________________________________________________________


        # Clientes
Cadastro com nome, email, telefone, tipo (particular/empresa) e endereço

Listagem em cards organizados

Busca por nome, email ou telefone

Edição e exclusão com confirmação
__________________________________________________________________________


        # Veículos
Cadastro com placa, modelo, marca, ano, cor e tipo (carro/moto/caminhão)

Status: ⏳ Aguardando serviço, 🔧 Em manutenção, ✅ Serviço concluído

Vínculo com cliente (opcional)

Busca por placa, modelo ou marca
__________________________________________________________________________


        # Ordens de Serviço
Vinculação com cliente e veículo

Adição de serviços e peças com valores

Cálculo automático do total

Status: 🟡 Aberta, 🔵 Em andamento, ✅ Concluída

Busca por cliente ou placa do veículo
___________________________________________________________________________


        # Responsividade
O sistema se adapta a diferentes tamanhos de tela:

📱 Mobile: Menu hambúrguer, cards em 1 coluna

💻 Tablet: Menu lateral visível, cards em 2 colunas

🖥️ Desktop: Menu lateral visível, cards em 3 colunas




____________________________________________________________________________
----------------------------------------------------------------------------

                               # Autores
                 * DOUGLAS INACIO & * Eric Albuquerque

----------------------------------------------------------------------------
_____________________________________________________________________________


