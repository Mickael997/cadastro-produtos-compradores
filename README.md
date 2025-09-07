# Sistema de Cadastro de Produtos e Compradores

Projeto fullstack desenvolvido com **React (frontend)**, **Node.js + Express (backend)** e **SQL Server (banco de dados)**.  
Possui autenticação com **JWT** e controle de permissões (usuário comum e admin).  

---

## Funcionalidades
- ✅ Login com autenticação via JWT  
- ✅ Controle de acesso por nível de usuário (admin/user)  
- ✅ Cadastro de **Produtos** (nome + categoria)  
- ✅ Cadastro de **Compradores** (nome + CPF/CNPJ)  
- ✅ Validação de CPF/CNPJ e prevenção de duplicidade  
- ✅ Editar/Excluir registros (somente admin pode excluir)  
- ✅ Busca de produtos por nome ou categoria  
- ✅ Interface simples e responsiva  

---

## 📂 Estrutura do Projeto
```
📦 projeto-cadastros
 ┣ 📂 backend
 ┃ ┣ 📂 controllers
 ┃ ┣ 📂 middleware
 ┃ ┣ 📂 models
 ┃ ┣ 📂 routes
 ┃ ┣ 📂 utils
 ┃ ┣ db.js
 ┃ ┣ index.js
 ┃ ┣ seedUser.js
 ┃ ┣ package.json
 ┃ ┗ package-lock.json
 ┣ 📂 frontend
 ┃ ┣ 📂 node_modules
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 assets
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📂 services
 ┃ ┃ ┣ 📂 utils
 ┃ ┃ ┣ App.jsx
 ┃ ┃ ┣ index.css
 ┃ ┃ ┗ main.jsx
 ┃ ┣ index.html
 ┃ ┣ vite.config.js
 ┃ ┣ package.json
 ┃ ┗ package-lock.json
 ┣ 📜 .gitignore
 ┗ 📜 README.md
```

---

## Pré-requisitos
Antes de começar, instale:  
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)  
- [SQL Server](https://www.microsoft.com/pt-br/sql-server/sql-server-downloads)  
- [Git](https://git-scm.com/)  

---

## Configuração do Banco de Dados

1. Crie um banco chamado **`CadProdComp`** no SQL Server.  
2. Execute os scripts abaixo para criar as tabelas:  

```sql

CREATE DATABASE CadProdComp;

USE CadProdComp;

CREATE TABLE Usuarios (
  id INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
);

CREATE TABLE Produtos (
  id INT PRIMARY KEY IDENTITY(1,1),
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(20) NOT NULL,
  CONSTRAINT UQ_Produto UNIQUE (nome, categoria)
);

CREATE TABLE Compradores (
  id INT PRIMARY KEY IDENTITY(1,1),
  nome VARCHAR(100) NOT NULL,
  documento VARCHAR(20) UNIQUE NOT NULL
);

-- Alguns exemplos de insert
INSERT INTO Produtos (nome, categoria) VALUES 
('Arroz', 'Alimentos'),
('Coca-Cola', 'Bebidas'),
('Detergente', 'Limpeza');

INSERT INTO Compradores (nome, documento) VALUES
('João da Silva', '254.903.821-55'),
('Empresa XP LTDA', '47.396.930/0001-70');
```

3. Crie os usuários padrões executando:  
```bash
cd backend
node seedUser.js
```
Isso cria:  
- **admin / 123** (acesso total)  
- **user / 123** (sem privilégios de exclusão)  

---

## Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/projeto-cadastros.git
cd projeto-cadastros
```

### 2. Backend
```bash
cd backend
npm install
# copie e configure as variáveis de ambiente
# cp .env.example .env   (Windows: copie manualmente)
node index.js
```
O backend sobe em **http://localhost:3000**

Opcional: adicione um script no `backend/package.json` para facilitar o start:
```json
"scripts": { "start": "node index.js" }
```
Depois use: `npm start`.

---

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend sobe em **http://localhost:5173** (ou similar, dependendo do Vite).  

---

## Variáveis de Ambiente (Backend)

Copie `backend/.env.example` para `backend/.env` e preencha os valores conforme seu ambiente:

```bash
# SQL Server
DB_USER=
DB_PASSWORD=
DB_SERVER=
DB_NAME=
DB_ENCRYPT=
DB_TRUST_CERT=
PORT=

# Pool
DB_POOL_MAX=
DB_POOL_MIN=
DB_POOL_IDLE=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=
```

Observações:
- `DB_SERVER` pode incluir instância/porta (ex.: `localhost\\SQLEXPRESS` ou `localhost,1433`).
- O backend valida a presença de `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_NAME` no startup.

---

## Notas Técnicas

- Conexão com SQL Server usa pool singleton com desligamento gracioso (SIGINT/SIGTERM).
- Validação de CPF/CNPJ no backend com `cpf-cnpj-validator`.
- Frontend aplica máscara e limita a 14 dígitos numéricos para CPF/CNPJ.
- Em banco, a tabela de Produtos mantém a restrição de unicidade pelo par `(nome, categoria)` conforme o script SQL deste README.

## Credenciais de Login
- Admin: `admin / 123`  
- Usuário comum: `user / 123`  

---

## Licença
Este projeto é livre para uso em testes, estudos.  
