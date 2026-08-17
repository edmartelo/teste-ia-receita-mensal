// Preços do ERP às vezes chegam como número (129.9) e às vezes como string
// no formato brasileiro ("1.299,90"). Normaliza os dois para número.
export function parseNumber(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string') {
    const normalizado = value.trim().replace(/\./g, '').replace(',', '.')
    const parsed = parseFloat(normalizado)
    return Number.isNaN(parsed) ? null : parsed
  }
  return null
}

export function computeProduct(raw) {
  const preco = parseNumber(raw.preco)
  const custo = parseNumber(raw.custo)
  const demanda = parseNumber(raw.demanda)

  const custoDisponivel = custo !== null
  const receita = preco !== null && demanda !== null ? preco * demanda : null
  const custoTotalMensal = custoDisponivel && demanda !== null ? custo * demanda : null
  const lucro = receita !== null && custoTotalMensal !== null ? receita - custoTotalMensal : null
  // Margem = participação do lucro unitário sobre o PREÇO (não sobre o custo).
  // Indefinida quando o preço é 0 (item de brinde) — divisão por zero.
  const margem = custoDisponivel && preco !== null && preco > 0
    ? ((preco - custo) / preco) * 100
    : null

  return {
    id: raw.id,
    nome: raw.nome,
    preco,
    custo,
    demanda,
    receita,
    lucro,
    margem,
    // Produto só entra nos totais consolidados se tiver todos os dados
    // necessários para lucro (preço, custo e demanda). Sem isso, incluir
    // a receita mas não o lucro distorceria a margem consolidada.
    completo: custoDisponivel && preco !== null && demanda !== null,
  }
}

export function computeCatalog(rawList) {
  const produtos = rawList.map(computeProduct)
  const completos = produtos.filter((p) => p.completo)

  const receitaTotal = completos.reduce((sum, p) => sum + p.receita, 0)
  const lucroTotal = completos.reduce((sum, p) => sum + p.lucro, 0)
  // Ponderada por receita (lucroTotal / receitaTotal), não média simples das
  // margens individuais — assim produtos com mais peso no faturamento pesam
  // mais no resultado consolidado.
  const margemConsolidada = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : 0

  return {
    produtos,
    resumo: {
      receitaTotal,
      lucroTotal,
      margemConsolidada,
      totalProdutos: produtos.length,
      produtosIncompletos: produtos.length - completos.length,
    },
  }
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatBRL(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return currencyFormatter.format(value)
}

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return `${percentFormatter.format(value)}%`
}
