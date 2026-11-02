// src/data/CyberpunkSheet.js

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
} from "./cyberpunk";

export default function CyberpunkSheet({
  dados = {},
  onChange,
  podeEditar = true,
  salvando = false,
}) {
  const atualizar = (campo, valor) => {
    onChange({ ...dados, [campo]: valor });
  };

  const identidade = dados.identidadeCyberpunk || {};
  const atributos = dados.atributosCyberpunk || {};
  const habilidades = dados.habilidadesCyberpunk || [];
  const cyberwares = dados.cyberwareCyberpunk || [];
  const ajustes = dados.ajustesPericiasCyberpunk || {};
  const formulas = dados.formulasCyberpunk || {};
  const pvRegioes = dados.pvRegioesCyberpunkAtuais || {};

  const atualizarIdentidade = (campo, valor) => {
    atualizar("identidadeCyberpunk", { ...identidade, [campo]: valor });
  };

  const atualizarAtributo = (id, campo, valor) => {
    atualizar("atributosCyberpunk", {
      ...atributos,
      [id]: {
        valor: 0,
        modificador: 0,
        multiplicador: 1,
        ...atributos[id],
        [campo]: Number(valor),
      },
    });
  };

  const atualizarRecurso = (campo, propriedade, valor) => {
    const atual = dados[campo] || {};
    atualizar(campo, { ...atual, [propriedade]: Number(valor) });
  };

  const adicionarHabilidade = () => {
    atualizar("habilidadesCyberpunk", [
      ...habilidades,
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
    const novaLista = [...habilidades];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    atualizar("habilidadesCyberpunk", novaLista);
  };

  const adicionarBonus = (index) => {
    const novaLista = [...habilidades];
    novaLista[index] = {
      ...novaLista[index],
      bonus: [
        ...(novaLista[index].bonus || []),
        { tipo: "pericia", alvo: "", valor: 1 },
      ],
    };
    atualizar("habilidadesCyberpunk", novaLista);
  };

  const editarBonus = (habilidadeIndex, bonusIndex, campo, valor) => {
    const novaLista = [...habilidades];
    const bonus = [...(novaLista[habilidadeIndex].bonus || [])];
    bonus[bonusIndex] = { ...bonus[bonusIndex], [campo]: valor };

    if (campo === "tipo") bonus[bonusIndex].alvo = "";

    novaLista[habilidadeIndex] = {
      ...novaLista[habilidadeIndex],
      bonus,
    };

    atualizar("habilidadesCyberpunk", novaLista);
  };

  const removerBonus = (habilidadeIndex, bonusIndex) => {
    const novaLista = [...habilidades];
    novaLista[habilidadeIndex].bonus = novaLista[habilidadeIndex].bonus.filter(
      (_, index) => index !== bonusIndex,
    );
    atualizar("habilidadesCyberpunk", novaLista);
  };

  const adicionarCyberware = () => {
    atualizar("cyberwareCyberpunk", [
      ...cyberwares,
      { id: `${Date.now()}-${Math.random()}`, nome: "", efeitos: "" },
    ]);
  };

  const editarCyberware = (index, campo, valor) => {
    const novaLista = [...cyberwares];
    novaLista[index] = { ...novaLista[index], [campo]: valor };
    atualizar("cyberwareCyberpunk", novaLista);
  };

  const opcoesBonus = (tipo) => {
    if (tipo === "atributo") {
      return ATRIBUTOS_CYBERPUNK.map((item) => ({
        id: item.id,
        nome: item.nome,
      }));
    }

    if (tipo === "recurso") {
      return [{ id: "PE", nome: "Pontos de Esforço (PE)" }];
    }

    return LISTA_PERICIAS_CYBERPUNK.map((item) => ({
      id: item.id,
      nome: item.nome,
    }));
  };

  const campo = (label, value, onChange, props = {}) => (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      disabled={!podeEditar || salvando || props.disabled}
    />
  );
  const secao = (titulo, children) => (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {titulo}
      </Typography>
      {children}
    </Paper>
  );

  return (
    <Box>
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
                    { type: "number", inputProps: { step: 0.1 } },
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

      {secao(
        "Recursos",
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            {campo(
              "PV máximo",
              dados.pvMaximoCyberpunk ?? 0,
              (v) => atualizar("pvMaximoCyberpunk", Number(v)),
              { type: "number" },
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {campo(
              "PV atual",
              dados.pvAtualCyberpunk ?? 0,
              (v) => atualizar("pvAtualCyberpunk", Number(v)),
              { type: "number" },
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="PE máximo calculado"
              value={calcularPECyberpunk(dados)}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Stress
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

      {secao(
        "Pontos de vida por região",
        <Grid container spacing={2}>
          {REGIOES_PV_CYBERPUNK.map((regiao) => {
            const maximo =
              Number(dados.pvMaximoCyberpunk || 0) * regiao.multiplicador;

            return (
              <Grid item xs={6} md={3} key={regiao.id}>
                <Typography fontWeight={600}>{regiao.nome}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Máximo: {maximo.toFixed(1)} ({regiao.multiplicador}x PV)
                </Typography>
                {campo(
                  "PV atual",
                  pvRegioes[regiao.id] ?? 0,
                  (v) =>
                    atualizar("pvRegioesCyberpunkAtuais", {
                      ...pvRegioes,
                      [regiao.id]: Number(v),
                    }),
                  { type: "number" },
                )}
              </Grid>
            );
          })}
        </Grid>,
      )}

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

                return (
                  <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    key={id}
                    sx={{ mb: 1 }}
                  >
                    <Grid item xs={12} md={4}>
                      <Typography>{nome}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      {alternativas.length > 1 ? (
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label="Fórmula"
                          value={formulas[id] ?? 0}
                          onChange={(e) =>
                            atualizar("formulasCyberpunk", {
                              ...formulas,
                              [id]: Number(e.target.value),
                            })
                          }
                        >
                          {alternativas.map((formula, index) => (
                            <MenuItem key={index} value={index}>
                              {formula.filter((x) => x !== "SUM").join(" + ")}
                              {formula.includes("SUM") ? " (soma)" : " (média)"}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          {alternativas[0]
                            .filter((x) => x !== "SUM")
                            .join(" + ")}
                          {alternativas[0].includes("SUM") ? " (soma)" : ""}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={3} md={2}>
                      {campo(
                        "Ajuste",
                        ajustes[id] ?? 0,
                        (v) =>
                          atualizar("ajustesPericiasCyberpunk", {
                            ...ajustes,
                            [id]: Number(v),
                          }),
                        { type: "number" },
                      )}
                    </Grid>
                    <Grid item xs={3} md={3}>
                      <Typography fontWeight={700} textAlign="center">
                        Total: {valor}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </>,
      )}

      {secao(
        "Habilidades",
        <>
          {habilidades.map((habilidade, index) => (
            <Paper
              key={habilidade.id || index}
              variant="outlined"
              sx={{ p: 2, mb: 2 }}
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
                    habilidade.nivel,
                    (v) => editarHabilidade(index, "nivel", Number(v)),
                    { type: "number" },
                  )}
                </Grid>
                <Grid item xs={12}>
                  {campo(
                    "Efeito / descrição",
                    habilidade.efeito,
                    (v) => editarHabilidade(index, "efeito", v),
                    { multiline: true, minRows: 2 },
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
                      value={bonus.tipo}
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
                      value={bonus.alvo}
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
                      (v) => editarBonus(index, bonusIndex, "valor", Number(v)),
                      { type: "number" },
                    )}
                  </Grid>
                  <Grid item xs={4} md={1}>
                    <Button
                      color="error"
                      onClick={() => removerBonus(index, bonusIndex)}
                    >
                      Excluir
                    </Button>
                  </Grid>
                </Grid>
              ))}

              <Button size="small" onClick={() => adicionarBonus(index)}>
                + Adicionar bônus
              </Button>
              <Button
                size="small"
                color="error"
                sx={{ ml: 1 }}
                onClick={() =>
                  atualizar(
                    "habilidadesCyberpunk",
                    habilidades.filter((_, i) => i !== index),
                  )
                }
              >
                Excluir habilidade
              </Button>
            </Paper>
          ))}

          <Button variant="outlined" onClick={adicionarHabilidade}>
            + Nova habilidade
          </Button>
        </>,
      )}

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
                  onClick={() =>
                    atualizar(
                      "cyberwareCyberpunk",
                      cyberwares.filter((_, i) => i !== index),
                    )
                  }
                >
                  Excluir
                </Button>
              </Grid>
            </Grid>
          ))}

          <Button variant="outlined" onClick={adicionarCyberware}>
            + Adicionar cyberware
          </Button>
        </>,
      )}
    </Box>
  );
}
