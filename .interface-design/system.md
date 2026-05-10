# TAKI SUSHI — Design System

**Product:** Cardápio digital mobile-first para restaurante japonês  
**Estilo:** Dark premium, botanical, conversão alta  
**Stack:** Next.js 14 App Router · Tailwind CSS · Framer Motion · Zustand

---

## Identidade

- **Nome:** TAKI SUSHI
- **Tagline:** Botanic Lounge
- **Sensação:** Izakaya japonês à noite — quente, escuro, premium, mas acessível

---

## Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| `bg-black` | `#0b0b0b` | Background principal |
| `bg-surface-1` | `#141414` | Cards, drawers |
| `bg-surface-2` | `#1a1a1a` | Inputs, items do carrinho |
| `bg-surface-3` | `#242424` | Hover states |
| `black-border` | `#2a2a2a` | Bordas sutis |
| `green-primary` | `#0f5132` | CTAs, badges ativos, navbar |
| `green-mid` | `#166534` | Hover de CTAs verdes |
| `green-bright` | `#22c55e` | Ícones, textos de destaque, "no carrinho" |
| `gold` | `#c8964c` | Preços com desconto, badges premium, destaque |
| `gold-light` | `#d4a76a` | Hover gold |

---

## Tipografia

| Uso | Fonte | Peso | Classe |
|---|---|---|---|
| Headings, botões, nomes | Poppins | 600–800 | `font-heading font-semibold/bold` |
| Body, descrições, labels | Inter | 400–500 | `font-body` |
| Preços | Poppins | 700 | `font-heading font-bold` |
| Labels pequenos | Inter | 500 | `font-body text-xs tracking-wide` |

---

## Elevação e Profundidade

```
Fundo:      #0b0b0b  (página)
Nível 1:    #141414  (cards de produto, drawers)
Nível 2:    #1a1a1a  (itens dentro de cards, inputs)
Nível 3:    #242424  (hover states)
Bordas:     #2a2a2a  (1px, sempre sutis)
```

Sombras usam a cor do elemento (não preto genérico):
- CTAs verdes: `shadow-green-primary/30`
- WhatsApp: `shadow-[#25D366]/40`
- Carrinhos/badges: `shadow-lg`

---

## Componentes

### ProductCard
- Grid 2 colunas no mobile
- Imagem h-40, `object-cover`, lazy load, hover scale-105
- Badge top-left (gold/green/orange dependendo do tipo)
- Controle de quantidade inline: `[–] N [+]` aparece após primeiro clique com `AnimatePresence`
- Preço com desconto: original riscado em gray-600, novo em gold

### CartButton (sticky)
- Só aparece quando `totalItems > 0`
- `fixed bottom-0`, gradiente para cima de 60% para evitar corte brusco
- Spring animation: `stiffness: 300, damping: 30`
- Mostra total à direita, contagem à esquerda

### CartDrawer
- `max-h-85vh`, `rounded-t-3xl`
- Handle bar no topo
- Mínimo de pedido: R$30 — bloqueia CTA com aviso laranja
- Frete grátis acima de R$80

### OrderForm (2 steps)
- Step 1: nome, telefone, delivery/pickup, endereço condicional, pagamento
- Step 2: resumo completo para confirmação
- Barra de progresso animada entre steps
- Botão final: WhatsApp green `#25D366`

### CategoryFilter
- `sticky top-[57px]` (abaixo do header)
- Scroll horizontal, `no-scrollbar`
- Ativo: `bg-green-primary` com `layoutId` framer-motion
- Auto-scroll para o item ativo via `scrollIntoView`

### Header
- `sticky top-0 z-40`, `backdrop-blur-md`
- Badge do carrinho com spring bounce ao atualizar

---

## Animações (Framer Motion)

| Situação | Configuração |
|---|---|
| Drawer slide-up | `spring stiffness:300 damping:35` |
| Badge do carrinho | `spring stiffness:400 damping:15` |
| Botão add→contador | `AnimatePresence mode="wait"`, `duration:0.15` |
| Contador de quantidade | `scale: 1.3 → 1` ao mudar |
| Cards de produto | `opacity 0→1, y 16→0, duration:0.25` |
| WhatsApp float | `delay:1.5, spring stiffness:260` |
| Promo banner | `y:-40→0, duration:0.4` |

---

## Padrões de Layout

- `max-w-lg mx-auto` — container centralizado, mobile-first
- `pb-32` no grid de produtos — espaço para o CartButton fixo
- Grid: `grid-cols-2 gap-3` para produtos
- Scroll horizontal para Featured e CategoryFilter: `flex overflow-x-auto no-scrollbar`

---

## WhatsApp Integration

**Número:** `5511996185751`  
**Utilitário:** `src/utils/whatsapp.js`

Formato da mensagem:
```
🍣 *TAKI SUSHI — NOVO PEDIDO*
━━━━━━━━━━━━━━━━━━━━━━
👤 *Nome:* ...
📞 *Telefone:* ...
[tipo] Entrega/Retirada
📍 *Endereço:* ...
🛒 *Itens:*
  • Item xN — R$...
💰 *Subtotal:* R$...
🛵 *Taxa:* R$...
✅ *TOTAL:* R$...
💳 *Pagamento:* ...
```

---

## Regras de Negócio (Configuráveis em products.json)

- Taxa de entrega: `R$ 8,00`
- Frete grátis: acima de `R$ 80,00`
- Pedido mínimo: `R$ 30,00`
- Tempo entrega: `35–50 min`
- Tempo retirada: `15–20 min`

---

## Decisões Intencionais

1. **Fundo #0b0b0b (não #000000)** — pure black causa fadiga visual; esse tom tem warmth
2. **Gold apenas em preços promocionais e destaques** — escassez garante impacto
3. **Green-bright (#22c55e) apenas em textos/ícones, nunca em backgrounds grandes** — preserva legibilidade
4. **Botão WhatsApp final usa `#25D366`** — reconhecimento imediato da marca
5. **CartButton usa gradiente, não barra sólida** — não corta o conteúdo visualmente
6. **IntersectionObserver para categoria ativa** — sincroniza tabs com scroll sem throttle manual
