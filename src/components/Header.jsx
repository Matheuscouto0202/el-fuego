'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag, Clock } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import productsData from '@/data/products.json'

export default function Header() {
  const { openCart } = useCartStore()
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-black-border">
      <div className="max-w-lg mx-auto px-4 py-2.5 flex items-center justify-between">

        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-black/60 border border-white/10 bg-[#111111]">
            <Image
              src="/images/logo.png"
              alt="El Fuego"
              fill
              className="object-contain p-0.5"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <h1 className="font-heading font-bold text-white text-base leading-none tracking-wide">
              EL FUEGO
            </h1>
            <p className="text-gray-400 text-[10px] font-body tracking-widest uppercase mt-0.5">
              Mexican Street Grill
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-gray-400 text-xs font-body">
            <Clock size={13} className="text-gray-300" />
            <span>{productsData.restaurant.estimatedTime.delivery}</span>
          </div>

          <button
            onClick={openCart}
            className="relative p-2 rounded-xl bg-surface-2 hover:bg-surface-3 transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={20} className="text-white" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md"
              >
                {totalItems > 9 ? '9+' : totalItems}
              </motion.span>
            )}
          </button>
        </div>

      </div>
    </header>
  )
}
