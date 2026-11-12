# Garagem+ — Gestão automotiva

Aplicação web para organizar clientes, veículos e ordens de serviço de uma oficina mecânica. A interface foi construída com React e Vite; os dados locais de demonstração são salvos no navegador.

## Funcionalidades

- Login de demonstração com validação de e-mail e senha e opção para mostrar ou ocultar a senha.
- Painel inicial com indicadores e atalhos para as principais áreas.
- Cadastro, consulta, edição e exclusão de clientes, veículos e ordens de serviço.
- Pesquisa de clientes, veículos e ordens de serviço.
- Interface adaptável a computadores e dispositivos móveis.

> **Atenção:** o login desta versão é uma demonstração no frontend, e os dados ficam no navegador. Ele não substitui autenticação, autorização ou armazenamento seguros em um servidor de produção.

## Tecnologias

- React 19
- Vite
- Tailwind CSS
- JavaScript
- LocalStorage para os dados locais

## Requisitos

- Node.js e npm. Consulte a versão recomendada pelo Vite para a versão instalada no projeto.

## Executar localmente

Abra um terminal na pasta do projeto e execute:

```bash
npm install
npm run dev
```

O Vite informará o endereço local, normalmente `http://localhost:5173`.

Para validar as alterações e preparar uma versão de produção:

```bash
npm run lint
npm run build
```

## Acesso de demonstração

Na tela de login, use **Preencher acesso** para preencher a conta de demonstração:

- E-mail: `admin@oficina.com`
- Senha: `Admin123`

## Histórico de alterações

### 2026-11-12 — Execução e verificação

- Corrigida a origem dos clientes nos formulários de veículos e ordens de serviço: ambos agora consultam a API usada pela tela de clientes e apresentam estados de carregamento e erro.
- Ajustadas as configurações de execução e depuração do VS Code para iniciar o Vite na porta `5173`.
- `npm run lint` e `npm run build` concluídos com sucesso; o fluxo de veículo e ordem foi verificado no navegador com uma resposta de API simulada.
- A API real em `http://localhost:8080/api` não estava disponível durante a verificação. O projeto não possui um script `npm test` configurado.

### 2026-11-11 — Documentação e versionamento

- Atualizado o histórico do README e preservados os créditos dos três autores.
- Documentado o fluxo Git para registrar alterações, consultar versões anteriores e desfazer commits sem apagar o histórico.
- Salvas as alterações em versões locais e sincronizadas com o repositório no GitHub.

### 2026-11-11 — Redesenho do frontend

- Introduzida a identidade visual **Garagem+**, incluindo novo favicon, cores, ícones e tipografia.
- Reformulada a tela de login, com layout responsivo e preenchimento da conta de demonstração.
- Renovados o painel inicial, a navegação lateral e o cabeçalho, incluindo menu adaptado a dispositivos móveis.
- Atualizadas as telas e os cartões de clientes, veículos e ordens de serviço.
- Padronizados os formulários de cadastro e edição e o resumo das ordens no painel.
- Documentada no README a natureza de demonstração do login e do armazenamento local.

## Versionar alterações e recuperar uma versão

O projeto usa Git. Cada **commit** é um ponto salvo do código: mantenha o commit anterior e crie outro quando quiser registrar um novo estado.

Depois de concluir uma alteração, revise e registre uma nova versão:

```bash
git status
git diff
git add -A
git commit -m "Descreva a alteração"
```

Consulte as versões registradas:

```bash
git log --oneline
```

Para **examinar uma versão anterior sem alterar o histórico**, substitua `<hash>` pelo identificador exibido no log:

```bash
git switch --detach <hash>
```

Depois, volte à versão mais recente da branch principal:

```bash
git switch main
```

Para **desfazer um commit publicado sem apagar o histórico**, crie um novo commit que reverta as alterações:

```bash
git revert <hash>
```

O `git revert` preserva os commits existentes. Já `git reset --hard` pode descartar alterações do projeto e não faz parte deste fluxo.

Os commits ficam no computador. Para guardar também uma cópia no GitHub e atualizar o repositório remoto:

```bash
git push origin main
```

O envio atualiza o repositório GitHub e pode publicar o código para outras pessoas. Confirme se está na conta e no repositório corretos antes de enviar.

## Autores

- Douglas Inácio
- Eric Albuquerque
- Sinval Custodio
