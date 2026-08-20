import type { Questao } from "../schema";
import { fonte } from "../ead/url";

const f = (aulaId: number, aula: string, extra?: { timestamp?: string; citacao?: string }) =>
  fonte("navegando", aulaId, aula, extra);

/** Modulo: Navegando com Maestria — trilha homonima (11 aulas no EAD). */
export const questoesNavegando: Questao[] = [
  /* -------------------------------------------- L1: interface ------------ */
  {
    id: "nav-interface-q1",
    moduloId: "navegando",
    licaoId: "nav-interface",
    tipo: "multipla-escolha",
    enunciado: "O que é o Sankhya Om?",
    explicacaoCorreta:
      "É a plataforma web do Sankhya, onde os módulos são acessados pelo navegador. Ela é a interface atual do ERP, sucedendo o uso exclusivo do cliente desktop.",
    fonte: f(234, "Conhecendo o Sankhya Om", { timestamp: "0:45" }),
    dificuldade: 1,
    tags: ["Sankhya Om", "interface"],
    alternativas: [
      { id: "a", texto: "A plataforma web de acesso ao ERP", correta: true },
      {
        id: "b",
        texto: "Um módulo de business intelligence",
        correta: false,
        explicacaoErro:
          "BI é um conjunto de recursos dentro da plataforma, não a plataforma. O Om é o ambiente onde todos os módulos vivem.",
      },
      {
        id: "c",
        texto: "O banco de dados do sistema",
        correta: false,
        explicacaoErro:
          "O banco armazena os dados; o Om é a camada com que o usuário interage. Confundir os dois leva a procurar configuração de tela no lugar errado.",
      },
      {
        id: "d",
        texto: "O aplicativo móvel de vendas",
        correta: false,
        explicacaoErro:
          "Existem aplicações específicas para força de vendas, mas o Om é a plataforma completa, não um app de um processo só.",
      },
    ],
  },
  {
    id: "nav-interface-q2",
    moduloId: "navegando",
    licaoId: "nav-interface",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre personalização.",
    afirmacao:
      "As personalizações de interface que um usuário faz valem apenas para ele, sem afetar os outros usuários.",
    resposta: true,
    explicacaoCorreta:
      "Personalização é preferência de usuário: layout de grade, colunas visíveis, filtros salvos. Ela fica no perfil de quem a fez e não altera a experiência dos demais.",
    explicacaoErro:
      "Achar que personalização é global gera medo de mexer na própria tela — e faz o usuário conviver com uma interface inadequada por receio de afetar a equipe.",
    fonte: f(236, "Personalizando o sistema"),
    dificuldade: 1,
    tags: ["personalização", "usuário"],
  },
  {
    id: "nav-interface-q3",
    moduloId: "navegando",
    licaoId: "nav-interface",
    tipo: "multipla-escolha",
    enunciado:
      "Qual é o ganho de entender a integração entre os processos antes de operar um módulo isolado?",
    explicacaoCorreta:
      "Cada módulo consome e produz dados dos outros: a venda move estoque e gera financeiro. Sem essa visão, um erro em um módulo é investigado no lugar errado.",
    fonte: f(7941, "Visão geral da integração dos processos"),
    dificuldade: 2,
    tags: ["integração", "processos"],
    alternativas: [
      {
        id: "a",
        texto: "Saber onde um erro se origina, já que os módulos se alimentam entre si",
        correta: true,
      },
      {
        id: "b",
        texto: "Poder operar sem permissão de acesso",
        correta: false,
        explicacaoErro:
          "Entender o processo não substitui permissão. Acesso é controlado por grupo de usuários, independentemente do conhecimento de quem opera.",
      },
      {
        id: "c",
        texto: "Dispensar a parametrização dos módulos",
        correta: false,
        explicacaoErro:
          "É o contrário: entender a integração mostra por que a parametrização de um módulo afeta os outros, tornando-a mais importante, não menos.",
      },
      {
        id: "d",
        texto: "Acelerar o processamento do sistema",
        correta: false,
        explicacaoErro:
          "Conhecimento do processo não altera desempenho técnico. O ganho é de diagnóstico e decisão.",
      },
    ],
  },

  /* -------------------------------------------- L2: cadastros ------------ */
  {
    id: "nav-cadastros-q1",
    moduloId: "navegando",
    licaoId: "nav-cadastros",
    tipo: "multipla-escolha",
    enunciado:
      "Para que serve a configuração de filtros em uma tela de cadastro?",
    explicacaoCorreta:
      "Para restringir os registros exibidos segundo critérios definidos pelo usuário, e salvar esse recorte para reuso. É o que torna uma tabela de milhares de linhas utilizável no dia a dia.",
    fonte: f(238, "Configuração de filtros"),
    dificuldade: 1,
    tags: ["filtros", "consulta"],
    alternativas: [
      {
        id: "a",
        texto: "Restringir e salvar o recorte de registros exibidos",
        correta: true,
      },
      {
        id: "b",
        texto: "Excluir permanentemente os registros que não interessam",
        correta: false,
        explicacaoErro:
          "Filtro afeta a exibição, nunca o dado. Confundir filtrar com excluir é o mal-entendido mais perigoso em tela de cadastro.",
      },
      {
        id: "c",
        texto: "Definir quais usuários podem ver a tela",
        correta: false,
        explicacaoErro:
          "Visibilidade de tela é permissão, configurada por grupo de usuários. Filtro é ferramenta de consulta de quem já tem acesso.",
      },
      {
        id: "d",
        texto: "Bloquear a edição dos registros filtrados",
        correta: false,
        explicacaoErro:
          "Filtro não altera direitos sobre o registro. Quem pode editar continua podendo, filtrado ou não.",
      },
    ],
  },
  {
    id: "nav-cadastros-q2",
    moduloId: "navegando",
    licaoId: "nav-cadastros",
    tipo: "associar-colunas",
    enunciado: "Associe cada recurso de tela ao problema que ele resolve.",
    pares: [
      {
        id: "p1",
        esquerda: "Filtro",
        direita: "A grade traz registros demais para trabalhar",
        explicacaoErro:
          "Filtro reduz o conjunto exibido. É a resposta para volume excessivo de linhas.",
      },
      {
        id: "p2",
        esquerda: "Configuração da grade",
        direita: "As colunas necessárias não aparecem, ou aparecem na ordem errada",
        explicacaoErro:
          "Configurar a grade escolhe e ordena colunas. É sobre quais campos ver, não sobre quais linhas.",
      },
      {
        id: "p3",
        esquerda: "Otimização do formulário",
        direita: "O cadastro tem campos demais para o uso do dia a dia",
        explicacaoErro:
          "A otimização do formulário organiza os campos de entrada, reduzindo o esforço de digitação repetitiva.",
      },
      {
        id: "p4",
        esquerda: "Navegação entre abas",
        direita: "É preciso comparar dois registros ou telas ao mesmo tempo",
        explicacaoErro:
          "Abas permitem manter contextos abertos em paralelo, sem perder o que já estava carregado.",
      },
    ],
    explicacaoCorreta:
      "Filtro escolhe linhas, grade escolhe colunas, formulário organiza a entrada e abas mantêm contextos paralelos. Cada um resolve um atrito diferente da mesma tela.",
    explicacaoErro:
      "Tentar resolver excesso de colunas com filtro (ou o contrário) é o erro que faz o usuário concluir que a tela 'não tem' o recurso que precisa.",
    fonte: f(240, "Configurações para otimização da grade"),
    dificuldade: 2,
    tags: ["grade", "filtros", "formulário", "abas"],
  },
  {
    id: "nav-cadastros-q3",
    moduloId: "navegando",
    licaoId: "nav-cadastros",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre otimização de formulários.",
    afirmacao:
      "Otimizar o formulário de um cadastro remove os campos ocultos do banco de dados, liberando espaço.",
    resposta: false,
    explicacaoCorreta:
      "A otimização muda apenas a apresentação: quais campos aparecem e em que ordem. A estrutura do banco não é alterada, e os dados continuam íntegros.",
    explicacaoErro:
      "Confundir apresentação com estrutura gera resistência a personalizar telas, por medo de perder dado — quando na prática nada no banco é tocado.",
    fonte: f(239, "Configurações para otimização dos Formulários de cadastros"),
    dificuldade: 2,
    tags: ["formulário", "personalização"],
  },
  {
    id: "nav-cadastros-q4",
    moduloId: "navegando",
    licaoId: "nav-cadastros",
    tipo: "resposta-curta",
    enunciado:
      "Qual recurso permite manter mais de uma tela aberta ao mesmo tempo, alternando entre contextos sem recarregar?",
    respostasAceitas: ["abas", "aba", "navegacao entre abas", "guias"],
    respostaCanonica: "Abas",
    dica: "Funciona como no navegador: vários contextos vivos em paralelo.",
    explicacaoCorreta:
      "As abas mantêm cada tela com seu próprio estado, permitindo comparar registros ou consultar um cadastro sem perder o lançamento em andamento.",
    explicacaoErro:
      "Filtros e configuração de grade atuam dentro de uma tela. Para manter dois contextos vivos ao mesmo tempo, o recurso são as abas.",
    fonte: f(241, "Opções de pesquisa e navegação entre abas"),
    dificuldade: 1,
    tags: ["abas", "navegação"],
  },

  /* ------------------------------------------------ L3: menus ------------ */
  {
    id: "nav-menus-q1",
    moduloId: "navegando",
    licaoId: "nav-menus",
    tipo: "multipla-escolha",
    enunciado:
      "Configurar os menus do sistema serve principalmente para:",
    explicacaoCorreta:
      "Organizar o acesso às telas conforme o uso real de cada área, encurtando o caminho até o que a pessoa usa todo dia. É organização, não permissão.",
    fonte: f(242, "Como configurar Menus do sistema"),
    dificuldade: 2,
    tags: ["menus", "organização"],
    alternativas: [
      {
        id: "a",
        texto: "Organizar o acesso às telas conforme o uso de cada área",
        correta: true,
      },
      {
        id: "b",
        texto: "Conceder permissão de acesso às telas",
        correta: false,
        explicacaoErro:
          "Menu é caminho, permissão é direito. Tirar uma tela do menu não impede quem tem permissão de chegar nela por busca — e é por isso que menu nunca deve ser usado como controle de segurança.",
      },
      {
        id: "c",
        texto: "Alterar o layout interno das telas",
        correta: false,
        explicacaoErro:
          "Layout de tela se ajusta pela configuração de grade e de formulário. O menu trata apenas de como se chega até ela.",
      },
      {
        id: "d",
        texto: "Definir quais módulos estão licenciados",
        correta: false,
        explicacaoErro:
          "Licenciamento é contratual e independe da configuração de menu. Um módulo não licenciado não funciona nem estando no menu.",
      },
    ],
  },
  {
    id: "nav-menus-q2",
    moduloId: "navegando",
    licaoId: "nav-menus",
    tipo: "completar-lacuna",
    enunciado: "Complete a frase sobre menu e permissão.",
    texto:
      "O {{1}} define o caminho até a tela, enquanto a {{2}} define quem pode abri-la; por isso o menu {{3}} deve ser usado como controle de segurança.",
    lacunas: [
      { pos: 1, respostaId: "menu" },
      { pos: 2, respostaId: "permissao" },
      { pos: 3, respostaId: "nunca" },
    ],
    banco: [
      { id: "menu", texto: "menu" },
      { id: "permissao", texto: "permissão" },
      { id: "nunca", texto: "nunca" },
      {
        id: "sempre",
        texto: "sempre",
        explicacaoErro:
          "Esconder do menu não bloqueia o acesso: quem tem permissão chega pela busca. Usar menu como segurança dá uma falsa sensação de controle.",
      },
      {
        id: "filtro",
        texto: "filtro",
        explicacaoErro:
          "Filtro atua sobre os registros dentro de uma tela, não sobre quem pode abrir a tela.",
      },
    ],
    explicacaoCorreta:
      "Menu é conveniência, permissão é controle. Só a permissão por grupo de usuários impede efetivamente o acesso a uma tela.",
    fonte: f(242, "Como configurar Menus do sistema"),
    dificuldade: 3,
    tags: ["menus", "permissões", "segurança"],
  },
  {
    id: "nav-menus-q3",
    moduloId: "navegando",
    licaoId: "nav-menus",
    tipo: "ordenar-passos",
    enunciado:
      "Ordene o caminho para deixar uma tela de uso diário mais acessível para uma equipe.",
    passos: [
      { id: "s1", texto: "Confirmar que o grupo tem permissão para a tela", ordem: 1 },
      { id: "s2", texto: "Posicionar a tela no menu da área", ordem: 2 },
      { id: "s3", texto: "Configurar a grade com as colunas que a equipe usa", ordem: 3 },
      { id: "s4", texto: "Salvar um filtro padrão para o recorte do dia a dia", ordem: 4 },
    ],
    explicacaoCorreta:
      "Sem permissão, nada do resto aparece. Depois vem o caminho (menu), então as colunas (grade) e por último o recorte (filtro) — do direito de acesso ao ajuste fino.",
    explicacaoErro:
      "Começar pela grade ou pelo filtro leva a configurar uma tela que a equipe ainda não consegue abrir, e o trabalho parece não ter efeito.",
    fonte: f(242, "Como configurar Menus do sistema"),
    dificuldade: 2,
    tags: ["menus", "grade", "filtros"],
  },
  {
    id: "nav-menus-q4",
    moduloId: "navegando",
    licaoId: "nav-menus",
    tipo: "verdadeiro-falso",
    enunciado: "Avalie a afirmação sobre conceitos básicos de cadastros.",
    afirmacao:
      "Parceiro é um cadastro único que pode acumular os papéis de cliente, fornecedor e transportadora ao mesmo tempo.",
    resposta: true,
    explicacaoCorreta:
      "O Sankhya usa um cadastro de Parceiro com marcações de papel. A mesma empresa pode ser cliente e fornecedor sem duplicar o registro, o que mantém CNPJ e endereço em um só lugar.",
    explicacaoErro:
      "Criar um cadastro por papel duplica CNPJ e fragmenta o histórico: a mesma empresa passa a ter dois saldos, dois endereços para manter e nenhuma visão consolidada.",
    fonte: f(243, "Conceitos básicos de alguns cadastros"),
    dificuldade: 2,
    tags: ["parceiro", "cadastro"],
  },

  /* ------------------------------------------------------- PROVA --------- */
  {
    id: "nav-prova-q1",
    moduloId: "navegando",
    licaoId: "nav-prova",
    tipo: "multipla-escolha",
    contexto:
      "Um usuário diz que a tela de Produtos 'não tem' a coluna de estoque mínimo.",
    enunciado: "Qual é a primeira verificação?",
    explicacaoCorreta:
      "Conferir a configuração da grade: a coluna provavelmente existe mas está oculta no layout daquele usuário. Grades são personalizáveis por pessoa.",
    fonte: f(240, "Configurações para otimização da grade"),
    dificuldade: 2,
    tags: ["grade", "diagnóstico"],
    alternativas: [
      { id: "a", texto: "A configuração da grade daquele usuário", correta: true },
      {
        id: "b",
        texto: "Se o campo existe no banco de dados",
        correta: false,
        explicacaoErro:
          "Estoque mínimo é campo padrão do cadastro de produtos. Ir ao banco antes de olhar o layout é começar pelo caminho mais longo.",
      },
      {
        id: "c",
        texto: "Se o usuário tem permissão para a tela",
        correta: false,
        explicacaoErro:
          "Ele já está na tela e vendo os registros, então a permissão de acesso está evidentemente concedida.",
      },
      {
        id: "d",
        texto: "Se há filtro ativo escondendo registros",
        correta: false,
        explicacaoErro:
          "Filtro esconde linhas, não colunas. A queixa é sobre um campo ausente, o que aponta para a grade.",
      },
    ],
  },
  {
    id: "nav-prova-q2",
    moduloId: "navegando",
    licaoId: "nav-prova",
    tipo: "associar-colunas",
    enunciado: "Associe cada ajuste ao seu escopo de efeito.",
    pares: [
      {
        id: "p1",
        esquerda: "Personalização de grade",
        direita: "Só o usuário que fez",
        explicacaoErro:
          "Grade é preferência individual: cada pessoa monta a sua sem afetar as demais.",
      },
      {
        id: "p2",
        esquerda: "Permissão de tela",
        direita: "O grupo de usuários",
        explicacaoErro:
          "Permissão é concedida a grupo (ou usuário), e é o único mecanismo que realmente bloqueia acesso.",
      },
      {
        id: "p3",
        esquerda: "Configuração de menu",
        direita: "Quem usa aquele menu",
        explicacaoErro:
          "Menu organiza o caminho para o público daquele menu. Não concede nem retira direito.",
      },
      {
        id: "p4",
        esquerda: "Parâmetro do sistema",
        direita: "A instalação inteira",
        explicacaoErro:
          "Parâmetro é o escopo mais amplo de todos: alterou, valeu para todos os usuários e empresas.",
      },
    ],
    explicacaoCorreta:
      "Do individual ao global: grade (usuário), permissão e menu (grupo), parâmetro (instalação). Saber o escopo antes de mexer é o que evita resolver um caso e afetar a empresa toda.",
    explicacaoErro:
      "Confundir escopo é o erro estrutural mais comum: o ajuste que deveria ser pessoal acaba feito em parâmetro, e o efeito colateral aparece dias depois em outra área.",
    fonte: f(236, "Personalizando o sistema"),
    dificuldade: 3,
    tags: ["escopo", "personalização", "permissões"],
  },
  {
    id: "nav-prova-q3",
    moduloId: "navegando",
    licaoId: "nav-prova",
    tipo: "resposta-curta",
    enunciado:
      "Qual é o nome do cadastro que representa clientes, fornecedores e transportadoras em um único registro?",
    respostasAceitas: ["parceiro", "parceiros", "cadastro de parceiros"],
    respostaCanonica: "Parceiro",
    dica: "Um único registro acumula papéis por marcação.",
    explicacaoCorreta:
      "Parceiro é o cadastro unificado de pessoas e empresas com quem a organização se relaciona. Os papéis são marcações no mesmo registro, não cadastros separados.",
    explicacaoErro:
      "Cliente, fornecedor e transportadora são papéis, não cadastros distintos. O registro que os comporta é o Parceiro.",
    fonte: f(243, "Conceitos básicos de alguns cadastros"),
    dificuldade: 1,
    tags: ["parceiro"],
  },
];
