import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatBRL } from '../utils/catalog.js'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const produto = payload[0].payload
  return (
    <div className="rounded-lg border border-zinc-700 bg-panel px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-zinc-100">{produto.nome}</p>
      <p className="text-neon-green">{formatBRL(produto.lucro)} / mês</p>
    </div>
  )
}

export default function ProfitChart({ produtos }) {
  const top10 = produtos
    .filter((p) => p.completo)
    .sort((a, b) => b.lucro - a.lucro)
    .slice(0, 10)
    .reverse() // maior lucro no topo do gráfico horizontal

  return (
    <div className="rounded-xl border border-zinc-800 bg-panel/80 p-5">
      <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
        Top 10 produtos por lucro mensal
      </h2>
      <div className="mt-4 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top10} layout="vertical" margin={{ left: 24, right: 24 }}>
            <CartesianGrid horizontal={false} stroke="#2c2c2a" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickFormatter={(v) => formatBRL(v)}
              stroke="#898781"
              tick={{ fontSize: 11, fill: '#898781' }}
            />
            <YAxis
              type="category"
              dataKey="nome"
              width={140}
              stroke="#898781"
              tick={{ fontSize: 12, fill: '#c3c2b7' }}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(57,255,136,0.06)' }} />
            <Bar dataKey="lucro" radius={[0, 4, 4, 0]} maxBarSize={18}>
              {top10.map((p) => (
                <Cell key={p.id} fill={p.lucro >= 0 ? '#39ff88' : '#ff3d81'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
