import { formatBRL, formatPercent } from '../utils/catalog.js'

const TONE_CLASSES = {
  cyan: { border: 'border-neon-cyan/30 shadow-glow-cyan', text: 'text-neon-cyan' },
  green: { border: 'border-neon-green/30 shadow-glow-green', text: 'text-neon-green' },
  pink: { border: 'border-neon-pink/30 shadow-glow-pink', text: 'text-neon-pink' },
}

function Card({ label, value, tone, hint }) {
  const { border, text } = TONE_CLASSES[tone]

  return (
    <div className={`rounded-xl border bg-panel/80 p-5 shadow-lg ${border}`}>
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${text}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  )
}

export default function SummaryCards({ resumo }) {
  const lucroTone = resumo.lucroTotal >= 0 ? 'green' : 'pink'
  const margemTone = resumo.margemConsolidada >= 0 ? 'green' : 'pink'

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card label="Receita total (mês)" value={formatBRL(resumo.receitaTotal)} tone="cyan" />
      <Card
        label="Lucro total (mês)"
        value={formatBRL(resumo.lucroTotal)}
        tone={lucroTone}
        hint={resumo.lucroTotal >= 0 ? '▲ portfólio lucrativo' : '▼ portfólio no prejuízo'}
      />
      <Card
        label="Margem consolidada"
        value={formatPercent(resumo.margemConsolidada)}
        tone={margemTone}
        hint={
          resumo.produtosIncompletos > 0
            ? `${resumo.produtosIncompletos} produto(s) com dado incompleto, excluído(s) do cálculo`
            : 'ponderada por receita'
        }
      />
    </div>
  )
}
