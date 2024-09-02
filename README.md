# Desafio Adonis

Desafio para demonstrar o conhecimento em AdonisJS, abordando conceitos como criação de APIs, autenticação, validação e testes.

## Índice

- [Descrição do Projeto](#descrição-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Configuração](#instalação-e-configuração)
- [Uso](#uso)
- [Testes](#testes)
- [Endpoints](#endpoints)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Descrição do Projeto

Este projeto é uma aplicação backend desenvolvida com AdonisJS. Inclui funcionalidades básicas como registro de usuário, login, CRUD de tarefas e filtros de tarefas. Foi desenvolvido para demonstrar a integração com o PostgreSQL e o uso de testes automatizados.

## Tecnologias Utilizadas

- [AdonisJS](https://adonisjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Japa](https://japa.dev/)
- [Vine](https://vinejs.dev/)

## Instalação e Configuração

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20.17 ou superior)
- [PostgreSQL](https://www.postgresql.org/)

### Passos para Instalação

1. Clone o repositório:
    
    git clone https://github.com/thiagopedrofer/desafio-adonis.git
    cd desafio-adonis

2. Instale as dependências:

    npm install

3. Configuração do Banco de Dados com Docker
Este projeto já inclui um arquivo docker-compose.yml para facilitar a criação e configuração do banco de dados PostgreSQL. Para iniciar o banco de dados usando Docker, siga os passos abaixo:

Certifique-se de que o Docker está instalado e em execução na sua máquina.

No diretório raiz do projeto, execute o seguinte comando para iniciar o contêiner do PostgreSQL:

docker-compose up -d

Isso criará e iniciará um contêiner PostgreSQL com as configurações especificadas no arquivo docker-compose.yml.

O banco de dados estará acessível na porta 5432 com as seguintes credenciais padrão:

Usuário: root
Senha: root
Database: backend

4. Execute as migrações:
   
    node ace migration:run

5. Inicie o servidor:
 
    npm run dev

## Uso

### Endpoints

- **POST** `/register` - Registrar um novo usuário
- **POST** `/login` - Realizar login e obter um token de autenticação
- **POST** `/api/logout` - Realizar logout e invalidar o token de autenticação
- **GET** `/api/task/:id` - Obter uma tarefa por ID
- **GET** `/api/tasks/user` - Listar todas as tarefas com filtros opcionais:
    status: 'pending', 'in_progress','completed';
    priority: 'low', 'medium', 'high';
    orderBy: 'created_at', 'priority', 'status';
    sortDirection: 'asc', 'desc'
- **PUT** `/api/task/:id` - Atualizar uma tarefa existente
- **DELETE** `/api/task/:id` - Deletar uma tarefa

### Exemplos de Requisições

#### Registrar Usuário

curl -X POST http://localhost:3333/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "John Doe", "email": "john.doe@example.com", "password": "securepassword"}'