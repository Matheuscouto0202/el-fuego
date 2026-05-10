'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import PromoBanner from '@/components/PromoBanner'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CategoryFilter from '@/components/CategoryFilter'
import FeaturedSection from '@/components/FeaturedSection'
import ProductSection from '@/components/ProductSection'
import CartButton from '@/components/CartButton'
import CartDrawer from '@/components/CartDrawer'
import OrderForm from '@/components/OrderForm'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import productsData from '@/data/products.json'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('destaques')

  const handleCategorySelect = useCallback((categoryId) => {
    setActiveCategory(categoryId)
    const el = document.getElementById(`section-${categoryId}`)
    if (el) {
      const offset = 120 // header + category bar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  const handleCategoryVisible = useCallback((categoryId) => {
    setActiveCategory(categoryId)
  }, [])

  return (
    <main className="max-w-lg mx-auto relative min-h-screen">
      {/* Promo banner */}
      <PromoBanner />

      {/* Header */}
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Restaurant info strip */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-b border-black-border bg-surface-1">
        <InfoPill emoji="🕒" text={`Entrega ${productsData.restaurant.estimatedTime.delivery}`} />
        <div className="w-px h-4 bg-black-border" />
        <InfoPill emoji="🛵" text={`Taxa R$ ${productsData.restaurant.deliveryFee.toFixed(2).replace('.', ',')}`} />
        <div className="w-px h-4 bg-black-border" />
        <InfoPill emoji="⭐" text="4.9 (500+)" />
      </div>

      {/* Category filter (sticky) */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelect={handleCategorySelect}
      />

      {/* Featured section */}
      <FeaturedSection />

      {/* Divider */}
      <div className="mx-4 h-px bg-black-border mt-2 mb-2" />

      {/* Product sections */}
      <ProductSection
        activeCategory={activeCategory}
        onCategoryVisible={handleCategoryVisible}
      />

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-black-border">
        <div className="flex flex-col items-center gap-3 mb-3">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg shadow-black/50 border border-white/10 bg-[#0D0D0D]">
            <Image
              src="/images/logo.png"
              alt="El Fuego"
              fill
              className="object-contain p-1"
              sizes="56px"
            />
          </div>
          <div>
            <p className="font-heading font-bold text-white text-sm tracking-wide">EL FUEGO</p>
            <p className="text-gray-500 text-[10px] font-body tracking-widest uppercase">Mexican Street Grill</p>
          </div>
        </div>
        <p className="text-gray-600 text-xs font-body">{productsData.restaurant.address}</p>
        <p className="text-gray-600 text-xs font-body mt-0.5">{productsData.restaurant.hours}</p>
        <p className="text-gray-700 text-[10px] font-body mt-4">© 2025 El Fuego · Todos os direitos reservados</p>
      </footer>

      {/* Floating elements */}
      <WhatsAppFloat />
      <CartButton />
      <CartDrawer />
      <OrderForm />
    </main>
  )
}

function InfoPill({ emoji, text }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm">{emoji}</span>
      <span className="text-gray-400 text-xs font-body">{text}</span>
    </div>
  )
}
