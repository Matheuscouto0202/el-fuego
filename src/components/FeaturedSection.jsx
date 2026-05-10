'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import useCartStore from '@/store/cartStore'
import productsData from '@/data/products.json'
import { formatCurrency } from '@/utils/whatsapp'

export default function FeaturedSection() {
  const { addItem, items } = useCartStore()
  const featured = productsData.products.filter((p) => p.featured)

  const containerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft]   = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const isDragging  = useRef(false)
  const dragStartX  = useRef(0)
  const scrollStart = useRef(0)
  const hasDragged  = useRef(false)

  const updateScrollState = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const tol = 4
    setCanScrollLeft(el.scrollLeft > tol)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - tol)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const raf = requestAnimationFrame(updateScrollState)
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState])

  const scrollBy = (dir) => {
    containerRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  const onMouseDown = (e) => {
    isDragging.current  = true
    hasDragged.current  = false
    dragStartX.current  = e.pageX
    scrollStart.current = containerRef.current.scrollLeft
    containerRef.current.style.cursor     = 'grabbing'
    containerRef.current.style.userSelect = 'none'
  }

  const onMouseMove = (e) => {
    if (!isDragging.current) return
    const delta = e.pageX - dragStartX.current
    if (Math.abs(delta) > 4) hasDragged.current = true
    containerRef.current.scrollLeft = scrollStart.current - delta
  }

  const onMouseUp = () => {
    isDragging.current = false
    if (containerRef.current) {
      containerRef.current.style.cursor     = 'grab'
      containerRef.current.style.userSelect = ''
    }
  }

  const onClickCapture = (e) => {
    if (hasDragged.current) e.stopPropagation()
  }

  if (!featured.length) return null

  return (
    <section className="py-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 px-4">
        <span className="text-gold text-base">⭐</span>
        <h2 className="font-heading font-bold text-white text-base tracking-wide">
          Mais Pedidos
        </h2>
        <div className="flex-1 h-px bg-black-border" />
      </div>

      {/* Carousel */}
      <div className="relative">

        {/* Left arrow */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.div
              key="left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-0 bottom-1 z-20 flex items-center pointer-events-none"
            >
              <div
                className="absolute inset-0 w-16"
                style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.85) 30%, transparent)' }}
              />
              <button
                onClick={() => scrollBy(-1)}
                className="relative z-10 ml-2 pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 active:scale-90 transition-all duration-150 shadow-lg"
                aria-label="Anterior"
              >
                <ChevronLeft size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right arrow */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.div
              key="right"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-0 bottom-1 z-20 flex items-center justify-end pointer-events-none"
            >
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to left, rgba(13,13,13,0.85) 30%, transparent)' }}
              />
              <button
                onClick={() => scrollBy(1)}
                className="relative z-10 mr-2 pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 active:scale-90 transition-all duration-150 shadow-lg"
                aria-label="Próximo"
              >
                <ChevronRight size={17} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll container */}
        <div
          ref={containerRef}
          className="flex gap-4 overflow-x-auto pb-3 px-4 no-scrollbar snap-x snap-mandatory cursor-grab"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClickCapture={onClickCapture}
        >
          {featured.map((product, i) => {
            const inCart = items.find((it) => it.id === product.id)
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="snap-start relative shrink-0 w-44 bg-surface-1 rounded-2xl overflow-hidden border border-black-border hover:border-white/20 transition-colors group"
              >
                {/* Image */}
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="210px"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent" />

                  <div className="absolute top-2 left-2 bg-gold/20 border border-gold/40 px-2 py-0.5 rounded-full text-gold text-[10px] font-semibold">
                    {product.badge || '⭐ Destaque'}
                  </div>

                  <button
                    onClick={() => addItem(product)}
                    className="absolute bottom-2 right-2 w-8 h-8 bg-white hover:bg-gray-100 active:scale-90 rounded-full flex items-center justify-center shadow-lg shadow-black/40 transition-all"
                  >
                    <Plus size={16} className="text-black" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-heading font-semibold text-white text-xs leading-snug line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="font-heading font-bold text-gold text-sm">
                      {formatCurrency(product.price)}
                    </p>
                    {product.serves && (
                      <span className="text-gray-500 text-[10px] font-body">
                        {product.serves}
                      </span>
                    )}
                  </div>
                  {inCart && (
                    <p className="text-gray-300 text-[10px] font-body mt-1">
                      ✓ No carrinho ({inCart.quantity}x)
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
