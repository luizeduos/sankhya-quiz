import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("vendas", aulaId, aula, extra);

/**
 * Modulo: Vendas e NF-e — trilha "Jornada de Vendas" (50 aulas no EAD).
 * E a unidade destacada no protótipo ("Unidade 2 - Faturamento e NF-e").
 */
export const questoesVendas: Questao[] = [
  /* ------------------------------------------------- L1: pedido ---------- */
  {
    id: "ven-pedido-q1",
    moduloId: "vendas",
    licaoId: "ven-pedido",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene as etapas do ciclo comercial de venda na Central de Vendas.",
    passos: [
      { id: "s1", texto: "Lançar o orçamento de venda", ordem: 1 },
      { id: "s2", texto: "Faturar o orçamento, gerando o pedido", ordem: 2 },
      { id: "s3", texto: "Liberar o pedido (se houver bloqueio)", ordem: 3 },
      { id: "s4", texto: "Faturar o pedido, gerando a nota", ordem: 4 },
      { id: "s5", texto: "Confirmar a nota", ordem: 5 },
    ],
    explicacaoCorreta:
      "O documento sobe de nível a cada faturamento: orçamento vira pedido, pedido vira nota. A confirmação é o último passo, e é ela que efetiva estoque e financeiro.",
    explicacaoErro:
      "O erro mais comum é colocar a confirmação antes do faturamento. Confirmar é o ato final: enquanto a nota não é confirmada, nada foi efetivado — nem estoque, nem título.",
    fonte: f(13, "Como faturar um orçamento de venda", { timestamp: "4:20" }),
    dificuldade: 1,
    tags: ["central de vendas", "orçamento", "pedido"],
  },
  {
    id: "ven-pedido-q2",
    moduloId: "vendas",
    licaoId: "ven-pedido",
    tipo: "multipla-escolha",
    contexto:
      "O pedido de venda foi lançado, mas o cliente ligou pedindo metade da quantidade agora e metade no mês seguinte.",
    enunciado: "Qual recurso atende sem precisar refazer o pedido?",
    explicacaoCorreta:
      "O faturamento parcial permite gerar a nota de parte das quantidades, mantendo o saldo do pedido em aberto para faturar depois. O pedido continua sendo a mesma referência comercial.",
    fonte: f(100, "Como realizar o faturamento parcial de pedidos de venda"),
    dificuldade: 2,
    tags: ["faturamento parcial", "pedido"],
    alternativas: [
      { id: "a", texto: "Faturamento parcial do pedido", correta: true },
      {
        id: "b",
        texto: "Cancelar e lançar dois pedidos novos",
        correta: false,
        explicacaoErro:
          "Funciona, mas destrói o histórico: você perde a referência comercial original, a numeração fica com um pedido cancelado e relatórios de pendência passam a contar dois pedidos onde havia um.",
      },
      {
        id: "c",
        texto: "Corte de pedido",
        correta: false,
        explicacaoErro:
          "O corte serve para eliminar definitivamente o saldo que não será entregue. Aqui o cliente quer o restante depois, então cortar o saldo apagaria justamente o que deve permanecer em aberto.",
      },
      {
        id: "d",
        texto: "Emitir nota complementar",
        correta: false,
        explicacaoErro:
          "Nota complementar ajusta valor ou imposto de uma nota já emitida. Ela não entrega mercadoria pendente nem controla saldo de pedido.",
      },
    ],
  },
  {
    id: "ven-pedido-q3",
    moduloId: "vendas",
    licaoId: "ven-pedido",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre estoque no pedido de venda.",
    afirmacao:
      "Lançar um pedido de venda já baixa a quantidade do estoque disponível do produto.",
    resposta: false,
    explicacaoCorreta:
      "O pedido reserva, não baixa. A baixa efetiva acontece na confirmação da nota. Por isso o disponível cai, mas o saldo físico permanece até o faturamento ser confirmado.",
    explicacaoErro:
      "Tratar pedido como baixa faz o time procurar movimento de estoque que ainda não existe. A ordem é: pedido reserva → nota confirmada movimenta.",
    fonte: f(23, "Como validar estoque de produtos no pedido de venda"),
    dificuldade: 2,
    tags: ["estoque", "reserva", "pedido"],
  },
  {
    id: "ven-pedido-q4",
    moduloId: "vendas",
    licaoId: "ven-pedido",
    tipo: "multipla-escolha",
    enunciado:
      "Onde o vendedor acompanha os pedidos que ainda têm saldo não faturado?",
    explicacaoCorreta:
      "O controle de pedidos pendentes lista os pedidos com saldo em aberto, permitindo decidir entre faturar, cortar ou renegociar. É a tela de gestão do que foi vendido e ainda não saiu.",
    fonte: f(89, "Como controlar pedidos pendentes"),
    dificuldade: 1,
    tags: ["pedidos pendentes"],
    alternativas: [
      { id: "a", texto: "No controle de pedidos pendentes", correta: true },
      {
        id: "b",
        texto: "No Kardex do produto",
        correta: false,
        explicacaoErro:
          "O Kardex mostra a movimentação de estoque já efetivada, item por item. Saldo de pedido é compromisso comercial, que ainda não virou movimento.",
      },
      {
        id: "c",
        texto: "Na Agenda Financeira",
        correta: false,
        explicacaoErro:
          "A Agenda Financeira lista títulos a vencer. Um pedido não faturado não gerou título, então ele não aparece lá.",
      },
      {
        id: "d",
        texto: "No cadastro do parceiro",
        correta: false,
        explicacaoErro:
          "O cadastro do parceiro guarda dados do cliente. Consultar negociações por ali dá histórico, não a fila de saldos pendentes.",
      },
    ],
  },

  /* -------------------------------------------- L2: aprovação ------------ */
  {
    id: "ven-aprovacao-q1",
    moduloId: "vendas",
    licaoId: "ven-aprovacao",
    tipo: "multipla-escolha",
    contexto:
      "Um pedido travou com a mensagem de limite de crédito excedido.",
    enunciado: "O que caracteriza corretamente o fluxo de aprovação do Sankhya?",
    explicacaoCorreta:
      "O fluxo de aprovação bloqueia o pedido por evento (limite de crédito, desconto acima do permitido, prazo médio, atraso de pagamento) e exige liberação de quem tem alçada. O pedido fica retido, não é descartado.",
    fonte: f(29, "Como controlar o fluxo de aprovação e liberar limite de crédito no pedido de venda"),
    dificuldade: 2,
    tags: ["aprovação", "limite de crédito"],
    alternativas: [
      {
        id: "a",
        texto: "O pedido fica retido até alguém com alçada liberar o evento",
        correta: true,
      },
      {
        id: "b",
        texto: "O pedido é cancelado automaticamente",
        correta: false,
        explicacaoErro:
          "Cancelar seria perder a venda. O sistema retém para que a decisão seja humana: liberar, renegociar ou recusar. Nada é descartado sem alguém decidir.",
      },
      {
        id: "c",
        texto: "O pedido é faturado e o bloqueio vira só um aviso no relatório",
        correta: false,
        explicacaoErro:
          "Se o faturamento passasse, o controle não teria função. O bloqueio existe justamente para impedir a nota antes do risco se concretizar.",
      },
      {
        id: "d",
        texto: "O limite do cliente é aumentado automaticamente",
        correta: false,
        explicacaoErro:
          "Elevar limite é decisão de crédito, nunca automática. O sistema apenas sinaliza que o teto configurado foi atingido.",
      },
    ],
  },
  {
    id: "ven-aprovacao-q2",
    moduloId: "vendas",
    licaoId: "ven-aprovacao",
    tipo: "associar-colunas",
    enunciado: "Associe cada tipo de bloqueio ao que ele protege.",
    pares: [
      {
        id: "p1",
        esquerda: "Limite de crédito",
        direita: "Exposição financeira com o cliente",
        explicacaoErro:
          "Limite de crédito é sobre quanto a empresa aceita ter a receber daquele cliente. É risco de inadimplência, não de margem.",
      },
      {
        id: "p2",
        esquerda: "Desconto máximo por item",
        direita: "Margem do produto",
        explicacaoErro:
          "Desconto por item protege a rentabilidade daquele produto. É controle de margem, não de crédito.",
      },
      {
        id: "p3",
        esquerda: "Prazo médio máximo",
        direita: "Capital de giro da empresa",
        explicacaoErro:
          "Prazo médio controla quanto tempo o dinheiro fica na rua. É capital de giro, não margem do item.",
      },
      {
        id: "p4",
        esquerda: "Atraso de pagamento",
        direita: "Histórico de inadimplência do parceiro",
        explicacaoErro:
          "O bloqueio por atraso olha o passado do cliente: existe título vencido em aberto. É diferente de limite, que olha o total exposto.",
      },
    ],
    explicacaoCorreta:
      "Cada evento protege um risco diferente: crédito e atraso cuidam do recebimento, desconto cuida da margem, prazo médio cuida do caixa. Liberar sem entender qual risco foi acionado é liberar às cegas.",
    explicacaoErro:
      "Misturar limite de crédito com desconto é o erro clássico: um fala de quanto o cliente deve, o outro de quanto a empresa ganha. Liberar o evento errado não desbloqueia o pedido.",
    fonte: f(30, "Como controlar o fluxo de aprovação e liberar desconto por item da nota"),
    dificuldade: 3,
    tags: ["aprovação", "eventos", "margem"],
  },
  {
    id: "ven-aprovacao-q3",
    moduloId: "vendas",
    licaoId: "ven-aprovacao",
    tipo: "multipla-escolha",
    enunciado:
      "O que o Evento 18 faz no processo de vendas do Sankhya?",
    explicacaoCorreta:
      "O Evento 18 é a liberação exigida no momento da confirmação da nota. Diferente de bloqueios de pedido, ele age na virada final: a nota não é confirmada até a liberação sair.",
    fonte: f(69, "Como realizar liberação de pedido de venda - evento 18 confirmação da nota", {
      timestamp: "2:35",
    }),
    dificuldade: 3,
    tags: ["evento 18", "confirmação da nota"],
    alternativas: [
      {
        id: "a",
        texto: "Exige liberação na confirmação da nota",
        correta: true,
      },
      {
        id: "b",
        texto: "Exige liberação no lançamento do orçamento",
        correta: false,
        explicacaoErro:
          "No orçamento não há compromisso ainda: não faz sentido travar ali. O evento 18 atua no ponto em que estoque e financeiro seriam efetivados.",
      },
      {
        id: "c",
        texto: "Transmite a NF-e para a SEFAZ",
        correta: false,
        explicacaoErro:
          "Transmissão é etapa fiscal, posterior e independente. O evento 18 é controle interno de liberação, anterior à confirmação.",
      },
      {
        id: "d",
        texto: "Calcula a comissão do vendedor",
        correta: false,
        explicacaoErro:
          "Comissão tem regra própria e é apurada a partir da nota. Eventos são pontos de controle e liberação, não cálculo.",
      },
    ],
  },
  {
    id: "ven-aprovacao-q4",
    moduloId: "vendas",
    licaoId: "ven-aprovacao",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre classificação gerencial da venda.",
    texto:
      "Classificar corretamente a {{1}} e o {{2}} na venda é o que permite ler o resultado por área no {{3}}.",
    lacunas: [
      { pos: 1, respostaId: "natureza" },
      { pos: 2, respostaId: "centro" },
      { pos: 3, respostaId: "dre" },
    ],
    banco: [
      { id: "natureza", texto: "natureza" },
      { id: "centro", texto: "centro de resultado" },
      { id: "dre", texto: "DRE" },
      {
        id: "cfop",
        texto: "CFOP",
        explicacaoErro:
          "CFOP é código fiscal declarado ao fisco. Ele não classifica o lançamento para leitura gerencial de resultado.",
      },
      {
        id: "danfe",
        texto: "DANFE",
        explicacaoErro:
          "O DANFE é a representação impressa da NF-e. É documento de acompanhamento da mercadoria, não relatório de resultado.",
      },
    ],
    explicacaoCorreta:
      "Natureza e centro de resultado são as duas dimensões gerenciais do lançamento. Sem elas preenchidas com critério, o DRE mostra o total certo distribuído da forma errada.",
    fonte: f(102, "Como classificar corretamente a natureza e o centro de resultado nas vendas"),
    dificuldade: 2,
    tags: ["natureza", "centro de resultado", "DRE"],
  },

  /* --------------------------------------------------- L3: NF-e ---------- */
  {
    id: "ven-nfe-q1",
    moduloId: "vendas",
    licaoId: "ven-nfe",
    tipo: "multipla-escolha",
    contexto:
      "A NF-e foi transmitida e a SEFAZ devolveu uma rejeição por divergência no cadastro do destinatário.",
    enunciado: "Qual é a consequência correta dessa rejeição?",
    explicacaoCorreta:
      "Nota rejeitada não existe fiscalmente: nada foi autorizado. Corrige-se o cadastro e transmite-se novamente, sem precisar de cancelamento nem de carta de correção.",
    fonte: f(127, "Como identificar e tratar ocorrências na emissão de NF-e", {
      timestamp: "6:08",
    }),
    dificuldade: 2,
    tags: ["NF-e", "SEFAZ", "rejeição"],
    alternativas: [
      {
        id: "a",
        texto: "A nota não foi autorizada; corrige-se o cadastro e retransmite",
        correta: true,
      },
      {
        id: "b",
        texto: "É preciso cancelar a nota antes de emitir outra",
        correta: false,
        explicacaoErro:
          "Só se cancela o que foi autorizado. Uma nota rejeitada nunca existiu para o fisco, então não há o que cancelar — tentar cancelar gera novo erro.",
      },
      {
        id: "c",
        texto: "Emite-se carta de correção eletrônica",
        correta: false,
        explicacaoErro:
          "A CC-e corrige informações acessórias de uma nota já autorizada, e nunca dados do destinatário nem valores. Numa nota rejeitada ela não se aplica.",
      },
      {
        id: "d",
        texto: "A nota vale como documento fiscal em contingência",
        correta: false,
        explicacaoErro:
          "Contingência é um modo de emissão previsto quando a SEFAZ está indisponível, não um efeito de rejeição. Rejeição significa recusa do conteúdo, não indisponibilidade.",
      },
    ],
  },
  {
    id: "ven-nfe-q2",
    moduloId: "vendas",
    licaoId: "ven-nfe",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre carta de correção eletrônica.",
    afirmacao:
      "A carta de correção eletrônica (CC-e) pode ser usada para corrigir o valor total e o destinatário de uma NF-e já autorizada.",
    resposta: false,
    explicacaoCorreta:
      "A CC-e serve apenas para informações que não alteram valores, impostos, data de emissão, remetente ou destinatário. Erro nesses campos exige cancelamento e nova emissão.",
    explicacaoErro:
      "Usar CC-e para valor ou destinatário é o atalho errado mais tentador: a carta é aceita pelo sistema mas não tem validade para esses campos, e a inconsistência aparece na apuração.",
    fonte: f(125, "Como emitir carta de correção eletrônica"),
    dificuldade: 2,
    tags: ["CC-e", "NF-e"],
  },
  {
    id: "ven-nfe-q3",
    moduloId: "vendas",
    licaoId: "ven-nfe",
    tipo: "multipla-escolha",
    enunciado:
      "Foi identificado, depois da autorização, que a nota saiu com valor abaixo do correto. Qual documento resolve?",
    explicacaoCorreta:
      "A NF complementar cobre a diferença de valor ou de imposto de uma nota já autorizada, mantendo o vínculo com a nota de origem. Não se refaz a nota inteira.",
    fonte: f(137, "Como emitir a NF complementar e identificar sua origem"),
    dificuldade: 3,
    tags: ["NF complementar", "NF-e"],
    alternativas: [
      { id: "a", texto: "Nota fiscal complementar", correta: true },
      {
        id: "b",
        texto: "Carta de correção eletrônica",
        correta: false,
        explicacaoErro:
          "A CC-e não pode alterar valores nem impostos. Diferença de valor exige documento fiscal próprio, que é a nota complementar.",
      },
      {
        id: "c",
        texto: "Nota de devolução",
        correta: false,
        explicacaoErro:
          "Devolução é o retorno da mercadoria, com efeito de entrada em estoque. Aqui a mercadoria ficou com o cliente: só o valor está a menos.",
      },
      {
        id: "d",
        texto: "Cancelamento e nova emissão",
        correta: false,
        explicacaoErro:
          "É possível dentro do prazo, mas desnecessário e mais caro: o cancelamento invalida uma nota correta na mercadoria só para corrigir valor, quando a complementar resolve pela diferença.",
      },
    ],
  },
  {
    id: "ven-nfe-q4",
    moduloId: "vendas",
    licaoId: "ven-nfe",
    tipo: "resposta-curta",
    enunciado:
      "Qual é o nome do documento impresso que acompanha a mercadoria e representa a NF-e autorizada?",
    respostasAceitas: ["danfe", "danfe nfe", "documento auxiliar da nfe"],
    respostaCanonica: "DANFE",
    dica: "Cinco letras. É o que o motorista leva junto com a carga.",
    explicacaoCorreta:
      "DANFE é o Documento Auxiliar da NF-e. Ele não é a nota: é a representação impressa que acompanha a mercadoria e traz a chave de acesso para consulta.",
    explicacaoErro:
      "A NF-e é o arquivo XML autorizado pela SEFAZ. O papel que viaja com a carga é o DANFE — confundir os dois costuma levar a tratar reimpressão como reemissão.",
    fonte: f(122, "Como realizar a impressão do DANFE"),
    dificuldade: 1,
    tags: ["DANFE", "NF-e"],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "ven-prova-q1",
    moduloId: "vendas",
    licaoId: "ven-prova",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene o tratamento de uma devolução total de venda, do pedido do cliente ao reflexo financeiro.",
    passos: [
      { id: "s1", texto: "Registrar a nota de devolução vinculada à venda", ordem: 1 },
      { id: "s2", texto: "Confirmar a devolução, repondo o estoque", ordem: 2 },
      { id: "s3", texto: "Gerar o crédito para o cliente", ordem: 3 },
      { id: "s4", texto: "Compensar o crédito com o título em aberto", ordem: 4 },
    ],
    explicacaoCorreta:
      "A devolução parte da nota original, é confirmada para repor o estoque, gera crédito e só então esse crédito é compensado no financeiro. Cada passo depende do anterior estar efetivado.",
    explicacaoErro:
      "Tentar compensar antes de confirmar a devolução é o erro típico: o crédito ainda não existe, então não há o que compensar, e a impressão é de que o sistema 'perdeu' o valor.",
    fonte: f(165, "Como realizar compensação financeira de devolução"),
    dificuldade: 3,
    tags: ["devolução", "crédito", "compensação"],
  },
  {
    id: "ven-prova-q2",
    moduloId: "vendas",
    licaoId: "ven-prova",
    tipo: "multipla-escolha",
    contexto:
      "A nota foi confirmada, mas o estoque do produto não se moveu.",
    enunciado: "Qual é a hipótese mais provável?",
    explicacaoCorreta:
      "A TOP usada na operação não está configurada para atualizar estoque. Como é a TOP que decide se a operação movimenta estoque, uma nota pode ser confirmada e não gerar movimento algum.",
    fonte: f(113, "Como validar a movimentação de estoque após a venda"),
    dificuldade: 3,
    tags: ["TOP", "estoque", "diagnóstico"],
    alternativas: [
      {
        id: "a",
        texto: "A TOP não está marcada para atualizar estoque",
        correta: true,
      },
      {
        id: "b",
        texto: "A NF-e ainda não foi transmitida à SEFAZ",
        correta: false,
        explicacaoErro:
          "Transmissão é etapa fiscal e independente do movimento interno. O estoque se move na confirmação, mesmo antes de a nota ser autorizada.",
      },
      {
        id: "c",
        texto: "O produto não tem NCM cadastrado",
        correta: false,
        explicacaoErro:
          "Falta de NCM impacta tributação e transmissão, não o lançamento de movimento de estoque.",
      },
      {
        id: "d",
        texto: "O cliente está com limite de crédito bloqueado",
        correta: false,
        explicacaoErro:
          "Bloqueio de crédito impede o pedido de avançar. Como a nota já foi confirmada, esse controle claramente não foi o que impediu o movimento.",
      },
    ],
  },
  {
    id: "ven-prova-q3",
    moduloId: "vendas",
    licaoId: "ven-prova",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre o financeiro gerado pela venda.",
    afirmacao:
      "O título a receber da venda pode ser consultado a partir da própria Central de Vendas, sem sair para o módulo financeiro.",
    resposta: true,
    explicacaoCorreta:
      "A Central de Vendas mostra o financeiro gerado pela nota, permitindo ir do documento comercial ao título sem trocar de módulo. É o caminho natural para conferir o que a venda produziu.",
    explicacaoErro:
      "Assumir que só o módulo financeiro mostra o título faz o consultor perder o rastro documento → título, que é exatamente o que a Central de Vendas oferece.",
    fonte: f(109, "Como visualizar o financeiro gerado pela nota na Central de Vendas"),
    dificuldade: 1,
    tags: ["central de vendas", "financeiro"],
  },
];
