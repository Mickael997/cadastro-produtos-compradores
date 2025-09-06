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
('João da Silva', '123.456.789-00'),
('Empresa XP LTDA', '12.345.678/0001-99');
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
npm start
```
O backend sobe em **http://localhost:3000**

---

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
O frontend sobe em **http://localhost:5173** (ou similar, dependendo do Vite).  

---

## Credenciais de Login
- Admin: `admin / 123`  
- Usuário comum: `user / 123`  

---

## Licença
Este projeto é livre para uso em testes, estudos.  
