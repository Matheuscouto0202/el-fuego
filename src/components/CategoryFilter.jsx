'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import productsData from '@/data/products.json'

export default function CategoryFilter({ activeCategory, onSelect }) {
  const scrollRef = useRef(null)
  const activeBtnRef = useRef(null)

  useEffect(() => {
    if (activeBtnRef.current && scrollRef.current) {
      activeBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [activeCategory])

  return (
    <div className="sticky top-[57px] z-30 bg-black/95 backdrop-blur-md border-b border-black-border">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {productsData.categories.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              ref={isActive ? activeBtnRef : null}
              onClick={() => onSelect(cat.id)}
              className={`
                relative flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 shrink-0
                ${isActive
                  ? 'bg-white text-black shadow-md shadow-white/10'
                  : 'bg-surface-2 text-gray-400 hover:bg-surface-3 hover:text-white'
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
              {isActive && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute inset-0 rounded-full border border-white/30"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
