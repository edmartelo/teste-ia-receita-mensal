Vamos fazer um projeto do zero, e preciso que você preencha o CLAUDE.md com as informações passadas abaixo, para construirmos a aplicação do zero da forma mais acertiva possível.

Painel de Margem do Catálogo
Um cliente exportou o catálogo de produtos diretamente do ERP e precisa de visibilidade sobre a saúde de margem do portfólio: quais produtos geram lucro, quais operam no prejuízo e onde está concentrado o resultado. Sua tarefa é construir esse painel.

Faça o projeto em React da forma menos poluída, vamos utilizar somente libs e estruturas reais, sem arquivos 'de sobra'.
Utilize libs de UI e gráficos, como Material UI (MUI), ou simplesmente tailwind, se ficar mais leve. Use cores de neon.

Utilize skills e agents e prompts salvos.

Dados do catálogo está em data.json na raiz do projeto
Regras de negócio
Cada produto do catálogo possui preço de venda, custo unitário de aquisição e demanda mensal (unidades vendidas por mês). A partir desses dados, o painel deve apresentar os seguintes indicadores — a tradução das regras em cálculo é parte da sua entrega

Receita mensal do produto: corresponde ao preço de venda aplicado sobre o volume de demanda mensal.
Lucro mensal do produto: corresponde ao que resta da receita mensal após descontado o custo de aquisição de todas as unidades vendidas no período.
Margem do produto: representa a participação percentual do lucro unitário sobre o preço de venda — não sobre o custo.
Margem consolidada do catálogo: deve refletir a rentabilidade real do portfólio como um todo, considerando que os produtos têm pesos muito diferentes no resultado.
Demais decisões de cálculo e tratamento são suas. Registre no README o que decidiu e a justificativa.

O que construir
O visual é seu, mas a tela precisa conter estas três peças:

Tabela do catálogo. Uma linha por produto: nome, preço, custo, margem %, receita e lucro. Com busca por nome e ordenação por margem ao clicar no cabeçalho da coluna.
Gráfico. Os 10 produtos de maior lucro mensal. Barras, ou o formato que melhor comunicar a informação.
Card de resumo. Receita total, lucro total e a margem consolidada do catálogo.
Todos os valores monetários em real (R$), com formatação brasileira.

A atividade tem o prazo de 40 minutos, ao final me apresente o tempo em que o projeto levou para ser feito.


Pegue as informações deste arquivo e coloque CLAUDE.md