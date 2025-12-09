# 🌌 Surreal Marketplace

> **Full-stack e-commerce platform with surreal design, atomic transactions & interdimensional commerce**

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue?logo=typescript)](https://www.typescriptlang.org)
[![tRPC](https://img.shields.io/badge/tRPC-v11-blue?logo=trpc)](https://trpc.io)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-blue?logo=stripe)](https://stripe.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📖 Overview

**Surreal Marketplace** é uma plataforma de e-commerce inovadora que transcende os paradigmas convencionais. Com design surrealista, animações futuristas e um sistema de checkout atómico, oferece uma experiência de compra verdadeiramente única.

### ✨ Features

- 🎨 **Design Surrealista** - Tema dark futurista com animações CSS puras
- 💳 **Stripe Integrado** - Sistema de pagamentos robusto e seguro
- 🔐 **Autenticação OAuth** - Login seguro com WeChat, Google e outros
- ⚛️ **React 19 + TypeScript** - Frontend type-safe e reativo
- 🔄 **tRPC End-to-End** - Tipagem automática frontend-backend
- 📦 **MySQL + Drizzle ORM** - Database robusta com migrations
- 🎯 **Transações Atómicas** - Tudo ou nada - sem estado inconsistente
- 📊 **Dashboard Admin** - Gestão completa de produtos e pedidos
- 🎬 **Animações** - Efeitos de glitch, pulsos e comportamento emergente
- ✅ **Testes** - Vitest configurado para operações críticas

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (ou npm)
- MySQL 8+ ou TiDB

### Installation

```bash
# Clone o repositório
git clone https://github.com/MariaSambe/surreal_marketplace.git
cd surreal_marketplace

# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env.local

# Configurar banco de dados
pnpm run db:push

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### Variáveis de Ambiente (.env.local)

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/surreal_marketplace"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth (WeChat example)
WECHAT_APP_ID="your_app_id"
WECHAT_APP_SECRET="your_app_secret"

# APIs
OPENAI_API_KEY="sk_..."
GOOGLE_MAPS_API_KEY="..."

# App
DOMAIN="http://localhost:5173"
NODE_ENV="development"
```

---

## 📁 Project Structure

```
surreal_marketplace/
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── pages/            # Páginas principais
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitários (tRPC, utils)
│   │   ├── contexts/         # Context API
│   │   └── index.css         # Estilos globais
│   └── index.html
├── server/                    # Backend Express + tRPC
│   ├── _core/                # Infraestrutura
│   │   ├── trpc.ts          # Setup tRPC
│   │   ├── context.ts       # Contexto tRPC
│   │   ├── env.ts           # Variáveis de ambiente
│   │   ├── llm.ts           # Integração IA
│   │   └── oauth.ts         # Autenticação
│   ├── stripe/              # Integração Stripe
│   ├── routers.ts           # Procedimentos tRPC
│   └── db.ts                # Funções database
├── drizzle/                  # ORM + Migrations
│   ├── schema.ts            # Schema das tabelas
│   └── migrations/          # SQL migrations
├── shared/                   # Código compartilhado
│   ├── const.ts             # Constantes
│   └── types.ts             # Tipos TypeScript
└── docs/                     # Documentação
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **TanStack Query** - Data fetching & caching
- **tRPC** - RPC framework
- **Vite** - Build tool
- **Shadcn/ui** - Component library

### Backend
- **Express** - Web framework
- **tRPC** - Type-safe RPC
- **Node.js** - Runtime
- **Drizzle ORM** - Database ORM

### Database
- **MySQL 8** / TiDB - SQL database
- **Drizzle Kit** - ORM & migrations

### External Services
- **Stripe** - Payments
- **WeChat OAuth** - Authentication
- **OpenAI** - AI features
- **AWS S3** - Image storage
- **Google Maps API** - Location services

---

## 📊 Database Schema

### Principais Tabelas
- **users** - Utilizadores do sistema
- **products** - Artefactos (produtos) no catálogo
- **cart_items** - Itens no carrinho
- **orders** - Histórico de transações
- **order_items** - Detalhes dos pedidos
- **wishlists** - Produtos guardados
- **reviews** - Avaliações de produtos
- **badges** - Sistema de conquistas
- **oracularLogs** - Logs auditoria

---

## 🔄 API Routes (tRPC)

### Auth
```
auth.me              - Get current user
auth.logout          - Logout user
auth.getLoginUrl     - Get OAuth login URL
```

### Products
```
products.list        - List all products
products.get         - Get single product
products.search      - Search products
```

### Cart
```
cart.add             - Add item to cart
cart.remove          - Remove item
cart.update          - Update quantity
cart.list            - Get cart items
```

### Orders
```
orders.create        - Create order
orders.list          - List user orders
orders.get           - Get order details
```

### Admin
```
admin.getDashboard   - Dashboard stats
admin.getLogs        - System logs
admin.updateProduct  - Edit product
```

---

## 🧪 Testing

```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Coverage
pnpm run test:coverage
```

---

## 📦 Build & Deploy

```bash
# Build for production
pnpm run build

# Start production server
pnpm run start

# Type check
pnpm run check

# Format code
pnpm run format
```

### Deploy Checklist
- [ ] `.env` configurado para produção
- [ ] Database migrado
- [ ] Stripe live mode ativado
- [ ] SSL/HTTPS configurado
- [ ] Backups agendados
- [ ] Analytics ativo
- [ ] Monitoring configurado
- [ ] Rate limiting ativo

---

## 🎨 Design System

### Color Palette (OKLCH)
- Primary: `oklch(0.5 0.2 280)` - Deep purple
- Success: `oklch(0.7 0.15 142)` - Vibrant green
- Error: `oklch(0.6 0.2 30)` - Vibrant red
- Background: `oklch(0.1 0 0)` - Near black

### Animations
- `spin-slow` - Slow rotation (20s)
- `pulse-slow` - Slow pulse effect
- `glitch` - Glitch effect (animated)
- `float` - Floating animation

---

## 📚 Documentation

- [Payment Integration Guide](docs/PAYMENT_INTEGRATION_GUIDE.md)
- [Security Guide](SECURITY_GUIDE.md)
- [Security Checklist](SECURITY_CHECKLIST.md)
- [Checkpoint](CHECKPOINT_FINAL.md)

---

## 🐛 Issues & Support

Encontrou um bug? Abra uma issue em [Issues](https://github.com/MariaSambe/surreal_marketplace/issues)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Maria Sambé** © 2025

---

## 🙏 Acknowledgments

- Inspiração em design surrealista e sci-fi
- Comunidade React e TypeScript
- Stripe por APIs excelentes
- Tailwind CSS por utilitários poderosos

---

## 🔗 Links

- 🌐 [Surreal Marketplace](https://surrealmarketplace.com)
- 📧 Email: maria.data.analyst@gmail.com
- 🐙 GitHub: [@MariaSambe](https://github.com/MariaSambe)
- 💼 Portfolio: [github.com/MariaSambe](https://github.com/MariaSambe?tab=repositories)

---

**Made with ✨ by Maria Sambé**
