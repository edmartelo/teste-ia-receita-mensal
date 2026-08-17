// Preços do ERP às vezes chegam como número (129.9) e às vezes como string —
// no formato brasileiro ("1.299,90", ponto de milhar + vírgula decimal) ou
// já em decimal simples ("89.9"). Só trata o ponto como milhar quando há
// vírgula decimal na mesma string; sem vírgula, o ponto já é o separador
// decimal. Valida a string inteira (não só o prefixo que parseFloat aceita)
// para não engolir lixo à direita como "12,90un".
export function parseNumber(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string') {
    const texto = value.trim()
    const normalizado = texto.includes(',') ? texto.replace(/\./g, '').replace(',', '.') : texto
    if (!/^-?\d+(\.\d+)?$/.test(normalizado)) return null
    return parseFloat(normalizado)
  }
  return null
}

// Valores negativos não fazem sentido de negócio (preço, custo e demanda
// nunca são < 0) e indicam erro de exportação do ERP — tratados como
// ausentes, seguindo o mesmo padrão de "dado incompleto" usado para custo
// nulo.
function semNegativo(valor) {
  return valor !== null && valor < 0 ? null : valor
}

export function computeProduct(raw) {
  const preco = semNegativo(parseNumber(raw.preco))
  const custo = semNegativo(parseNumber(raw.custo))
  const demanda = semNegativo(parseNumber(raw.demanda))

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
  // data.json é um export de ERP externo — valida o formato mínimo (array
  // de objetos) antes de processar, em vez de deixar o .map quebrar a tela
  // inteira em branco se vier um formato inesperado (ex.: objeto envelope
  // {produtos: [...]} ou uma entrada nula no meio da lista).
  const brutos = Array.isArray(rawList) ? rawList.filter((r) => r && typeof r === 'object') : []
  const produtos = brutos.map(computeProduct)
  const completos = produtos.filter((p) => p.completo)

  const receitaTotal = completos.reduce((sum, p) => sum + p.receita, 0)
  const lucroTotal = completos.reduce((sum, p) => sum + p.lucro, 0)
  // Ponderada por receita (lucroTotal / receitaTotal), não média simples das
  // margens individuais — assim produtos com mais peso no faturamento pesam
  // mais no resultado consolidado. Sem receita (nenhum produto completo, ou
  // todos com preço 0), a margem consolidada não tem denominador — fica
  // indefinida (null) em vez de mascarar prejuízo como "0,0%".
  const margemConsolidada = receitaTotal > 0 ? (lucroTotal / receitaTotal) * 100 : null

  return {
    produtos,
    resumo: {
      receitaTotal,
      lucroTotal,
      margemConsolidada,
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
