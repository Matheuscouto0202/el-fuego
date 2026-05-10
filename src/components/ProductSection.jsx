'use client'

import { useRef, useEffect } from 'react'
import CategoryCarousel from './CategoryCarousel'
import productsData from '@/data/products.json'

export default function ProductSection({ activeCategory, onCategoryVisible }) {
  const sectionRefs = useRef({})

  useEffect(() => {
    const observers = {}

    productsData.categories.forEach((cat) => {
      const el = sectionRefs.current[cat.id]
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            onCategoryVisible(cat.id)
          }
        },
        { threshold: 0.3, rootMargin: '-120px 0px -50% 0px' }
      )
      observer.observe(el)
      observers[cat.id] = observer
    })

    return () => {
      Object.values(observers).forEach((obs) => obs.disconnect())
    }
  }, [onCategoryVisible])

  return (
    <div id="menu" className="pb-32">
      {productsData.categories.map((cat) => {
        const catProducts = productsData.products.filter(
          (p) => p.categoryId === cat.id
        )
        if (!catProducts.length) return null

        return (
          <section
            key={cat.id}
            id={`section-${cat.id}`}
            ref={(el) => (sectionRefs.current[cat.id] = el)}
            className="mb-12"
          >
            {/* Category header */}
            <div className="flex items-center gap-2 mb-4 pt-7 px-4">
              <span className="text-lg">{cat.emoji}</span>
              <h2 className="font-heading font-bold text-white text-base">
                {cat.name}
              </h2>
              <div className="flex-1 h-px bg-black-border" />
              <span className="text-gray-600 text-xs font-body">
                {catProducts.length} itens
              </span>
            </div>

            {/* Carousel */}
            <CategoryCarousel products={catProducts} />
          </section>
        )
      })}
    </div>
  )
}
