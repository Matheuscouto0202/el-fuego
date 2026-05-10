'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'

export default function CategoryCarousel({ products }) {
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

  return (
    <div className="relative">

      {/* ── Left arrow overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div
            key="left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-0 bottom-2 z-20 flex items-center pointer-events-none"
          >
            {/* Fade gradient */}
            <div
              className="absolute inset-0 w-16"
              style={{ background: 'linear-gradient(to right, rgba(11,11,11,0.85) 30%, transparent)' }}
            />
            {/* Button */}
            <button
              onClick={() => scrollBy(-1)}
              className="
                relative z-10 ml-2 pointer-events-auto
                w-9 h-9 rounded-full flex items-center justify-center
                bg-black/40 backdrop-blur-sm
                border border-white/10
                text-white
                hover:bg-black/70 hover:border-white/20
                active:scale-90
                transition-all duration-150
                shadow-lg
              "
              aria-label="Anterior"
            >
              <ChevronLeft size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Right arrow overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.div
            key="right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-0 bottom-2 z-20 flex items-center justify-end pointer-events-none"
          >
            {/* Fade gradient */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to left, rgba(11,11,11,0.85) 30%, transparent)' }}
            />
            {/* Button */}
            <button
              onClick={() => scrollBy(1)}
              className="
                relative z-10 mr-2 pointer-events-auto
                w-9 h-9 rounded-full flex items-center justify-center
                bg-black/40 backdrop-blur-sm
                border border-white/10
                text-white
                hover:bg-black/70 hover:border-white/20
                active:scale-90
                transition-all duration-150
                shadow-lg
              "
              aria-label="Próximo"
            >
              <ChevronRight size={17} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Scroll container ────────────────────────────────────────── */}
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
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            className="snap-start shrink-0 w-40"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
        <div className="shrink-0 w-2" aria-hidden="true" />
      </div>
    </div>
  )
}
