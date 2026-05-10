'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, User, Phone, Truck, Store, CreditCard, Banknote, MessageCircle, ChevronRight, CheckCircle } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { formatCurrency, buildWhatsAppMessage, sendWhatsApp } from '@/utils/whatsapp'
import { sendOrderToVenttaro } from '@/utils/venttaro'
import productsData from '@/data/products.json'

const PAYMENT_OPTIONS = [
  { id: 'delivery_cash', label: 'Dinheiro', sublabel: 'Pagar na entrega', icon: Banknote },
  { id: 'delivery_card', label: 'Cartão', sublabel: 'Máquina na entrega', icon: CreditCard },
  { id: 'pix', label: 'PIX', sublabel: 'Pagar agora', icon: CheckCircle },
]

export default function OrderForm() {
  const { items, isOrderFormOpen, closeOrderForm, clearCart } = useCartStore()
  const [step, setStep] = useState(1) // 1: info, 2: confirm
  const [form, setForm] = useState({
    name: '',
    phone: '',
    orderType: 'delivery',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    paymentMethod: '',
  })
  const [errors, setErrors] = useState({})

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = form.orderType === 'delivery' && subtotal < 80
    ? productsData.restaurant.deliveryFee
    : 0
  const total = subtotal + deliveryFee

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Informe seu nome'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10)
      e.phone = 'Telefone inválido'
    if (form.orderType === 'delivery') {
      if (!form.cidade) e.cidade = 'Selecione a cidade'
      if (!form.bairro.trim()) e.bairro = 'Informe o bairro'
      if (!form.rua.trim()) e.rua = 'Informe a rua'
      if (!form.numero.trim()) e.numero = 'Informe o número'
    }
    if (!form.paymentMethod) e.paymentMethod = 'Escolha a forma de pagamento'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validate()) setStep(2)
  }

  const handleSubmit = async () => {
    const address = form.orderType === 'delivery'
      ? `${form.rua}, nº ${form.numero} — ${form.bairro}, ${form.cidade}`
      : ''

    // Envia ao Venttaro em paralelo com o WhatsApp — falha silenciosa para não bloquear o pedido
    sendOrderToVenttaro({
      items,
      name: form.name,
      phone: form.phone,
      address,
      paymentMethod: form.paymentMethod,
      deliveryFee,
      total,
    }).catch(() => {})

    const message = buildWhatsAppMessage({
      items,
      orderType: form.orderType,
      name: form.name,
      phone: form.phone,
      address,
      paymentMethod: form.paymentMethod,
      subtotal,
      deliveryFee,
      total,
    })
    sendWhatsApp(message)
    clearCart()
    closeOrderForm()
    setStep(1)
    setForm({ name: '', phone: '', orderType: 'delivery', cidade: '', bairro: '', rua: '', numero: '', paymentMethod: '' })
  }

  const handleClose = () => {
    closeOrderForm()
    setStep(1)
  }

  if (!isOrderFormOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex flex-col justify-end"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          className="bg-surface-1 rounded-t-3xl max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-black-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-black-border">
            <div>
              <h2 className="font-heading font-bold text-white text-base">
                {step === 1 ? 'Finalizar Pedido' : 'Confirmar Pedido'}
              </h2>
              <p className="text-gray-500 text-xs font-body mt-0.5">
                Passo {step} de 2
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-2 text-gray-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-0.5 bg-surface-2">
            <motion.div
              className="h-full bg-white"
              animate={{ width: step === 1 ? '50%' : '100%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  {/* Name */}
                  <div>
                    <label className="text-gray-400 text-xs font-body font-medium mb-2 flex items-center gap-1.5">
                      <User size={12} />
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Seu nome"
                      className={`w-full bg-surface-2 border ${errors.name ? 'border-red-500' : 'border-black-border focus:border-white/40'} rounded-xl px-4 py-3 text-white text-sm font-body outline-none transition-colors placeholder:text-gray-600`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-gray-400 text-xs font-body font-medium mb-2 flex items-center gap-1.5">
                      <Phone size={12} />
                      WhatsApp / Telefone *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="(11) 99999-9999"
                      className={`w-full bg-surface-2 border ${errors.phone ? 'border-red-500' : 'border-black-border focus:border-white/40'} rounded-xl px-4 py-3 text-white text-sm font-body outline-none transition-colors placeholder:text-gray-600`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Order type */}
                  <div>
                    <label className="text-gray-400 text-xs font-body font-medium mb-2 block">
                      Como deseja receber?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'delivery', label: 'Entrega', sublabel: productsData.restaurant.estimatedTime.delivery, icon: Truck },
                        { id: 'pickup', label: 'Retirada', sublabel: productsData.restaurant.estimatedTime.pickup, icon: Store },
                      ].map(({ id, label, sublabel, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => setForm((prev) => ({ ...prev, orderType: id }))}
                          className={`flex flex-col items-center gap-1 p-4 rounded-2xl border-2 transition-all duration-200 ${
                            form.orderType === id
                              ? 'border-white bg-white/10 text-white'
                              : 'border-black-border bg-surface-2 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <Icon size={22} />
                          <span className="font-heading font-semibold text-sm">{label}</span>
                          <span className="text-xs font-body opacity-70">{sublabel}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Address (conditional) */}
                  <AnimatePresence>
                    {form.orderType === 'delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <label className="text-gray-400 text-xs font-body font-medium flex items-center gap-1.5">
                          <MapPin size={12} />
                          Endereço de entrega *
                        </label>

                        {/* Cidade */}
                        <div>
                          <select
                            value={form.cidade}
                            onChange={set('cidade')}
                            className={`w-full bg-surface-2 border ${errors.cidade ? 'border-red-500' : 'border-black-border focus:border-white/40'} rounded-xl px-4 py-3 text-sm font-body outline-none transition-colors appearance-none ${form.cidade ? 'text-white' : 'text-gray-600'}`}
                          >
                            <option value="" disabled>Cidade *</option>
                            <option value="Mairinque">Mairinque</option>
                            <option value="São Roque">São Roque</option>
                            <option value="Alumínio">Alumínio</option>
                          </select>
                          {errors.cidade && <p className="text-red-400 text-xs mt-1">{errors.cidade}</p>}
                        </div>

                        {/* Bairro */}
                        <div>
                          <input
                            type="text"
                            value={form.bairro}
                            onChange={set('bairro')}
                            placeholder="Bairro *"
                            className={`w-full bg-surface-2 border ${errors.bairro ? 'border-red-500' : 'border-black-border focus:border-white/40'} rounded-xl px-4 py-3 text-white text-sm font-body outline-none transition-colors placeholder:text-gray-600`}
                          />
                          {errors.bairro && <p className="text-red-400 text-xs mt-1">{errors.bairro}</p>}
                        </div>

                        {/* Rua */}
                        <div>
                          <input
                            type="text"
                            value={form.rua}
                            onChange={set('rua')}
                            placeholder="Rua / Avenida *"
                            className={`w-full bg-surface-2 border ${errors.rua ? 'border-red-500' : 'border-black-border focus:border-white/40'} rounded-xl px-4 py-3 text-white text-sm font-body outline-none transition-colors placeholder:text-gray-600`}
                          />
                          {errors.rua && <p className="text-red-400 text-xs mt-1">{errors.rua}</p>}
                        </div>

                        {/* Número */}
                        <div>
                          <input
                            type="text"
                            value={form.numero}
                            onChange={set('numero')}
                            placeholder="Número da residência *"
                            className={`w-full bg-surface-2 border ${errors.numero ? 'border-red-500' : 'border-black-border focus:border-white/40'} rounded-xl px-4 py-3 text-white text-sm font-body outline-none transition-colors placeholder:text-gray-600`}
                          />
                          {errors.numero && <p className="text-red-400 text-xs mt-1">{errors.numero}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Payment */}
                  <div>
                    <label className="text-gray-400 text-xs font-body font-medium mb-2 block">
                      Pagamento *
                    </label>
                    <div className="space-y-2">
                      {PAYMENT_OPTIONS.map(({ id, label, sublabel, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, paymentMethod: id }))
                            setErrors((prev) => ({ ...prev, paymentMethod: null }))
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-200 ${
                            form.paymentMethod === id
                              ? 'border-white bg-white/10'
                              : 'border-black-border bg-surface-2 hover:border-gray-600'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            form.paymentMethod === id ? 'bg-white text-black' : 'bg-surface-3 text-gray-400'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div className="text-left">
                            <p className={`font-heading font-semibold text-sm ${form.paymentMethod === id ? 'text-white' : 'text-white'}`}>
                              {label}
                            </p>
                            <p className="text-gray-500 text-xs font-body">{sublabel}</p>
                          </div>
                          {form.paymentMethod === id && (
                            <CheckCircle size={16} className="text-white ml-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.paymentMethod && (
                      <p className="text-red-400 text-xs mt-1">{errors.paymentMethod}</p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Order summary */}
                  <div className="bg-surface-2 rounded-2xl p-4 space-y-2">
                    <h3 className="font-heading font-semibold text-white text-sm mb-3">
                      Resumo do Pedido
                    </h3>
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm font-body">
                        <span className="text-gray-300">
                          {item.name} <span className="text-gray-500">x{item.quantity}</span>
                        </span>
                        <span className="text-white">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery info */}
                  <div className="bg-surface-2 rounded-2xl p-4 space-y-2">
                    <h3 className="font-heading font-semibold text-white text-sm mb-3">
                      Informações de Entrega
                    </h3>
                    <div className="space-y-2 text-sm font-body">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nome</span>
                        <span className="text-white">{form.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Telefone</span>
                        <span className="text-white">{form.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo</span>
                        <span className="text-white capitalize">
                          {form.orderType === 'delivery' ? '🛵 Entrega' : '🏪 Retirada'}
                        </span>
                      </div>
                      {form.orderType === 'delivery' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cidade</span>
                            <span className="text-white">{form.cidade}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bairro</span>
                            <span className="text-white">{form.bairro}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-gray-400 shrink-0">Rua</span>
                            <span className="text-white text-right">{form.rua}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Número</span>
                            <span className="text-white">{form.numero}</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pagamento</span>
                        <span className="text-white">
                          {PAYMENT_OPTIONS.find((p) => p.id === form.paymentMethod)?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    {form.orderType === 'delivery' && (
                      <div className="flex justify-between text-sm font-body">
                        <span className="text-gray-400">Taxa de entrega</span>
                        <span className={deliveryFee === 0 ? 'text-gray-300' : 'text-white'}>
                          {deliveryFee === 0 ? 'Grátis' : formatCurrency(deliveryFee)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-heading font-bold border-t border-white/10 pt-2 mt-2">
                      <span className="text-white">Total</span>
                      <span className="text-gold text-lg">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-xs font-body text-center leading-relaxed">
                    Ao confirmar, você será redirecionado para o WhatsApp para finalizar o pedido com nossa equipe.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-black-border space-y-3">
            {step === 1 ? (
              <button
                onClick={handleNext}
                className="w-full bg-white hover:bg-gray-100 active:scale-[0.98] text-black font-heading font-bold text-base rounded-2xl py-4 flex items-center justify-between px-6 transition-all shadow-lg shadow-black/20"
              >
                <span>Revisar Pedido</span>
                <ChevronRight size={20} />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#25D366] hover:bg-[#20bc5a] active:scale-[0.98] text-white font-heading font-bold text-base rounded-2xl py-4 flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/30"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Enviar Pedido pelo WhatsApp
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="w-full text-gray-500 hover:text-white text-sm font-body py-2 transition-colors"
                >
                  ← Voltar e editar
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
