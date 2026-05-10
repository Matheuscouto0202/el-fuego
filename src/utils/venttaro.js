const VENTTARO_URL = process.env.NEXT_PUBLIC_VENTTARO_URL || 'https://venttaro-backend-production.up.railway.app/api'
const VENTTARO_API_KEY = process.env.NEXT_PUBLIC_VENTTARO_API_KEY || ''

const PAYMENT_LABEL = {
  delivery_cash: 'dinheiro',
  delivery_card: 'cartao',
  pix: 'pix',
}

export async function sendOrderToVenttaro({ items, name, phone, address, paymentMethod, deliveryFee, total }) {
  const payload = {
    customer: {
      name,
      phone,
      address: address || undefined,
    },
    items: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    payment: {
      method: PAYMENT_LABEL[paymentMethod] || paymentMethod,
    },
    deliveryFee: deliveryFee || 0,
    total,
    source: 'elfuego',
  }

  const response = await fetch(`${VENTTARO_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': VENTTARO_API_KEY,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Venttaro API error ${response.status}: ${err}`)
  }

  return response.json()
}
