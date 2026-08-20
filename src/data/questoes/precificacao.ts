import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("precificacao", aulaId, aula, extra);

/** Modulo: Precificação — trilha "Jornada de Precificação" (28 aulas no EAD). */
export const questoesPrecificacao: Questao[] = [
  /* ------------------------------------------------- L1: custo ----------- */
  {
    id: "pre-custo-q1",
    moduloId: "precificacao",
    licaoId: "pre-custo",
    tipo: "multipla-escolha",
    enunciado:
      "Qual é a relação entre a fórmula de custo geral da empresa e a fórmula específica de um produto?",
    explicacaoCorreta:
      "A fórmula geral vale como padrão para todos os produtos; a específica sobrepõe esse padrão apenas nos produtos em que foi definida. É uma relação de exceção sobre regra.",
    fonte: f(132, "Como utilizar a fórmula de custo geral para a empresa", {
      timestamp: "2:55",
    }),
    dificuldade: 2,
    tags: ["custo", "fórmula"],
    alternativas: [
      {
        id: "a",
        texto: "A específica sobrepõe a geral apenas nos produtos onde existe",
        correta: true,
      },
      {
        id: "b",
        texto: "As duas se somam no cálculo do custo",
        correta: false,
        explicacaoErro:
          "Somar duas fórmulas dobraria componentes de custo. Elas são alternativas mutuamente exclusivas por produto, não parcelas de um total.",
      },
      {
        id: "c",
        texto: "A geral sempre vence, e a específica é só informativa",
        correta: false,
        explicacaoErro:
          "Se a geral sempre vencesse, a fórmula específica não teria função. Ela existe justamente para tratar produtos que fogem ao padrão.",
      },
      {
        id: "d",
        texto: "A específica vale para o grupo de produtos inteiro",
        correta: false,
        explicacaoErro:
          "Confunde escopo: específica é por produto. Aplicar ao grupo mudaria o custo de itens que deveriam seguir a regra geral.",
      },
    ],
  },
  {
    id: "pre-custo-q2",
    moduloId: "precificacao",
    licaoId: "pre-custo",
    tipo: "associar-colunas",
    enunciado: "Associe cada tipo de custo ao seu propósito.",
    pares: [
      {
        id: "p1",
        esquerda: "Custo de reposição",
        direita: "Quanto custaria comprar o item hoje",
        explicacaoErro:
          "Reposição olha o preço atual de mercado. É o custo usado para decidir preço de venda sem corroer margem futura.",
      },
      {
        id: "p2",
        esquerda: "Custo contábil",
        direita: "Valor de estoque para balanço e apuração fiscal",
        explicacaoErro:
          "O contábil segue as regras de avaliação de estoque e alimenta o balanço. Não serve para decisão comercial do dia.",
      },
      {
        id: "p3",
        esquerda: "Custo gerencial",
        direita: "Base de análise interna de margem e resultado",
        explicacaoErro:
          "O gerencial é construído para decidir: pode incluir rateios e componentes que o contábil não aceita.",
      },
      {
        id: "p4",
        esquerda: "Custo por controle",
        direita: "Custo apurado por lote, série ou local do item",
        explicacaoErro:
          "Custo por controle desce ao nível da unidade rastreada, e não ao do produto como um todo.",
      },
    ],
    explicacaoCorreta:
      "Reposição para precificar, contábil para o balanço, gerencial para decidir, por controle para rastrear. Usar o custo errado na decisão de preço é o caminho mais rápido para vender abaixo do que custa repor.",
    explicacaoErro:
      "Precificar pelo custo contábil é o erro clássico em cenário de inflação: o valor histórico está defasado e a margem calculada existe só no relatório.",
    fonte: f(159, "Como apurar o custo de reposição dos produtos"),
    dificuldade: 3,
    tags: ["custo", "reposição", "contábil", "gerencial"],
  },
  {
    id: "pre-custo-q3",
    moduloId: "precificacao",
    licaoId: "pre-custo",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre recálculo de custos.",
    afirmacao:
      "O recálculo de custos pode ser agendado para rodar periodicamente, sem depender de alguém executá-lo manualmente.",
    resposta: true,
    explicacaoCorreta:
      "O agendamento do recálculo mantém o custo atualizado sem depender de rotina manual. Isso importa porque preço calculado sobre custo velho gera margem que não existe.",
    explicacaoErro:
      "Depender de execução manual faz o recálculo ser esquecido justamente nos períodos de maior movimento — quando o custo mais muda e a defasagem mais dói.",
    fonte: f(177, "Como realizar o agendamento do recálculo de custos"),
    dificuldade: 2,
    tags: ["recálculo", "agendador"],
  },
  {
    id: "pre-custo-q4",
    moduloId: "precificacao",
    licaoId: "pre-custo",
    tipo: "resposta-curta",
    enunciado:
      "Qual relatório mostra a formação do custo do produto ao longo dos movimentos de estoque?",
    respostasAceitas: ["kardex", "cardex"],
    respostaCanonica: "Kardex",
    dica: "É o mesmo relatório usado para auditar movimentação de estoque.",
    explicacaoCorreta:
      "O Kardex traz movimento a movimento com custo acumulado, permitindo ver em qual entrada o custo médio mudou. É onde a divergência de custo é reconstruída.",
    explicacaoErro:
      "Consultas de posição mostram o custo atual, sem dizer como ele se formou. A sequência de movimentos que explica o valor está no Kardex.",
    fonte: f(179, "Como emitir o Kardex"),
    dificuldade: 1,
    tags: ["Kardex", "custo"],
  },

  /* ---------------------------------------------- L2: tabelas ------------ */
  {
    id: "pre-tabelas-q1",
    moduloId: "precificacao",
    licaoId: "pre-tabelas",
    tipo: "multipla-escolha",
    contexto:
      "Existem tabelas de preço por parceiro, por região e uma tabela única geral.",
    enunciado: "Como o sistema decide qual preço aplicar em uma venda?",
    explicacaoCorreta:
      "Pela tabela mais específica que se aplica àquela venda. Parceiro é mais específico que região, e região é mais específica que a tabela única — a exceção vence a regra.",
    fonte: f(195, "Como definir tabelas de preço por parceiro"),
    dificuldade: 2,
    tags: ["tabela de preço", "precedência"],
    alternativas: [
      { id: "a", texto: "A tabela mais específica aplicável prevalece", correta: true },
      {
        id: "b",
        texto: "A tabela com o menor preço prevalece",
        correta: false,
        explicacaoErro:
          "O sistema não escolhe por valor — isso tornaria a política de preço imprevisível e sempre a favor do cliente, mesmo quando a intenção era cobrar mais de um canal.",
      },
      {
        id: "c",
        texto: "A tabela cadastrada mais recentemente prevalece",
        correta: false,
        explicacaoErro:
          "Data de cadastro não é critério de precedência. Se fosse, revisar a tabela geral sobrescreveria todas as exceções negociadas.",
      },
      {
        id: "d",
        texto: "O vendedor escolhe manualmente a tabela",
        correta: false,
        explicacaoErro:
          "A escolha manual pode existir como exceção controlada, mas não é o mecanismo padrão — o objetivo das tabelas é justamente tirar essa decisão do improviso.",
      },
    ],
  },
  {
    id: "pre-tabelas-q2",
    moduloId: "precificacao",
    licaoId: "pre-tabelas",
    tipo: "multipla-escolha",
    enunciado:
      "Qual é o cenário típico para uma tabela de preço por tipo de negociação?",
    explicacaoCorreta:
      "Diferenciar preço conforme a condição de pagamento: à vista mais barato, prazo longo mais caro, refletindo o custo financeiro embutido.",
    fonte: f(198, "Como definir tabelas de preço por tipo de negociação"),
    dificuldade: 2,
    tags: ["tabela de preço", "tipo de negociação"],
    alternativas: [
      {
        id: "a",
        texto: "Cobrar diferente conforme prazo e forma de pagamento",
        correta: true,
      },
      {
        id: "b",
        texto: "Cobrar diferente conforme o estado do cliente",
        correta: false,
        explicacaoErro:
          "Diferença geográfica é resolvida por tabela por região, do parceiro ou do vendedor. Tipo de negociação trata de condição de pagamento.",
      },
      {
        id: "c",
        texto: "Cobrar diferente conforme o local de estoque",
        correta: false,
        explicacaoErro:
          "Existe tabela por local para isso. O tipo de negociação não sabe de onde a mercadoria sai.",
      },
      {
        id: "d",
        texto: "Cobrar diferente conforme a quantidade comprada",
        correta: false,
        explicacaoErro:
          "Desconto por volume é regra de desconto, não de tabela por negociação. São mecanismos distintos e podem coexistir.",
      },
    ],
  },
  {
    id: "pre-tabelas-q3",
    moduloId: "precificacao",
    licaoId: "pre-tabelas",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre precedência de tabelas de preço.",
    texto:
      "Entre uma tabela {{1}} e a tabela {{2}}, o sistema aplica a {{3}}, porque a exceção prevalece sobre a regra geral.",
    lacunas: [
      { pos: 1, respostaId: "parceiro" },
      { pos: 2, respostaId: "unica" },
      { pos: 3, respostaId: "maisespecifica" },
    ],
    banco: [
      { id: "parceiro", texto: "por parceiro" },
      { id: "unica", texto: "única" },
      { id: "maisespecifica", texto: "mais específica" },
      {
        id: "maisantiga",
        texto: "mais antiga",
        explicacaoErro:
          "Antiguidade não é critério: a tabela geral costuma ser a mais antiga e, se ela vencesse, nenhuma negociação individual funcionaria.",
      },
      {
        id: "maiorpreco",
        texto: "de maior preço",
        explicacaoErro:
          "O sistema não escolhe pelo valor. A precedência é por especificidade, para que a política de preço seja previsível.",
      },
    ],
    explicacaoCorreta:
      "A hierarquia vai do geral ao particular. Uma tabela por parceiro existe para tratar aquele cliente de forma diferente, então ela precisa vencer a tabela única.",
    fonte: f(185, "Como definir a tabela de preço única"),
    dificuldade: 2,
    tags: ["tabela de preço", "precedência"],
  },
  {
    id: "pre-tabelas-q4",
    moduloId: "precificacao",
    licaoId: "pre-tabelas",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre tabela por região.",
    afirmacao:
      "A região usada na tabela de preço pode ser a do vendedor ou a do parceiro, e a escolha muda qual preço é aplicado.",
    resposta: true,
    explicacaoCorreta:
      "São dois cadastros diferentes: região do vendedor e região do parceiro. Escolher um ou outro muda o critério — território de venda ou localização do cliente.",
    explicacaoErro:
      "Tratar as duas como a mesma coisa faz o preço variar de forma inexplicável quando um vendedor de uma região atende cliente de outra.",
    fonte: f(188, "Como definir tabela de preço por região do vendedor"),
    dificuldade: 3,
    tags: ["tabela de preço", "região"],
  },

  /* --------------------------------------------- L3: análise ------------- */
  {
    id: "pre-analise-q1",
    moduloId: "precificacao",
    licaoId: "pre-analise",
    tipo: "multipla-escolha",
    enunciado:
      "O que a atualização de preço de venda pela nota de compra faz?",
    explicacaoCorreta:
      "Ao lançar a entrada, o sistema recalcula o preço de venda a partir do novo custo e da margem configurada, mantendo a rentabilidade quando o fornecedor reajusta.",
    fonte: f(216, "Como atualizar o preço de venda pela nota de compra"),
    dificuldade: 2,
    tags: ["preço de venda", "nota de compra"],
    alternativas: [
      {
        id: "a",
        texto: "Recalcula o preço de venda a partir do novo custo e da margem",
        correta: true,
      },
      {
        id: "b",
        texto: "Copia o preço da nota do fornecedor para o preço de venda",
        correta: false,
        explicacaoErro:
          "Isso venderia pelo custo, com margem zero. O preço de compra é insumo do cálculo, não o resultado.",
      },
      {
        id: "c",
        texto: "Atualiza somente o custo, sem tocar no preço",
        correta: false,
        explicacaoErro:
          "Atualizar apenas o custo é o comportamento padrão do estoque. O recurso descrito existe justamente para propagar a mudança até o preço.",
      },
      {
        id: "d",
        texto: "Cria uma nova tabela de preço para o fornecedor",
        correta: false,
        explicacaoErro:
          "Tabelas são por cliente, região ou negociação — nunca por fornecedor, que está no lado da compra.",
      },
    ],
  },
  {
    id: "pre-analise-q2",
    moduloId: "precificacao",
    licaoId: "pre-analise",
    tipo: "multipla-escolha",
    enunciado:
      "Para que serve a tela de Variação de Preço?",
    explicacaoCorreta:
      "Para analisar o preço efetivamente praticado nas vendas contra o preço de tabela, revelando onde o desconto concedido está corroendo a margem.",
    fonte: f(221, "Como analisar o preço de venda praticado pela tela Variação de Preço"),
    dificuldade: 2,
    tags: ["variação de preço", "margem"],
    alternativas: [
      {
        id: "a",
        texto: "Comparar o preço praticado com o preço de tabela",
        correta: true,
      },
      {
        id: "b",
        texto: "Alterar os preços em lote por índice",
        correta: false,
        explicacaoErro:
          "Reajuste em lote é feito na atualização por índice. Variação de Preço é tela de análise, não de alteração.",
      },
      {
        id: "c",
        texto: "Definir o desconto máximo permitido por produto",
        correta: false,
        explicacaoErro:
          "Limite de desconto é controle de aprovação, configurado como evento. A tela de variação mostra o resultado, não define a política.",
      },
      {
        id: "d",
        texto: "Consultar o histórico de custo do produto",
        correta: false,
        explicacaoErro:
          "Histórico de custo está no Kardex. Variação de Preço olha o lado da venda.",
      },
    ],
  },
  {
    id: "pre-analise-q3",
    moduloId: "precificacao",
    licaoId: "pre-analise",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene a revisão de preços após um reajuste do fornecedor.",
    passos: [
      { id: "s1", texto: "Lançar a nota de compra com o novo custo", ordem: 1 },
      { id: "s2", texto: "Recalcular o custo dos produtos afetados", ordem: 2 },
      { id: "s3", texto: "Atualizar o preço de venda pela margem desejada", ordem: 3 },
      { id: "s4", texto: "Conferir o resultado na Variação de Preço", ordem: 4 },
    ],
    explicacaoCorreta:
      "Custo entra pela nota, é recalculado, propaga para o preço e o efeito é conferido na análise. Cada etapa depende de a anterior ter sido efetivada.",
    explicacaoErro:
      "Atualizar o preço antes de recalcular o custo aplica a margem sobre o custo antigo: o preço sobe, mas não o suficiente, e a margem real fica abaixo da desejada.",
    fonte: f(174, "Como realizar o recálculo de custos"),
    dificuldade: 3,
    tags: ["recálculo", "preço", "margem"],
  },
  {
    id: "pre-analise-q4",
    moduloId: "precificacao",
    licaoId: "pre-analise",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre simulação de preço.",
    afirmacao:
      "A tela de Negociação e Simulação de Preço permite testar o efeito de um desconto na margem antes de fechar a venda.",
    resposta: true,
    explicacaoCorreta:
      "A simulação mostra o resultado do desconto sobre a margem antes de o pedido existir. É o que transforma negociação em decisão informada em vez de aposta.",
    explicacaoErro:
      "Sem simular, o vendedor descobre o efeito do desconto no relatório do mês seguinte — quando a margem já foi perdida e a venda não pode mais ser refeita.",
    fonte: f(225, "Como analisar o preço venda praticado pela tela Negociação e Simulação de Preço"),
    dificuldade: 2,
    tags: ["simulação", "margem", "desconto"],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "pre-prova-q1",
    moduloId: "precificacao",
    licaoId: "pre-prova",
    tipo: "multipla-escolha",
    contexto:
      "O produto está sendo vendido com margem positiva no relatório, mas o estoque não se sustenta: cada reposição custa mais do que a venda anterior rendeu.",
    enunciado: "Qual é a causa mais provável?",
    explicacaoCorreta:
      "O preço está sendo calculado sobre um custo histórico, não sobre o custo de reposição. A margem contábil existe, mas não cobre a recompra do item.",
    fonte: f(159, "Como apurar o custo de reposição dos produtos"),
    dificuldade: 3,
    tags: ["custo de reposição", "margem", "diagnóstico"],
    alternativas: [
      {
        id: "a",
        texto: "O preço usa custo histórico em vez de custo de reposição",
        correta: true,
      },
      {
        id: "b",
        texto: "A tabela de preço está vinculada à região errada",
        correta: false,
        explicacaoErro:
          "Região errada mudaria o preço de alguns clientes, não criaria uma defasagem sistemática entre venda e recompra do item.",
      },
      {
        id: "c",
        texto: "O produto está sem NCM",
        correta: false,
        explicacaoErro:
          "NCM afeta tributação e emissão fiscal. Não participa do cálculo de margem sobre custo.",
      },
      {
        id: "d",
        texto: "O estoque mínimo está mal dimensionado",
        correta: false,
        explicacaoErro:
          "Estoque mínimo afeta quando repor, não quanto a reposição custa em relação ao preço praticado.",
      },
    ],
  },
  {
    id: "pre-prova-q2",
    moduloId: "precificacao",
    licaoId: "pre-prova",
    tipo: "associar-colunas",
    enunciado: "Associe cada critério de tabela de preço ao que ele diferencia.",
    pares: [
      {
        id: "p1",
        esquerda: "Por parceiro",
        direita: "Um cliente específico",
        explicacaoErro:
          "É o critério mais específico e por isso o de maior precedência: trata aquele cliente de forma particular.",
      },
      {
        id: "p2",
        esquerda: "Por região",
        direita: "Um território de venda",
        explicacaoErro:
          "Região agrupa clientes por localização, do parceiro ou do vendedor. É mais amplo que parceiro.",
      },
      {
        id: "p3",
        esquerda: "Por tipo de negociação",
        direita: "A condição de pagamento acordada",
        explicacaoErro:
          "Aqui o que muda o preço é o prazo, não quem compra nem de onde.",
      },
      {
        id: "p4",
        esquerda: "Por empresa",
        direita: "O estabelecimento que está vendendo",
        explicacaoErro:
          "Por empresa diferencia o lado de quem vende, permitindo que filiais tenham preços distintos.",
      },
    ],
    explicacaoCorreta:
      "Parceiro (quem compra), região (de onde), negociação (como paga), empresa (quem vende). Entender a dimensão de cada tabela é o que evita criar duas regras que se contradizem.",
    explicacaoErro:
      "Cadastrar por região o que deveria ser por parceiro é o erro que mais gera reclamação: o desconto negociado com um cliente passa a valer para todos os vizinhos dele.",
    fonte: f(187, "Como definir tabelas de preço por empresa"),
    dificuldade: 2,
    tags: ["tabela de preço"],
  },
  {
    id: "pre-prova-q3",
    moduloId: "precificacao",
    licaoId: "pre-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual tipo de custo responde à pergunta: quanto eu gastaria para comprar este item hoje?",
    respostasAceitas: [
      "custo de reposicao",
      "reposicao",
      "custo reposicao",
      "custo de reposição",
    ],
    respostaCanonica: "Custo de reposição",
    dica: "É o custo que deve embasar a decisão de preço em cenário de alta.",
    explicacaoCorreta:
      "O custo de reposição usa o preço atual de mercado. Precificar por ele garante que a venda cubra a recompra, o que o custo histórico não assegura.",
    explicacaoErro:
      "O custo contábil registra o valor histórico do estoque e o gerencial serve à análise interna. Nenhum dos dois responde quanto custaria repor o item hoje.",
    fonte: f(159, "Como apurar o custo de reposição dos produtos"),
    dificuldade: 2,
    tags: ["custo de reposição"],
  },
];
