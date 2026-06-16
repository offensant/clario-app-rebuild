'use client'
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

interface SparklineChartProps {
  data: number[]
  width?: number | `${number}%`
  height?: number
  color?: string
}

export default function SparklineChart({ data, width = '100%', height = 60, color = '#F97316' }: SparklineChartProps) {
  const chartData = data.map((value, i) => ({ index: i, value }))

  // Avoid flat-line rendering issue with single value
  if (chartData.length < 2) {
    chartData.push({ index: 1, value: data[0] || 0 })
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData}>
        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
        <defs>
          <linearGradient id={`sparkline-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          fill={`url(#sparkline-${color})`}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
