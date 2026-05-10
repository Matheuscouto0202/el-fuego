'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { formatCurrency } from '@/utils/whatsapp'
import productsData from '@/data/products.json'

export default function CartButton() {
  const { items, openCart } = useCartStore()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6"
          style={{
            background: 'linear-gradient(to top, rgba(13,13,13,0.98) 60%, transparent)',
          }}
        >
          <button
            onClick={openCart}
            className="w-full max-w-lg mx-auto flex items-center justify-between bg-white hover:bg-gray-100 active:scale-[0.98] text-black rounded-2xl px-4 py-4 shadow-xl shadow-black/40 transition-all duration-200"
          >
            {/* Left: bag + count */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={22} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              </div>
              <span className="font-heading font-semibold text-sm">
                Ver Carrinho
              </span>
            </div>

            {/* Right: total */}
            <div className="flex items-center gap-1">
              <span className="font-heading font-bold text-base">
                {formatCurrency(subtotal)}
              </span>
              <ChevronRight size={18} />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
