'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import { formatCurrency } from '@/utils/whatsapp'

const BADGE_STYLES = {
  gold: 'bg-gold/20 text-gold border border-gold/30',
  white: 'bg-white/10 text-white border border-white/20',
  orange: 'bg-orange-500/20 text-orange-400 border border-orange-500/20',
  green: 'bg-white/10 text-white border border-white/20',
}

export default function ProductCard({ product }) {
  const { items, addItem, updateQuantity } = useCartStore()
  const cartItem = items.find((i) => i.id === product.id)
  const quantity = cartItem?.quantity || 0

  const [descHighlight, setDescHighlight] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem(product)
    setDescHighlight(true)
    setTimeout(() => setDescHighlight(false), 1400)
  }

  const handleDecrease = (e) => {
    e.stopPropagation()
    updateQuantity(product.id, quantity - 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative w-full bg-surface-1 rounded-2xl overflow-hidden border border-black-border hover:border-white/15 transition-colors duration-200 group"
    >
      {/* Image */}
      <div className="relative h-28 bg-surface-2 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, 300px"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />

        {product.badge && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-body font-semibold tracking-wide ${BADGE_STYLES[product.badgeColor] || BADGE_STYLES.white}`}>
            {product.badge}
          </div>
        )}

        {product.serves && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-gray-300 font-body">
            👥 {product.serves}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 flex flex-col gap-1.5">

        {/* Name */}
        <h3 className="font-heading font-semibold text-white text-xs leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p
          className={`text-xs font-body leading-relaxed line-clamp-2 transition-colors duration-500 ${
            descHighlight ? 'text-white' : 'text-gray-500'
          }`}
        >
          {product.description}
        </p>

        {/* Price row */}
        <div className="flex items-center gap-1.5">
          {product.originalPrice && (
            <span className="text-gray-600 text-[10px] line-through font-body">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className={`font-heading font-bold text-sm ${product.originalPrice ? 'text-gold' : 'text-white'}`}>
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Action */}
        <AnimatePresence mode="wait">
          {quantity === 0 ? (
            <motion.button
              key="add"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-gray-100 active:scale-95 text-black text-xs font-body font-semibold py-2 rounded-xl transition-all duration-150 shadow-md shadow-black/20"
            >
              <Plus size={13} />
              Adicionar
            </motion.button>
          ) : (
            <motion.div
              key="counter"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="w-full flex items-center justify-between bg-surface-2 rounded-xl border border-white/15 px-1"
            >
              <button
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-surface-3 rounded-xl transition-colors"
              >
                <Minus size={13} />
              </button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.4 }}
                animate={{ scale: 1 }}
                className="text-center text-white font-heading font-bold text-sm"
              >
                {quantity}
              </motion.span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 flex items-center justify-center text-white hover:bg-surface-3 rounded-xl transition-colors"
              >
                <Plus size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}
