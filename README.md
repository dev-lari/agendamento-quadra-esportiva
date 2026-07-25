# SQUAD 07 - Agendamento de Quadras Esportivas - BootCamp Desenvolvimento Full-Stack

## Equipe  Squad 07

- João Paulo
- Matheus Pimenta
- João Pedro

---
## Objetivo 
Aplicação web desenvolvida para a gestão e organização de quadras esportivas em bairros, escolas e condomínios. O sistema simplifica a administração do uso dos espaços ao permitir o cadastro de jogadores e quadras, além do agendamento automatizado de horários, prevenindo conflitos de agenda de forma prática e intuitiva. 

---

## Tecnologias Utilizadas 
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma ORM
- **Banco de Dados:** PostgreSQL

---

## Estrutura do Projeto

```text
agendamento-quadra-esportiva/
├── database/
│   └── PrismaClient.js        # Conexão centralizada e instância do Prisma
├── prisma/
│   ├── migrations/            # Histórico de alterações do banco de dados
│   └── schema.prisma          # Modelagem de dados (Player, Court, Schedule)
├── src/
│   ├── controllers/
│   │   ├── CourtController.js # Regras de negócio e CRUD de Quadras
│   │   └── ScheduleController.js # Regras de negócio, agendamentos e validações
│   ├── routes/
│   │   └── index.js           # Centralizador de rotas da aplicação
│   └── players.js             # Endpoints para gestão de jogadores
├── .env                       # Variáveis de ambiente (DATABASE_URL)
├── .gitignore                 # Arquivos ignorados pelo Git
├── index.js                   # Ponto de entrada e inicialização do servidor (Porta 3000)
├── package.json               # Dependências e scripts do Node.js
└── README.md                  # Documentação do projeto

```

---

## Modelo de Dados

- **Player (Jogadores)**
  - `id`: identificador único (UUID)
  - `name`: nome completo
  - `email`: e-mail (único)
  - `phone`: telefone

- **Court (Quadras)**
  - `id`: identificador único (UUID)
  - `name`: nome da quadra
  - `sport`: modalidade esportiva
  - `location`: localização

- **Schedule (Reservas)**
  - `id`: identificador único (UUID)
  - `player_id`: referência ao jogador responsável
  - `court_id`: referência à quadra reservada
  - `start_time`: horário de início
  - `end_time`: horário de término

  --- 

## Endpoints da API

### Jogadores
- **GET** `/players` — lista todos os jogadores
- **POST** `/players` — cadastra um novo jogador
- **PUT** `/players/:id` — atualiza os dados de um jogador
- **DELETE** `/players/:id` — remove um jogador

### Quadras
- **GET** `/quadras` — lista todas as quadras (com reservas vinculadas)
- **POST** `/quadras` — cadastra uma nova quadra
- **PUT** `/quadras/:id` — atualiza os dados de uma quadra
- **DELETE** `/quadras/:id` — remove uma quadra (bloqueado se houver reservas vinculadas)

### Reservas
- **GET** `/reservas` — lista todas as reservas (com jogador e quadra)
- **POST** `/reserva` — cria uma nova reserva, validando conflito de horário
- **PUT** `/reserva/:id` — atualiza uma reserva existente
- **DELETE** `/reserva/:id` — remove uma reserva

---

## Como executar o projeto 

### Pré-requisitos 
- [Node.js](https://nodejs.org/) (testado na versão `v24.14.0`)
- [PostgreSQL](https://www.postgresql.org/) instalado e em execução (testado na versão `18.4`)

### 1. Clonar o repositório

```bash
git clone https://github.com/dev-lari/agendamento-quadra-esportiva.git
cd agendamento-quadra-esportiva
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar o banco de dados PostgreSQL

Acesse o `psql` como superusuário e crie um usuário e um banco de dados para o projeto:

```bash
sudo -u postgres psql
```

Dentro do `psql`:

```sql
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
ALTER USER seu_usuario CREATEDB;
CREATE DATABASE agendamento_quadras OWNER seu_usuario;
\q
```

> A permissão `CREATEDB` é necessária para que o Prisma consiga criar o banco de dados temporário ("shadow database") usado durante as migrations.

### 4. Criar o arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com o seguinte conteúdo (substituindo pelos dados do seu banco):

> Este arquivo nunca deve ser enviado ao repositório (já está listado no `.gitignore`).

### 5. Rodar as migrations

```bash
npx prisma migrate dev
```

### 6. Gerar o Prisma Client

```bash
npx prisma generate
```

### 7. Iniciar o servidor

```bash
npm start
```

O servidor estará disponível em `http://localhost:3000`.