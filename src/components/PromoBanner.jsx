'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function PromoBanner() {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[#1a1a1a] border-b border-[#2e2e2e] text-gray-300 text-xs font-body font-medium px-4 py-2 flex items-center justify-center gap-2 tracking-wide"
    >
      <Flame size={13} className="text-gold shrink-0" />
      <span>
        Frete grátis acima de R$ 80 &nbsp;•&nbsp; Entrega em 30–45 min &nbsp;•&nbsp; Aberto agora 🌮
      </span>
    </motion.div>
  )
}
