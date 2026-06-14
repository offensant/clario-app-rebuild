export default function Divider({ text = 'or' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '20px 0',
    }}>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} className="dark:bg-white/8" />
      <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} className="dark:bg-white/8" />
    </div>
  )
}
