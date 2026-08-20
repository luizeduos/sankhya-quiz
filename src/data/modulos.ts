import type { Licao, Modulo } from "./schema";

/**
 * Os 8 modulos do app, derivados das trilhas REAIS do EAD Sankhya
 * (ver src/data/ead/catalog.json). Cada modulo = uma trilha; cada licao
 * agrupa aulas consecutivas daquela trilha.
 *
 * O protótipo (artboard 1c) trazia modulos ficticios — "Faturamento e NF-e",
 * "BI e Consultas", "Integracoes/API". Trocamos os rotulos pela taxonomia
 * real, mantendo integralmente o tratamento visual: emoji em quadrado
 * colorido, percentual a direita, mini-trilha de 4 nos e linha de apoio.
 */

type LicaoSeed = Omit<Licao, "moduloId" | "ordem"> & { ordem?: number };

function build(
  modulo: Omit<Modulo, "licoes">,
  seeds: LicaoSeed[],
): Modulo {
  return {
    ...modulo,
    licoes: seeds.map((s, i) => ({
      ...s,
      moduloId: modulo.id,
      ordem: s.ordem ?? i + 1,
    })),
  };
}

export const modulos: Modulo[] = [
  build(
    {
      id: "navegando",
      titulo: "Navegando com Maestria",
      descricao: "Interface do Om, cadastros, filtros, grades e menus.",
      emoji: "🧭",
      tone: "blue",
      trilhaEad: "Navegando com Maestria",
      ordem: 1,
    },
    [
      {
        id: "nav-interface",
        titulo: "Interface e personalização",
        resumo: "Sankhya Om, tela inicial e como deixar o sistema do seu jeito.",
        tipo: "licao",
      },
      {
        id: "nav-cadastros",
        titulo: "Cadastros e filtros",
        resumo: "Manipular cadastros, montar filtros e otimizar formulários.",
        tipo: "licao",
      },
      {
        id: "nav-menus",
        titulo: "Grade, abas e menus",
        resumo: "Configurar a grade, navegar entre abas e organizar menus.",
        tipo: "licao",
      },
      {
        id: "nav-prova",
        titulo: "Prova da unidade",
        resumo: "Tudo o que a unidade cobriu, sem consulta.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "parametros",
      titulo: "Parâmetros e configurações",
      descricao: "Parâmetros, TOP, CFOP, natureza, usuários e acessos.",
      emoji: "⚙️",
      tone: "gold",
      trilhaEad: "Configurações técnicas",
      ordem: 2,
    },
    [
      {
        id: "par-parametros",
        titulo: "Parâmetros e preferências",
        resumo: "Conferência de parâmetros, preferências da empresa e numeração.",
        tipo: "licao",
      },
      {
        id: "par-top",
        titulo: "TOP, CFOP e natureza",
        resumo: "O Tipo de Operação e os cadastros fiscais que ele carrega.",
        tipo: "licao",
      },
      {
        id: "par-acessos",
        titulo: "Usuários, acessos e perfis",
        resumo: "Grupos de usuários, liberação de telas, perfis e centro de resultado.",
        tipo: "licao",
      },
      {
        id: "par-prova",
        titulo: "Prova da unidade",
        resumo: "Parametrização de ponta a ponta.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "compras",
      titulo: "Compras",
      descricao: "Orçamento, pedido, eventos de liberação, XML e devolução.",
      emoji: "🛒",
      tone: "orange",
      trilhaEad: "Jornada de Compras",
      ordem: 3,
    },
    [
      {
        id: "com-pedido",
        titulo: "Orçamento e pedido de compra",
        resumo: "Do orçamento ao pedido, e do pedido ao faturamento.",
        tipo: "licao",
      },
      {
        id: "com-liberacao",
        titulo: "Liberação e eventos",
        resumo: "Eventos 44 e 18, pendências e divergência entre pedido e nota.",
        tipo: "licao",
      },
      {
        id: "com-nota",
        titulo: "Nota de entrada e devolução",
        resumo: "Importação de XML, conferência, impostos e devoluções.",
        tipo: "licao",
      },
      {
        id: "com-prova",
        titulo: "Prova da unidade",
        resumo: "O ciclo de compras inteiro.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "vendas",
      titulo: "Vendas e NF-e",
      descricao: "Pedido, fluxo de aprovação, faturamento, NF-e e DANFE.",
      emoji: "🧾",
      tone: "blue",
      trilhaEad: "Jornada de Vendas",
      ordem: 4,
    },
    [
      {
        id: "ven-pedido",
        titulo: "Orçamento, pedido e faturamento",
        resumo: "Central de Vendas: do orçamento à confirmação da nota.",
        tipo: "licao",
      },
      {
        id: "ven-aprovacao",
        titulo: "Fluxo de aprovação e limites",
        resumo: "Limite de crédito, desconto máximo, prazo médio e eventos.",
        tipo: "licao",
      },
      {
        id: "ven-nfe",
        titulo: "NF-e, DANFE e ocorrências",
        resumo: "Emissão, rejeições da SEFAZ, CC-e, cancelamento e devolução.",
        tipo: "licao",
      },
      {
        id: "ven-prova",
        titulo: "Prova da unidade",
        resumo: "Do pedido à nota autorizada.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "recebimentos",
      titulo: "Recebimentos",
      descricao: "Contas a receber, boletos, baixa, juros e compensação.",
      emoji: "💳",
      tone: "green",
      trilhaEad: "Jornada de Recebimentos",
      ordem: 5,
    },
    [
      {
        id: "rec-titulos",
        titulo: "Contas a receber e provisões",
        resumo: "Provisão, título, rateio de receita e Agenda Financeira.",
        tipo: "licao",
      },
      {
        id: "rec-baixa",
        titulo: "Baixa, juros e estorno",
        resumo: "Baixa individual e em lote, juros e multa, estorno e compensação.",
        tipo: "licao",
      },
      {
        id: "rec-boletos",
        titulo: "Boletos, PIX e antecipação",
        resumo: "Boleto rápido híbrido, duplicatas, cheques e antecipação.",
        tipo: "licao",
      },
      {
        id: "rec-prova",
        titulo: "Prova da unidade",
        resumo: "Do título à baixa conciliada.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "estocagem",
      titulo: "Estocagem",
      descricao: "Entradas, saídas, reserva, requisições, contagem e Kardex.",
      emoji: "📦",
      tone: "green",
      trilhaEad: "Jornada de Estocagem",
      ordem: 6,
    },
    [
      {
        id: "est-movimento",
        titulo: "Entradas, saídas e reserva",
        resumo: "Como o estoque se move e quando a mercadoria fica reservada.",
        tipo: "licao",
      },
      {
        id: "est-controles",
        titulo: "Requisições, validade e grades",
        resumo: "Requisição interna, validade com saída prioritária, grades e locais.",
        tipo: "licao",
      },
      {
        id: "est-inventario",
        titulo: "Contagem, ajuste e Kardex",
        resumo: "Cópia, contagem, ajuste, coletor e inventário no Kardex.",
        tipo: "licao",
      },
      {
        id: "est-prova",
        titulo: "Prova da unidade",
        resumo: "Movimentação e inventário sem consulta.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "financeiro",
      titulo: "Financeiro",
      descricao: "Movimentação bancária, conciliação e fechamento de caixa.",
      emoji: "💰",
      tone: "coral",
      trilhaEad: "Jornada Financeira",
      ordem: 7,
    },
    [
      {
        id: "fin-bancos",
        titulo: "Movimentações bancárias",
        resumo: "Transferência entre contas, entre títulos, rendimentos e juros.",
        tipo: "licao",
      },
      {
        id: "fin-conciliacao",
        titulo: "Conciliação bancária",
        resumo: "Conciliação manual, por extrato e automática pela baixa.",
        tipo: "licao",
      },
      {
        id: "fin-caixa",
        titulo: "Fechamento e controle",
        resumo: "Fechamento de caixa e controle das contas da empresa.",
        tipo: "licao",
      },
      {
        id: "fin-prova",
        titulo: "Prova da unidade",
        resumo: "Do extrato ao caixa fechado.",
        tipo: "prova",
      },
    ],
  ),

  build(
    {
      id: "precificacao",
      titulo: "Precificação",
      descricao: "Fórmulas de custo, apuração, tabelas de preço e análise.",
      emoji: "📊",
      tone: "violet",
      trilhaEad: "Jornada de Precificação",
      ordem: 8,
    },
    [
      {
        id: "pre-custo",
        titulo: "Fórmulas e apuração de custo",
        resumo: "Custo geral e específico, reposição, contábil e gerencial.",
        tipo: "licao",
      },
      {
        id: "pre-tabelas",
        titulo: "Tabelas de preço",
        resumo: "Preço por perfil, região, parceiro, empresa e negociação.",
        tipo: "licao",
      },
      {
        id: "pre-analise",
        titulo: "Atualização e análise",
        resumo: "Recálculo, atualização pela nota, variação e simulação de preço.",
        tipo: "licao",
      },
      {
        id: "pre-prova",
        titulo: "Prova da unidade",
        resumo: "Custo e preço de ponta a ponta.",
        tipo: "prova",
      },
    ],
  ),
];

/* ===========================================================================
 * Indices derivados — construidos uma vez, no carregamento do modulo.
 * ======================================================================== */
export const modulosPorId = new Map(modulos.map((m) => [m.id, m]));

export const licoes: Licao[] = modulos.flatMap((m) => m.licoes);
export const licoesPorId = new Map(licoes.map((l) => [l.id, l]));

/** Ordem linear de todas as licoes — define a trilha continua do app. */
export const ordemGlobal: string[] = licoes.map((l) => l.id);

export function moduloDaLicao(licaoId: string): Modulo | undefined {
  const l = licoesPorId.get(licaoId);
  return l ? modulosPorId.get(l.moduloId) : undefined;
}

export function proximaLicao(licaoId: string): Licao | undefined {
  const i = ordemGlobal.indexOf(licaoId);
  return i >= 0 ? licoesPorId.get(ordemGlobal[i + 1] ?? "") : undefined;
}
