export const MODELOS_FICHAS = {
  noDie: {
    id: "noDie",
    codigo: "no-die",
    nome: "No Die",
    versao: "Sistema próprio",
    secoes: [
      {
        id: "identidade",
        titulo: "Identidade",
        campos: [
          { id: "nomePersonagem", label: "Nome do personagem" },
          { id: "raca", label: "Raça" },
          { id: "idade", label: "Idade", tipo: "number" },
          { id: "altura", label: "Altura" },
          { id: "peso", label: "Peso" },
          { id: "cultura", label: "Cultura" },
          { id: "conceito", label: "Conceito", tipo: "textarea" },
          { id: "aparencia", label: "Aparência", tipo: "textarea" },
          { id: "personalidade", label: "Personalidade", tipo: "textarea" },
          { id: "historia", label: "História", tipo: "textarea" },
          { id: "objetivos", label: "Objetivos", tipo: "textarea" },
        ],
      },
      {
        id: "atributos",
        titulo: "Atributos",
        campos: [
          { id: "STR", label: "Força (STR)", tipo: "number" },
          { id: "DEX", label: "Destreza (DEX)", tipo: "number" },
          { id: "REF", label: "Reflexos (REF)", tipo: "number" },
          { id: "CON", label: "Constituição (CON)", tipo: "number" },
          { id: "INT", label: "Inteligência (INT)", tipo: "number" },
          { id: "WIS", label: "Sabedoria (WIS)", tipo: "number" },
          { id: "CHA", label: "Carisma (CHA)", tipo: "number" },
          { id: "PER", label: "Percepção (PER)", tipo: "number" },
          { id: "RES", label: "Resistência (RES)", tipo: "number" },
          { id: "WILL", label: "Vontade (WILL)", tipo: "number" },
        ],
      },
      {
        id: "recursos",
        titulo: "Recursos e sobrevivência",
        campos: [
          { id: "pvAtual", label: "PV atuais", tipo: "number" },
          { id: "pvMaximo", label: "PV máximos", tipo: "number" },
          { id: "peAtual", label: "PE atuais", tipo: "number" },
          { id: "peMaximo", label: "PE máximos", tipo: "number" },
          { id: "manaAtual", label: "Mana atual", tipo: "number" },
          { id: "manaMaxima", label: "Mana máxima", tipo: "number" },
          { id: "estresseAtual", label: "Estresse atual", tipo: "number" },
          { id: "estresseMaximo", label: "Estresse máximo", tipo: "number" },
          { id: "sanidadeAtual", label: "Sanidade atual", tipo: "number" },
          { id: "sanidadeMaxima", label: "Sanidade máxima", tipo: "number" },
        ],
      },
      {
        id: "pericias",
        titulo: "Perícias e resistências",
        campos: [
          {
            id: "efeitosPericias",
            label: "Bônus e efeitos aplicados",
            tipo: "textarea",
            linhas: 8,
            ajuda:
              "Uma linha por efeito: Origem | tipo | alvos | valor. Ex.: Caçador | pericia | furtividade,percepcaoVisual | 4",
          },
        ],
      },
      {
        id: "combate",
        titulo: "Combate e equipamentos",
        campos: [
          { id: "defesa", label: "Defesa / proteção", tipo: "number" },
          { id: "deslocamento", label: "Deslocamento" },
          {
            id: "pvPorRegiao",
            label: "Observações de PV por região",
            tipo: "textarea",
            linhas: 4,
            ajuda:
              "Os PV máximos por região serão calculados a partir dos PV totais.",
          },
          {
            id: "armas",
            label: "Armas e conversão de dano",
            tipo: "textarea",
            linhas: 6,
          },
          { id: "armaduras", label: "Armaduras e proteções", tipo: "textarea" },
          {
            id: "inventario",
            label: "Inventário",
            tipo: "textarea",
            linhas: 6,
          },
          {
            id: "moedas",
            label: "Dinheiro e recursos materiais",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "poderes",
        titulo: "Magias, técnicas e habilidades",
        campos: [
          { id: "magias", label: "Magias", tipo: "textarea", linhas: 7 },
          {
            id: "habilidades",
            label: "Habilidades e talentos",
            tipo: "textarea",
            linhas: 6,
          },
          { id: "racial", label: "Características raciais", tipo: "textarea" },
          {
            id: "efeitosPermanentes",
            label: "Bônus e efeitos permanentes",
            tipo: "textarea",
          },
          {
            id: "efeitosTemporarios",
            label: "Bônus e efeitos temporários",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "anotacoes",
        titulo: "Observações e diário",
        campos: [
          {
            id: "condicoes",
            label: "Condições e efeitos ativos",
            tipo: "textarea",
          },
          {
            id: "observacoes",
            label: "Observações gerais",
            tipo: "textarea",
            linhas: 5,
          },
          {
            id: "anotacoes",
            label: "Anotações do jogador",
            tipo: "textarea",
            linhas: 7,
          },
          {
            id: "diario",
            label: "Diário de aventura",
            tipo: "textarea",
            linhas: 8,
          },
          {
            id: "relacionamentos",
            label: "Relações e personagens conhecidos",
            tipo: "textarea",
          },
          {
            id: "missoes",
            label: "Missões e objetivos pendentes",
            tipo: "textarea",
          },
        ],
      },
    ],
  },

  cyberpunk: {
    id: "cyberpunk",
    nome: "Cyberpunk",
    titulo: "Cyberpunk RPG",
    secoes: [],
  },
};

export function identificarModelo(sistema = {}) {
  const texto = [
    sistema.id,
    sistema.sistemaId,
    sistema.codigo,
    sistema.nome,
    sistema.titulo,
    sistema.versao,
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (texto.includes("cyberpunk") || texto.includes("cyber punk")) {
    return MODELOS_FICHAS.cyberpunk;
  }

  if (texto.includes("no die") || texto.includes("nodie")) {
    return MODELOS_FICHAS.noDie;
  }

  if (
    texto.includes("2024") ||
    texto.includes("5.5") ||
    texto.includes("revisada") ||
    texto.includes("revised")
  ) {
    return MODELOS_FICHAS.dnd5e2024;
  }

  if (
    texto.includes("d&d") ||
    texto.includes("dnd") ||
    texto.includes("dungeons") ||
    texto.includes("5e")
  ) {
    return MODELOS_FICHAS.dnd5e2014;
  }

  return null;
}

export function criarDadosIniciais(modelo) {
  const dados = {};

  for (const secao of modelo?.secoes || []) {
    for (const campo of secao.campos || []) {
      dados[campo.id] = campo.tipo === "number" ? 0 : "";
    }
  }

  return dados;
}
