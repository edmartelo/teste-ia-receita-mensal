import { useMemo, useState } from 'react'
import { formatBRL, formatPercent } from '../utils/catalog.js'

export default function CatalogTable({ produtos }) {
  const [busca, setBusca] = useState('')
  const [direcao, setDirecao] = useState(null) // null | 'asc' | 'desc'

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const lista = termo
      ? produtos.filter((p) => p.nome.toLowerCase().includes(termo))
      : produtos.slice()

    if (!direcao) return lista

    return lista.sort((a, b) => {
      if (a.margem === null && b.margem === null) return 0
      if (a.margem === null) return 1
      if (b.margem === null) return -1
      return direcao === 'asc' ? a.margem - b.margem : b.margem - a.margem
    })
  }, [produtos, busca, direcao])

  function alternarOrdenacao() {
    setDirecao((atual) => (atual === 'desc' ? 'asc' : 'desc'))
  }

  const indicador = direcao === 'desc' ? ' ▼' : direcao === 'asc' ? ' ▲' : ''

  return (
    <div className="rounded-xl border border-zinc-800 bg-panel/80 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Catálogo de produtos
        </h2>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome..."
          className="w-full rounded-lg border border-zinc-700 bg-surface px-3 py-1.5 text-sm text-zinc-100 outline-none focus:border-neon-cyan sm:w-64"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
              <th className="py-2 pr-4">Nome</th>
              <th className="py-2 pr-4 text-right">Preço</th>
              <th className="py-2 pr-4 text-right">Custo</th>
              <th
                className="cursor-pointer select-none py-2 pr-4 text-right hover:text-neon-cyan"
                onClick={alternarOrdenacao}
                title="Ordenar por margem"
              >
                Margem %{indicador}
              </th>
              <th className="py-2 pr-4 text-right">Receita/mês</th>
              <th className="py-2 pr-4 text-right">Lucro/mês</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p) => {
              const semCusto = !p.completo
              const prejuizo = p.completo && p.lucro < 0
              const valorClasse = semCusto
                ? 'text-zinc-500'
                : prejuizo
                ? 'text-neon-pink'
                : 'text-neon-green'

              return (
                <tr key={p.id} className="border-b border-zinc-800/60 last:border-0">
                  <td className="py-2 pr-4 text-zinc-100">
                    {p.nome}
                    {semCusto && (
                      <span className="ml-2 rounded border border-zinc-600 px-1.5 py-0.5 text-[10px] uppercase text-zinc-500">
                        dado incompleto
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-right text-zinc-300">{formatBRL(p.preco)}</td>
                  <td className="py-2 pr-4 text-right text-zinc-300">
                    {semCusto ? '—' : formatBRL(p.custo)}
                  </td>
                  <td className={`py-2 pr-4 text-right font-medium ${valorClasse}`}>
                    {formatPercent(p.margem)}
                  </td>
                  <td className="py-2 pr-4 text-right text-zinc-300">{formatBRL(p.receita)}</td>
                  <td className={`py-2 pr-4 text-right font-medium ${valorClasse}`}>
                    {semCusto ? '—' : formatBRL(p.lucro)}
                  </td>
                </tr>
              )
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-zinc-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
