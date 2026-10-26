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

  dnd5e2014: {
    id: "dnd5e2014",
    nome: "D&D 5e",
    versao: "2014",
    secoes: [
      {
        id: "identidade",
        titulo: "Identidade e progressão",
        campos: [
          { id: "classe", label: "Classe e subclasse" },
          { id: "nivel", label: "Nível", tipo: "number" },
          { id: "raca", label: "Raça" },
          { id: "antecedente", label: "Antecedente" },
          { id: "alinhamento", label: "Tendência" },
          { id: "experiencia", label: "Pontos de experiência", tipo: "number" },
          { id: "inspiracao", label: "Inspiração", tipo: "text" },
          { id: "aparencia", label: "Aparência", tipo: "textarea" },
          {
            id: "historia",
            label: "História e personalidade",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "atributos",
        titulo: "Atributos e testes",
        campos: [
          { id: "FOR", label: "Força", tipo: "number" },
          { id: "DES", label: "Destreza", tipo: "number" },
          { id: "CON", label: "Constituição", tipo: "number" },
          { id: "INT", label: "Inteligência", tipo: "number" },
          { id: "SAB", label: "Sabedoria", tipo: "number" },
          { id: "CAR", label: "Carisma", tipo: "number" },
          {
            id: "bonusProficiencia",
            label: "Bônus de proficiência",
            tipo: "number",
          },
          {
            id: "testesResistencia",
            label: "Testes de resistência proficientes",
            tipo: "textarea",
          },
          {
            id: "pericias",
            label: "Perícias e proficiências",
            tipo: "textarea",
            linhas: 6,
          },
          {
            id: "sentidos",
            label: "Sentidos e percepção passiva",
            tipo: "textarea",
          },
          {
            id: "idiomas",
            label: "Idiomas e outras proficiências",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "combate",
        titulo: "Combate",
        campos: [
          { id: "pvAtual", label: "PV atuais", tipo: "number" },
          { id: "pvMaximo", label: "PV máximos", tipo: "number" },
          { id: "pvTemporarios", label: "PV temporários", tipo: "number" },
          { id: "dadosVida", label: "Dados de vida" },
          { id: "ca", label: "Classe de Armadura (CA)", tipo: "number" },
          { id: "iniciativa", label: "Iniciativa", tipo: "number" },
          { id: "deslocamento", label: "Deslocamento" },
          {
            id: "salvaguardasMorte",
            label: "Salvaguardas contra a morte",
            tipo: "textarea",
          },
          {
            id: "ataques",
            label: "Ataques e armas",
            tipo: "textarea",
            linhas: 7,
          },
        ],
      },
      {
        id: "magias",
        titulo: "Magias",
        campos: [
          { id: "atributoConjuracao", label: "Atributo de conjuração" },
          {
            id: "cdMagias",
            label: "CD para resistir às magias",
            tipo: "number",
          },
          {
            id: "ataqueMagico",
            label: "Bônus de ataque mágico",
            tipo: "number",
          },
          { id: "truques", label: "Truques", tipo: "textarea", linhas: 5 },
          {
            id: "magiasConhecidas",
            label: "Magias conhecidas/preparadas",
            tipo: "textarea",
            linhas: 8,
          },
          {
            id: "espacosMagia",
            label: "Espaços de magia por nível",
            tipo: "textarea",
            linhas: 5,
          },
          {
            id: "componentesMagia",
            label: "Componentes, foco e observações",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "caracteristicas",
        titulo: "Características e talentos",
        campos: [
          {
            id: "caracteristicasClasse",
            label: "Características de classe e subclasse",
            tipo: "textarea",
            linhas: 7,
          },
          {
            id: "tracosRaciais",
            label: "Traços raciais",
            tipo: "textarea",
            linhas: 5,
          },
          { id: "talentos", label: "Talentos", tipo: "textarea", linhas: 5 },
          {
            id: "vinculos",
            label: "Ideais, vínculos e defeitos",
            tipo: "textarea",
            linhas: 5,
          },
        ],
      },
      {
        id: "equipamento",
        titulo: "Equipamentos e tesouros",
        campos: [
          {
            id: "inventario",
            label: "Equipamento e inventário",
            tipo: "textarea",
            linhas: 7,
          },
          { id: "moedas", label: "Moedas e tesouros", tipo: "textarea" },
          {
            id: "itensMagicos",
            label: "Itens mágicos",
            tipo: "textarea",
            linhas: 5,
          },
        ],
      },
      {
        id: "anotacoes",
        titulo: "Observações e diário",
        campos: [
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
            id: "aliados",
            label: "Aliados, organizações e contatos",
            tipo: "textarea",
          },
          { id: "missoes", label: "Missões e objetivos", tipo: "textarea" },
        ],
      },
    ],
  },

  dnd5e2024: {
    id: "dnd5e2024",
    nome: "D&D 5e revisada",
    versao: "2024 / 5.5e",
    secoes: [
      {
        id: "identidade",
        titulo: "Identidade e progressão",
        campos: [
          { id: "classe", label: "Classe e subclasse" },
          { id: "nivel", label: "Nível", tipo: "number" },
          { id: "especie", label: "Espécie" },
          { id: "antecedente", label: "Antecedente" },
          { id: "origemTalento", label: "Talento de origem" },
          { id: "alinhamento", label: "Tendência (opcional)" },
          { id: "experiencia", label: "Pontos de experiência", tipo: "number" },
          { id: "aparencia", label: "Aparência", tipo: "textarea" },
          {
            id: "historia",
            label: "História e personalidade",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "atributos",
        titulo: "Atributos e proficiências",
        campos: [
          { id: "FOR", label: "Força", tipo: "number" },
          { id: "DES", label: "Destreza", tipo: "number" },
          { id: "CON", label: "Constituição", tipo: "number" },
          { id: "INT", label: "Inteligência", tipo: "number" },
          { id: "SAB", label: "Sabedoria", tipo: "number" },
          { id: "CAR", label: "Carisma", tipo: "number" },
          {
            id: "bonusProficiencia",
            label: "Bônus de proficiência",
            tipo: "number",
          },
          {
            id: "testesResistencia",
            label: "Testes de resistência proficientes",
            tipo: "textarea",
          },
          {
            id: "pericias",
            label: "Perícias e proficiências",
            tipo: "textarea",
            linhas: 6,
          },
          { id: "idiomas", label: "Idiomas e proficiências", tipo: "textarea" },
          {
            id: "sentidos",
            label: "Sentidos e percepção passiva",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "combate",
        titulo: "Combate e recuperação",
        campos: [
          { id: "pvAtual", label: "PV atuais", tipo: "number" },
          { id: "pvMaximo", label: "PV máximos", tipo: "number" },
          { id: "pvTemporarios", label: "PV temporários", tipo: "number" },
          { id: "dadosVida", label: "Dados de vida" },
          { id: "ca", label: "Classe de Armadura (CA)", tipo: "number" },
          { id: "iniciativa", label: "Iniciativa", tipo: "number" },
          { id: "deslocamento", label: "Deslocamento" },
          {
            id: "salvaguardasMorte",
            label: "Salvaguardas contra a morte",
            tipo: "textarea",
          },
          {
            id: "ataques",
            label: "Ataques e armas",
            tipo: "textarea",
            linhas: 7,
          },
          {
            id: "maestriaArmas",
            label: "Maestria com armas",
            tipo: "textarea",
            linhas: 4,
          },
        ],
      },
      {
        id: "magias",
        titulo: "Magias e conjuração",
        campos: [
          { id: "atributoConjuracao", label: "Atributo de conjuração" },
          {
            id: "cdMagias",
            label: "CD para resistir às magias",
            tipo: "number",
          },
          {
            id: "ataqueMagico",
            label: "Bônus de ataque mágico",
            tipo: "number",
          },
          { id: "truques", label: "Truques", tipo: "textarea", linhas: 5 },
          {
            id: "magiasConhecidas",
            label: "Magias preparadas/conhecidas",
            tipo: "textarea",
            linhas: 8,
          },
          {
            id: "espacosMagia",
            label: "Espaços de magia por nível",
            tipo: "textarea",
            linhas: 5,
          },
          {
            id: "recursosConjuracao",
            label: "Outros recursos de conjuração",
            tipo: "textarea",
          },
        ],
      },
      {
        id: "caracteristicas",
        titulo: "Características, talentos e recursos",
        campos: [
          {
            id: "caracteristicasClasse",
            label: "Características de classe e subclasse",
            tipo: "textarea",
            linhas: 7,
          },
          {
            id: "tracosEspecie",
            label: "Traços de espécie",
            tipo: "textarea",
            linhas: 5,
          },
          { id: "talentos", label: "Talentos", tipo: "textarea", linhas: 5 },
          {
            id: "recursosClasse",
            label: "Recursos de classe e usos",
            tipo: "textarea",
            linhas: 6,
          },
          {
            id: "vinculos",
            label: "Ideais, vínculos e defeitos",
            tipo: "textarea",
            linhas: 5,
          },
        ],
      },
      {
        id: "equipamento",
        titulo: "Equipamentos e tesouros",
        campos: [
          {
            id: "inventario",
            label: "Equipamento e inventário",
            tipo: "textarea",
            linhas: 7,
          },
          { id: "moedas", label: "Moedas e tesouros", tipo: "textarea" },
          {
            id: "itensMagicos",
            label: "Itens mágicos",
            tipo: "textarea",
            linhas: 5,
          },
        ],
      },
      {
        id: "anotacoes",
        titulo: "Observações e diário",
        campos: [
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
            id: "aliados",
            label: "Aliados, organizações e contatos",
            tipo: "textarea",
          },
          { id: "missoes", label: "Missões e objetivos", tipo: "textarea" },
        ],
      },
    ],
  },
};

export function identificarModelo(sistema = {}) {
  const texto = [sistema.id, sistema.nome, sistema.titulo, sistema.versao]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

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
    for (const campo of secao.campos) {
      dados[campo.id] = campo.tipo === "number" ? 0 : "";
    }
  }

  return dados;
}
