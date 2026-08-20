import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("recebimentos", aulaId, aula, extra);

/** Modulo: Recebimentos — trilha "Jornada de Recebimentos" (26 aulas no EAD). */
export const questoesRecebimentos: Questao[] = [
  /* --------------------------------------------- L1: títulos ------------- */
  {
    id: "rec-titulos-q1",
    moduloId: "recebimentos",
    licaoId: "rec-titulos",
    tipo: "multipla-escolha",
    enunciado: "Qual é a diferença entre provisão e título a receber?",
    explicacaoCorreta:
      "A provisão antecipa um valor esperado que ainda não tem documento definitivo. O título é o direito formalizado, com valor, vencimento e parceiro definidos. Provisão vira título quando o fato se concretiza.",
    fonte: f(189, "Como realizar o controle de provisões de contas a receber: Origem em Vendas e Financeiro", {
      timestamp: "3:40",
    }),
    dificuldade: 2,
    tags: ["provisão", "título"],
    alternativas: [
      {
        id: "a",
        texto: "Provisão é expectativa sem documento; título é direito formalizado",
        correta: true,
      },
      {
        id: "b",
        texto: "Provisão é do financeiro e título é das vendas",
        correta: false,
        explicacaoErro:
          "Ambos podem ter origem em vendas ou no financeiro. A diferença é o estágio do fato, não o módulo que o originou.",
      },
      {
        id: "c",
        texto: "Provisão é para valores pequenos, título para grandes",
        correta: false,
        explicacaoErro:
          "Valor não define a natureza do lançamento. Uma provisão de milhões continua sendo provisão até o documento existir.",
      },
      {
        id: "d",
        texto: "São sinônimos em contas a receber",
        correta: false,
        explicacaoErro:
          "Se fossem sinônimos, provisões apareceriam na Agenda Financeira como cobrança devida — e a empresa cobraria valores que ainda não tem direito de cobrar.",
      },
    ],
  },
  {
    id: "rec-titulos-q2",
    moduloId: "recebimentos",
    licaoId: "rec-titulos",
    tipo: "multipla-escolha",
    enunciado:
      "Para que serve o rateio de títulos de receita?",
    explicacaoCorreta:
      "Para distribuir a receita de um único título entre vários centros de resultado, projetos ou naturezas, permitindo que o DRE mostre a contribuição de cada área.",
    fonte: f(201, "Como ratear títulos de receita"),
    dificuldade: 2,
    tags: ["rateio", "receita", "centro de resultado"],
    alternativas: [
      {
        id: "a",
        texto: "Distribuir a receita do título entre centros de resultado",
        correta: true,
      },
      {
        id: "b",
        texto: "Dividir o título em várias parcelas de vencimento",
        correta: false,
        explicacaoErro:
          "Parcelamento é definido pelo Tipo de Negociação e cria títulos com datas distintas. Rateio divide a classificação de um mesmo valor, não as datas.",
      },
      {
        id: "c",
        texto: "Dividir o recebimento entre várias contas bancárias",
        correta: false,
        explicacaoErro:
          "A conta de liquidação é definida na baixa. Rateio é classificação gerencial, e acontece antes de qualquer recebimento.",
      },
      {
        id: "d",
        texto: "Ratear a comissão entre os vendedores envolvidos",
        correta: false,
        explicacaoErro:
          "Comissão tem regra própria a partir da nota. O rateio de título trata da receita da empresa, não da remuneração do vendedor.",
      },
    ],
  },
  {
    id: "rec-titulos-q3",
    moduloId: "recebimentos",
    licaoId: "rec-titulos",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre adiantamento de cliente.",
    afirmacao:
      "Um adiantamento recebido de cliente é receita no momento em que o dinheiro entra na conta.",
    resposta: false,
    explicacaoCorreta:
      "Adiantamento é obrigação: a empresa recebeu e ainda deve entregar. Ele se torna receita quando a entrega ou o serviço acontece e o título correspondente é gerado.",
    explicacaoErro:
      "Reconhecer adiantamento como receita antecipa resultado que não foi realizado e, se o pedido for cancelado, obriga a estornar receita de um período já fechado.",
    fonte: f(199, "Como registrar um adiantamento/empréstimo de cliente"),
    dificuldade: 3,
    tags: ["adiantamento", "receita"],
  },
  {
    id: "rec-titulos-q4",
    moduloId: "recebimentos",
    licaoId: "rec-titulos",
    tipo: "resposta-curta",
    enunciado:
      "Qual tela mostra os títulos a receber organizados por data de vencimento, para planejar a cobrança?",
    respostasAceitas: [
      "agenda financeira",
      "agenda",
      "agenda financeira de titulos",
    ],
    respostaCanonica: "Agenda Financeira",
    dica: "Complementa a Movimentação Financeira, que mostra o que já transitou.",
    explicacaoCorreta:
      "A Agenda Financeira apresenta os títulos pela data de vencimento, dando a visão do que está por vencer e do que já venceu. É a base do planejamento de cobrança e de fluxo de caixa.",
    explicacaoErro:
      "A Movimentação Financeira mostra o que já foi movimentado. Para olhar para frente, por vencimento, a tela é a Agenda Financeira.",
    fonte: f(204, "Como conferir os títulos a receber na Movimentação Financeira e na Agenda Financeira"),
    dificuldade: 1,
    tags: ["agenda financeira", "cobrança"],
  },

  /* ------------------------------------------------ L2: baixa ------------ */
  {
    id: "rec-baixa-q1",
    moduloId: "recebimentos",
    licaoId: "rec-baixa",
    tipo: "multipla-escolha",
    enunciado: "O que a baixa de um título representa?",
    explicacaoCorreta:
      "A liquidação do título: o direito foi recebido. A baixa registra data, valor, conta e eventuais juros ou descontos, e é o que remove o título do saldo a receber.",
    fonte: f(215, "Como realizar a baixa de títulos"),
    dificuldade: 1,
    tags: ["baixa", "liquidação"],
    alternativas: [
      { id: "a", texto: "A liquidação do título, com recebimento efetivado", correta: true },
      {
        id: "b",
        texto: "O cancelamento do título por erro de lançamento",
        correta: false,
        explicacaoErro:
          "Cancelar é anular um título que não deveria existir. Baixar é registrar que ele foi pago — o oposto em significado, embora ambos tirem o título do aberto.",
      },
      {
        id: "c",
        texto: "A transferência do título para outro parceiro",
        correta: false,
        explicacaoErro:
          "Troca de parceiro é alteração de titularidade. A baixa não muda de quem é a dívida, ela encerra a dívida.",
      },
      {
        id: "d",
        texto: "A renegociação do vencimento",
        correta: false,
        explicacaoErro:
          "Renegociação altera prazo e condições, mantendo o título em aberto. Se o título fosse baixado, não haveria mais nada a renegociar.",
      },
    ],
  },
  {
    id: "rec-baixa-q2",
    moduloId: "recebimentos",
    licaoId: "rec-baixa",
    tipo: "multipla-escolha",
    contexto:
      "Uma baixa foi lançada com valor errado e o período ainda está aberto.",
    enunciado: "Qual é o procedimento correto?",
    explicacaoCorreta:
      "Realizar o estorno da baixa, que desfaz a liquidação e devolve o título ao aberto, e então lançar a baixa correta. O estorno deixa rastro do que foi desfeito.",
    fonte: f(229, "Como realizar estorno de receitas (desfazer a baixa)"),
    dificuldade: 2,
    tags: ["estorno", "baixa"],
    alternativas: [
      { id: "a", texto: "Estornar a baixa e lançar a correta", correta: true },
      {
        id: "b",
        texto: "Lançar uma segunda baixa com a diferença",
        correta: false,
        explicacaoErro:
          "Duas baixas para um recebimento único deixam o histórico do título ilegível, e se o valor original foi maior que o devido não há como 'somar' uma diferença negativa.",
      },
      {
        id: "c",
        texto: "Editar o valor diretamente no título",
        correta: false,
        explicacaoErro:
          "Alterar o valor do título muda o direito original, não a liquidação. O erro foi na baixa e é lá que a correção deve acontecer.",
      },
      {
        id: "d",
        texto: "Criar um novo título com o valor correto",
        correta: false,
        explicacaoErro:
          "Isso duplica o direito: passariam a existir dois títulos para a mesma venda, um baixado errado e um em aberto.",
      },
    ],
  },
  {
    id: "rec-baixa-q3",
    moduloId: "recebimentos",
    licaoId: "rec-baixa",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene o tratamento de um cliente que devolveu mercadoria e tem título em aberto.",
    passos: [
      { id: "s1", texto: "Registrar a devolução e gerar o crédito do cliente", ordem: 1 },
      { id: "s2", texto: "Localizar o título em aberto do cliente", ordem: 2 },
      { id: "s3", texto: "Compensar o crédito contra o título", ordem: 3 },
      { id: "s4", texto: "Baixar o saldo remanescente, se houver", ordem: 4 },
    ],
    explicacaoCorreta:
      "O crédito precisa existir antes de ser usado. Compensa-se contra o título em aberto e, se ainda restar valor a receber, esse saldo é baixado normalmente.",
    explicacaoErro:
      "Baixar o título inteiro antes de compensar cria um recebimento que não aconteceu, e o crédito do cliente fica órfão no sistema esperando outra venda.",
    fonte: f(230, "Como realizar a compensação de crédito de cliente"),
    dificuldade: 3,
    tags: ["compensação", "crédito", "devolução"],
  },
  {
    id: "rec-baixa-q4",
    moduloId: "recebimentos",
    licaoId: "rec-baixa",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre juros e multa.",
    afirmacao:
      "O cálculo de juros e multa de títulos em atraso pode ser aplicado no momento da baixa, sem alterar o valor original do título.",
    resposta: true,
    explicacaoCorreta:
      "O valor de face permanece; juros e multa entram como acréscimo na liquidação. Isso preserva o histórico do que foi vendido e separa a receita financeira do atraso.",
    explicacaoErro:
      "Somar juros ao valor do título contamina o valor original da venda: relatórios de faturamento passam a incluir receita financeira, e a comparação com a nota fiscal deixa de fechar.",
    fonte: f(209, "Como calcular juros e multas de títulos em atraso"),
    dificuldade: 2,
    tags: ["juros", "multa", "baixa"],
  },

  /* --------------------------------------------- L3: boletos ------------- */
  {
    id: "rec-boletos-q1",
    moduloId: "recebimentos",
    licaoId: "rec-boletos",
    tipo: "multipla-escolha",
    enunciado:
      "O que caracteriza o boleto rápido híbrido no Sankhya?",
    explicacaoCorreta:
      "Ele traz código de barras e chave PIX no mesmo documento, deixando o pagador escolher o meio. Os dois caminhos liquidam o mesmo título.",
    fonte: f(207, "Como realizar e emissão de boleto rápido híbrido (código de barras e chave pix)"),
    dificuldade: 1,
    tags: ["boleto", "PIX"],
    alternativas: [
      {
        id: "a",
        texto: "Traz código de barras e chave PIX no mesmo documento",
        correta: true,
      },
      {
        id: "b",
        texto: "Permite pagar com cartão de crédito",
        correta: false,
        explicacaoErro:
          "Cartão é outro meio, tratado via TEF. O híbrido combina boleto bancário e PIX, ambos com liquidação em conta.",
      },
      {
        id: "c",
        texto: "Substitui a formação de duplicatas",
        correta: false,
        explicacaoErro:
          "Duplicata é o instrumento do direito de crédito; boleto é o meio de cobrança. Um não substitui o outro.",
      },
      {
        id: "d",
        texto: "Gera o título automaticamente ao ser pago",
        correta: false,
        explicacaoErro:
          "A ordem é a inversa: o título já existe e o boleto o cobra. Boleto sem título não teria a que se referir.",
      },
    ],
  },
  {
    id: "rec-boletos-q2",
    moduloId: "recebimentos",
    licaoId: "rec-boletos",
    tipo: "associar-colunas",
    enunciado: "Associe cada operação de recebíveis ao seu efeito.",
    pares: [
      {
        id: "p1",
        esquerda: "Antecipação de recebíveis",
        direita: "Recebe antes do vencimento pagando um custo financeiro",
        explicacaoErro:
          "Antecipar troca prazo por dinheiro agora, e o custo é a taxa cobrada pela instituição. O direito continua existindo.",
      },
      {
        id: "p2",
        esquerda: "Desconto de títulos",
        direita: "Entrega o título à instituição, que adianta o valor",
        explicacaoErro:
          "No desconto o título vai para a instituição como garantia ou cessão. É operação de crédito com lastro no recebível.",
      },
      {
        id: "p3",
        esquerda: "Renegociação de títulos",
        direita: "Substitui os títulos por novos, com prazo e valor acordados",
        explicacaoErro:
          "Renegociar cria títulos novos em lugar dos antigos. Não adianta dinheiro: reorganiza a dívida.",
      },
      {
        id: "p4",
        esquerda: "Compensação de crédito",
        direita: "Usa um crédito do cliente para abater um título dele",
        explicacaoErro:
          "Compensação não movimenta caixa: é encontro de contas entre um crédito e um débito do mesmo parceiro.",
      },
    ],
    explicacaoCorreta:
      "Antecipação e desconto trazem dinheiro antes do prazo, com custo. Renegociação reorganiza a dívida. Compensação abate sem caixa. Confundir esses efeitos leva a projetar entrada de dinheiro que não vai acontecer.",
    explicacaoErro:
      "Tratar compensação como recebimento é o erro que mais distorce fluxo de caixa: o título sai do aberto sem que nenhum real tenha entrado na conta.",
    fonte: f(212, "Como realizar antecipação de recebíveis"),
    dificuldade: 3,
    tags: ["antecipação", "desconto", "renegociação", "compensação"],
  },
  {
    id: "rec-boletos-q3",
    moduloId: "recebimentos",
    licaoId: "rec-boletos",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre cheques pré-datados.",
    texto:
      "O cheque pré-datado é controlado até a data de {{1}}; se voltar sem fundo, registra-se a {{2}} e o título retorna ao {{3}}.",
    lacunas: [
      { pos: 1, respostaId: "compensacao" },
      { pos: 2, respostaId: "devolucao" },
      { pos: 3, respostaId: "aberto" },
    ],
    banco: [
      { id: "compensacao", texto: "compensação" },
      { id: "devolucao", texto: "devolução do cheque" },
      { id: "aberto", texto: "aberto" },
      {
        id: "baixado",
        texto: "baixado",
        explicacaoErro:
          "Se o cheque voltou, o recebimento não se concretizou. Manter o título baixado significaria dar como recebido um valor que não entrou.",
      },
      {
        id: "estorno",
        texto: "estorno de nota",
        explicacaoErro:
          "A venda continua válida — o problema foi o meio de pagamento. Estornar a nota anularia uma operação comercial legítima.",
      },
    ],
    explicacaoCorreta:
      "Cheque é promessa até compensar. A devolução por falta de fundo desfaz o recebimento e devolve o título ao saldo a receber, com o rastro da devolução.",
    fonte: f(231, "Como realizar a devolução de cheques"),
    dificuldade: 3,
    tags: ["cheque", "devolução"],
  },
  {
    id: "rec-boletos-q4",
    moduloId: "recebimentos",
    licaoId: "rec-boletos",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre classificação de clientes.",
    afirmacao:
      "O Sankhya classifica os clientes conforme a pontualidade de pagamento, e essa classificação pode alimentar a política de crédito.",
    resposta: true,
    explicacaoCorreta:
      "A classificação por pontualidade transforma histórico de pagamento em critério objetivo. É o que permite conceder limite e prazo com base em comportamento, e não em impressão do vendedor.",
    explicacaoErro:
      "Sem essa leitura, a decisão de crédito volta a ser subjetiva — e o cliente que sempre atrasa recebe o mesmo prazo do que sempre paga em dia.",
    fonte: f(232, "Como classificar os clientes de acordo com sua pontualidade de pagamento"),
    dificuldade: 2,
    tags: ["crédito", "pontualidade"],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "rec-prova-q1",
    moduloId: "recebimentos",
    licaoId: "rec-prova",
    tipo: "multipla-escolha",
    contexto:
      "O cliente pagou R$ 1.000 de um título de R$ 1.200 e pediu prazo para o resto.",
    enunciado: "Qual tratamento preserva o controle do saldo?",
    explicacaoCorreta:
      "Baixa parcial de R$ 1.000, mantendo R$ 200 em aberto. O título continua existindo pelo saldo devedor, e a cobrança do restante segue rastreável.",
    fonte: f(215, "Como realizar a baixa de títulos"),
    dificuldade: 2,
    tags: ["baixa parcial", "saldo"],
    alternativas: [
      { id: "a", texto: "Baixa parcial, deixando R$ 200 em aberto", correta: true },
      {
        id: "b",
        texto: "Baixar o título inteiro e criar outro de R$ 200",
        correta: false,
        explicacaoErro:
          "Funciona no saldo, mas quebra o histórico: o título original aparece como quitado no prazo e nasce um segundo título sem origem comercial clara.",
      },
      {
        id: "c",
        texto: "Deixar o título integralmente em aberto até o pagamento total",
        correta: false,
        explicacaoErro:
          "Os R$ 1.000 entraram na conta e precisam ter contrapartida. Sem a baixa parcial, a conciliação bancária não fecha.",
      },
      {
        id: "d",
        texto: "Registrar os R$ 200 como desconto concedido",
        correta: false,
        explicacaoErro:
          "Desconto seria perdoar o valor. O cliente pediu prazo, não abatimento — dar baixa como desconto renuncia a um direito que a empresa ainda tem.",
      },
    ],
  },
  {
    id: "rec-prova-q2",
    moduloId: "recebimentos",
    licaoId: "rec-prova",
    tipo: "ordenar-passos",
    enunciado: "Ordene o ciclo de um recebimento por boleto.",
    passos: [
      { id: "s1", texto: "Título gerado pela nota de venda", ordem: 1 },
      { id: "s2", texto: "Emissão do boleto para o título", ordem: 2 },
      { id: "s3", texto: "Pagamento pelo cliente e retorno do banco", ordem: 3 },
      { id: "s4", texto: "Baixa do título", ordem: 4 },
      { id: "s5", texto: "Conciliação do lançamento na conta", ordem: 5 },
    ],
    explicacaoCorreta:
      "Título, boleto, pagamento, baixa, conciliação. O boleto é meio de cobrança de um título que já existe, e a conciliação é a confirmação final contra o extrato.",
    explicacaoErro:
      "Emitir boleto antes de existir título é impossível: o boleto precisa de um direito a cobrar. E conciliar antes de baixar deixa o lançamento do extrato sem par no sistema.",
    fonte: f(206, "Como realizar a emissão de boletos"),
    dificuldade: 2,
    tags: ["boleto", "ciclo"],
  },
  {
    id: "rec-prova-q3",
    moduloId: "recebimentos",
    licaoId: "rec-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual operação desfaz uma baixa lançada por engano, devolvendo o título ao saldo em aberto?",
    respostasAceitas: ["estorno", "estorno de baixa", "estorno de receita", "desfazer a baixa"],
    respostaCanonica: "Estorno da baixa",
    dica: "Não é cancelamento do título nem renegociação.",
    explicacaoCorreta:
      "O estorno desfaz a liquidação e devolve o título ao aberto, mantendo o registro de que houve uma baixa e de que ela foi revertida.",
    explicacaoErro:
      "Cancelar anularia o título, apagando o direito de receber. O estorno preserva o direito e desfaz apenas o recebimento indevidamente registrado.",
    fonte: f(229, "Como realizar estorno de receitas (desfazer a baixa)"),
    dificuldade: 2,
    tags: ["estorno"],
  },
];
