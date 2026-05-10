'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag, ChevronRight } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { formatCurrency } from '@/utils/whatsapp'
import productsData from '@/data/products.json'

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, openOrderForm, updateQuantity, removeItem, clearCart } = useCartStore()

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const deliveryFee = productsData.restaurant.deliveryFee
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const minOrder = productsData.restaurant.minOrder
  const belowMin = subtotal < minOrder

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1 rounded-t-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-black-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-gray-300" />
                <h2 className="font-heading font-bold text-white text-base">
                  Seu Pedido
                </h2>
                <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-2 hover:bg-surface-3 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="text-5xl mb-4">🌮</div>
                  <p className="font-heading font-semibold text-white text-base mb-1">
                    Seu carrinho está vazio
                  </p>
                  <p className="text-gray-500 text-sm font-body">
                    Adicione itens do cardápio para começar
                  </p>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-white text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-gold font-body text-sm font-bold mt-0.5">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-surface-3 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {item.quantity === 1 ? (
                              <Trash2 size={12} className="text-red-400" />
                            ) : (
                              <Minus size={12} className="text-gray-400" />
                            )}
                          </button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.3 }}
                            animate={{ scale: 1 }}
                            className="w-6 text-center text-white font-heading font-bold text-sm"
                          >
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Plus size={12} className="text-black" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Clear cart */}
                  <button
                    onClick={clearCart}
                    className="w-full text-center text-gray-600 hover:text-red-400 text-xs font-body py-2 transition-colors"
                  >
                    Limpar carrinho
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-black-border space-y-3">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-gray-400">Taxa de entrega (est.)</span>
                    <span className="text-gray-300">{formatCurrency(deliveryFee)}</span>
                  </div>
                  {subtotal >= 80 && (
                    <p className="text-gray-300 text-xs font-body text-right">
                      🎉 Frete grátis aplicado!
                    </p>
                  )}
                </div>

                {/* Min order warning */}
                {belowMin && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
                    <p className="text-orange-400 text-xs font-body text-center">
                      Pedido mínimo: {formatCurrency(minOrder)} — faltam {formatCurrency(minOrder - subtotal)}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={openOrderForm}
                  disabled={belowMin}
                  className={`
                    w-full flex items-center justify-between rounded-2xl px-5 py-4 font-heading font-bold text-base transition-all duration-200
                    ${belowMin
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-100 active:scale-[0.98] text-black shadow-lg shadow-black/20'
                    }
                  `}
                >
                  <span>Continuar</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{formatCurrency(subtotal)}</span>
                    <ChevronRight size={18} />
                  </div>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
