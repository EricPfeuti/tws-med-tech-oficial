# 💉 TWSMedTech

**A inovação que fortalece a prática cardiológica.**

Plataforma de telemedicina criada para resolver desafios específicos que cardiologistas particulares e seus pacientes enfrentam no dia a dia.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

## 📸 Demonstração

👉 CONFIRMAR: adicione 2 a 3 prints ou um GIF curto das telas principais e, se houver deploy, o link.

## 📌 Sobre o projeto

👉 CONFIRMAR: em 3 a 5 linhas, responda:
- Qual problema do cardiologista ou do paciente o sistema resolve?
- Quem usa (médico, paciente, secretária)?
- Como a telemedicina entra na solução?

## ✨ Funcionalidades

👉 CONFIRMAR: liste o que já funciona hoje. Exemplo de formato:
- [x] Cadastro e login de usuários
- [x] ...
- [ ] ... (o que ainda está planejado)

## 🛠️ Tecnologias

| Camada   | Tecnologia |
|----------|------------|
| Frontend | React      |
| Backend  | Node.js    |
| Banco    | MongoDB    |

## 📁 Estrutura do projeto

```
tws-med-tech-oficial/
├── backend/     # API e regras de negócio
├── frontend/    # Interface em React
└── README.md
```

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- [MongoDB](https://www.mongodb.com/) local ou uma conta no MongoDB Atlas
- Git

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/EricPfeuti/tws-med-tech-oficial.git
cd tws-med-tech-oficial

# 2. Backend
cd backend
npm install
cp .env.example .env   # preencha as variáveis
npm start

# 3. Frontend (em outro terminal)
cd frontend
npm install
npm start
```

👉 CONFIRMAR: os comandos de execução (`npm start`, `npm run dev`...) e as portas usadas.

### Variáveis de ambiente

👉 CONFIRMAR: crie um arquivo `backend/.env.example` (sem valores reais) e liste aqui, por exemplo:

| Variável | Descrição |
|----------|-----------|
| `PORT` | Porta da API |
| `MONGO_URI` | String de conexão com o MongoDB |
