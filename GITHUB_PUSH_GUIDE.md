# 🚀 Guia Final: Push para GitHub

## ✅ Checklist Antes de Fazer Push

- [ ] Git instalado (`git --version`)
- [ ] `.env` está em `.gitignore`
- [ ] `.env.local` criado localmente (NÃO commitado)
- [ ] `.env.example` criado e commitado
- [ ] README.md atualizado
- [ ] LICENSE adicionado
- [ ] `.gitignore` completo
- [ ] Repositório GitHub criado (PUBLIC)

---

## 📋 Passo a Passo

### 1️⃣ Abrir PowerShell

```powershell
# Na pasta do projeto
cd "c:\Users\maria\Desktop\Escola Nova Era\surreal_marketplace"
```

### 2️⃣ Configurar Git (1ª vez apenas)

```powershell
git config --global user.name "Maria Sambé"
git config --global user.email "seu-email@example.com"
```

### 3️⃣ Inicializar Repositório Local

```powershell
git init
```

### 4️⃣ Verificar Status

```powershell
git status

# Deve mostrar:
# - Arquivos não rastreados (untracked files)
# - NÃO deve mostrar .env ou .env.local
# - NÃO deve mostrar node_modules
```

### 5️⃣ Adicionar Arquivos

```powershell
git add .

# Verificar o que vai ser commitido
git status
```

**Importante:** Se ver `.env` ou `.env.local` na lista:
```powershell
# PARAR! Verificar .gitignore
# Adicionar e verificar novamente
echo ".env.local" >> .gitignore
git add .
```

### 6️⃣ Primeiro Commit

```powershell
git commit -m "Initial commit: Surreal Marketplace by Maria Sambé"
```

### 7️⃣ Adicionar Remote (Repositório GitHub)

```powershell
# Substitua SEU_USERNAME pelo seu nome de utilizador GitHub
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/surreal_marketplace.git
```

### 8️⃣ Fazer Push para GitHub

```powershell
git push -u origin main
```

### 9️⃣ Autenticar no GitHub

Quando pedir autenticação:

**Opção A: Token Pessoal (Recomendado)**
1. GitHub → Settings → Developer settings → Tokens (classic)
2. "Generate new token"
3. Nome: "Git CLI"
4. Scopes: `repo`, `workflow`
5. "Generate token"
6. Copiar o token
7. Cola no terminal quando pedir "password"

**Opção B: SSH (Avançado)**
- Se quiser usar SSH, há guia em: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 🎉 Verificar no GitHub

Após o push, acesse:
```
https://github.com/SEU_USERNAME/surreal_marketplace
```

Deve ver:
- ✅ README.md
- ✅ LICENSE
- ✅ .gitignore
- ✅ client/, server/, drizzle/, shared/
- ✅ package.json
- ✅ Etc.

**NÃO deve ver:**
- ❌ .env
- ❌ .env.local
- ❌ node_modules/

---

## 🎯 Configurar GitHub Depois

### 1. Adicionar Description

1. Repository → About (ícone ⚙️)
2. Description: 
   ```
   Surreal Marketplace - Full-stack e-commerce with React, TypeScript, tRPC, Stripe & surreal animations
   ```

### 2. Adicionar Topics

1. Repository → About (ícone ⚙️)
2. Topics → Add:
   - ecommerce
   - react
   - typescript
   - trpc
   - stripe
   - full-stack
   - tailwindcss
   - animations

### 3. Configurar Profile

1. GitHub Profile → Edit profile
2. Bio: "Full-stack developer • React • TypeScript • Surreal Marketplace"
3. Adicionar foto de perfil

### 4. Pinned Repositories (Opcional)

1. Profile → Customize your pinned repositories
2. Selecionar `surreal_marketplace`

---

## 🔒 Verificação de Segurança

Antes de fazer push, executar:

```powershell
# Procurar por secrets (não deve encontrar nada)
grep -r "sk_live\|pk_live\|password" client/ server/ --exclude-dir=node_modules

# Ver o que vai ser commitido (não deve ter .env)
git status

# Ver histórico (não deve ter .env)
git log --name-only
```

---

## ✅ Comandos Essenciais Depois

### Fazer novos commits depois (após editar)

```powershell
git add .
git commit -m "Descrição clara da mudança"
git push
```

### Criar branches para novas features

```powershell
git checkout -b feature/nova-feature
# ... editar código ...
git add .
git commit -m "Add nova feature"
git push -u origin feature/nova-feature
```

### Voltar ao main

```powershell
git checkout main
git pull origin main
```

---

## 🐛 Se Algo Correr Mal

### Erro: "The term 'git' is not recognized"
- Git não está instalado
- Solução: Instalar de https://git-scm.com/download/win

### Erro: "fatal: .git already exists"
- `.git` já existe (repositório já inicializado)
- Solução: Deletar pasta `.git` e recomeçar

### Erro: "fatal: remote already exists"
- Remote `origin` já adicionado
- Solução: 
  ```powershell
  git remote remove origin
  git remote add origin https://github.com/SEU_USERNAME/...
  ```

### Erro: "refused to merge unrelated histories"
- Repositórios com históricos diferentes
- Solução:
  ```powershell
  git pull origin main --allow-unrelated-histories
  ```

---

## 📞 Próximos Passos

1. ✅ Push o projeto
2. 📋 Verificar no GitHub
3. 🔗 Adicionar link ao portfólio/LinkedIn
4. ⭐ Pedir a amigos para dar star
5. 📈 Compartilhar no Twitter/LinkedIn

---

**Pronto! Agora é só executar os comandos! 🚀**

Qualquer dúvida, reveja as seções acima ou avise!
