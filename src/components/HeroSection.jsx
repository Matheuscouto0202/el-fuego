'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-black">
      {/* Background — hero image */}
      <div className="relative h-64 w-full">
        <Image
          src="/images/capa.png"
          alt="El Fuego Mexican Street Grill"
          fill
          className="object-cover object-center opacity-60"
          priority
          sizes="100vw"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-black/50" />
      </div>

      {/* Overlay content */}
      <div className="px-5 pb-7 -mt-16 relative z-10 flex items-end gap-5">

        {/* Logo badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
          className="relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10 bg-[#111111]"
        >
          <Image
            src="/images/logo.png"
            alt="El Fuego"
            fill
            className="object-contain p-1"
            sizes="80px"
            priority
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="pb-1"
        >
          <p className="text-gray-400 text-[11px] font-body tracking-widest uppercase font-semibold mb-1">
            🌶️ Mexican Street Grill
          </p>
          <h2 className="font-heading font-bold text-white text-xl leading-tight">
            O sabor do México
          </h2>
          <h2 className="font-heading font-bold text-xl leading-tight mb-3">
            <span className="text-gold">na sua mesa.</span>
          </h2>

          <button
            onClick={scrollToMenu}
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light active:scale-95 text-white font-heading font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-black/40"
          >
            PEDIR AGORA 🌮
          </button>
        </motion.div>

      </div>
    </section>
  )
}
