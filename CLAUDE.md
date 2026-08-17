# CLAUDE.md

Instruções do projeto para o Claude Code.

## Projeto: Painel de Margem do Catálogo

Um cliente exportou o catálogo de produtos diretamente do ERP e precisa de
visibilidade sobre a saúde de margem do portfólio: quais produtos geram
lucro, quais operam no prejuízo e onde está concentrado o resultado.

### Requisitos técnicos

- React, o mais enxuto possível — apenas libs e estruturas reais, sem
  arquivos "de sobra".
- Lib de UI/gráficos: MUI ou Tailwind (o que ficar mais leve). Paleta neon.
- Usar skills, agents e prompts salvos do Claude Code durante a construção.
- Dados do catálogo em `data.json` na raiz do projeto.

### Regras de negócio

Cada produto tem: preço de venda, custo unitário de aquisição e demanda
mensal (unidades vendidas/mês).

- **Receita mensal**: preço de venda × demanda mensal.
- **Lucro mensal**: receita mensal − (custo unitário × demanda mensal).
- **Margem do produto**: participação percentual do lucro unitário sobre o
  **preço de venda** (não sobre o custo). `(preço − custo) / preço × 100`.
- **Margem consolidada do catálogo**: deve refletir a rentabilidade real do
  portfólio, ponderando pelos pesos diferentes de cada produto no resultado
  (ponderada por receita, não média simples entre produtos).
- Demais decisões de cálculo/tratamento de dados ficam a critério da
  implementação — devem ser registradas no README com a justificativa.

### O que construir

Tela única contendo:

1. **Tabela do catálogo** — uma linha por produto: nome, preço, custo,
   margem %, receita e lucro. Busca por nome. Ordenação por margem ao
   clicar no cabeçalho da coluna.
2. **Gráfico** — os 10 produtos de maior lucro mensal (barras ou formato
   equivalente).
3. **Card de resumo** — receita total, lucro total e margem consolidada do
   catálogo.

Todos os valores monetários em R$, formatação brasileira (`pt-BR`).

### Prazo

Atividade com prazo de 40 minutos. Ao final, reportar o tempo total gasto
na construção do projeto.

Ver `intrucoes.md` para o texto original completo.
