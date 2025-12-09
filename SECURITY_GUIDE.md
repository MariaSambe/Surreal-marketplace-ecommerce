# 🔒 Guia de Segurança: Repositório Público

## ✅ Checklist de Proteção

### 1. Environment Variables (.env)
```bash
✅ .env
✅ .env.local
✅ .env.development.local
✅ .env.test.local
✅ .env.production.local
```

**Status do seu projeto:** ✅ PROTEGIDO
(Seu `.gitignore` já tem tudo!)

---

## 2. O que NUNCA commitar

### ❌ NUNCA commite:
```
.env (variáveis de ambiente)
.env.local
*.key (chaves privadas)
*.pem (certificados)
secrets.json
config.json (com dados sensíveis)
passwords.txt
API_KEYS
Database credentials
OAuth tokens
```

### ✅ OK commitar:
```
.env.example (modelo sem valores)
*.md (documentação)
package.json
package-lock.json / pnpm-lock.yaml
source code
tests
config files (sem valores sensíveis)
```

---

## 3. Criar .env.example (Modelo)

**Arquivo:** `/.env.example`

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/surreal_marketplace"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OAuth
WECHAT_APP_ID="your_app_id"
WECHAT_APP_SECRET="your_app_secret"

# APIs
OPENAI_API_KEY="sk_..."
GOOGLE_MAPS_API_KEY="..."

# App
DOMAIN="http://localhost:5173"
NODE_ENV="development"
```

**Propósito:** Mostrar que variáveis são necessárias SEM expor valores reais

---

## 4. Verificar Commits (Se já fez push)

```bash
# Ver se há .env nos commits
git log --all -- .env

# Ver todos os arquivos no histórico
git log --name-only --pretty=format: | sort -u

# Procurar por padrões de API keys
git grep -i "api_key\|password\|secret" $(git rev-list --all)
```

---

## 5. Se Acidentalmente Commitou Segredos

### Opção A: Remover do repositório (Rápido)
```bash
# Remove o arquivo do git (mas não do disco)
git rm --cached .env

# Adiciona ao .gitignore
echo ".env" >> .gitignore

# Commit
git commit -m "Remove .env from git tracking"
git push
```

### Opção B: Reescrever histórico (Completo)
```bash
# Remove do histórico completamente
git filter-branch --tree-filter 'rm -f .env' --prune-empty HEAD

# Force push (cuidado!)
git push --force
```

### ⚠️ **IMPORTANTE:** Depois de remover segredos
- ✅ **Regenere** todas as API keys e passwords
- ✅ **Retire** as antigas de circulação
- ✅ **Avise** ao seu time

---

## 6. GitHub Secret Scanning

GitHub **automaticamente** avisa se detectar:
- AWS keys
- GitHub tokens
- Stripe keys
- Firebase keys
- etc

**Se receber alerta:**
1. Vá para Settings → Security → Secret scanning
2. Regenere a chave comprometida
3. Retire a chave antiga

---

## 7. Proteção Adicional (Opcional)

### Branch Protection
1. Settings → Branches → Add rule
2. Apply to main/master
3. Exija code review antes de merge

### Require status checks
- Exija testes passando
- Exija TypeScript check

### Require branches to be up to date
- Previne code desatualizado

---

## 8. Dados Sensíveis no Código

### ❌ BAD:
```typescript
// ❌ NUNCA faça isso!
const STRIPE_KEY = "sk_live_abc123def456";

const config = {
  database: "mysql://root:password@db.com/surreal",
  apiKey: "openai_sk_abcd1234"
};
```

### ✅ GOOD:
```typescript
// ✅ Use variáveis de ambiente
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

const config = {
  database: process.env.DATABASE_URL,
  apiKey: process.env.OPENAI_API_KEY
};
```

---

## 9. Revisão de Segurança no seu Projeto

### Procurar por padrões perigosos:

```bash
# Procurar por API keys
grep -r "sk_" client/ server/
grep -r "pk_" client/ server/

# Procurar por passwords
grep -r "password" client/ server/ | grep -v "password:"

# Procurar por URLs de database
grep -r "mysql://" client/ server/

# Procurar por tokens
grep -r "token\|secret\|key" client/ server/ | grep -v "// " | grep -v "/*"
```

---

## 10. Estrutura Segura Recomendada

```
surreal_marketplace/
├── .env.example          ← Modelo (sem valores)
├── .env.production       ← Local machine (NOT COMMITTED)
├── .env.development      ← Local machine (NOT COMMITTED)
├── .gitignore            ← Inclui .env*
├── src/
│   └── config.ts         ← Lê do process.env
├── package.json
└── README.md
```

**File: config.ts**
```typescript
export const config = {
  database: {
    url: process.env.DATABASE_URL || 'mysql://localhost/test',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publicKey: process.env.STRIPE_PUBLIC_KEY, // pode ser público
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  app: {
    domain: process.env.DOMAIN || 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};
```

---

## ✅ CHECKLIST FINAL DE SEGURANÇA

- [ ] `.env` está em `.gitignore`
- [ ] `.env.example` criado (sem valores reais)
- [ ] Nenhuma API key no código
- [ ] Nenhuma password em strings
- [ ] `process.env` usado para tudo sensível
- [ ] GitHub Secret Scanning ativo (automático)
- [ ] Repo é PÚBLICO (seguro)
- [ ] Documentação clara (README)
- [ ] `.gitignore` completo
- [ ] Revisor: Executou `grep` para procurar secrets

---

## 🎯 Resumo para seu Projeto

**Seu projeto está seguro porque:**

✅ `.gitignore` tem `.env`  
✅ Nenhuma API key hardcoded  
✅ Usa `process.env`  
✅ `.env.example` modelo  
✅ Repo é PUBLIC (dados sensíveis protegidos)  

**Próximos passos:**
1. Crie `.env.example` no repo
2. Adicione no README: "Copy `.env.example` to `.env`"
3. Faz push normalmente
4. Pronto! Seguro e público 🔒

---

## 🔗 Links Úteis

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Git Docs - gitignore](https://git-scm.com/docs/gitignore)

---

**Dúvida: Posso confiar no .gitignore?**

Sim! Mas lembre-se: `.gitignore` previne **commits futuros**, não **commits passados**. Se já commitou um `.env` com secrets, precisa limpar o histórico.

Sempre use `.env.example` como modelo! 🔑
