export const ATRIBUTOS_NODIE = [
  { id: "STR", nome: "Força" },
  { id: "DEX", nome: "Destreza" },
  { id: "REF", nome: "Reflexos" },
  { id: "CON", nome: "Constituição" },
  { id: "INT", nome: "Inteligência" },
  { id: "WIS", nome: "Sabedoria" },
  { id: "CHA", nome: "Carisma" },
  { id: "PER", nome: "Percepção" },
  { id: "RES", nome: "Resistência" },
  { id: "WILL", nome: "Vontade" },
];

export const REGIOES_PV = [
  { id: "cabeca", nome: "Cabeça", multiplicador: 0.3 },
  { id: "peito", nome: "Peito", multiplicador: 0.7 },
  { id: "abdomen", nome: "Abdômen", multiplicador: 0.7 },
  { id: "bracoDireito", nome: "Braço direito", multiplicador: 0.3 },
  { id: "bracoEsquerdo", nome: "Braço esquerdo", multiplicador: 0.3 },
  { id: "pernaDireita", nome: "Perna direita", multiplicador: 0.4 },
  { id: "pernaEsquerda", nome: "Perna esquerda", multiplicador: 0.4 },
];

// Cada fórmula pode usar um atributo ou a média de dois.
// Em fórmulas alternativas, o jogador poderá escolher a opção.
export const PERICIAS_NODIE = [
  {
    grupo: "Físicas",
    itens: [
      { id: "atletismo", nome: "Atletismo", formulas: [["STR"]] },
      { id: "contorcionismo", nome: "Contorcionismo", formulas: [["DEX"]] },
      { id: "danca", nome: "Dança", formulas: [["DEX", "CHA"]] },
      {
        id: "resistirTorturaFisica",
        nome: "Resistir à tortura física",
        formulas: [["RES", "CON"]],
      },
      {
        id: "resistirSubstancias",
        nome: "Resistir a substâncias",
        formulas: [["RES", "CON"]],
      },
      {
        id: "resistirFrio",
        nome: "Resistir ao frio",
        formulas: [["RES", "CON"]],
      },
      {
        id: "resistirCalor",
        nome: "Resistir ao calor",
        formulas: [["RES", "CON"]],
      },
      { id: "furtividade", nome: "Furtividade", formulas: [["DEX", "INT"]] },
      { id: "evasao", nome: "Evasão", formulas: [["REF"]] },
      { id: "brigar", nome: "Brigar", formulas: [["DEX"]] },
      { id: "prestidigitacao", nome: "Prestidigitação", formulas: [["DEX"]] },
    ],
  },
  {
    grupo: "Percepção",
    itens: [
      { id: "percepcaoVisual", nome: "Percepção visual", formulas: [["PER"]] },
      {
        id: "percepcaoAuditiva",
        nome: "Percepção auditiva",
        formulas: [["PER"]],
      },
      {
        id: "percepcaoOlfativa",
        nome: "Percepção olfativa",
        formulas: [["PER", "INT"]],
      },
      {
        id: "percepcaoGustativa",
        nome: "Percepção gustativa",
        formulas: [["PER", "WIS"]],
      },
      { id: "percepcaoTatil", nome: "Percepção tátil", formulas: [["PER"]] },
      {
        id: "percepcaoCinestesica",
        nome: "Percepção cinestésica",
        formulas: [["DEX", "REF"]],
      },
      {
        id: "percepcaoTermica",
        nome: "Percepção térmica",
        formulas: [["PER", "RES"]],
      },
      {
        id: "percepcaoDor",
        nome: "Percepção de dor",
        formulas: [["PER", "CON"]],
      },
      {
        id: "percepcaoTempo",
        nome: "Percepção do tempo",
        formulas: [["WIS", "INT"]],
      },
    ],
  },
  {
    grupo: "Sociais",
    itens: [
      {
        id: "persuasao",
        nome: "Persuasão",
        formulas: [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      },
      { id: "enganacao", nome: "Enganação", formulas: [["CHA", "INT"]] },
      { id: "manipulacao", nome: "Manipulação", formulas: [["CHA", "INT"]] },
      {
        id: "intimidacaoVerbal",
        nome: "Intimidação verbal",
        formulas: [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      },
      {
        id: "intimidacaoFisica",
        nome: "Intimidação física",
        formulas: [["STR", "CON"], ["CHA"]],
      },
      {
        id: "diplomacia",
        nome: "Diplomacia",
        formulas: [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      },
      { id: "atuacao", nome: "Atuação", formulas: [["CHA"]] },
      {
        id: "lideranca",
        nome: "Liderança",
        formulas: [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      },
      { id: "empatia", nome: "Empatia", formulas: [["WIS", "PER"]] },
      { id: "interrogar", nome: "Interrogar", formulas: [["INT"]] },
      { id: "intuicao", nome: "Intuição", formulas: [["WIS", "PER"]] },
    ],
  },
  {
    grupo: "Acadêmicas",
    itens: [
      { id: "arcanismo", nome: "Arcanismo", formulas: [["INT"], ["WIS"]] },
      { id: "medicina", nome: "Medicina", formulas: [["INT"]] },
      { id: "investigacao", nome: "Investigação", formulas: [["INT"]] },
      { id: "natureza", nome: "Natureza", formulas: [["INT"]] },
      { id: "religiao", nome: "Religião", formulas: [["INT"]] },
      { id: "historia", nome: "História", formulas: [["INT"]] },
      { id: "linguistica", nome: "Linguística", formulas: [["INT"]] },
      { id: "engenharia", nome: "Engenharia", formulas: [["INT"]] },
      { id: "alquimia", nome: "Alquimia", formulas: [["INT"]] },
      { id: "astronomia", nome: "Astronomia", formulas: [["INT"]] },
      { id: "geografia", nome: "Geografia", formulas: [["INT"]] },
    ],
  },
  {
    grupo: "Gerais",
    itens: [
      {
        id: "adestrarAnimais",
        nome: "Adestrar animais",
        formulas: [["INT", "WIS"]],
      },
      {
        id: "sobrevivencia",
        nome: "Sobrevivência",
        formulas: [["WIS", "PER"]],
      },
      { id: "rastrear", nome: "Rastrear", formulas: [["INT", "PER"]] },
      {
        id: "primeirosSocorros",
        nome: "Primeiros socorros",
        formulas: [["INT", "WIS"]],
      },
      { id: "navegacao", nome: "Navegação", formulas: [["INT", "PER"]] },
      { id: "equitacao", nome: "Equitação", formulas: [["DEX", "INT"]] },
    ],
  },
  {
    grupo: "Resistências mentais",
    itens: [
      {
        id: "torturaPsicologica",
        nome: "Resistir à tortura psicológica",
        formulas: [["WILL", "WIS"]],
      },
      {
        id: "resistirIntimidacao",
        nome: "Resistir à intimidação",
        formulas: [["WILL", "CHA"]],
      },
      {
        id: "resistirMedo",
        nome: "Resistir ao medo",
        formulas: [["WILL", "WIS"]],
      },
      {
        id: "resistirEncantamentosMentais",
        nome: "Resistir a encantamentos mentais",
        formulas: [["WILL", "INT"]],
      },
    ],
  },
  {
    grupo: "Resistências físicas",
    itens: [
      { id: "postura", nome: "Postura", formulas: [["RES", "CON"]] },
      {
        id: "resistirTorturaFisica2",
        nome: "Resistir à tortura física",
        formulas: [["RES", "CON"]],
      },
      {
        id: "resistirSubstancias2",
        nome: "Resistir a substâncias",
        formulas: [["RES", "CON"]],
      },
      {
        id: "resistirFrio2",
        nome: "Resistir ao frio",
        formulas: [["RES", "CON"]],
      },
      {
        id: "resistirCalor2",
        nome: "Resistir ao calor",
        formulas: [["RES", "CON"]],
      },
    ],
  },
];

export const BONUS_EXEMPLO_NODIE = [
  {
    id: "cacador",
    nome: "Caçador",
    valor: 4,
    pericias: [
      "furtividade",
      "percepcaoVisual",
      "percepcaoAuditiva",
      "percepcaoOlfativa",
      "rastrear",
      "sobrevivencia",
    ],
  },
  {
    id: "remedioCaseiro",
    nome: "Remédio Caseiro",
    valor: 8,
    pericias: ["alquimia", "medicina", "natureza", "primeirosSocorros"],
  },
  {
    id: "escoteiro",
    nome: "Escoteiro",
    valor: 2,
    pericias: ["sobrevivencia", "primeirosSocorros"],
  },
  {
    id: "intrusoVitalia8",
    nome: "Intruso - Vitalia",
    valor: 8,
    pericias: ["adestrarAnimais", "natureza"],
  },
  {
    id: "intrusoVitalia4",
    nome: "Intruso - Vitalia",
    valor: 4,
    pericias: ["historia", "religiao"],
  },
];

export function calcularBasePericia(pericia, atributos, formulaIndex = 0) {
  const formula = pericia.formulas[formulaIndex] || pericia.formulas[0];

  const valores = formula.map((id) => Number(atributos?.[id] || 0));

  if (valores.length === 1) return valores[0];

  // Médias arredondadas para o inteiro mais próximo.
  return Math.round(
    valores.reduce((total, valor) => total + valor, 0) / valores.length,
  );
}

export function calcularBonusPericia(periciaId, bonus = []) {
  return bonus.reduce((total, item) => {
    if (!Array.isArray(item.pericias) || !item.pericias.includes(periciaId)) {
      return total;
    }

    return total + Number(item.valor || 0);
  }, 0);
}

export function calcularPericia(
  pericia,
  atributos,
  bonus = [],
  formulaIndex = 0,
) {
  const base = calcularBasePericia(pericia, atributos, formulaIndex);
  const bonusTotal = calcularBonusPericia(pericia.id, bonus);

  return {
    base,
    bonus: bonusTotal,
    total: base + bonusTotal,
    formula: pericia.formulas[formulaIndex] || pericia.formulas[0],
  };
}

export function calcularPVRegioes(con, pvAtuais = {}) {
  const total = Math.max(0, Number(con || 0));

  return REGIOES_PV.map((regiao) => ({
    ...regiao,
    pvMaximo: Math.round(total * regiao.multiplicador * 10) / 10,
    pvAtual:
      pvAtuais[regiao.id] === undefined
        ? Math.round(total * regiao.multiplicador * 10) / 10
        : Number(pvAtuais[regiao.id]),
  }));
}
