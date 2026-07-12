## Sistema de agendamento para barbearia

    Sistema de agendamento para barbearia, utilizando as tecnologias Next.js, TypeScript, React, Tailwind CSS, Prisma, PostgreSQL e Better-auth.
    O sistema permite aos usuários agendar consultas com as barbeiras, visualizar seu agendamentos e gerenciar suas informações de conta.
    Os usuários podem criar contas, fazer login e agendar consultas com as barbeiras.

# Tecnologias usadas

- Stacks usadas : Next.js, TypeScript, React, Tailwind CSS, Prisma, PostgreSQL
- Banco de dados : PostgreSQL
- Autenticação : Better-auth

# Requisitos

- Node.js - 24.14.0
- Npm - 11.9.0
- PostgreSQL
- Prisma - 7.1.0
- Better-auth - 1.4.6

## Setup

```bash
git clone https://github.com/DGTJS/BarberPortfolio.git
cd BarberPortfolio
npm install

# Configurar o .env
# DATABASE_URL
# BETTER_AUTH_SECRET
# BETTER_AUTH_URL
# NEXT_PUBLIC_APP_URL

# Rodar o projeto
npx prisma generate
npx prisma db push
npm run seed

# Rodar o projeto
npm run dev


# Acessar o projeto
http://localhost:3000

```
