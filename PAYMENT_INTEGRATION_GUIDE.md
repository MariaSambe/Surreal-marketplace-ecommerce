# Guia de Integração de Métodos de Pagamento

## Documento Interno | Maria Sambé
**Última atualização:** Dezembro 2025

---

## Visão Geral

O Surreal Marketplace já tem **Stripe** integrado como gateway principal de pagamentos. A boa notícia é que tanto **MB WAY** como **PayPal** podem ser ativados diretamente através do Stripe, sem necessidade de integrações separadas.

---

## 1. MB WAY (via Stripe)

### O que é
MB WAY é uma carteira digital portuguesa que permite pagamentos através do número de telemóvel. Os clientes autenticam o pagamento na app MB WAY.

### Como Ativar

1. **Aceder ao Stripe Dashboard**
   - Ir a [dashboard.stripe.com](https://dashboard.stripe.com)
   - Navegar para **Settings → Payment Methods**

2. **Ativar MB WAY**
   - Procurar "MB WAY" na lista de métodos de pagamento
   - Clicar em "Turn on"
   - O Stripe trata de tudo automaticamente

3. **Requisitos**
   - Conta Stripe ativa em Portugal ou com EUR como moeda
   - Negócio registado em Portugal (recomendado)

### Limites
- Transações entre **0,50€ e 5.000€**
- Limite diário padrão do utilizador: 1.000€ (ajustável até 10.000€)

### Fluxo de Pagamento
1. Cliente insere número de telemóvel (+351...)
2. Recebe notificação push na app MB WAY
3. Autoriza o pagamento com PIN
4. Retorna ao site com confirmação

### Testar
Usar números de teste do Stripe:
- `+351 900 000 000` - Pagamento aprovado
- `+351 900 000 001` - Pagamento recusado

---

## 2. PayPal (via Stripe)

### O que é
PayPal permite que clientes de qualquer país paguem usando a sua conta PayPal, cartão associado, ou opções "compre agora, pague depois".

### Como Ativar

1. **Aceder ao Stripe Dashboard**
   - Ir a [dashboard.stripe.com](https://dashboard.stripe.com)
   - Navegar para **Settings → Payment Methods**

2. **Ativar PayPal**
   - Procurar "PayPal" na lista
   - Clicar em "Turn on"
   - Seguir o processo de ligação da conta PayPal

3. **Requisitos**
   - Conta PayPal Business
   - Aprovação do Stripe (automática para a maioria dos negócios)

### Moedas Suportadas
EUR, GBP, USD, CHF, CZK, DKK, NOK, PLN, SEK, AUD, CAD, HKD, NZD, SGD

### Fluxo de Pagamento
1. Cliente seleciona PayPal no checkout
2. É redirecionado para o PayPal
3. Faz login e escolhe método de financiamento
4. Autoriza o pagamento
5. Retorna ao site com confirmação

### Reembolsos
- Disponíveis até 180 dias após o pagamento
- Podem ser totais ou parciais

---

## 3. Implementação Técnica

### Já Implementado
O Surreal Marketplace já usa **Stripe Checkout Sessions**, o que significa que:
- MB WAY e PayPal aparecem automaticamente quando ativados no Dashboard
- Não é necessário código adicional
- O Stripe determina os métodos mais relevantes para cada cliente

### Código Atual (server/stripe/checkout.ts)
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'], // Stripe adiciona automaticamente outros métodos
  // ... resto da configuração
});
```

### Para Forçar Métodos Específicos (Opcional)
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card', 'paypal', 'mb_way'],
  // ... resto da configuração
});
```

---

## 4. Passos para Ativar

### Stripe Dashboard
1. Fazer login em [dashboard.stripe.com](https://dashboard.stripe.com)
2. Ir a **Settings → Payment Methods**
3. Ativar "MB WAY" e "PayPal"
4. Seguir instruções de configuração

### Verificar Ativação
Após ativar, os métodos aparecem automaticamente no checkout para clientes elegíveis.

---

## 5. Outros Serviços Recomendados

### Email Transacional
- **Resend** ou **SendGrid** para emails de confirmação de pedido
- Chaves API obtidas nos respetivos dashboards

### Analytics
- **Umami** (já integrado via Manus) para analytics de visitantes
- Sem necessidade de configuração adicional

### Notificações
- O template já inclui `notifyOwner()` para alertas ao proprietário
- Configurável no painel de Settings → Notifications

---

## Notas Importantes

1. **Ambiente de Teste vs Produção**
   - O Stripe está em modo sandbox (teste)
   - Para produção, ativar o modo live no Dashboard

2. **Taxas**
   - MB WAY: Taxas padrão do Stripe + taxa adicional por transação
   - PayPal: Taxas padrão do Stripe + taxas do PayPal

3. **Disputas**
   - Ambos os métodos suportam disputas
   - Gerir através do Stripe Dashboard

---

**© 2025 Maria Sambé. Todos os direitos reservados.**
