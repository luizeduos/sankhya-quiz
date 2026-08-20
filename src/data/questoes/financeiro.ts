import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("financeiro", aulaId, aula, extra);

/** Modulo: Financeiro — trilha "Jornada Financeira" (11 aulas no EAD). */
export const questoesFinanceiro: Questao[] = [
  /* ---------------------------------------------- L1: bancos ------------- */
  {
    id: "fin-bancos-q1",
    moduloId: "financeiro",
    licaoId: "fin-bancos",
    tipo: "multipla-escolha",
    contexto:
      "A empresa moveu R$ 50.000 da conta do Banco A para a conta do Banco B, ambas próprias.",
    enunciado: "Como esse fato deve ser registrado?",
    explicacaoCorreta:
      "Como movimentação bancária entre contas da própria empresa: uma saída em A e uma entrada em B, sem receita nem despesa. O patrimônio não mudou, só a localização do dinheiro.",
    fonte: f(176, "Como Realizar Movimentações bancárias entre contas da empresa", {
      timestamp: "2:10",
    }),
    dificuldade: 1,
    tags: ["transferência", "contas bancárias"],
    alternativas: [
      {
        id: "a",
        texto: "Movimentação entre contas, sem receita nem despesa",
        correta: true,
      },
      {
        id: "b",
        texto: "Uma despesa em A e uma receita em B",
        correta: false,
        explicacaoErro:
          "Isso infla receita e despesa do período em R$ 50.000 cada, distorcendo o DRE sem que nada tenha entrado ou saído da empresa. É o erro mais comum e o mais visível no fechamento.",
      },
      {
        id: "c",
        texto: "Um título a pagar em A e um a receber em B",
        correta: false,
        explicacaoErro:
          "Título pressupõe obrigação ou direito com terceiro. A empresa não deve nada a si mesma, e os títulos ficariam em aberto para sempre.",
      },
      {
        id: "d",
        texto: "Um ajuste manual de saldo em cada conta",
        correta: false,
        explicacaoErro:
          "Ajuste sem contrapartida quebra a conciliação: o extrato do banco vai mostrar a transferência, e o sistema não vai ter o documento correspondente.",
      },
    ],
  },
  {
    id: "fin-bancos-q2",
    moduloId: "financeiro",
    licaoId: "fin-bancos",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre transferência de títulos.",
    afirmacao:
      "Transferir um título entre contas da empresa é a mesma operação que transferir dinheiro entre contas.",
    resposta: false,
    explicacaoCorreta:
      "Transferir título muda a conta prevista de liquidação de uma obrigação ou direito que ainda não foi liquidado. Transferir dinheiro move saldo já existente. São documentos e efeitos diferentes.",
    explicacaoErro:
      "Confundir os dois faz o saldo bancário ser alterado por um título que ainda nem venceu, e a conciliação passa a não fechar por um movimento que o banco nunca registrou.",
    fonte: f(178, "Como realizar a transferência de títulos entre contas da empresa"),
    dificuldade: 3,
    tags: ["títulos", "transferência"],
  },
  {
    id: "fin-bancos-q3",
    moduloId: "financeiro",
    licaoId: "fin-bancos",
    tipo: "multipla-escolha",
    enunciado:
      "Como registrar o rendimento de uma aplicação financeira da empresa?",
    explicacaoCorreta:
      "Como receita financeira, associada à conta da aplicação. É o que separa resultado financeiro do resultado operacional no DRE.",
    fonte: f(180, "Como registrar rendimentos de aplicações financeiras e juros pagos de empréstimos"),
    dificuldade: 2,
    tags: ["aplicação", "receita financeira"],
    alternativas: [
      {
        id: "a",
        texto: "Como receita financeira, na conta da aplicação",
        correta: true,
      },
      {
        id: "b",
        texto: "Como receita de vendas",
        correta: false,
        explicacaoErro:
          "Rendimento não vem de operação comercial. Classificar como venda infla a receita operacional e distorce indicadores de margem e de crescimento.",
      },
      {
        id: "c",
        texto: "Como redução da despesa financeira",
        correta: false,
        explicacaoErro:
          "Compensar receita com despesa esconde os dois números. Juros pagos e rendimentos recebidos devem aparecer separadamente para se poder analisar cada um.",
      },
      {
        id: "d",
        texto: "Como transferência entre contas",
        correta: false,
        explicacaoErro:
          "Transferência não altera patrimônio, e rendimento altera: houve ganho. Registrar como transferência faz o resultado financeiro desaparecer do DRE.",
      },
    ],
  },
  {
    id: "fin-bancos-q4",
    moduloId: "financeiro",
    licaoId: "fin-bancos",
    tipo: "resposta-curta",
    enunciado:
      "Qual cadastro precisa existir antes de registrar qualquer movimentação em uma conta corrente no Sankhya?",
    respostasAceitas: [
      "conta bancaria",
      "contas bancarias",
      "cadastro de contas bancarias",
      "conta bancária",
    ],
    respostaCanonica: "Contas bancárias",
    dica: "Depende de outros dois cadastros anteriores: Bancos e Agência Bancária.",
    explicacaoCorreta:
      "A conta bancária é o cadastro que representa a conta corrente da empresa. Ela depende de Bancos e Agência Bancária estarem cadastrados antes, e é nela que se implanta o saldo inicial.",
    explicacaoErro:
      "Banco e agência sozinhos não movimentam nada: são referências. Quem recebe lançamento e tem saldo é a conta bancária.",
    // A aula de cadastro de contas bancarias vive na trilha "Configurações
    // técnicas" (aula 250), nao na Jornada Financeira.
    fonte: fonte("parametros", 250, "Como cadastrar Contas bancárias"),
    dificuldade: 1,
    tags: ["contas bancárias", "cadastro"],
  },

  /* ----------------------------------------- L2: conciliação ------------- */
  {
    id: "fin-conciliacao-q1",
    moduloId: "financeiro",
    licaoId: "fin-conciliacao",
    tipo: "multipla-escolha",
    enunciado: "Qual é o objetivo da conciliação bancária?",
    explicacaoCorreta:
      "Garantir que cada lançamento do extrato do banco tenha um lançamento correspondente no sistema, e vice-versa. O que não casa é o que precisa de investigação.",
    fonte: f(190, "Como realizar conciliação bancária manual"),
    dificuldade: 1,
    tags: ["conciliação"],
    alternativas: [
      {
        id: "a",
        texto: "Casar cada lançamento do extrato com o lançamento do sistema",
        correta: true,
      },
      {
        id: "b",
        texto: "Igualar o saldo do sistema ao saldo do extrato por ajuste",
        correta: false,
        explicacaoErro:
          "Forçar o saldo esconde a causa da diferença. A conciliação existe para encontrar o lançamento faltante ou duplicado, não para apagar o sintoma.",
      },
      {
        id: "c",
        texto: "Gerar os boletos do período",
        correta: false,
        explicacaoErro:
          "Emissão de boleto é etapa de cobrança, anterior ao recebimento. Conciliação olha o que já transitou na conta.",
      },
      {
        id: "d",
        texto: "Fechar o caixa da loja no fim do dia",
        correta: false,
        explicacaoErro:
          "Fechamento de caixa trata do dinheiro em espécie e das operações do ponto de venda. Conciliação bancária trata da conta corrente.",
      },
    ],
  },
  {
    id: "fin-conciliacao-q2",
    moduloId: "financeiro",
    licaoId: "fin-conciliacao",
    tipo: "associar-colunas",
    enunciado: "Associe cada forma de conciliação ao seu uso típico.",
    pares: [
      {
        id: "p1",
        esquerda: "Conciliação manual",
        direita: "Poucos lançamentos ou casos que exigem julgamento",
        explicacaoErro:
          "A manual é para volume baixo ou exceções: o operador decide item por item o que casa com o quê.",
      },
      {
        id: "p2",
        esquerda: "Conciliação pelo extrato importado",
        direita: "Volume alto, com o arquivo do banco como base",
        explicacaoErro:
          "Importar o extrato traz os lançamentos do banco em lote, e o sistema propõe as correspondências.",
      },
      {
        id: "p3",
        esquerda: "Conciliação automática pela baixa",
        direita: "Título já baixado que se concilia no mesmo ato",
        explicacaoErro:
          "Nesse modo a conciliação acontece junto com a baixa do título, sem uma segunda passagem depois.",
      },
    ],
    explicacaoCorreta:
      "Manual para exceção, extrato para volume, automática pela baixa para o fluxo corrente. Escolher o modo errado significa refazer trabalho: conciliar manualmente o que já veio conciliado da baixa é retrabalho puro.",
    explicacaoErro:
      "Tratar tudo como conciliação manual é o hábito que consome o fechamento: o volume que o extrato resolveria em minutos leva dias.",
    fonte: f(196, "Como realizar a conciliação bancária automática através da baixa"),
    dificuldade: 2,
    tags: ["conciliação", "extrato"],
  },
  {
    id: "fin-conciliacao-q3",
    moduloId: "financeiro",
    licaoId: "fin-conciliacao",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre diferença na conciliação.",
    afirmacao:
      "Uma diferença de conciliação sempre indica erro de lançamento no sistema.",
    resposta: false,
    explicacaoCorreta:
      "A diferença pode vir de tarifa não lançada, cheque não compensado, crédito em trânsito ou erro do próprio banco. Ela aponta onde investigar, não de quem é a culpa.",
    explicacaoErro:
      "Presumir erro interno faz o analista corrigir o sistema para acomodar um lançamento que o banco vai estornar amanhã — e a diferença reaparece invertida no mês seguinte.",
    fonte: f(194, "Como realizar conciliação do extrato bancário"),
    dificuldade: 2,
    tags: ["conciliação", "diagnóstico"],
  },
  {
    id: "fin-conciliacao-q4",
    moduloId: "financeiro",
    licaoId: "fin-conciliacao",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre a ordem do fechamento financeiro.",
    texto:
      "Primeiro se registra a {{1}} do título, depois se faz a {{2}} contra o extrato e por último o {{3}} do período.",
    lacunas: [
      { pos: 1, respostaId: "baixa" },
      { pos: 2, respostaId: "conciliacao" },
      { pos: 3, respostaId: "fechamento" },
    ],
    banco: [
      { id: "baixa", texto: "baixa" },
      { id: "conciliacao", texto: "conciliação" },
      { id: "fechamento", texto: "fechamento" },
      {
        id: "provisao",
        texto: "provisão",
        explicacaoErro:
          "A provisão é anterior ao título: ela antecipa uma obrigação futura. No fechamento já se trabalha com títulos existentes.",
      },
      {
        id: "rateio",
        texto: "rateio",
        explicacaoErro:
          "O rateio distribui valor entre centros de resultado. Ele acompanha o lançamento, não é uma etapa da sequência de fechamento.",
      },
    ],
    explicacaoCorreta:
      "Baixa, conciliação, fechamento: cada etapa depende da anterior estar completa. Fechar antes de conciliar carimba uma diferença como definitiva.",
    fonte: f(183, "Como realizar o fechamento de caixa"),
    dificuldade: 2,
    tags: ["fechamento", "baixa", "conciliação"],
  },

  /* -------------------------------------------- L3: caixa ---------------- */
  {
    id: "fin-caixa-q1",
    moduloId: "financeiro",
    licaoId: "fin-caixa",
    tipo: "multipla-escolha",
    enunciado: "O que o fechamento de caixa efetivamente faz?",
    explicacaoCorreta:
      "Ele encerra o período de movimentação, consolidando o saldo apurado e impedindo lançamentos retroativos sem autorização. É o que dá confiabilidade ao número do dia.",
    fonte: f(183, "Como realizar o fechamento de caixa"),
    dificuldade: 2,
    tags: ["fechamento de caixa"],
    alternativas: [
      {
        id: "a",
        texto: "Encerra o período e bloqueia lançamento retroativo",
        correta: true,
      },
      {
        id: "b",
        texto: "Transfere o saldo do caixa para o banco",
        correta: false,
        explicacaoErro:
          "Depósito do caixa no banco é uma movimentação, que pode ou não acontecer. Fechar caixa é ato de controle, não de transferência de dinheiro.",
      },
      {
        id: "c",
        texto: "Baixa automaticamente todos os títulos vencidos",
        correta: false,
        explicacaoErro:
          "Baixar título é reconhecer pagamento recebido ou feito. Fechamento não inventa pagamentos que não ocorreram.",
      },
      {
        id: "d",
        texto: "Concilia o extrato bancário do período",
        correta: false,
        explicacaoErro:
          "Conciliação é etapa anterior e independente. Fechar sem conciliar é justamente o que carimba a diferença como definitiva.",
      },
    ],
  },
  {
    id: "fin-caixa-q2",
    moduloId: "financeiro",
    licaoId: "fin-caixa",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre controle das contas da empresa.",
    afirmacao:
      "Manter o saldo inicial correto em cada conta bancária é pré-requisito para que a conciliação faça sentido.",
    resposta: true,
    explicacaoCorreta:
      "A implantação de saldo define o ponto de partida. Se o saldo inicial está errado, toda conciliação posterior vai acusar uma diferença constante, que não tem lançamento correspondente para achar.",
    explicacaoErro:
      "Ignorar o saldo inicial é o que produz a diferença 'fantasma' que persiste mês após mês, sempre no mesmo valor, e que ninguém consegue explicar por lançamento.",
    fonte: f(197, "Como controlar as contas da empresa"),
    dificuldade: 2,
    tags: ["saldo inicial", "conciliação"],
  },
  {
    id: "fin-caixa-q3",
    moduloId: "financeiro",
    licaoId: "fin-caixa",
    tipo: "ordenar-passos",
    enunciado: "Ordene a rotina diária de tesouraria.",
    passos: [
      { id: "s1", texto: "Importar o extrato bancário do dia", ordem: 1 },
      { id: "s2", texto: "Baixar os títulos identificados no extrato", ordem: 2 },
      { id: "s3", texto: "Conciliar os lançamentos remanescentes", ordem: 3 },
      { id: "s4", texto: "Fechar o caixa do dia", ordem: 4 },
    ],
    explicacaoCorreta:
      "O extrato é a fonte da verdade do dia: importa, baixa o que ele confirma, concilia o que sobrou e fecha. Fechar antes de conciliar transforma pendência em diferença permanente.",
    explicacaoErro:
      "Fechar o caixa antes de conciliar é o erro que mais custa depois: reabrir período fechado exige autorização e refaz trabalho já dado como pronto.",
    fonte: f(194, "Como realizar conciliação do extrato bancário"),
    dificuldade: 2,
    tags: ["tesouraria", "rotina"],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "fin-prova-q1",
    moduloId: "financeiro",
    licaoId: "fin-prova",
    tipo: "multipla-escolha",
    contexto:
      "O saldo do sistema está R$ 320 acima do extrato, e o valor corresponde exatamente a uma tarifa mensal.",
    enunciado: "Qual é a ação correta?",
    explicacaoCorreta:
      "Lançar a tarifa como despesa bancária na conta. A diferença tem causa identificada e um lançamento legítimo faltando — não é caso de ajuste de saldo.",
    fonte: f(190, "Como realizar conciliação bancária manual"),
    dificuldade: 2,
    tags: ["tarifa", "conciliação"],
    alternativas: [
      {
        id: "a",
        texto: "Lançar a tarifa como despesa bancária na conta",
        correta: true,
      },
      {
        id: "b",
        texto: "Ajustar o saldo do sistema para bater com o extrato",
        correta: false,
        explicacaoErro:
          "O saldo passa a bater e a despesa nunca aparece no DRE. Você perde o custo bancário do período justamente quando ele foi identificado com precisão.",
      },
      {
        id: "c",
        texto: "Registrar como transferência entre contas",
        correta: false,
        explicacaoErro:
          "Transferência não afeta resultado, e tarifa é despesa: houve perda patrimonial. A classificação erraria a natureza do fato.",
      },
      {
        id: "d",
        texto: "Ignorar, por ser valor imaterial",
        correta: false,
        explicacaoErro:
          "Imaterial ou não, a diferença fica no relatório de conciliação e se acumula todo mês. Doze tarifas ignoradas viram uma divergência que ninguém mais consegue rastrear.",
      },
    ],
  },
  {
    id: "fin-prova-q2",
    moduloId: "financeiro",
    licaoId: "fin-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual é o nome do processo que compara os lançamentos do extrato do banco com os lançamentos registrados no sistema?",
    respostasAceitas: [
      "conciliacao bancaria",
      "conciliacao",
      "conciliação bancária",
      "conciliar",
    ],
    respostaCanonica: "Conciliação bancária",
    dica: "Pode ser manual, por extrato importado ou automática pela baixa.",
    explicacaoCorreta:
      "Conciliação bancária é o processo de casar extrato e sistema, lançamento por lançamento. O que não casa vira a lista de pendências a investigar.",
    explicacaoErro:
      "Fechamento encerra o período e a baixa liquida o título. Nenhum dos dois compara o extrato com o sistema — isso é conciliação.",
    fonte: f(194, "Como realizar conciliação do extrato bancário"),
    dificuldade: 1,
    tags: ["conciliação"],
  },
  {
    id: "fin-prova-q3",
    moduloId: "financeiro",
    licaoId: "fin-prova",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre integração do financeiro.",
    afirmacao:
      "O título gerado por uma nota de venda pode ser baixado no financeiro sem que a nota precise ser alterada.",
    resposta: true,
    explicacaoCorreta:
      "Nota e título são documentos distintos e ligados: a nota origina o título, mas a liquidação acontece no financeiro. Mexer na nota para registrar recebimento seria alterar um documento fiscal já emitido.",
    explicacaoErro:
      "Tentar registrar o recebimento pela nota leva a alterar documento fiscal por motivo financeiro — o que, quando a nota já foi autorizada, simplesmente não é permitido.",
    fonte: f(175, "Introdução"),
    dificuldade: 2,
    tags: ["integração", "título", "baixa"],
  },
];
