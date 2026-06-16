'use client'
import { motion } from 'framer-motion'

export default function AxoAvatar({ size = 48 }: { size?: number }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #F97316, #EA6C00)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(249,115,22,0.3)',
        flexShrink: 0,
      }}
    >
      <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: size * 0.4 }}>A</span>
    </motion.div>
  )
}
