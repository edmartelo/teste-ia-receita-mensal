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

**Também corrigidos** (inicialmente deixados só documentados, depois
endereçados):
- `parseNumber` só tratava o ponto como separador de milhar — uma string
  decimal simples como `"89.9"` virava `899`. Agora só remove pontos quando
  a mesma string tem vírgula (padrão BR real, ex. `"1.299,90"`); sem vírgula,
  o ponto já é o separador decimal.
- Junto disso, `parseNumber` passou a validar a string inteira com regex em
  vez de aceitar o prefixo que `parseFloat` reconhece — um valor como
  `"12,90un"` agora vira dado inválido (`null`) em vez de silenciosamente
  virar `12.9`.
- `computeCatalog` valida que `data.json` é um array de objetos antes do
  `map` (ignora entradas nulas/inválidas) em vez de derrubar o app inteiro
  se o export do ERP vier em outro formato.
- Margem consolidada agora fica indefinida (`—`) em vez de "0,0%" quando a
  receita total dos produtos completos é ≤ 0 — um card de margem em verde
  mostrando 0% mascararia um prejuízo real nesse cenário extremo.
- Cor de lucro/prejuízo centralizada em `src/utils/tone.js` — tabela, cards
  e gráfico leem da mesma fonte (`TONE`/`tonePorSinal`) em vez de repetir
  classes Tailwind e hex soltos que podiam desalinhar entre si.
- `ProfitChart` agora memoiza o cálculo do top 10 com `useMemo`, no mesmo
  padrão já usado pela tabela.
- Campo `totalProdutos` removido do resumo por não ter nenhum consumidor.

Com isso, todos os 13 achados do `code-review` foram corrigidos.

## Tempo gasto

Prazo do exercício: 40 minutos. 
Tempo tratando a mecânica do teste - **+/- 10 minutos**
Tempo de execução da I.A: **~8 minutos**
Tempo real de construção: **~18 minutos**
