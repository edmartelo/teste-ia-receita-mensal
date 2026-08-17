import { formatBRL, formatPercent } from '../utils/catalog.js'
import { TONE, tonePorSinal } from '../utils/tone.js'

function Card({ label, value, tone, hint }) {
  const { border, text } = TONE[tone]

  return (
    <div className={`rounded-xl border bg-panel/80 p-5 shadow-lg ${border}`}>
      <p className="text-xs uppercase tracking-wide text-zinc-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${text}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  )
}

export default function SummaryCards({ resumo }) {
  const lucroTone = tonePorSinal(resumo.lucroTotal)
  const margemTone = resumo.margemConsolidada === null ? 'cyan' : tonePorSinal(resumo.margemConsolidada)

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
