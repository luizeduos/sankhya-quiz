import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("estocagem", aulaId, aula, extra);

/** Modulo: Estocagem — trilha "Jornada de Estocagem" (23 aulas no EAD). */
export const questoesEstocagem: Questao[] = [
  /* --------------------------------------------- L1: movimento ----------- */
  {
    id: "est-movimento-q1",
    moduloId: "estocagem",
    licaoId: "est-movimento",
    tipo: "multipla-escolha",
    enunciado:
      "Qual é a diferença entre estoque físico e estoque disponível no Sankhya?",
    explicacaoCorreta:
      "O físico é o que está no depósito. O disponível é o físico menos o que já foi comprometido por reservas de pedidos. Vender pelo físico é o que gera venda sem mercadoria para entregar.",
    fonte: f(7, "Como é realizada a reserva de mercadorias no estoque", {
      timestamp: "1:50",
    }),
    dificuldade: 1,
    tags: ["estoque", "reserva", "disponível"],
    alternativas: [
      {
        id: "a",
        texto: "Disponível é o físico menos as reservas",
        correta: true,
      },
      {
        id: "b",
        texto: "São a mesma coisa, com nomes diferentes por tela",
        correta: false,
        explicacaoErro:
          "Se fossem iguais, a reserva não teria função. A distinção existe justamente para impedir que a mesma peça seja prometida a dois clientes.",
      },
      {
        id: "c",
        texto: "Disponível é o físico mais o que está em pedido de compra",
        correta: false,
        explicacaoErro:
          "Somar o que ainda não chegou é previsão de suprimento, não disponibilidade. Vender contra mercadoria em trânsito é decisão comercial, e não o cálculo do disponível.",
      },
      {
        id: "d",
        texto: "Físico é o do local principal e disponível é a soma dos locais",
        correta: false,
        explicacaoErro:
          "Essa é a diferença entre saldo por local e saldo total, outro conceito. Reserva é o que separa físico de disponível.",
      },
    ],
  },
  {
    id: "est-movimento-q2",
    moduloId: "estocagem",
    licaoId: "est-movimento",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre o momento do movimento de estoque.",
    afirmacao:
      "O movimento de estoque de uma venda é gravado no momento em que a nota é confirmada, e não quando o pedido é lançado.",
    resposta: true,
    explicacaoCorreta:
      "A confirmação é o ponto em que a operação se torna efetiva. Antes disso existe reserva, que afeta o disponível mas não gera movimento no Kardex.",
    explicacaoErro:
      "Esperar movimento no lançamento do pedido faz o analista concluir que o estoque 'não baixou'. Ele não baixou porque ainda não devia: o que houve foi reserva.",
    fonte: f(11, "Como validar as saídas de mercadorias do estoque"),
    dificuldade: 2,
    tags: ["confirmação", "Kardex", "movimento"],
  },
  {
    id: "est-movimento-q3",
    moduloId: "estocagem",
    licaoId: "est-movimento",
    tipo: "multipla-escolha",
    contexto:
      "Um lote chegou com avaria e não pode ser vendido, mas ainda não foi descartado.",
    enunciado: "Qual é o tratamento adequado?",
    explicacaoCorreta:
      "O controle de produtos avariados segrega essa quantidade, mantendo-a no saldo físico mas fora do disponível para venda. Assim o item não é prometido a um cliente e continua rastreável.",
    fonte: f(31, "Como controlar os produtos avariados"),
    dificuldade: 2,
    tags: ["avariados", "segregação"],
    alternativas: [
      { id: "a", texto: "Usar o controle de produtos avariados", correta: true },
      {
        id: "b",
        texto: "Dar baixa no estoque como se tivesse sido vendido",
        correta: false,
        explicacaoErro:
          "Baixar como venda cria receita que não existiu e apaga o rastro da avaria — que é justamente o dado necessário para cobrar o fornecedor ou a transportadora.",
      },
      {
        id: "c",
        texto: "Deixar no saldo normal e avisar o time comercial",
        correta: false,
        explicacaoErro:
          "Aviso não é controle: o item continua disponível no sistema, e a primeira venda que o pegar vai gerar entrega impossível.",
      },
      {
        id: "d",
        texto: "Transferir para outro local de estoque qualquer",
        correta: false,
        explicacaoErro:
          "Mover para outro local esconde o problema sem classificá-lo. O saldo segue disponível, só em outro endereço.",
      },
    ],
  },
  {
    id: "est-movimento-q4",
    moduloId: "estocagem",
    licaoId: "est-movimento",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene a transferência de mercadoria entre empresas do grupo com emissão de nota.",
    passos: [
      { id: "s1", texto: "Lançar a nota de transferência na empresa de origem", ordem: 1 },
      { id: "s2", texto: "Confirmar a nota, baixando o estoque da origem", ordem: 2 },
      { id: "s3", texto: "Registrar a entrada na empresa de destino", ordem: 3 },
      { id: "s4", texto: "Confirmar a entrada, subindo o estoque do destino", ordem: 4 },
    ],
    explicacaoCorreta:
      "Transferência entre empresas são duas operações espelhadas: saída documentada na origem e entrada documentada no destino. Cada lado tem sua confirmação.",
    explicacaoErro:
      "Tratar como movimento único deixa o estoque duplicado ou faltando: se só a origem baixa, a mercadoria desaparece; se só o destino sobe, ela se multiplica.",
    fonte: f(14, "Como realizar a transferência entre locais com emissão de nota (transferência entre empresas)"),
    dificuldade: 3,
    tags: ["transferência", "entre empresas"],
  },

  /* -------------------------------------------- L2: controles ------------ */
  {
    id: "est-controles-q1",
    moduloId: "estocagem",
    licaoId: "est-controles",
    tipo: "multipla-escolha",
    enunciado:
      "O que o controle de validade com saída prioritária garante?",
    explicacaoCorreta:
      "Ele faz a separação sugerir primeiro os lotes com validade mais próxima, aplicando FEFO. Sem isso, o lote novo sai antes e o antigo vence na prateleira.",
    fonte: f(25, "Como controlar o estoque por validade e saída prioritária"),
    dificuldade: 2,
    tags: ["validade", "FEFO", "lote"],
    alternativas: [
      {
        id: "a",
        texto: "Que os lotes com validade mais próxima saiam primeiro",
        correta: true,
      },
      {
        id: "b",
        texto: "Que produtos vencidos sejam excluídos do cadastro",
        correta: false,
        explicacaoErro:
          "Vencido não se apaga: ele precisa ser baixado com registro, para haver rastro fiscal e contábil da perda. Excluir cadastro destruiria o histórico do item.",
      },
      {
        id: "c",
        texto: "Que a validade seja calculada a partir da data da venda",
        correta: false,
        explicacaoErro:
          "A validade é atributo do lote, definida na entrada. A data da venda não altera quando o produto vence.",
      },
      {
        id: "d",
        texto: "Que o preço caia conforme a validade se aproxima",
        correta: false,
        explicacaoErro:
          "Desconto por proximidade de vencimento é decisão comercial, tratada em precificação. O controle de validade cuida da ordem de saída.",
      },
    ],
  },
  {
    id: "est-controles-q2",
    moduloId: "estocagem",
    licaoId: "est-controles",
    tipo: "associar-colunas",
    enunciado: "Associe cada controle de estoque ao que ele diferencia.",
    pares: [
      {
        id: "p1",
        esquerda: "Local de estoque",
        direita: "Onde a mercadoria está fisicamente",
        explicacaoErro:
          "Local responde 'onde'. É endereçamento físico: depósito, prateleira, filial.",
      },
      {
        id: "p2",
        esquerda: "Grade",
        direita: "Variação do mesmo produto, como cor e tamanho",
        explicacaoErro:
          "Grade responde 'qual variação'. É o mesmo item base em cor, tamanho ou voltagem diferentes.",
      },
      {
        id: "p3",
        esquerda: "Controle adicional",
        direita: "Lote, série ou validade da unidade",
        explicacaoErro:
          "Controle adicional responde 'qual unidade específica'. É o que permite rastrear lote e número de série.",
      },
      {
        id: "p4",
        esquerda: "Consignação de terceiros",
        direita: "De quem é a mercadoria que está no seu depósito",
        explicacaoErro:
          "Consignação responde 'de quem'. O item está fisicamente com você, mas a propriedade é de terceiro.",
      },
    ],
    explicacaoCorreta:
      "Local diz onde, grade diz qual variação, controle adicional diz qual unidade e consignação diz de quem. São dimensões independentes: o mesmo item pode ter as quatro simultaneamente.",
    explicacaoErro:
      "Usar grade para representar lote é o erro mais caro: você cria um produto novo a cada entrada e perde tanto a rastreabilidade quanto a consolidação do saldo.",
    fonte: f(28, "Como realizar o controle adicional de produtos"),
    dificuldade: 3,
    tags: ["local", "grade", "lote", "consignação"],
  },
  {
    id: "est-controles-q3",
    moduloId: "estocagem",
    licaoId: "est-controles",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre estoque em consignação.",
    afirmacao:
      "Mercadoria de terceiros em consignação no seu depósito deve compor o seu estoque próprio para venda, já que está fisicamente com você.",
    resposta: false,
    explicacaoCorreta:
      "Consignação exige controle separado: a mercadoria é de terceiro até ser vendida ou adquirida. Somá-la ao estoque próprio infla o patrimônio e confunde a apuração.",
    explicacaoErro:
      "Posse não é propriedade. Tratar consignado como próprio distorce o valor de estoque no balanço e faz a devolução ao consignante parecer uma perda.",
    fonte: f(33, "Como controlar estoque de terceiros em consignação"),
    dificuldade: 2,
    tags: ["consignação", "terceiros"],
  },
  {
    id: "est-controles-q4",
    moduloId: "estocagem",
    licaoId: "est-controles",
    tipo: "resposta-curta",
    enunciado:
      "Qual documento uma área interna emite para retirar material do estoque, sem envolver venda nem fornecedor?",
    respostasAceitas: [
      "requisicao interna",
      "requisicoes internas",
      "requisicao",
      "requisição interna",
    ],
    respostaCanonica: "Requisição interna",
    dica: "Gera saída de estoque para consumo próprio, não para cliente.",
    explicacaoCorreta:
      "A requisição interna documenta o consumo interno: gera saída de estoque sem nota de venda, com rastro de quem pediu e para qual centro de resultado.",
    explicacaoErro:
      "Sem a requisição, a retirada vira ajuste de estoque sem justificativa — e o consumo interno deixa de aparecer no centro de resultado que o gerou.",
    fonte: f(15, "Como registrar e controlar requisições internas"),
    dificuldade: 1,
    tags: ["requisição interna", "consumo"],
  },

  /* ------------------------------------------ L3: inventário ------------- */
  {
    id: "est-inventario-q1",
    moduloId: "estocagem",
    licaoId: "est-inventario",
    tipo: "ordenar-passos",
    enunciado: "Ordene as etapas de um inventário de estoque no Sankhya.",
    passos: [
      { id: "s1", texto: "Cópia de estoque (congela o saldo do momento)", ordem: 1 },
      { id: "s2", texto: "Contagem de estoque (registra o que foi contado)", ordem: 2 },
      { id: "s3", texto: "Ajuste de estoque (aplica a diferença)", ordem: 3 },
      { id: "s4", texto: "Consulta do inventário no Kardex", ordem: 4 },
    ],
    explicacaoCorreta:
      "A cópia é a foto do saldo antes da contagem; a contagem registra o real; o ajuste aplica a diferença; o Kardex mostra o movimento resultante. Sem a cópia, não há base contra o que comparar.",
    explicacaoErro:
      "Pular a cópia de estoque é o erro que inviabiliza o inventário: sem a foto inicial, movimentos ocorridos durante a contagem se misturam à diferença e o ajuste fica arbitrário.",
    fonte: f(11038, "Cópia de estoque"),
    dificuldade: 2,
    tags: ["inventário", "contagem", "ajuste"],
  },
  {
    id: "est-inventario-q2",
    moduloId: "estocagem",
    licaoId: "est-inventario",
    tipo: "multipla-escolha",
    enunciado: "O que o Kardex apresenta?",
    explicacaoCorreta:
      "O Kardex é o extrato de movimentação do produto: cada entrada e saída em ordem cronológica, com saldo e custo acumulado. É onde se reconstrói como o saldo chegou ao valor atual.",
    fonte: f(11045, "Inventário e estoque no Kardex"),
    dificuldade: 1,
    tags: ["Kardex"],
    alternativas: [
      {
        id: "a",
        texto: "O extrato cronológico de movimentos, com saldo e custo",
        correta: true,
      },
      {
        id: "b",
        texto: "Apenas o saldo atual por local",
        correta: false,
        explicacaoErro:
          "Saldo atual é uma consulta de posição. O Kardex é justamente o histórico que explica como se chegou nesse saldo.",
      },
      {
        id: "c",
        texto: "A lista de pedidos de venda pendentes",
        correta: false,
        explicacaoErro:
          "Pedido pendente é compromisso, não movimento. O Kardex só registra o que efetivamente movimentou estoque.",
      },
      {
        id: "d",
        texto: "As tabelas de preço aplicadas ao produto",
        correta: false,
        explicacaoErro:
          "Preço de venda é precificação. O custo que aparece no Kardex é o custo de estoque, coisa diferente.",
      },
    ],
  },
  {
    id: "est-inventario-q3",
    moduloId: "estocagem",
    licaoId: "est-inventario",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre inventário de itens com número de série.",
    texto:
      "Para itens rastreados, o inventário usa {{1}} por série, seguida de {{2}} de produtos com série, e o ajuste é aplicado {{3}}.",
    lacunas: [
      { pos: 1, respostaId: "copia" },
      { pos: 2, respostaId: "contagem" },
      { pos: 3, respostaId: "porserie" },
    ],
    banco: [
      { id: "copia", texto: "cópia de estoque" },
      { id: "contagem", texto: "contagem" },
      { id: "porserie", texto: "por série" },
      {
        id: "porlocal",
        texto: "por local",
        explicacaoErro:
          "Ajustar por local resolveria a quantidade total, mas deixaria indefinido qual número de série está presente — que é exatamente o dado que o rastreamento existe para garantir.",
      },
      {
        id: "kardex",
        texto: "no Kardex",
        explicacaoErro:
          "O Kardex é consulta: ele mostra o resultado do ajuste, não é onde o ajuste é aplicado.",
      },
    ],
    explicacaoCorreta:
      "Itens com série têm um fluxo próprio de inventário — cópia, contagem e ajuste todos por série — porque a identidade de cada unidade precisa ser preservada, não só a quantidade.",
    fonte: f(11043, "Ajuste de estoque por série"),
    dificuldade: 3,
    tags: ["inventário", "série", "rastreabilidade"],
  },
  {
    id: "est-inventario-q4",
    moduloId: "estocagem",
    licaoId: "est-inventario",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre contagem via coletor.",
    afirmacao:
      "A contagem via coletor substitui a etapa de ajuste: o que o coletor registra já passa a ser o saldo do sistema.",
    resposta: false,
    explicacaoCorreta:
      "O coletor é meio de captura, não de efetivação. A contagem coletada ainda precisa ser conferida e aplicada pelo ajuste, que é o passo auditável do inventário.",
    explicacaoErro:
      "Assumir que o coletor já ajusta remove o ponto de conferência: um erro de leitura viraria saldo oficial sem ninguém aprovar, e sem registro de quem alterou o quê.",
    fonte: f(11044, "Contagem via coletor"),
    dificuldade: 2,
    tags: ["coletor", "contagem", "ajuste"],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "est-prova-q1",
    moduloId: "estocagem",
    licaoId: "est-prova",
    tipo: "multipla-escolha",
    contexto:
      "O comercial reclama que o sistema não deixa vender um produto que está fisicamente no depósito.",
    enunciado: "Qual verificação resolve mais rápido?",
    explicacaoCorreta:
      "Conferir quanto do saldo está reservado por pedidos em aberto. O físico existe, mas o disponível pode estar zerado por reservas — situação normal, não erro.",
    fonte: f(7, "Como é realizada a reserva de mercadorias no estoque"),
    dificuldade: 3,
    tags: ["reserva", "disponível", "diagnóstico"],
    alternativas: [
      {
        id: "a",
        texto: "Quanto do saldo está reservado por pedidos em aberto",
        correta: true,
      },
      {
        id: "b",
        texto: "Se o produto tem NCM cadastrado",
        correta: false,
        explicacaoErro:
          "Falta de NCM barra a emissão fiscal, não a disponibilidade no pedido. O sintoma seria outro e apareceria mais adiante.",
      },
      {
        id: "c",
        texto: "Se o preço de venda está atualizado",
        correta: false,
        explicacaoErro:
          "Preço ausente impede precificar o item, mas a mensagem seria sobre preço, não sobre estoque.",
      },
      {
        id: "d",
        texto: "Refazer a contagem de estoque",
        correta: false,
        explicacaoErro:
          "Contar de novo confirma o físico, que o enunciado já dá como certo. O problema está no disponível, e contagem não mexe em reserva.",
      },
    ],
  },
  {
    id: "est-prova-q2",
    moduloId: "estocagem",
    licaoId: "est-prova",
    tipo: "associar-colunas",
    enunciado: "Associe cada etapa do inventário ao seu papel.",
    pares: [
      {
        id: "p1",
        esquerda: "Cópia de estoque",
        direita: "Congela o saldo como base de comparação",
        explicacaoErro:
          "A cópia é a foto do antes. Sem ela não há base para calcular diferença.",
      },
      {
        id: "p2",
        esquerda: "Contagem",
        direita: "Registra o que foi encontrado fisicamente",
        explicacaoErro:
          "A contagem captura o real, mas ainda não altera o saldo do sistema.",
      },
      {
        id: "p3",
        esquerda: "Ajuste",
        direita: "Aplica a diferença ao saldo do sistema",
        explicacaoErro:
          "O ajuste é o único passo que altera o saldo, e por isso é o passo auditável do processo.",
      },
      {
        id: "p4",
        esquerda: "Kardex",
        direita: "Mostra o movimento resultante do ajuste",
        explicacaoErro:
          "O Kardex é consulta posterior. Ele evidencia o ajuste, não o executa.",
      },
    ],
    explicacaoCorreta:
      "Cópia congela, contagem captura, ajuste aplica, Kardex evidencia. Só o ajuste muda saldo — e é por isso que ele precisa de aprovação e deixa rastro.",
    explicacaoErro:
      "Achar que a contagem já altera o saldo remove a conferência do meio do processo, transformando erro de leitura em ajuste definitivo.",
    fonte: f(11040, "Ajuste de estoque"),
    dificuldade: 2,
    tags: ["inventário"],
  },
  {
    id: "est-prova-q3",
    moduloId: "estocagem",
    licaoId: "est-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual é o nome do relatório que mostra a movimentação cronológica de um produto, com saldo e custo acumulado?",
    respostasAceitas: ["kardex", "cardex", "ficha kardex"],
    respostaCanonica: "Kardex",
    dica: "Seis letras. É o extrato do produto.",
    explicacaoCorreta:
      "O Kardex é o extrato de movimentação do item. Toda investigação de divergência de estoque ou de custo começa por ele, porque é onde a sequência de fatos aparece.",
    explicacaoErro:
      "Consultas de saldo mostram a posição atual; o inventário mostra uma apuração pontual. O histórico completo, movimento por movimento, é o Kardex.",
    fonte: f(11045, "Inventário e estoque no Kardex"),
    dificuldade: 1,
    tags: ["Kardex"],
  },
];
