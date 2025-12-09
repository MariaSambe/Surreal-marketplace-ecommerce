# 📤 Guia: Como Colocar o Projeto no GitHub

## Passo 1: Instalar Git

### No Windows:
1. Acesse: https://git-scm.com/download/win
2. Baixe o instalador (.exe)
3. Execute e siga as instruções
4. Reinicie o VS Code após instalar

**OU use Chocolatey (se tiver instalado):**
```powershell
choco install git
```

---

## Passo 2: Configurar Git Globalmente

Após instalar Git, abra o PowerShell e execute:

```powershell
git config --global user.name "Maria Sambé"
git config --global user.email "seu-email@example.com"
```

---

## Passo 3: Inicializar Repositório Local

Na pasta do projeto:

```powershell
cd "c:\Users\maria\Desktop\Escola Nova Era\surreal_marketplace"
git init
```

---

## Passo 4: Criar Arquivo .gitignore

Na raiz do projeto, crie um arquivo `.gitignore` com:

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/

# Vite
.vite/

# Node
pnpm-lock.yaml (opcional - você pode commitar isto para reproducibilidade)
```

---

## Passo 5: Adicionar Arquivos ao Git

```powershell
git add .
git status  # Verifica o que vai ser comitido
```

---

## Passo 6: Fazer o Primeiro Commit

```powershell
git commit -m "Initial commit: Surreal Marketplace setup by Maria Sambé"
```

---

## Passo 7: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `surreal_marketplace`
   - **Description:** "Plataforma de transações interdimensionais - Surreal Marketplace"
   - **Visibility:** Escolha entre **Public** (para mostrar o portfólio) ou **Private**
   - **README:** Deixe desmarcado (você já tem)
3. Clique em **"Create repository"**

---

## Passo 8: Conectar o Repositório Local ao GitHub

GitHub vai te mostrar comandos. Execute:

```powershell
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/surreal_marketplace.git
git push -u origin main
```

**Substitua `SEU_USERNAME` pelo seu nome de utilizador no GitHub.**

---

## Passo 9: Autenticar com GitHub

Quando fazer o `git push`, o Git vai pedir autenticação. Tem 2 opções:

### Opção A: Token de Acesso Pessoal (Recomendado)
1. No GitHub: Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Clique "Generate new token"
3. Dê permissões: `repo`, `workflow`, `admin:repo_hook`
4. Copie o token
5. Quando Git pedir senha, cole o token

### Opção B: SSH (Avançado)
Se quiser usar SSH, há um guia aqui: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Passo 10: Verificar no GitHub

Acesse https://github.com/SEU_USERNAME/surreal_marketplace

Deve ver seus arquivos lá! 🎉

---

## Comandos Úteis para o Futuro

```powershell
# Ver histórico de commits
git log

# Ver status
git status

# Fazer novos commits após editar
git add .
git commit -m "Mensagem descritiva"
git push

# Criar branch para novas features
git checkout -b feature/nome-da-feature
git push -u origin feature/nome-da-feature

# Voltar ao main
git checkout main
git pull origin main
```

---

## 📋 Checklist Final

- [ ] Git instalado e configurado
- [ ] `.gitignore` criado
- [ ] Repositório local inicializado (`git init`)
- [ ] Primeiro commit feito
- [ ] Repositório criado no GitHub
- [ ] `git remote add origin` executado
- [ ] `git push -u origin main` executado
- [ ] Verificado no GitHub se tudo está lá

---

## Dicas Importantes

✅ **Faça commits frequentes** - A cada feature/fix importante  
✅ **Use mensagens claras** - Explique o que fez  
✅ **Não commite .env** - Está no .gitignore  
✅ **Não commite node_modules** - Está no .gitignore  
✅ **Documente no README** - Como instalar e rodar o projeto  

---

## Se Algo Correr Mal

Se precisar reverter um commit:
```powershell
git reset --soft HEAD~1  # Desfaz o commit mas mantém os arquivos
git reset --hard HEAD~1  # Desfaz tudo (cuidado!)
```

---

**Depois de colocar no GitHub, você pode:**
- 📚 Mostrar no portfólio
- 🤝 Colaborar com outros (via pull requests)
- 🔄 Fazer backup automático
- 📊 Rastrear mudanças ao longo do tempo

Boa sorte! 🚀
