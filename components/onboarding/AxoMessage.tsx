'use client'
import { motion } from 'framer-motion'
import AxoAvatar from './AxoAvatar'

export default function AxoMessage({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 28, maxWidth: 480 }}
    >
      <AxoAvatar size={40} />
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: '14px 18px',
        fontSize: 15,
        color: '#9CA3AF',
        lineHeight: 1.6,
      }}>
        {text}
      </div>
    </motion.div>
  )
}
