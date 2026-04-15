# 🚀 SKAMBY — Plataforma de troca e venda de produtos sustentáveis

## 🌱 Sobre o Projeto

O **Skamby** é uma plataforma web que conecta pessoas de regiões próximas com um objetivo em comum: **a sustentabilidade**.

Através da plataforma, usuários podem interagir para:
- ♻️ Realizar doações  
- 💰 Comprar e vender produtos  
- 🔄 Trocar itens de forma consciente  

O foco é incentivar o consumo sustentável, reduzir desperdícios e fortalecer comunidades locais por meio da economia circular.

---

## 👥 Equipe

- Francisco Valdenisio da Silva Santos  
- João Carlos de Oliveira Sabino  
- Kauan dos Santos Lima  
- Maria Clara Pereira Sombra  
- Maria Luiza Albano Almeida  

---

## 📦 Stack

### Frontend (`apps/web`)

* Next.js 14
* TypeScript
* Tailwind CSS
* Zustand

### Backend (`apps/api`)

* NestJS
* Prisma ORM
* PostgreSQL
* Redis
* Socket.io

### Shared (`packages/shared`)

* Schemas
* Tipos compartilhados

---

## 📁 Estrutura do Projeto

```
apps/
  web/        # Frontend Next.js
  api/        # Backend NestJS

packages/
  shared/     # Tipos e schemas compartilhados
```

---

## ⚙️ Pré-requisitos

* Node.js 18+
* pnpm
* PostgreSQL
* Redis

---

## 🚀 Início Rápido

### 1. Clone o repositório

```bash
git clone <repo-url>
cd skamby
```

### 2. Configure o ambiente

```bash
cp .env.example .env
```

Preencha as variáveis necessárias no `.env`.

---

### 3. Instale as dependências

```bash
pnpm install
```

---

### 4. Configure o banco de dados

Gerar client do Prisma:

```bash
pnpm --filter @skamby/api prisma:generate
```

Rodar migrations:

```bash
pnpm --filter @skamby/api prisma:migrate
```

---

### 5. Rodar o projeto

```bash
pnpm dev
```

---

## 🔗 API - Principais Endpoints

### 🔐 Autenticação

* `POST /auth/register` → Criar conta
* `POST /auth/login` → Login
* `POST /auth/refresh` → Renovar token
* `POST /auth/logout` → Logout
* `POST /auth/logout-all` → Logout em todos dispositivos

---

### 📦 Produtos

* `GET /products` → Listar produtos
* `GET /products/:id` → Detalhes do produto
* `POST /products` → Criar produto
* `PATCH /products/:id` → Atualizar produto
* `DELETE /products/:id` → Remover produto

---

### ❤️ Favoritos

* `GET /favorites` → Listar favoritos
* `POST /favorites/:productId` → Adicionar favorito
* `DELETE /favorites/:productId` → Remover favorito

---

### 💎 Planos

* `GET /plans` → Listar planos disponíveis

---

### 💳 Pagamentos

* `POST /payments/checkout` → Criar checkout
* `POST /payments/webhook` → Webhook de pagamento

---

### 👤 Perfil

* `GET /profile/me` → Perfil do usuário logado
* `PATCH /profile/me` → Atualizar perfil
* `GET /users/:id/public` → Perfil público

---

### 📤 Upload

* `POST /uploads/product-images` → Upload de imagens

---

## 💬 Chat em Tempo Real (Socket.io)

### Eventos

#### Entrada

* `chat:join` → Entrar em uma sala

#### Envio

* `chat:message:send` → Enviar mensagem

#### Recebimento

* `chat:message:new` → Nova mensagem recebida

---

## 🔐 Autenticação

* Baseada em JWT
* Suporte a refresh token
* Controle de sessões

---

## 🧠 Boas Práticas

* Código modular (monorepo)
* Tipagem compartilhada entre frontend e backend
* Separação clara de responsabilidades
* Uso de cache com Redis
* ORM com migrations versionadas (Prisma)

---

## 🧪 Scripts Úteis

```bash
pnpm dev              # Rodar tudo em modo dev
pnpm build            # Build geral
pnpm lint             # Lint
pnpm test             # Testes
```

---

## 🐳 (Opcional) Docker

Você pode adicionar suporte com:

* PostgreSQL container
* Redis container
* API + Web

Se quiser, posso gerar o `docker-compose.yml`.

---

## 🚀 Deploy

Sugestões:

* Frontend: Vercel
* Backend: Railway / Fly.io / AWS
* Banco: Supabase / Neon
* Redis: Upstash

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`feature/minha-feature`)
3. Commit (`git commit -m 'feat: nova feature'`)
4. Push (`git push origin feature/minha-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 📬 Contato

Se precisar de ajuda ou quiser evoluir o projeto, é só falar 🚀
