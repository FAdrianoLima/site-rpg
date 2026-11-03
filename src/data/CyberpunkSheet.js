import React from "react";

import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  ATRIBUTOS_CYBERPUNK,
  REGIOES_PV_CYBERPUNK,
  PERICIAS_CYBERPUNK,
  LISTA_PERICIAS_CYBERPUNK,
  calcularAtributoCyberpunk,
  calcularPericiaCyberpunk,
  calcularPECyberpunk,
  calcularBonusCyberpunk,
  calcularPVMaximoCyberpunk,
  calcularPVRegiaoCyberpunk,
} from "./cyberpunk";

const CORES = {
  painel: "#15131D",
  borda: "rgba(196, 181, 253, 0.14)",
  texto: "#F5F3FF",
  secundario: "#A5A0B2",
  destaque: "#A78BFA",
};

function formatarFormula(formula) {
  const nomes = {
    STR: "Força",
    DEX: "Destreza",
    REF: "Reflexos",
    CON: "Constituição",
    INT: "Inteligência",
    WIS: "Sabedoria",
    CHA: "Carisma",
    PER: "Percepção",
    RES: "Resistência",
    WIL: "Vontade",
  };

  const atributos = formula
    .filter((id) => id !== "SUM")
    .map((id) => nomes[id] || id);

  if (atributos.length === 1) {
    return atributos[0];
  }

  const soma = formula.includes("SUM");

  return soma
    ? `${atributos.join(" + ")} (soma)`
    : `(${atributos.join(" + ")}) / 2`;
}

export default function CyberpunkSheet({
  dados = {},
  onChange,
  podeEditar = true,
  salvando = false,
}) {
  const identidade = dados.identidadeCyberpunk || {};
  const atributos = dados.atributosCyberpunk || {};
  const habilidades = dados.habilidadesCyberpunk || [];
  const cyberwares = dados.cyberwareCyberpunk || [];
  const ajustes = dados.ajustesPericiasCyberpunk || {};
  const formulas = dados.formulasCyberpunk || {};
  const pvRegioes = dados.pvRegioesCyberpunkAtuais || {};

  // Utiliza atualização funcional para evitar sobrescrever alterações.
  const atualizar = (campo, valor) => {
    onChange((anterior) => {
      const atual = anterior || {};

      const novoValor =
        typeof valor === "function" ? valor(atual[campo]) : valor;

      return {
        ...atual,
        [campo]: novoValor,
      };
    });
  };

  const atualizarInterno = (campo, propriedade, valor) => {
    atualizar(campo, (anterior) => ({
      ...(anterior || {}),
      [propriedade]: valor,
    }));
  };

  const atualizarIdentidade = (campo, valor) => {
    atualizarInterno("identidadeCyberpunk", campo, valor);
  };

  const atualizarAtributo = (id, campo, valor) => {
    atualizar("atributosCyberpunk", (anterior) => {
      const atual = anterior || {};

      return {
        ...atual,
        [id]: {
          valor: 0,
          modificador: 0,
          multiplicador: 1,
          ...(atual[id] || {}),
          [campo]: Number(valor),
        },
      };
    });
  };

  const atualizarRecurso = (campo, propriedade, valor) => {
    atualizarInterno(campo, propriedade, Number(valor));
  };

  const adicionarHabilidade = () => {
    atualizar("habilidadesCyberpunk", (anterior) => [
      ...(anterior || []),
      {
        id: `${Date.now()}-${Math.random()}`,
        nome: "",
        nivel: 1,
        efeito: "",
        bonus: [],
      },
    ]);
  };

  const editarHabilidade = (index, campo, valor) => {
    atualizar("habilidadesCyberpunk", (anterior) => {
      const lista = [...(anterior || [])];

      lista[index] = {
        ...lista[index],
        [campo]: valor,
      };

      return lista;
    });
  };

  const removerHabilidade = (index) => {
    atualizar("habilidadesCyberpunk", (anterior) =>
      (anterior || []).filter((_, i) => i !== index),
    );
  };

  const adicionarBonus = (index) => {
    atualizar("habilidadesCyberpunk", (anterior) => {
      const lista = [...(anterior || [])];

      lista[index] = {
        ...lista[index],
        bonus: [
          ...(lista[index].bonus || []),
          {
            tipo: "pericia",
            alvo: "",
            valor: 1,
          },
        ],
      };

      return lista;
    });
  };

  const editarBonus = (habilidadeIndex, bonusIndex, campo, valor) => {
    atualizar("habilidadesCyberpunk", (anterior) => {
      const lista = [...(anterior || [])];

      const bonus = [...(lista[habilidadeIndex].bonus || [])];

      bonus[bonusIndex] = {
        ...bonus[bonusIndex],
        [campo]: valor,
      };

      if (campo === "tipo") {
        bonus[bonusIndex].alvo = "";
      }

      lista[habilidadeIndex] = {
        ...lista[habilidadeIndex],
        bonus,
      };

      return lista;
    });
  };

  const removerBonus = (habilidadeIndex, bonusIndex) => {
    atualizar("habilidadesCyberpunk", (anterior) => {
      const lista = [...(anterior || [])];

      lista[habilidadeIndex] = {
        ...lista[habilidadeIndex],
        bonus: (lista[habilidadeIndex].bonus || []).filter(
          (_, index) => index !== bonusIndex,
        ),
      };

      return lista;
    });
  };

  const adicionarCyberware = () => {
    atualizar("cyberwareCyberpunk", (anterior) => [
      ...(anterior || []),
      {
        id: `${Date.now()}-${Math.random()}`,
        nome: "",
        efeitos: "",
      },
    ]);
  };

  const editarCyberware = (index, campo, valor) => {
    atualizar("cyberwareCyberpunk", (anterior) => {
      const lista = [...(anterior || [])];

      lista[index] = {
        ...lista[index],
        [campo]: valor,
      };

      return lista;
    });
  };

  const removerCyberware = (index) => {
    atualizar("cyberwareCyberpunk", (anterior) =>
      (anterior || []).filter((_, i) => i !== index),
    );
  };

  const opcoesBonus = (tipo) => {
    if (tipo === "atributo") {
      return ATRIBUTOS_CYBERPUNK.map((item) => ({
        id: item.id,
        nome: item.nome,
      }));
    }

    if (tipo === "recurso") {
      return [
        {
          id: "PE",
          nome: "Pontos de Esforço (PE)",
        },
      ];
    }

    return LISTA_PERICIAS_CYBERPUNK.map((item) => ({
      id: item.id,
      nome: item.nome,
    }));
  };

  const campo = (label, value, onValueChange, props = {}) => {
    const { disabled: disabledExtra, ...rest } = props;

    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value ?? ""}
        onChange={(event) => onValueChange(event.target.value)}
        {...rest}
        disabled={!podeEditar || salvando || disabledExtra}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "#100E16",
            color: CORES.texto,
            "& fieldset": {
              borderColor: CORES.borda,
            },
            "&:hover fieldset": {
              borderColor: CORES.destaque,
            },
          },
          "& .MuiInputLabel-root": {
            color: CORES.secundario,
          },
          "& .MuiFormHelperText-root": {
            color: CORES.secundario,
          },
          ...rest.sx,
        }}
      />
    );
  };

  const secao = (titulo, children) => (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        bgcolor: CORES.painel,
        borderColor: CORES.borda,
        color: CORES.texto,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {titulo}
      </Typography>

      {children}
    </Paper>
  );

  const pvMaximo = calcularPVMaximoCyberpunk(dados);
  const peMaximo = calcularPECyberpunk(dados);

  const pvAtual = Number(dados.pvAtualCyberpunk ?? 0);

  return (
    <Box>
      {/* IDENTIDADE */}

      {secao(
        "Identidade",
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            {campo("Nome", identidade.nome, (v) =>
              atualizarIdentidade("nome", v),
            )}
          </Grid>

          <Grid item xs={6} md={2}>
            {campo("Idade", identidade.idade, (v) =>
              atualizarIdentidade("idade", v),
            )}
          </Grid>

          <Grid item xs={6} md={2}>
            {campo("Altura", identidade.altura, (v) =>
              atualizarIdentidade("altura", v),
            )}
          </Grid>

          <Grid item xs={6} md={3}>
            {campo("Peso", identidade.peso, (v) =>
              atualizarIdentidade("peso", v),
            )}
          </Grid>

          <Grid item xs={12}>
            {campo("Cultura", identidade.cultura, (v) =>
              atualizarIdentidade("cultura", v),
            )}
          </Grid>
        </Grid>,
      )}

      {/* ATRIBUTOS */}

      {secao(
        "Atributos",
        <>
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {["Atributo", "Valor", "Modificador", "Multiplicador", "Total"].map(
              (label) => (
                <Grid item xs={2.4} key={label}>
                  <Typography variant="caption" fontWeight={700}>
                    {label}
                  </Typography>
                </Grid>
              ),
            )}
          </Grid>

          {ATRIBUTOS_CYBERPUNK.map((atributo) => {
            const item = atributos[atributo.id] || {};

            const total = calcularAtributoCyberpunk(dados, atributo.id);

            return (
              <Grid
                container
                spacing={1}
                alignItems="center"
                key={atributo.id}
                sx={{ mb: 1 }}
              >
                <Grid item xs={2.4}>
                  <Typography fontWeight={600}>{atributo.nome}</Typography>
                </Grid>

                <Grid item xs={2.4}>
                  {campo(
                    "Valor",
                    item.valor ?? 0,
                    (v) => atualizarAtributo(atributo.id, "valor", v),
                    { type: "number" },
                  )}
                </Grid>

                <Grid item xs={2.4}>
                  {campo(
                    "Mod.",
                    item.modificador ?? 0,
                    (v) => atualizarAtributo(atributo.id, "modificador", v),
                    { type: "number" },
                  )}
                </Grid>

                <Grid item xs={2.4}>
                  {campo(
                    "Mult.",
                    item.multiplicador ?? 1,
                    (v) => atualizarAtributo(atributo.id, "multiplicador", v),
                    {
                      type: "number",
                      inputProps: { step: 0.1 },
                    },
                  )}
                </Grid>

                <Grid item xs={2.4}>
                  <Typography fontWeight={700}>
                    {Number(total.toFixed(2))}
                  </Typography>

                  {calcularBonusCyberpunk(dados, "atributo", atributo.id) !==
                    0 && (
                    <Typography variant="caption" color="success.main">
                      Inclui bônus de habilidades
                    </Typography>
                  )}
                </Grid>
              </Grid>
            );
          })}
        </>,
      )}

      {/* RECURSOS */}

      {secao(
        "Recursos",
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="PV máximo (calculado pela CON)"
              value={Number(pvMaximo.toFixed(2))}
              InputProps={{ readOnly: true }}
              helperText="Calculado automaticamente pelo valor total de Constituição."
            />
          </Grid>

          <Grid item xs={12} md={4}>
            {campo(
              "PV atual",
              pvAtual,
              (v) => atualizar("pvAtualCyberpunk", Number(v) || 0),
              {
                type: "number",
                inputProps: {
                  min: 0,
                  max: pvMaximo,
                  step: "any",
                },
              },
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="PE máximo calculado"
              value={peMaximo}
              InputProps={{ readOnly: true }}
              helperText="(CON + RES) / 2 + bônus de habilidades."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Estresse
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                {campo(
                  "Atual",
                  dados.stressCyberpunk?.atual ?? 0,
                  (v) => atualizarRecurso("stressCyberpunk", "atual", v),
                  { type: "number" },
                )}
              </Grid>

              <Grid item xs={6}>
                {campo(
                  "Máximo",
                  dados.stressCyberpunk?.maximo ?? 100,
                  (v) => atualizarRecurso("stressCyberpunk", "maximo", v),
                  { type: "number" },
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Sanidade
            </Typography>

            <Grid container spacing={1}>
              <Grid item xs={6}>
                {campo(
                  "Atual",
                  dados.sanidadeCyberpunk?.atual ?? 100,
                  (v) => atualizarRecurso("sanidadeCyberpunk", "atual", v),
                  { type: "number" },
                )}
              </Grid>

              <Grid item xs={6}>
                {campo(
                  "Máximo",
                  dados.sanidadeCyberpunk?.maximo ?? 100,
                  (v) => atualizarRecurso("sanidadeCyberpunk", "maximo", v),
                  { type: "number" },
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>,
      )}

      {/* PV POR REGIÃO */}

      {secao(
        "Pontos de vida por região",
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Os PV máximos de cada região são calculados automaticamente com base
            na Constituição e no multiplicador correspondente.
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            PV total utilizado no cálculo: <strong>{pvMaximo}</strong>
          </Typography>

          <Grid container spacing={2}>
            {REGIOES_PV_CYBERPUNK.map((regiao) => {
              const multiplicador = Number(regiao.multiplicador);
              const maximo = Number(pvMaximo) * multiplicador;
              const atual = Number(pvRegioes[regiao.id] ?? 0);

              return (
                <Grid item xs={6} md={3} key={regiao.id}>
                  <Typography fontWeight={600} sx={{ mb: 1 }}>
                    {regiao.nome}
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    label="PV máximo"
                    value={Number.isFinite(maximo) ? maximo.toFixed(1) : "Erro"}
                    InputProps={{ readOnly: true }}
                    sx={{ mb: 1 }}
                  />

                  {campo(
                    "PV atual",
                    atual,
                    (v) =>
                      atualizar("pvRegioesCyberpunkAtuais", (anterior) => ({
                        ...(anterior || {}),
                        [regiao.id]: Number(v) || 0,
                      })),
                    {
                      type: "number",
                      inputProps: {
                        min: 0,
                        max: maximo,
                        step: "any",
                      },
                    },
                  )}
                </Grid>
              );
            })}
          </Grid>
        </>,
      )}

      {/* PERÍCIAS */}

      {secao(
        "Perícias",
        <>
          {PERICIAS_CYBERPUNK.map((grupo) => (
            <Box key={grupo.categoria} sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                {grupo.categoria}
              </Typography>

              {grupo.pericias.map(([id, nome, alternativas]) => {
                const valor = calcularPericiaCyberpunk(dados, id);

                const indice = Math.max(
                  0,
                  Math.min(Number(formulas[id] ?? 0), alternativas.length - 1),
                );

                return (
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    key={id}
                    sx={{ mb: 1.5 }}
                  >
                    <Grid item xs={12} md={4}>
                      <Typography fontWeight={500}>{nome}</Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                      {alternativas.length > 1 ? (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Fórmula"
                          value={indice}
                          disabled={!podeEditar || salvando}
                          onChange={(e) =>
                            atualizar("formulasCyberpunk", (anterior) => ({
                              ...(anterior || {}),
                              [id]: Number(e.target.value),
                            }))
                          }
                        >
                          {alternativas.map((formula, index) => (
                            <MenuItem key={index} value={index}>
                              {formatarFormula(formula)}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {formatarFormula(alternativas[0])}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={6} md={2}>
                      {campo(
                        "Ajuste",
                        ajustes[id] ?? 0,
                        (v) =>
                          atualizar("ajustesPericiasCyberpunk", (anterior) => ({
                            ...(anterior || {}),
                            [id]: Number(v) || 0,
                          })),
                        { type: "number" },
                      )}
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <Typography fontWeight={700} textAlign="center">
                        Total: {valor}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}

              <Divider sx={{ mt: 2, borderColor: CORES.borda }} />
            </Box>
          ))}
        </>,
      )}

      {/* HABILIDADES */}

      {secao(
        "Habilidades",
        <>
          {habilidades.map((habilidade, index) => (
            <Paper
              key={habilidade.id || index}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                bgcolor: "#100E16",
                borderColor: CORES.borda,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  {campo("Nome da habilidade", habilidade.nome, (v) =>
                    editarHabilidade(index, "nome", v),
                  )}
                </Grid>

                <Grid item xs={12} md={2}>
                  {campo(
                    "Nível",
                    habilidade.nivel ?? 1,
                    (v) => editarHabilidade(index, "nivel", Number(v) || 0),
                    { type: "number" },
                  )}
                </Grid>

                <Grid item xs={12}>
                  {campo(
                    "Efeito / descrição",
                    habilidade.efeito,
                    (v) => editarHabilidade(index, "efeito", v),
                    {
                      multiline: true,
                      minRows: 2,
                    },
                  )}
                </Grid>
              </Grid>

              <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
                Bônus concedidos
              </Typography>

              {(habilidade.bonus || []).map((bonus, bonusIndex) => (
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  key={bonusIndex}
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={12} md={3}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Tipo"
                      value={bonus.tipo || "pericia"}
                      disabled={!podeEditar || salvando}
                      onChange={(e) =>
                        editarBonus(index, bonusIndex, "tipo", e.target.value)
                      }
                    >
                      <MenuItem value="atributo">Atributo</MenuItem>

                      <MenuItem value="pericia">Perícia</MenuItem>

                      <MenuItem value="recurso">Recurso</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Onde aplicar"
                      value={bonus.alvo || ""}
                      disabled={!podeEditar || salvando}
                      onChange={(e) =>
                        editarBonus(index, bonusIndex, "alvo", e.target.value)
                      }
                    >
                      {opcoesBonus(bonus.tipo).map((opcao) => (
                        <MenuItem key={opcao.id} value={opcao.id}>
                          {opcao.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={8} md={2}>
                    {campo(
                      "Valor",
                      bonus.valor,
                      (v) =>
                        editarBonus(index, bonusIndex, "valor", Number(v) || 0),
                      { type: "number" },
                    )}
                  </Grid>

                  <Grid item xs={4} md={1}>
                    <Button
                      color="error"
                      disabled={!podeEditar || salvando}
                      onClick={() => removerBonus(index, bonusIndex)}
                    >
                      Excluir
                    </Button>
                  </Grid>
                </Grid>
              ))}

              <Button
                size="small"
                disabled={!podeEditar || salvando}
                onClick={() => adicionarBonus(index)}
              >
                + Adicionar bônus
              </Button>

              <Button
                size="small"
                color="error"
                sx={{ ml: 1 }}
                disabled={!podeEditar || salvando}
                onClick={() => removerHabilidade(index)}
              >
                Excluir habilidade
              </Button>
            </Paper>
          ))}

          <Button
            variant="outlined"
            disabled={!podeEditar || salvando}
            onClick={adicionarHabilidade}
          >
            + Nova habilidade
          </Button>
        </>,
      )}

      {/* CYBERWARE */}

      {secao(
        "Cyberware",
        <>
          {cyberwares.map((item, index) => (
            <Grid container spacing={2} key={item.id || index} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                {campo("Nome", item.nome, (v) =>
                  editarCyberware(index, "nome", v),
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                {campo(
                  "Efeitos",
                  item.efeitos,
                  (v) => editarCyberware(index, "efeitos", v),
                  { multiline: true },
                )}
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  color="error"
                  disabled={!podeEditar || salvando}
                  onClick={() => removerCyberware(index)}
                >
                  Excluir
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button
            variant="outlined"
            disabled={!podeEditar || salvando}
            onClick={adicionarCyberware}
          >
            + Adicionar cyberware
          </Button>
        </>,
      )}
    </Box>
  );
}
