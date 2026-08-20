import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("compras", aulaId, aula, extra);

/** Modulo: Compras — trilha "Jornada de Compras" (48 aulas no EAD). */
export const questoesCompras: Questao[] = [
  /* ------------------------------------------------- L1: pedido ---------- */
  {
    id: "com-pedido-q1",
    moduloId: "compras",
    licaoId: "com-pedido",
    tipo: "ordenar-passos",
    enunciado: "Ordene o fluxo padrão de uma compra com pedido.",
    passos: [
      { id: "s1", texto: "Registrar o orçamento de compras", ordem: 1 },
      { id: "s2", texto: "Gerar o pedido de compra a partir do orçamento", ordem: 2 },
      { id: "s3", texto: "Faturar o pedido, gerando a nota de entrada", ordem: 3 },
      { id: "s4", texto: "Conferir os produtos na entrada", ordem: 4 },
      { id: "s5", texto: "Confirmar a nota, atualizando estoque e financeiro", ordem: 5 },
    ],
    explicacaoCorreta:
      "A compra sobe de orçamento para pedido e de pedido para nota. A conferência acontece antes da confirmação, justamente para que divergência seja tratada antes de o estoque e o contas a pagar serem afetados.",
    explicacaoErro:
      "Colocar a conferência depois da confirmação inverte a lógica do controle: confirmada a nota, o estoque já subiu e o título já existe — a conferência perde o poder de barrar a divergência.",
    fonte: f(19, "Como registrar um pedido de compras utilizando o orçamento"),
    dificuldade: 1,
    tags: ["orçamento", "pedido de compra"],
  },
  {
    id: "com-pedido-q2",
    moduloId: "compras",
    licaoId: "com-pedido",
    tipo: "multipla-escolha",
    contexto:
      "O comprador quer saber o que repor sem depender de pedido de venda.",
    enunciado: "Qual recurso indica a necessidade de compra pelo estoque?",
    explicacaoCorreta:
      "A identificação por estoque mínimo e máximo compara o saldo atual com os limites cadastrados no produto e aponta o que precisa ser reposto, gerando base para a sugestão de compra.",
    fonte: f(57, "Como identificar a necessidade de compras pelo estoque mínimo e máximo"),
    dificuldade: 1,
    tags: ["estoque mínimo", "sugestão de compra"],
    alternativas: [
      { id: "a", texto: "Necessidade por estoque mínimo e máximo", correta: true },
      {
        id: "b",
        texto: "Necessidade por encomenda (pedidos de venda)",
        correta: false,
        explicacaoErro:
          "Esse método existe, mas parte justamente dos pedidos de venda — que o enunciado excluiu. Ele repõe o que foi vendido, não o que faltou na prateleira.",
      },
      {
        id: "c",
        texto: "Conferência de produtos na entrada",
        correta: false,
        explicacaoErro:
          "A conferência valida o que chegou. Ela olha para trás, não aponta necessidade futura.",
      },
      {
        id: "d",
        texto: "Relatório de entradas e notas de compras",
        correta: false,
        explicacaoErro:
          "É um relatório histórico do que já foi comprado. Serve para auditoria, não para dimensionar reposição.",
      },
    ],
  },
  {
    id: "com-pedido-q3",
    moduloId: "compras",
    licaoId: "com-pedido",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre análise de giro.",
    afirmacao:
      "A análise de giro permite atualizar o estoque mínimo dos produtos com base no consumo real, além de gerar a sugestão de compra.",
    resposta: true,
    explicacaoCorreta:
      "O giro mede a velocidade de consumo. A partir dele é possível recalibrar o estoque mínimo e gerar pedido pela sugestão de compra giro, em vez de manter parâmetros definidos uma vez e nunca revistos.",
    explicacaoErro:
      "Tratar o estoque mínimo como número fixo é o que faz a reposição descolar da realidade: produto que acelerou fica faltando e produto que desacelerou fica parado no depósito.",
    fonte: f(117, "Como atualizar o estoque mínimo com base no giro"),
    dificuldade: 2,
    tags: ["giro", "estoque mínimo"],
  },
  {
    id: "com-pedido-q4",
    moduloId: "compras",
    licaoId: "com-pedido",
    tipo: "resposta-curta",
    enunciado:
      "Qual documento interno o usuário registra para solicitar material ao estoque e que pode originar um pedido de compra?",
    respostasAceitas: [
      "requisicao interna",
      "requisicoes internas",
      "requisicao",
      "requisição interna",
    ],
    respostaCanonica: "Requisição interna",
    dica: "É como uma área pede material para o estoque, sem envolver fornecedor.",
    explicacaoCorreta:
      "A requisição interna é o pedido de uma área ao estoque. Quando não há saldo, ela vira base para gerar compra, ligando a demanda interna ao fornecedor.",
    explicacaoErro:
      "Pedido de compra é o documento voltado ao fornecedor. Antes dele existe a demanda interna — a requisição — e é dela que o enunciado fala.",
    fonte: f(87, "Como gerar compras com base nas requisições internas"),
    dificuldade: 2,
    tags: ["requisição interna", "compra"],
  },

  /* --------------------------------------------- L2: liberação ----------- */
  {
    id: "com-liberacao-q1",
    moduloId: "compras",
    licaoId: "com-liberacao",
    tipo: "associar-colunas",
    enunciado: "Associe cada evento de liberação ao momento em que ele age.",
    pares: [
      {
        id: "p1",
        esquerda: "Evento 44",
        direita: "Liberação do pedido de compra",
        explicacaoErro:
          "O evento 44 age no pedido: ele impede que a compra avance sem aprovação, antes de existir nota.",
      },
      {
        id: "p2",
        esquerda: "Evento 18",
        direita: "Liberação na confirmação da nota",
        explicacaoErro:
          "O evento 18 age no último momento, quando a nota seria confirmada e efetivaria estoque e financeiro.",
      },
      {
        id: "p3",
        esquerda: "Liberação de valor divergente",
        direita: "Diferença entre o pedido e a nota do fornecedor",
        explicacaoErro:
          "Esse controle compara o que foi pedido com o que o fornecedor faturou. É sobre divergência de valor, não sobre alçada de aprovação.",
      },
      {
        id: "p4",
        esquerda: "Conferência de produtos na entrada",
        direita: "Divergência entre o que foi pedido e o que chegou fisicamente",
        explicacaoErro:
          "A conferência é física: quantidade e item recebidos. Diferente da divergência de valor, que é documental.",
      },
    ],
    explicacaoCorreta:
      "Compras tem controles em três momentos: no pedido (evento 44), na entrada física (conferência) e na confirmação da nota (evento 18 e divergência de valor). Cada um barra um tipo distinto de problema.",
    explicacaoErro:
      "Trocar 44 por 18 é o erro mais comum: um trava o pedido, o outro trava a nota. Liberar no ponto errado deixa o documento parado onde você não está olhando.",
    fonte: f(40, "Como liberar pedido de compra com Evento 44"),
    dificuldade: 3,
    tags: ["evento 44", "evento 18", "liberação"],
  },
  {
    id: "com-liberacao-q2",
    moduloId: "compras",
    licaoId: "com-liberacao",
    tipo: "multipla-escolha",
    contexto:
      "O fornecedor faturou R$ 100 acima do valor do pedido, por reajuste combinado por telefone.",
    enunciado: "Qual é o tratamento correto no Sankhya?",
    explicacaoCorreta:
      "Existe liberação específica para valor divergente entre pedido e nota. Quem tem alçada libera a diferença, e o vínculo pedido-nota é preservado com o histórico da aprovação.",
    fonte: f(124, "Como realizar a liberação de valor divergente entre pedido e nota"),
    dificuldade: 2,
    tags: ["divergência", "liberação"],
    alternativas: [
      {
        id: "a",
        texto: "Usar a liberação de valor divergente entre pedido e nota",
        correta: true,
      },
      {
        id: "b",
        texto: "Alterar o valor do pedido para bater com a nota",
        correta: false,
        explicacaoErro:
          "Reescrever o pedido apaga a divergência em vez de registrá-la. Você perde a evidência de que houve reajuste e de quem o aprovou — exatamente o que a auditoria vai procurar.",
      },
      {
        id: "c",
        texto: "Lançar a nota sem vínculo com o pedido",
        correta: false,
        explicacaoErro:
          "Quebrar o vínculo resolve o bloqueio e destrói o controle: o pedido fica pendente para sempre e a nota entra sem rastro de origem.",
      },
      {
        id: "d",
        texto: "Recusar a nota e pedir uma nova ao fornecedor",
        correta: false,
        explicacaoErro:
          "Cabível quando o valor está errado. Aqui o reajuste foi combinado, então o certo é registrar a aprovação da diferença, não devolver documento correto.",
      },
    ],
  },
  {
    id: "com-liberacao-q3",
    moduloId: "compras",
    licaoId: "com-liberacao",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre integração de compras.",
    afirmacao:
      "A confirmação da nota de compra pode atualizar estoque e gerar o título no contas a pagar em uma única ação.",
    resposta: true,
    explicacaoCorreta:
      "A confirmação é o ponto de integração: conforme a TOP, ela atualiza o estoque e gera o financeiro ao mesmo tempo. É por isso que a conferência precisa vir antes.",
    explicacaoErro:
      "Imaginar que estoque e financeiro exigem duas ações separadas leva a procurar um lançamento manual que não existe — e a duplicar o título quando ele é criado 'na mão'.",
    fonte: f(79, "Como validar a integração da compra com o financeiro"),
    dificuldade: 2,
    tags: ["integração", "contas a pagar", "estoque"],
  },
  {
    id: "com-liberacao-q4",
    moduloId: "compras",
    licaoId: "com-liberacao",
    tipo: "multipla-escolha",
    enunciado:
      "Ao importar o XML de uma nota do fornecedor, qual é a vantagem de vinculá-lo ao pedido registrado?",
    explicacaoCorreta:
      "O vínculo faz o sistema comparar o que foi pedido com o que o fornecedor faturou, acusando divergência de item, quantidade ou valor, e ainda baixa o saldo do pedido.",
    fonte: f(120, "Como realizar a importação de XML e vincular aos pedidos registrados"),
    dificuldade: 2,
    tags: ["XML", "pedido de compra"],
    alternativas: [
      {
        id: "a",
        texto: "Permite conferir divergências e baixar o saldo do pedido",
        correta: true,
      },
      {
        id: "b",
        texto: "Dispensa a conferência física da mercadoria",
        correta: false,
        explicacaoErro:
          "O XML diz o que o fornecedor faturou, não o que chegou na doca. A conferência física continua sendo o único controle do que entrou de fato.",
      },
      {
        id: "c",
        texto: "Autoriza a nota junto à SEFAZ",
        correta: false,
        explicacaoErro:
          "A nota do fornecedor já foi autorizada por ele. Na entrada você importa um documento existente, não emite um novo.",
      },
      {
        id: "d",
        texto: "Calcula automaticamente o preço de venda do produto",
        correta: false,
        explicacaoErro:
          "Atualizar preço de venda pela nota de compra é um recurso de precificação, separado, e precisa ser configurado. Não é efeito do vínculo com o pedido.",
      },
    ],
  },

  /* ------------------------------------------------ L3: nota ------------- */
  {
    id: "com-nota-q1",
    moduloId: "compras",
    licaoId: "com-nota",
    tipo: "multipla-escolha",
    enunciado:
      "Quando é apropriado lançar uma nota fiscal de entrada sem pedido de compra?",
    explicacaoCorreta:
      "Em entradas que não passaram pelo ciclo de compras — uma aquisição eventual, uma nota de serviço, um recebimento sem pedido prévio. O sistema permite, mas você perde a conferência automática contra o pedido.",
    fonte: f(53, "Como lançar uma nota fiscal sem pedido de compra"),
    dificuldade: 2,
    tags: ["nota de entrada", "sem pedido"],
    alternativas: [
      {
        id: "a",
        texto: "Em entradas eventuais que não passaram pelo ciclo de compras",
        correta: true,
      },
      {
        id: "b",
        texto: "Sempre, porque é mais rápido que criar pedido",
        correta: false,
        explicacaoErro:
          "Ganha-se tempo no lançamento e perde-se o controle: sem pedido não há comparação de preço e quantidade acordados, e a divergência com o fornecedor deixa de ser detectável.",
      },
      {
        id: "c",
        texto: "Quando o pedido existe mas está bloqueado",
        correta: false,
        explicacaoErro:
          "Contornar o bloqueio lançando sem pedido burla o controle que travou a compra de propósito, e ainda deixa o pedido pendente indefinidamente.",
      },
      {
        id: "d",
        texto: "Quando o fornecedor não enviou o XML",
        correta: false,
        explicacaoErro:
          "Falta de XML é problema de documento, não de existência do pedido. O pedido continua devendo ser vinculado quando existe.",
      },
    ],
  },
  {
    id: "com-nota-q2",
    moduloId: "compras",
    licaoId: "com-nota",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre devolução de compra.",
    texto:
      "Numa devolução parcial de compra, a mercadoria {{1}} do estoque e o valor correspondente vira {{2}} com o fornecedor, que depois é {{3}}.",
    lacunas: [
      { pos: 1, respostaId: "sai" },
      { pos: 2, respostaId: "credito" },
      { pos: 3, respostaId: "compensado" },
    ],
    banco: [
      { id: "sai", texto: "sai" },
      { id: "credito", texto: "crédito" },
      { id: "compensado", texto: "compensado" },
      {
        id: "entra",
        texto: "entra",
        explicacaoErro:
          "Na devolução de compra a mercadoria volta para o fornecedor, logo ela sai do seu estoque. Entrada foi o movimento da nota de compra original.",
      },
      {
        id: "debito",
        texto: "débito",
        explicacaoErro:
          "Quem devolve passa a ter crédito com o fornecedor, não débito. O débito era a obrigação original de pagar a nota inteira.",
      },
    ],
    explicacaoCorreta:
      "Devolver mercadoria comprada gera saída de estoque e crédito com o fornecedor. Esse crédito não desaparece sozinho: precisa ser compensado contra os títulos a pagar.",
    fonte: f(160, "Como realizar a compensação de uma devolução de compra parcial"),
    dificuldade: 3,
    tags: ["devolução", "crédito", "compensação"],
  },
  {
    id: "com-nota-q3",
    moduloId: "compras",
    licaoId: "com-nota",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre nota de remessa para demonstração.",
    afirmacao:
      "A nota de remessa para demonstração transfere a propriedade da mercadoria para o parceiro, como uma venda comum.",
    resposta: false,
    explicacaoCorreta:
      "Remessa para demonstração movimenta a mercadoria sem transferir propriedade: o item continua sendo da empresa e precisa retornar, ou ser convertido em venda, dentro do prazo.",
    explicacaoErro:
      "Tratar demonstração como venda faz o estoque de terceiros desaparecer do controle e o retorno da mercadoria ficar sem contrapartida — vira sobra física sem lastro documental.",
    fonte: f(143, "Como inserir uma nota de remessa para demonstração"),
    dificuldade: 2,
    tags: ["remessa", "demonstração"],
  },
  {
    id: "com-nota-q4",
    moduloId: "compras",
    licaoId: "com-nota",
    tipo: "multipla-escolha",
    enunciado:
      "Como rastrear de qual nota de compra uma devolução se originou?",
    explicacaoCorreta:
      "A devolução guarda o vínculo com a nota de origem, e existe consulta específica para identificá-la. É esse vínculo que sustenta a compensação financeira e a apuração fiscal.",
    fonte: f(171, "Como identificar a origem da nota de devolução de compra"),
    dificuldade: 2,
    tags: ["devolução", "rastreabilidade"],
    alternativas: [
      {
        id: "a",
        texto: "Pela consulta de origem da nota de devolução",
        correta: true,
      },
      {
        id: "b",
        texto: "Comparando datas no relatório de entradas",
        correta: false,
        explicacaoErro:
          "Cruzar datas é inferência, não rastreamento: com o mesmo produto comprado várias vezes no mês, a correspondência fica ambígua justo quando você mais precisa dela.",
      },
      {
        id: "c",
        texto: "Pelo número do pedido de compra",
        correta: false,
        explicacaoErro:
          "O pedido pode ter gerado mais de uma nota, e a devolução se refere a uma nota específica. O pedido não é granular o suficiente.",
      },
      {
        id: "d",
        texto: "Pelo Kardex do produto",
        correta: false,
        explicacaoErro:
          "O Kardex mostra a sequência de movimentos de estoque. Ele evidencia que houve devolução, mas não o vínculo documental entre as duas notas.",
      },
    ],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "com-prova-q1",
    moduloId: "compras",
    licaoId: "com-prova",
    tipo: "multipla-escolha",
    contexto:
      "A nota de compra foi confirmada, mas o título não apareceu no contas a pagar.",
    enunciado: "Qual é a causa mais provável?",
    explicacaoCorreta:
      "A TOP usada não está configurada para gerar financeiro. Como é ela que decide se a operação produz título, a nota pode ser confirmada e atualizar apenas o estoque.",
    fonte: f(79, "Como validar a integração da compra com o financeiro"),
    dificuldade: 3,
    tags: ["TOP", "financeiro", "diagnóstico"],
    alternativas: [
      {
        id: "a",
        texto: "A TOP não está marcada para gerar financeiro",
        correta: true,
      },
      {
        id: "b",
        texto: "O fornecedor não tem conta bancária cadastrada",
        correta: false,
        explicacaoErro:
          "Conta bancária é dado de pagamento, usado depois. A ausência dela não impede a criação do título.",
      },
      {
        id: "c",
        texto: "O Tipo de Negociação não foi informado",
        correta: false,
        explicacaoErro:
          "Sem Tipo de Negociação o parcelamento fica indefinido, e normalmente o lançamento é barrado antes. Não é o caso de uma nota que confirmou com sucesso.",
      },
      {
        id: "d",
        texto: "A nota precisa ser conferida antes de gerar título",
        correta: false,
        explicacaoErro:
          "A conferência é controle de recebimento físico, e não uma condição para o financeiro existir. A geração do título acontece na confirmação.",
      },
    ],
  },
  {
    id: "com-prova-q2",
    moduloId: "compras",
    licaoId: "com-prova",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene o tratamento de uma entrada em que a quantidade recebida foi menor que a do pedido.",
    passos: [
      { id: "s1", texto: "Conferir os produtos na entrada e apontar a diferença", ordem: 1 },
      { id: "s2", texto: "Lançar a nota com a quantidade efetivamente recebida", ordem: 2 },
      { id: "s3", texto: "Confirmar a nota, atualizando estoque e financeiro", ordem: 3 },
      { id: "s4", texto: "Decidir entre manter o saldo pendente ou cortar o pedido", ordem: 4 },
    ],
    explicacaoCorreta:
      "Confere, lança pelo real, confirma e só então decide o destino do saldo. Registrar a quantidade recebida é o que mantém estoque e contas a pagar coerentes com o que existe fisicamente.",
    explicacaoErro:
      "Lançar pela quantidade do pedido para 'não travar' cria estoque que não existe e um título maior que o devido. A diferença aparece depois no inventário, sem explicação documental.",
    fonte: f(5935, "Como realizar a conferência de produtos na entrada de compras"),
    dificuldade: 3,
    tags: ["conferência", "divergência", "pedido"],
  },
  {
    id: "com-prova-q3",
    moduloId: "compras",
    licaoId: "com-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual é o número do evento que exige liberação do pedido de compra antes de ele avançar?",
    respostasAceitas: ["44", "evento 44"],
    respostaCanonica: "Evento 44",
    dica: "Dois dígitos. Não confunda com o que age na confirmação da nota.",
    explicacaoCorreta:
      "O evento 44 é a liberação do pedido de compra. Ele atua antes de existir nota, retendo a compra até que alguém com alçada aprove.",
    explicacaoErro:
      "O evento 18 é o que age na confirmação da nota, tanto em compras quanto em vendas. Quem trava o pedido de compra é o 44.",
    fonte: f(40, "Como liberar pedido de compra com Evento 44"),
    dificuldade: 2,
    tags: ["evento 44", "liberação"],
  },
];
