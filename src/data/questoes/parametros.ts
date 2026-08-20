import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("parametros", aulaId, aula, extra);

/**
 * Modulo: Parâmetros e configurações — trilha "Configurações técnicas".
 * Fontes: aulas 42, 154, 63, 5939, 110, 128, 138, 68, 70, 244, 150 do EAD.
 */
export const questoesParametros: Questao[] = [
  /* ---------------------------------------------------------------- L1 --- */
  {
    id: "par-parametros-q1",
    moduloId: "parametros",
    licaoId: "par-parametros",
    tipo: "multipla-escolha",
    enunciado:
      "Em qual tela do Sankhya Om você revisa e altera os parâmetros que valem para toda a instalação?",
    explicacaoCorreta:
      "Os parâmetros globais ficam na tela Preferências da Empresa, organizada por abas de módulo. É de lá que sai o comportamento padrão de faturamento, estoque e financeiro para todas as empresas do grupo.",
    fonte: f(42, "Como realizar a conferência de Parâmetros", { timestamp: "3:12" }),
    dificuldade: 1,
    tags: ["parâmetros", "preferências"],
    alternativas: [
      {
        id: "a",
        texto: "Preferências da Empresa",
        correta: true,
      },
      {
        id: "b",
        texto: "Cadastro de Usuários",
        correta: false,
        explicacaoErro:
          "O Cadastro de Usuários define quem acessa o quê — permissões e vínculos. Ele não altera o comportamento funcional dos módulos, que é o que os parâmetros controlam.",
      },
      {
        id: "c",
        texto: "Tipos de Operação — TOP",
        correta: false,
        explicacaoErro:
          "A TOP parametriza uma operação específica (uma venda, uma devolução). Parâmetro é o nível acima: vale para a instalação inteira, independentemente da operação.",
      },
      {
        id: "d",
        texto: "Configuração de Filtros",
        correta: false,
        explicacaoErro:
          "Filtros são um recurso de consulta na grade, por usuário. Não têm relação com parametrização funcional do sistema.",
      },
    ],
  },
  {
    id: "par-parametros-q2",
    moduloId: "parametros",
    licaoId: "par-parametros",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre escopo de parâmetros.",
    afirmacao:
      "Um parâmetro alterado em Preferências da Empresa passa a valer imediatamente para todos os usuários, sem necessidade de liberá-lo usuário por usuário.",
    resposta: true,
    explicacaoCorreta:
      "Parâmetro é configuração de instalação: assim que salvo, vale para todos. Quem precisa de tratamento individual é permissão de tela e preferência de usuário, que são outro cadastro.",
    explicacaoErro:
      "Você tratou parâmetro como se fosse permissão. Permissão é por usuário ou grupo; parâmetro é global. Confundir os dois costuma levar a alterar o comportamento do sistema para a empresa toda achando que se está ajustando um caso isolado.",
    fonte: f(42, "Como realizar a conferência de Parâmetros"),
    dificuldade: 2,
    tags: ["parâmetros", "escopo"],
  },
  {
    id: "par-parametros-q3",
    moduloId: "parametros",
    licaoId: "par-parametros",
    tipo: "multipla-escolha",
    enunciado:
      "A empresa quer que os pedidos de venda sigam uma sequência numérica própria, separada das notas. Onde isso é definido?",
    explicacaoCorreta:
      "A numeração de cada tipo de documento é definida na configuração de numeração dos cadastros, por série/tipo. É lá que se separa a sequência de pedido da sequência de nota.",
    fonte: f(5939, "Como configurar a numeração dos cadastros"),
    dificuldade: 2,
    tags: ["numeração", "séries"],
    alternativas: [
      {
        id: "a",
        texto: "Na configuração de numeração dos cadastros",
        correta: true,
      },
      {
        id: "b",
        texto: "Digitando o número manualmente no primeiro pedido",
        correta: false,
        explicacaoErro:
          "Digitar o número no documento não cria sequência: o próximo continuaria do contador antigo. A sequência tem que ser configurada, não improvisada no lançamento.",
      },
      {
        id: "c",
        texto: "No campo Série da TOP",
        correta: false,
        explicacaoErro:
          "A TOP aponta para qual série usar, mas não é ela que guarda o contador. Quem controla o número corrente é a configuração de numeração.",
      },
      {
        id: "d",
        texto: "No cadastro do parceiro",
        correta: false,
        explicacaoErro:
          "O cadastro do parceiro guarda dados de quem compra ou vende. Numeração de documento é característica da empresa emissora, não do parceiro.",
      },
    ],
  },
  {
    id: "par-parametros-q4",
    moduloId: "parametros",
    licaoId: "par-parametros",
    tipo: "resposta-curta",
    enunciado:
      "Qual cadastro define a unidade em que o produto é comprado e vendida, permitindo converter, por exemplo, caixa em unidade?",
    respostasAceitas: [
      "unidade alternativa",
      "unidades alternativas",
      "unidade de medida alternativa",
      "unidades alternativas de medida",
    ],
    respostaCanonica: "Unidades Alternativas",
    dica: "É o cadastro que complementa a Unidade de Medida principal do produto.",
    explicacaoCorreta:
      "Unidades Alternativas guarda o fator de conversão entre a unidade de controle do produto e as unidades usadas na compra ou na venda. Sem ela, comprar em caixa e vender em unidade não fecha o estoque.",
    explicacaoErro:
      "O cadastro de Unidades de Medida apenas lista as unidades existentes (UN, CX, KG). Quem cria a relação entre elas — o fator de conversão do produto — é Unidades Alternativas.",
    fonte: f(78, "Como cadastrar Unidades Alternativas"),
    dificuldade: 2,
    tags: ["produtos", "unidade de medida"],
  },

  /* ---------------------------------------------------------------- L2 --- */
  {
    id: "par-top-q1",
    moduloId: "parametros",
    licaoId: "par-top",
    tipo: "multipla-escolha",
    contexto:
      "Uma venda foi lançada e, ao confirmar a nota, o imposto saiu diferente do esperado.",
    enunciado:
      "Qual cadastro define a natureza da operação e carrega as regras fiscais aplicadas ao documento?",
    explicacaoCorreta:
      "A TOP (Tipo de Operação) é o que classifica a operação e carrega suas regras: se movimenta estoque, se gera financeiro, qual série, qual CFOP e qual tratamento fiscal. É o primeiro lugar a olhar quando o resultado do documento saiu diferente do esperado.",
    fonte: f(110, "Como cadastrar Tipos de Operação - TOP", {
      timestamp: "12:41",
      citacao:
        "a TOP é que carrega a regra fiscal e define se a operação movimenta estoque e financeiro",
    }),
    dificuldade: 1,
    tags: ["TOP", "fiscal"],
    alternativas: [
      { id: "a", texto: "TOP — Tipo de Operação", correta: true },
      {
        id: "b",
        texto: "CFOP",
        correta: false,
        explicacaoErro:
          "O CFOP é um código fiscal que a operação usa, mas ele é consequência: quem escolhe qual CFOP entra no documento é a TOP. O CFOP sozinho não define se a operação movimenta estoque ou gera título.",
      },
      {
        id: "c",
        texto: "Tipo de Negociação",
        correta: false,
        explicacaoErro:
          "O Tipo de Negociação define condição de pagamento — prazo, parcelas, forma. Ele não determina a natureza fiscal da operação.",
      },
      {
        id: "d",
        texto: "Natureza (centro de resultado)",
        correta: false,
        explicacaoErro:
          "Natureza aqui é classificação gerencial/contábil do lançamento, usada em DRE e rateio. Não é ela que define o comportamento fiscal e operacional do documento.",
      },
    ],
  },
  {
    id: "par-top-q2",
    moduloId: "parametros",
    licaoId: "par-top",
    tipo: "associar-colunas",
    enunciado: "Associe cada cadastro à decisão que ele controla no documento.",
    pares: [
      {
        id: "p1",
        esquerda: "TOP",
        direita: "Se a operação movimenta estoque e gera financeiro",
        explicacaoErro:
          "A TOP é o cadastro que liga ou desliga movimentação de estoque e geração de financeiro para aquela operação. É o comportamento do documento, não um código de relatório.",
      },
      {
        id: "p2",
        esquerda: "CFOP",
        direita: "Código fiscal da operação declarado ao fisco",
        explicacaoErro:
          "O CFOP é o código que informa ao fisco a natureza da circulação da mercadoria. Ele é declaratório: não altera por si o comportamento interno do sistema.",
      },
      {
        id: "p3",
        esquerda: "NCM",
        direita: "Classificação fiscal do produto",
        explicacaoErro:
          "NCM classifica o produto (mercadoria), não a operação. É o cadastro que amarra alíquotas e tratamento tributário ao item.",
      },
      {
        id: "p4",
        esquerda: "Tipo de Negociação",
        direita: "Condição de pagamento e parcelamento",
        explicacaoErro:
          "Tipo de Negociação cuida do lado financeiro do acordo — prazo, número de parcelas, forma de pagamento. Nada de fiscal.",
      },
    ],
    explicacaoCorreta:
      "A TOP governa o comportamento da operação, o CFOP a declara ao fisco, o NCM classifica o produto e o Tipo de Negociação define como se paga. Trocar esses papéis é a origem mais comum de erro de parametrização fiscal.",
    explicacaoErro:
      "A confusão típica é achar que o CFOP comanda a operação. A ordem é a inversa: a TOP decide o comportamento e escolhe o CFOP que será declarado.",
    fonte: f(110, "Como cadastrar Tipos de Operação - TOP"),
    dificuldade: 2,
    tags: ["TOP", "CFOP", "NCM"],
  },
  {
    id: "par-top-q3",
    moduloId: "parametros",
    licaoId: "par-top",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre a hierarquia dos cadastros fiscais.",
    texto:
      "A {{1}} define a natureza da operação e aponta o {{2}} que será declarado, enquanto o {{3}} classifica fiscalmente o produto.",
    lacunas: [
      { pos: 1, respostaId: "top" },
      { pos: 2, respostaId: "cfop" },
      { pos: 3, respostaId: "ncm" },
    ],
    banco: [
      { id: "top", texto: "TOP" },
      { id: "cfop", texto: "CFOP" },
      { id: "ncm", texto: "NCM" },
      {
        id: "cst",
        texto: "CST",
        explicacaoErro:
          "O CST informa a situação tributária do item dentro de um imposto. Ele é mais específico que o NCM e não ocupa nenhum dos três papéis da frase.",
      },
      {
        id: "natureza",
        texto: "Natureza",
        explicacaoErro:
          "Natureza é classificação gerencial usada em DRE e rateio de centro de resultado. Não define operação nem classifica produto fiscalmente.",
      },
    ],
    explicacaoCorreta:
      "A cadeia é TOP → CFOP → NCM: a TOP decide o que a operação faz, o CFOP comunica isso ao fisco e o NCM classifica a mercadoria envolvida.",
    fonte: f(128, "Como cadastrar CFOP"),
    dificuldade: 3,
    tags: ["TOP", "CFOP", "NCM"],
  },
  {
    id: "par-top-q4",
    moduloId: "parametros",
    licaoId: "par-top",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre natureza e centro de resultado.",
    afirmacao:
      "A Natureza e o Centro de Resultado são cadastros gerenciais: eles classificam o lançamento para DRE e rateio, sem alterar o cálculo de imposto da nota.",
    resposta: true,
    explicacaoCorreta:
      "Natureza e Centro de Resultado servem à leitura gerencial do resultado — DRE, rateio, análise por área. O cálculo fiscal vem da TOP, do CFOP, do NCM e das alíquotas do produto.",
    explicacaoErro:
      "Você atribuiu efeito fiscal a um cadastro gerencial. Classificar mal a natureza distorce o DRE, mas não muda o imposto da nota — e é justamente por isso que o erro passa despercebido até o fechamento.",
    fonte: f(244, "Como realizar o cadastro de centro de resultado"),
    dificuldade: 2,
    tags: ["natureza", "centro de resultado", "DRE"],
  },
  {
    id: "par-top-q5",
    moduloId: "parametros",
    licaoId: "par-top",
    tipo: "multipla-escolha",
    enunciado:
      "Ao cadastrar uma TOP de devolução de venda, qual característica precisa estar coerente para o estoque voltar corretamente?",
    explicacaoCorreta:
      "A TOP de devolução precisa estar marcada para movimentar estoque em entrada. Se ela herda a atualização de saída da TOP de venda, a devolução baixa o estoque de novo em vez de repor.",
    fonte: f(110, "Como cadastrar Tipos de Operação - TOP"),
    dificuldade: 3,
    tags: ["TOP", "devolução", "estoque"],
    alternativas: [
      {
        id: "a",
        texto: "O sentido da atualização de estoque deve ser entrada",
        correta: true,
      },
      {
        id: "b",
        texto: "A série do documento deve ser a mesma da venda original",
        correta: false,
        explicacaoErro:
          "Devolução normalmente usa série própria, e a série não tem influência sobre o sentido do movimento de estoque. Mesmo com a série certa, o estoque sairia errado.",
      },
      {
        id: "c",
        texto: "O Tipo de Negociação deve ser à vista",
        correta: false,
        explicacaoErro:
          "Tipo de Negociação afeta o financeiro gerado, não o estoque. A devolução ficaria com estoque errado independentemente da condição de pagamento.",
      },
      {
        id: "d",
        texto: "O CFOP deve ser o mesmo da nota de venda",
        correta: false,
        explicacaoErro:
          "Devolução tem CFOP próprio, de entrada. Repetir o CFOP de saída além de estar fiscalmente errado não corrige o sentido do movimento, que é definido na TOP.",
      },
    ],
  },

  /* ---------------------------------------------------------------- L3 --- */
  {
    id: "par-acessos-q1",
    moduloId: "parametros",
    licaoId: "par-acessos",
    tipo: "multipla-escolha",
    enunciado:
      "Um novo consultor entrou na equipe e precisa dos mesmos acessos dos colegas. Qual o caminho mais sustentável?",
    explicacaoCorreta:
      "Vincular o usuário ao Grupo de Usuários já existente faz ele herdar as permissões do grupo. Manutenção futura acontece em um lugar só, e não usuário por usuário.",
    fonte: f(68, "Como cadastrar Grupo de Usuários e Usuários"),
    dificuldade: 1,
    tags: ["usuários", "permissões"],
    alternativas: [
      {
        id: "a",
        texto: "Vincular o usuário ao grupo que já tem essas permissões",
        correta: true,
      },
      {
        id: "b",
        texto: "Liberar cada tela individualmente para o novo usuário",
        correta: false,
        explicacaoErro:
          "Funciona no primeiro dia e vira dívida técnica no segundo: cada mudança de política precisará ser repetida em todos os usuários, e as diferenças acumuladas ficam invisíveis.",
      },
      {
        id: "c",
        texto: "Compartilhar o login de um colega até a liberação sair",
        correta: false,
        explicacaoErro:
          "Além do risco de segurança, o log de auditoria passa a atribuir todas as ações ao dono do login. Rastreabilidade de lançamento fiscal e financeiro depende de usuário individual.",
      },
      {
        id: "d",
        texto: "Alterar um parâmetro para liberar todas as telas",
        correta: false,
        explicacaoErro:
          "Parâmetro é global: isso abriria as telas para a instalação inteira, não para um usuário. É o oposto do que se quer.",
      },
    ],
  },
  {
    id: "par-acessos-q2",
    moduloId: "parametros",
    licaoId: "par-acessos",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene os passos para dar a um novo usuário acesso a uma tela específica.",
    passos: [
      { id: "s1", texto: "Cadastrar o usuário", ordem: 1 },
      { id: "s2", texto: "Vincular o usuário a um Grupo de Usuários", ordem: 2 },
      { id: "s3", texto: "Liberar o acesso à tela para o grupo", ordem: 3 },
      { id: "s4", texto: "Validar entrando na tela com o usuário", ordem: 4 },
    ],
    explicacaoCorreta:
      "Primeiro existe o usuário, depois ele entra no grupo, depois o grupo recebe o acesso, e só então a validação faz sentido. Liberar acesso ao grupo antes de o usuário pertencer a ele não produz efeito visível.",
    explicacaoErro:
      "Inverter grupo e liberação é o erro comum: você libera a tela e testa antes de o usuário estar no grupo, conclui que a permissão não funcionou e sai procurando problema onde não há.",
    fonte: f(70, "Como liberar acessos a telas"),
    dificuldade: 2,
    tags: ["permissões", "grupo de usuários"],
  },
  {
    id: "par-acessos-q3",
    moduloId: "parametros",
    licaoId: "par-acessos",
    tipo: "multipla-escolha",
    enunciado:
      "Para que serve o cadastro de Critérios de Rateio nas configurações técnicas?",
    explicacaoCorreta:
      "Critérios de Rateio definem como um valor único é distribuído entre centros de resultado ou projetos, em percentuais. É o que permite lançar uma despesa comum e vê-la dividida no DRE por área.",
    fonte: f(85, "Como cadastrar Critérios de Rateio"),
    dificuldade: 2,
    tags: ["rateio", "centro de resultado"],
    alternativas: [
      {
        id: "a",
        texto: "Distribuir um valor entre centros de resultado ou projetos",
        correta: true,
      },
      {
        id: "b",
        texto: "Dividir uma nota fiscal em várias parcelas de pagamento",
        correta: false,
        explicacaoErro:
          "Parcelamento é do Tipo de Negociação. Rateio divide o valor entre classificações gerenciais, não entre datas de vencimento.",
      },
      {
        id: "c",
        texto: "Ratear a mercadoria entre vários locais de estoque",
        correta: false,
        explicacaoErro:
          "Distribuição física entre locais é controle de estoque. Critério de Rateio trabalha com valor e classificação contábil/gerencial.",
      },
      {
        id: "d",
        texto: "Dividir a comissão entre vendedores",
        correta: false,
        explicacaoErro:
          "Comissão tem regra própria, ligada a vendedor e negociação. Não é o que o cadastro de Critérios de Rateio resolve.",
      },
    ],
  },
  {
    id: "par-acessos-q4",
    moduloId: "parametros",
    licaoId: "par-acessos",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre certificado digital.",
    afirmacao:
      "Se o certificado digital A1 da empresa vencer, os pedidos de venda continuam sendo lançados normalmente, mas a transmissão da NF-e para a SEFAZ falha.",
    resposta: true,
    explicacaoCorreta:
      "Pedido é documento interno: não depende de certificado. O certificado é exigido no momento de assinar e transmitir a NF-e, então a fila de notas para autorizar é que trava.",
    explicacaoErro:
      "Você assumiu que o vencimento derruba o processo comercial inteiro. Na prática o time segue vendendo e o problema só aparece na transmissão — motivo pelo qual a conferência periódica do certificado é parte da rotina técnica.",
    fonte: f(108, "Como realizar a conferência do Certificado Digital"),
    dificuldade: 2,
    tags: ["certificado digital", "NF-e"],
  },

  /* -------------------------------------------------------------- PROVA --- */
  {
    id: "par-prova-q1",
    moduloId: "parametros",
    licaoId: "par-prova",
    tipo: "associar-colunas",
    enunciado: "Associe cada cadastro ao seu escopo de aplicação.",
    pares: [
      {
        id: "p1",
        esquerda: "Parâmetro",
        direita: "Instalação inteira",
        explicacaoErro:
          "Parâmetro é o escopo mais amplo: alterou, valeu para todos. É por isso que mudança de parâmetro pede cuidado redobrado.",
      },
      {
        id: "p2",
        esquerda: "Preferência da empresa",
        direita: "Uma empresa do grupo",
        explicacaoErro:
          "Preferência da empresa é por empresa/estabelecimento, permitindo que filiais tenham comportamentos diferentes.",
      },
      {
        id: "p3",
        esquerda: "Permissão de tela",
        direita: "Usuário ou grupo de usuários",
        explicacaoErro:
          "Permissão é sempre individual ou por grupo — nunca global. Confundir com parâmetro é o erro clássico.",
      },
      {
        id: "p4",
        esquerda: "TOP",
        direita: "Uma operação específica",
        explicacaoErro:
          "A TOP vale para os documentos que a usam, ou seja, para um tipo de operação. Não é global nem por usuário.",
      },
    ],
    explicacaoCorreta:
      "Do mais amplo para o mais restrito: parâmetro (instalação), preferência (empresa), TOP (operação), permissão (usuário). Saber em que nível mexer evita resolver um caso isolado alterando o comportamento de todos.",
    explicacaoErro:
      "Errar o nível de escopo é a causa mais frequente de efeito colateral em parametrização: o ajuste resolve o pedido de um usuário e muda o sistema para a empresa toda.",
    fonte: f(63, "Como cadastrar e definir as preferências da empresa"),
    dificuldade: 3,
    tags: ["parâmetros", "escopo", "permissões"],
  },
  {
    id: "par-prova-q2",
    moduloId: "parametros",
    licaoId: "par-prova",
    tipo: "multipla-escolha",
    contexto:
      "A nota de venda saiu sem destaque de ICMS, mas o produto é tributado normalmente.",
    enunciado: "Qual é a sequência de investigação mais eficiente?",
    explicacaoCorreta:
      "Comece pela TOP, porque é ela que decide o tratamento fiscal da operação; depois confira o NCM e as alíquotas do produto; por último os dados do parceiro, que podem carregar isenção ou regime especial.",
    fonte: f(110, "Como cadastrar Tipos de Operação - TOP"),
    dificuldade: 3,
    tags: ["TOP", "ICMS", "diagnóstico"],
    alternativas: [
      {
        id: "a",
        texto: "TOP da operação → NCM e alíquotas do produto → cadastro do parceiro",
        correta: true,
      },
      {
        id: "b",
        texto: "Cadastro do parceiro → TOP → NCM",
        correta: false,
        explicacaoErro:
          "Começar pelo parceiro custa tempo: ele explica exceções (isenção, Simples, regime especial), não a regra. A regra geral da operação vem da TOP.",
      },
      {
        id: "c",
        texto: "Refazer a nota com outra série",
        correta: false,
        explicacaoErro:
          "Série é numeração. Mudar de série reemite o mesmo erro com outro número, sem tocar na causa do tratamento fiscal.",
      },
      {
        id: "d",
        texto: "Alterar o parâmetro global de cálculo de imposto",
        correta: false,
        explicacaoErro:
          "Mexer em parâmetro global por causa de um caso é o erro de escopo mais caro: você muda o cálculo para todas as operações de todas as empresas para corrigir uma nota.",
      },
    ],
  },
  {
    id: "par-prova-q3",
    moduloId: "parametros",
    licaoId: "par-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual sigla nomeia o cadastro que define a natureza da operação no Sankhya, controlando estoque, financeiro e regra fiscal do documento?",
    respostasAceitas: ["top", "tipo de operacao", "tipos de operacao", "tipo de operação"],
    respostaCanonica: "TOP (Tipo de Operação)",
    dica: "Três letras. É o primeiro cadastro a olhar quando um documento se comporta de forma inesperada.",
    explicacaoCorreta:
      "TOP é a sigla de Tipo de Operação. Ela concentra as decisões da operação: movimenta estoque, gera financeiro, qual série, qual CFOP, qual tratamento fiscal.",
    explicacaoErro:
      "CFOP e NCM são códigos fiscais usados pela operação, e Tipo de Negociação cuida do pagamento. Nenhum deles governa o comportamento do documento — quem faz isso é a TOP.",
    fonte: f(110, "Como cadastrar Tipos de Operação - TOP"),
    dificuldade: 1,
    tags: ["TOP"],
  },
];
