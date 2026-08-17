import rawCatalog from '../data.json'
import SummaryCards from './components/SummaryCards.jsx'
import ProfitChart from './components/ProfitChart.jsx'
import CatalogTable from './components/CatalogTable.jsx'
import { computeCatalog } from './utils/catalog.js'

const { produtos, resumo } = computeCatalog(rawCatalog)

export default function App() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">Painel de Margem do Catálogo</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Saúde de margem do portfólio: quem gera lucro, quem opera no prejuízo e onde o
          resultado está concentrado.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <SummaryCards resumo={resumo} />
        <ProfitChart produtos={produtos} />
        <CatalogTable produtos={produtos} />
      </div>
    </div>
  )
}
