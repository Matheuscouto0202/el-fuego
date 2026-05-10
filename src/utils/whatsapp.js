import productsData from '@/data/products.json'

const WHATSAPP_NUMBER = productsData.restaurant.phone

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function buildWhatsAppMessage({ items, orderType, name, phone, address, paymentMethod, subtotal, deliveryFee, total }) {
  const itemsList = items
    .map((item) => `  • ${item.name} x${item.quantity} — ${formatCurrency(item.price * item.quantity)}`)
    .join('\n')

  const paymentLabel = paymentMethod === 'online' ? 'Pagamento Online (simulado)' : 'Pagar na Entrega/Retirada'
  const typeLabel = orderType === 'delivery' ? '🛵 Entrega' : '🏪 Retirada no Local'

  const addressLine = orderType === 'delivery' && address
    ? `\n📍 *Endereço:* ${address}`
    : ''

  const deliveryFeeLine = orderType === 'delivery'
    ? `\n🛵 *Taxa de entrega:* ${formatCurrency(deliveryFee)}`
    : ''

  const message = `🌮 *EL FUEGO — NOVO PEDIDO*
━━━━━━━━━━━━━━━━━━━━━━

👤 *Nome:* ${name}
📞 *Telefone:* ${phone}

${typeLabel}${addressLine}

🛒 *Itens do Pedido:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* ${formatCurrency(subtotal)}${deliveryFeeLine}
✅ *TOTAL: ${formatCurrency(total)}*

💳 *Pagamento:* ${paymentLabel}
━━━━━━━━━━━━━━━━━━━━━━

_Pedido enviado pelo cardápio digital_ 🌶️`

  return message
}

export function sendWhatsApp(message) {
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
  window.open(url, '_blank')
}
