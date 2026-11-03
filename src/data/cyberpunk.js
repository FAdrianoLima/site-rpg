export const ATRIBUTOS_CYBERPUNK = [
  { id: "STR", nome: "Força" },
  { id: "DEX", nome: "Destreza" },
  { id: "REF", nome: "Reflexos" },
  { id: "CON", nome: "Constituição" },
  { id: "INT", nome: "Inteligência" },
  { id: "WIS", nome: "Sabedoria" },
  { id: "CHA", nome: "Carisma" },
  { id: "PER", nome: "Percepção" },
  { id: "RES", nome: "Resistência" },
  { id: "WIL", nome: "Vontade" },
];

export const REGIOES_PV_CYBERPUNK = [
  { id: "cabeca", nome: "Cabeça", multiplicador: 0.3 },
  { id: "peito", nome: "Peito", multiplicador: 0.7 },
  { id: "abdomen", nome: "Abdômen", multiplicador: 0.6 },
  { id: "bracoDireito", nome: "Braço direito", multiplicador: 0.3 },
  { id: "bracoEsquerdo", nome: "Braço esquerdo", multiplicador: 0.3 },
  { id: "pernaDireita", nome: "Perna direita", multiplicador: 0.4 },
  { id: "pernaEsquerda", nome: "Perna esquerda", multiplicador: 0.4 },
];

// Fórmulas:
// - Um atributo: utiliza seu valor total.
// - Dois atributos: calcula a média.
// - Fórmula com SUM: soma os atributos sem dividir.
// - Cada fórmula pode possuir alternativas.

export const PERICIAS_CYBERPUNK = [
  {
    categoria: "Físicas",
    pericias: [
      ["atletismo", "Atletismo", [["STR"]]],
      ["contorcionismo", "Contorcionismo", [["DEX"]]],
      ["danca", "Dança", [["DEX", "CHA"]]],
      ["furtividade", "Furtividade", [["DEX", "INT"]]],
      ["evasao", "Evasão", [["REF"]]],
      ["prestidigitacao", "Prestidigitação", [["DEX"]]],
      ["escalada", "Escalada", [["STR", "DEX"]]],
      ["natacao", "Natação", [["STR", "CON"]]],
    ],
  },

  {
    categoria: "Percepção",
    pericias: [
      ["percepcaoVisual", "Percepção visual", [["PER"]]],
      ["percepcaoAuditiva", "Percepção auditiva", [["PER"]]],
      ["percepcaoOlfativa", "Percepção olfativa", [["PER", "INT"]]],
      ["percepcaoGustativa", "Percepção gustativa", [["PER", "WIS"]]],
      ["percepcaoTatil", "Percepção tátil", [["PER"]]],
      ["percepcaoCinestesica", "Percepção cinestésica", [["DEX", "REF"]]],
      ["percepcaoTermica", "Percepção térmica", [["PER", "RES"]]],
      ["percepcaoDor", "Percepção de dor", [["PER", "CON"]]],
      ["percepcaoTempo", "Percepção do tempo", [["WIS", "INT"]]],
    ],
  },

  {
    categoria: "Sociais",
    pericias: [
      [
        "persuasao",
        "Persuasão",
        [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      ],
      ["enganacao", "Enganação", [["CHA", "INT"]]],
      ["manipulacao", "Manipulação", [["CHA", "INT"]]],
      [
        "intimidacaoVerbal",
        "Intimidação verbal",
        [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      ],
      [
        "intimidacaoFisica",
        "Intimidação física",
        [
          ["STR", "CON"],
          ["CHA", "STR"],
        ],
      ],
      [
        "diplomacia",
        "Diplomacia",
        [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      ],
      ["atuacao", "Atuação", [["CHA"]]],
      [
        "lideranca",
        "Liderança",
        [
          ["CHA", "WIS"],
          ["CHA", "INT"],
        ],
      ],
      ["empatia", "Empatia", [["WIS", "PER"]]],
      ["interrogar", "Interrogar", [["INT"]]],
      ["intuicao", "Intuição", [["WIS", "PER"]]],
      ["etiqueta", "Etiqueta", [["INT", "CHA"]]],
      ["seducao", "Sedução", [["CHA", "INT"]]],
    ],
  },

  {
    categoria: "Conhecimento",
    pericias: [
      ...[
        "Tecnologia Básica",
        "Cibernética",
        "Eletrônica",
        "Demolição",
        "Armaria",
        "Mecatrônica",
        "Tecnologia de Veículos Terrestres",
        "Tecnologia de Veículos Aquáticos",
        "Tecnologia de Veículos Aéreos",
        "Medicina",
        "Investigação",
        "Natureza",
        "Religião",
        "História",
        "Linguística",
        "Engenharia",
        "Astronomia",
        "Geografia",
      ].map((nome) => [
        nome
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_|_$/g, ""),
        nome,
        [["INT"]],
      ]),
    ],
  },

  {
    categoria: "Conhecimentos Gerais",
    pericias: [
      ["adestrarAnimais", "Adestrar animais", [["INT", "WIS", "SUM"]]],
      ["sobrevivencia", "Sobrevivência", [["WIS", "PER", "SUM"]]],
      ["rastrear", "Rastrear", [["INT", "PER", "SUM"]]],
      ["primeirosSocorros", "Primeiros socorros", [["INT", "WIS", "SUM"]]],
      ["navegacao", "Navegação", [["INT", "PER"]]],
      ["equitacao", "Equitação", [["DEX", "INT"]]],
      ["veiculoTerrestre", "Conduzir veículo terrestre", [["DEX", "INT"]]],
      ["veiculoAquatico", "Conduzir veículo aquático", [["DEX", "INT"]]],
      ["veiculoAereo", "Conduzir veículo aéreo", [["DEX", "INT"]]],
    ],
  },

  {
    categoria: "Resistências Mentais",
    pericias: [
      [
        "torturaPsicologica",
        "Resistir à tortura psicológica",
        [["WIL", "WIS"]],
      ],
      ["resistirIntimidacao", "Resistir à intimidação", [["WIL", "CHA"]]],
      ["resistirMedo", "Resistir ao medo", [["WIL", "WIS"]]],
    ],
  },

  {
    categoria: "Resistências Físicas",
    pericias: [
      ["postura", "Postura", [["RES", "CON"]]],
      ["torturaFisica", "Resistir à tortura física", [["RES", "CON"]]],
      ["resistirSubstancia", "Resistir a substância", [["RES", "CON"]]],
      ["resistirFrio", "Resistir ao frio", [["RES", "CON"]]],
      ["resistirCalor", "Resistir ao calor", [["RES", "CON"]]],
    ],
  },
];

export const LISTA_PERICIAS_CYBERPUNK = PERICIAS_CYBERPUNK.flatMap((grupo) =>
  grupo.pericias.map(([id, nome]) => ({
    id,
    nome,
    categoria: grupo.categoria,
  })),
);

export function criarDadosIniciaisCyberpunk() {
  const atributosCyberpunk = {};

  ATRIBUTOS_CYBERPUNK.forEach(({ id }) => {
    atributosCyberpunk[id] = {
      valor: 0,
      modificador: 0,
      multiplicador: 1,
    };
  });

  const pvRegioesCyberpunkAtuais = {};

  REGIOES_PV_CYBERPUNK.forEach(({ id }) => {
    pvRegioesCyberpunkAtuais[id] = 0;
  });

  return {
    identidadeCyberpunk: {
      nome: "",
      idade: "",
      altura: "",
      peso: "",
      cultura: "",
    },

    atributosCyberpunk,

    // Mantido para compatibilidade com fichas antigas.
    // O valor exibido será sempre calculado pela Constituição.
    pvMaximoCyberpunk: 0,
    pvAtualCyberpunk: 0,
    pvRegioesCyberpunkAtuais,

    stressCyberpunk: {
      atual: 0,
      maximo: 100,
    },

    sanidadeCyberpunk: {
      atual: 100,
      maximo: 100,
    },

    ajustesPericiasCyberpunk: {},
    formulasCyberpunk: {},
    habilidadesCyberpunk: [],
    cyberwareCyberpunk: [],
  };
}

export function calcularBonusCyberpunk(dados, tipo, alvo) {
  return (dados.habilidadesCyberpunk || []).reduce((total, habilidade) => {
    const bonus = habilidade.bonus || [];

    const soma = bonus
      .filter((item) => item.tipo === tipo && item.alvo === alvo)
      .reduce((subtotal, item) => subtotal + (Number(item.valor) || 0), 0);

    return total + soma;
  }, 0);
}

export function calcularAtributoCyberpunk(dados, atributoId) {
  const atributo = dados.atributosCyberpunk?.[atributoId] || {};

  const valor = Number(atributo.valor) || 0;
  const modificador = Number(atributo.modificador) || 0;
  const multiplicador = Number(atributo.multiplicador ?? 1);

  return (
    (valor + modificador) * multiplicador +
    calcularBonusCyberpunk(dados, "atributo", atributoId)
  );
}

// PV máximo = valor total de Constituição.
// Não considera tamanho do personagem.
export function calcularPVMaximoCyberpunk(dados) {
  return Math.max(0, calcularAtributoCyberpunk(dados, "CON"));
}

// Calcula o PV máximo de uma região.
export function calcularPVRegiaoCyberpunk(dados, regiaoId) {
  const regiao = REGIOES_PV_CYBERPUNK.find((item) => item.id === regiaoId);

  if (!regiao) return 0;

  // Utiliza o PV máximo já calculado pela ficha
  const pvMaximo = calcularPVMaximoCyberpunk(dados);

  // Aplica o multiplicador específico da região
  return Math.max(0, pvMaximo * regiao.multiplicador);
}

export function calcularPericiaCyberpunk(dados, periciaId) {
  const grupo = PERICIAS_CYBERPUNK.find((item) =>
    item.pericias.some(([id]) => id === periciaId),
  );

  if (!grupo) return 0;

  const item = grupo.pericias.find(([id]) => id === periciaId);

  if (!item) return 0;

  const formulas = item[2];

  if (!formulas?.length) return 0;

  // Compatibilidade com fichas antigas que usavam "equitação".
  const chaveAntiga = periciaId === "equitacao" ? "equitação" : periciaId;

  const indiceSalvo = Number(
    dados.formulasCyberpunk?.[periciaId] ??
      dados.formulasCyberpunk?.[chaveAntiga] ??
      0,
  );

  const indice = Math.max(
    0,
    Math.min(
      Number.isFinite(indiceSalvo) ? indiceSalvo : 0,
      formulas.length - 1,
    ),
  );

  const formula = formulas[indice];

  const soma = formula.includes("SUM");

  const atributos = formula.filter((id) => id !== "SUM");

  const valores = atributos.map((id) => calcularAtributoCyberpunk(dados, id));

  const total = valores.reduce((subtotal, valor) => subtotal + valor, 0);

  const base = soma || valores.length <= 1 ? total : total / valores.length;

  const ajuste =
    Number(
      dados.ajustesPericiasCyberpunk?.[periciaId] ??
        dados.ajustesPericiasCyberpunk?.[chaveAntiga],
    ) || 0;

  const bonus = calcularBonusCyberpunk(dados, "pericia", periciaId);

  return Math.round(base) + ajuste + bonus;
}

// PE = média entre Constituição e Resistência + bônus de habilidades.
export function calcularPECyberpunk(dados) {
  const con = calcularAtributoCyberpunk(dados, "CON");
  const res = calcularAtributoCyberpunk(dados, "RES");

  return (
    Math.round((con + res) / 2) + calcularBonusCyberpunk(dados, "recurso", "PE")
  );
}
