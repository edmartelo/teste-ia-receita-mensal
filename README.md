# Painel de Margem do Catálogo

Painel para visibilidade sobre a saúde de margem do portfólio de produtos:
quem gera lucro, quem opera no prejuízo e onde o resultado está concentrado.

## Stack

- **React 18 + Vite** — sem framework de roteamento ou state manager: a tela
  é única e o estado (busca/ordenação) é local aos componentes.
- **Tailwind CSS** em vez de MUI — para uma tela só, com poucos componentes
  visuais próprios (cards, tabela, gráfico), Tailwind evita o peso de um
  design system inteiro e dá controle direto sobre a paleta neon pedida.
- **Recharts** para o gráfico de barras — única lib de gráficos adicionada,
  suficiente para o caso de uso (um bar chart horizontal).

## Rodando

```bash
npm install
npm run dev
```

## Decisões de cálculo e tratamento de dados

Os dados vêm de um export de ERP (`data.json`) e chegam com inconsistências
reais — parte do exercício foi decidir como tratá-las:

- **Preço como string BR** (`"1.299,90"`): alguns produtos trazem o preço
  como string no formato brasileiro em vez de número. Normalizado via
  `parseNumber` (remove separador de milhar `.`, troca `,` decimal por `.`).
- **Custo ausente (`null`)**: dois produtos (Hub USB-C, Smartwatch Básico)
  não têm custo cadastrado. Sem custo não há como calcular lucro ou margem
  de forma confiável — em vez de assumir custo zero (o que inflaria o lucro
  artificialmente), esses produtos são **excluídos dos totais consolidados**
  (receita, lucro e margem do card de resumo) e sinalizados na tabela com o
  selo "dado incompleto". A receita bruta deles seria calculável
  isoladamente, mas incluí-la só no numerador ou só no denominador do
  consolidado distorceria a margem — por isso ficam de fora dos dois.
- **Preço zero (item de brinde)**: "Brinde Adesivos" tem preço R$ 0 e custo
  R$ 2,50. A margem percentual não é definida (divisão por zero) e aparece
  como "—" na tabela, mas o **lucro continua calculado normalmente**
  (0 − custo × demanda = prejuízo), porque essa informação é o ponto central
  do painel: mostrar onde o catálogo está perdendo dinheiro.
- **Margem do produto**: `(preço − custo) / preço × 100` — participação do
  lucro unitário sobre o preço de venda, conforme pedido (não sobre o
  custo).
- **Margem consolidada do catálogo**: `lucro total / receita total`, e não a
  média simples das margens individuais. Isso pondera automaticamente pelo
  peso de cada produto no faturamento — um produto de alto volume/baixa
  margem pesa mais no resultado real do que um produto de nicho com margem
  alta, que é exatamente o comportamento pedido.

## Design visual

Achei mais produtivo utilizar tailwind, lib pesaria no projeto sem necessidade.

Tema escuro com paleta neon (verde para lucro, rosa/magenta para prejuízo,
ciano como cor de destaque neutra), usada de forma consistente entre os
cards, o gráfico e a tabela. Cor nunca é o único sinal: valores negativos
também trazem o selo "▼" e produtos com dado incompleto trazem o rótulo
"dado incompleto", não apenas uma cor diferente.

A paleta foi validada com o script de contraste/CVD da skill de
visualização de dados do Claude Code (contraste ≥ 3:1 contra o fundo escuro
e separação segura para daltonismo entre verde/rosa/ciano). Uma ressalva
registrada: o verde e o ciano neon usados aqui ficam mais claros que a
faixa padrão recomendada para paletas categóricas de dashboard — trade-off
consciente para atender ao pedido explícito de "cores neon", mantendo os
critérios de contraste e distinguibilidade sob daltonismo.

## Revisão com agent (code-review)

Depois da primeira versão pronta, rodei o skill `code-review` do Claude Code
(fork de 10 agents de busca + verificação adversarial) sobre o diff completo
do projeto. Ele apontou 13 achados; tratei-os assim:

**Corrigidos:**
- **Cor da margem indefinida** (`CatalogTable.jsx`): a coluna Margem herdava
  a cor de prejuízo (rosa) do Lucro sempre que `p.lucro < 0`, então o "Brinde
  Adesivos" (margem indefinida por preço R$ 0, ÷0) aparecia em rosa mesmo sem
  ter uma margem negativa de fato — confundia "indefinido" com "prejuízo".
  Agora a Margem tem cor própria: cinza quando indefinida/incompleta, rosa só
  quando realmente negativa.
- **Busca quebrava com nome ausente**: o filtro por nome chamava
  `.toLowerCase()` direto em `p.nome`, sem a mesma proteção contra `null`
  que já existia para preço/custo/demanda. Uma linha do ERP sem `nome`
  derrubaria o painel inteiro ao digitar na busca. Corrigido com
  `String(p.nome ?? '')`.
- **Preço/custo/demanda negativos não eram tratados como dado inválido**:
  um custo negativo, por exemplo, empurrava a margem para acima de 100% e
  inflava o lucro artificialmente. Agora valores negativos são tratados como
  ausentes, seguindo o mesmo padrão já usado para custo nulo (produto vai
  para "dado incompleto" e sai dos totais). O texto do resumo também deixou
  de dizer especificamente "sem custo cadastrado", já que agora a exclusão
  pode vir de qualquer um dos três campos.

**Documentados, não corrigidos** (fora do escopo dos 40 minutos — não
ocorrem com o `data.json` atual, só com variações hipotéticas de export):
`parseNumber` assume formatação BR mesmo em strings decimais simples (ex.:
`"89.9"` seria mal interpretado); `data.json` não é validado como array antes
do `map`; margem consolidada cai para "0,0%" (e não para negativo) no caso
extremo de receita total ficar ≤ 0; `parseFloat` aceita lixo à direita da
string; cor de lucro/prejuízo duplicada em 3 componentes em vez de uma fonte
única; `ProfitChart` recalcula o top 10 sem `useMemo`; campo `totalProdutos`
calculado e nunca consumido.

## Ajustes de ordenação

- **Gráfico**: os 10 produtos aparecem do maior lucro (topo) para o menor
  (base) — o array já vem ordenado assim para o `BarChart` vertical do
  Recharts, que renderiza a primeira posição do array no topo.
- **Tabela do catálogo**: ordem alfabética por nome como estado inicial
  (antes de qualquer clique no cabeçalho); ordenar por margem continua
  disponível clicando em "Margem %".

## Tempo gasto

Prazo do exercício: 40 minutos. 
Tempo tratando a mecânica do teste - **+/- 10 minutos**
Tempo de execução da I.A: **~8 minutos**
Tempo real de construção: **~18 minutos**
