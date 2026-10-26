import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  ATRIBUTOS_NODIE,
  PERICIAS_NODIE,
  REGIOES_PV,
  calcularPericia,
  calcularPVRegioes,
} from "./noDie";

const CORES = {
  painel: "#15131D",
  borda: "rgba(196, 181, 253, 0.18)",
  texto: "#F5F3FF",
  secundario: "#A5A0B2",
  destaque: "#A78BFA",
};

const estiloCampo = {
  "& .MuiOutlinedInput-root": {
    color: CORES.texto,
    bgcolor: "#100E16",
    "& fieldset": { borderColor: CORES.borda },
    "&:hover fieldset": { borderColor: CORES.destaque },
  },
  "& .MuiInputLabel-root": { color: CORES.secundario },
};

function obterPericias(grupo) {
  if (Array.isArray(grupo.pericias)) return grupo.pericias;
  if (Array.isArray(grupo.habilidades)) return grupo.habilidades;
  if (Array.isArray(grupo.campos)) return grupo.campos;
  if (Array.isArray(grupo.itens)) return grupo.itens;
  return [];
}

const PERICIAS = PERICIAS_NODIE.flatMap((grupo) =>
  obterPericias(grupo).map((pericia) => ({
    ...pericia,
    grupo: grupo.nome || grupo.titulo || grupo.id || "Perícias",
  })),
);

function Campo({ label, value, onChange, disabled, type = "text" }) {
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={type}
      value={value ?? ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      sx={estiloCampo}
      inputProps={type === "number" ? { step: "any" } : undefined}
    />
  );
}

function Painel({ titulo, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 2.5,
        bgcolor: CORES.painel,
        color: CORES.texto,
        border: `1px solid ${CORES.borda}`,
        borderRadius: 3,
        minWidth: 0,
      }}
    >
      <Typography variant="h6" fontWeight={800}>
        {titulo}
      </Typography>
      <Divider sx={{ my: 2, borderColor: CORES.borda }} />
      {children}
    </Paper>
  );
}

function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

export default function NoDieSheet({ dados, setDados, podeEditar, salvando }) {
  const atributos = React.useMemo(() => {
    const salvos = dados.atributosNoDie || {};

    return Object.fromEntries(
      ATRIBUTOS_NODIE.map((atributo) => [
        atributo.id,
        numero(salvos[atributo.id] ?? dados[atributo.id] ?? 0),
      ]),
    );
  }, [dados]);

  const bonus = Array.isArray(dados.bonusPericias) ? dados.bonusPericias : [];

  const formulas = dados.formulasPericias || {};
  const pvAtuais = dados.pvRegioesAtuais || {};

  const con = Number(dados.atributosNoDie?.CON ?? dados.CON ?? 0);

  const regioesCalculadas = REGIOES_PV.map((regiao) => {
    const maximo = Math.round(con * regiao.multiplicador * 10) / 10;

    const atualSalvo = pvAtuais[regiao.id];

    return {
      ...regiao,
      maximo,
      atual:
        atualSalvo === undefined || atualSalvo === null || atualSalvo === ""
          ? maximo
          : Number(atualSalvo),
    };
  });

  const atualizar = (chave, valor) => {
    setDados((anterior) => ({
      ...anterior,
      [chave]: valor,
    }));
  };

  const atualizarAtributo = (id, valor) => {
    const n = valor === "" ? "" : numero(valor);

    setDados((anterior) => ({
      ...anterior,
      atributosNoDie: {
        ...(anterior.atributosNoDie || {}),
        [id]: n,
      },
      // Mantém os valores simples sincronizados para compatibilidade.
      [id]: n,
    }));
  };

  const atualizarBonus = (index, campo, valor) => {
    setDados((anterior) => {
      const lista = Array.isArray(anterior.bonusPericias)
        ? [...anterior.bonusPericias]
        : [];

      lista[index] = {
        ...(lista[index] || {}),
        [campo]: valor,
      };

      return { ...anterior, bonusPericias: lista };
    });
  };

  const adicionarBonus = () => {
    setDados((anterior) => ({
      ...anterior,
      bonusPericias: [
        ...(Array.isArray(anterior.bonusPericias)
          ? anterior.bonusPericias
          : []),
        {
          id: `bonus-${Date.now()}`,
          nome: "",
          valor: 0,
          pericias: [],
        },
      ],
    }));
  };

  const removerBonus = (index) => {
    setDados((anterior) => ({
      ...anterior,
      bonusPericias: (anterior.bonusPericias || []).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const atualizarFormula = (id, index) => {
    setDados((anterior) => ({
      ...anterior,
      formulasPericias: {
        ...(anterior.formulasPericias || {}),
        [id]: Number(index),
      },
    }));
  };

  const atualizarPVRegiao = (id, valor) => {
    setDados((anterior) => ({
      ...anterior,
      pvRegioesAtuais: {
        ...(anterior.pvRegioesAtuais || {}),
        [id]: valor === "" ? "" : numero(valor),
      },
    }));
  };

  const totalPericias = PERICIAS.map((pericia) => {
    const formulaIndex = Number(formulas[pericia.id] ?? 0);
    const calculo = calcularPericia(pericia, atributos, bonus, formulaIndex);

    return { pericia, calculo, formulaIndex };
  });

  return (
    <Box>
      <Painel titulo="Atributos">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(5, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {ATRIBUTOS_NODIE.map((atributo) => (
            <Campo
              key={atributo.id}
              label={atributo.nome || atributo.label || atributo.id}
              type="number"
              value={atributos[atributo.id]}
              disabled={!podeEditar || salvando}
              onChange={(valor) => atualizarAtributo(atributo.id, valor)}
            />
          ))}
        </Box>
      </Painel>

      <Painel titulo="Recursos">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <Campo
            label="PV atual"
            type="number"
            value={dados.pvAtual ?? atributos.CON}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("pvAtual", v)}
          />
          <Campo
            label="PV máximo (CON)"
            value={atributos.CON}
            disabled
            onChange={() => {}}
          />
          <Campo
            label="PE atual"
            type="number"
            value={dados.peAtual ?? 0}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("peAtual", v)}
          />
          <Campo
            label="PE máximo"
            type="number"
            value={dados.peMaximo ?? 0}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("peMaximo", v)}
          />
          <Campo
            label="Mana atual"
            type="number"
            value={dados.manaAtual ?? 0}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("manaAtual", v)}
          />
          <Campo
            label="Mana máxima"
            type="number"
            value={dados.manaMaxima ?? 0}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("manaMaxima", v)}
          />
          <Campo
            label="Estresse atual"
            type="number"
            value={dados.estresseAtual ?? 200}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("estresseAtual", v)}
          />
          <Campo
            label="Estresse máximo"
            type="number"
            value={dados.estresseMaximo ?? 200}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("estresseMaximo", v)}
          />
          <Campo
            label="Sanidade atual"
            type="number"
            value={dados.sanidadeAtual ?? 200}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("sanidadeAtual", v)}
          />
          <Campo
            label="Sanidade máxima"
            type="number"
            value={dados.sanidadeMaxima ?? 200}
            disabled={!podeEditar || salvando}
            onChange={(v) => atualizar("sanidadeMaxima", v)}
          />
        </Box>
      </Painel>

      <Painel titulo="Pontos de vida por região">
        <Typography variant="body2" sx={{ color: CORES.secundario, mb: 2 }}>
          Os máximos são calculados automaticamente com base na CON.
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: CORES.secundario }}>Região</TableCell>
                <TableCell sx={{ color: CORES.secundario }}>
                  Multiplicador
                </TableCell>
                <TableCell sx={{ color: CORES.secundario }}>PV atual</TableCell>
                <TableCell sx={{ color: CORES.secundario }}>
                  PV máximo
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regioesCalculadas.map((regiao) => {
                const pv = regiao;

                return (
                  <TableRow key={regiao.id}>
                    <TableCell sx={{ color: CORES.texto }}>
                      {regiao.nome}
                    </TableCell>
                    <TableCell sx={{ color: CORES.texto }}>
                      {regiao.nome}
                    </TableCell>

                    <TableCell sx={{ color: CORES.texto }}>
                      {regiao.multiplicador}
                    </TableCell>

                    <TableCell sx={{ minWidth: 110 }}>
                      <TextField
                        size="small"
                        type="number"
                        value={pv.atual}
                        disabled={!podeEditar || salvando}
                        onChange={(e) =>
                          atualizarPVRegiao(regiao.id, e.target.value)
                        }
                        sx={estiloCampo}
                        inputProps={{ step: "any", min: 0 }}
                      />
                    </TableCell>

                    <TableCell sx={{ color: CORES.texto }}>
                      {pv.maximo}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Painel>

      <Painel titulo="Bônus de perícias">
        <Typography variant="body2" sx={{ color: CORES.secundario, mb: 2 }}>
          Cadastre um bônus e selecione todas as perícias afetadas. O valor será
          somado automaticamente aos totais.
        </Typography>

        <Box sx={{ display: "grid", gap: 2 }}>
          {bonus.map((item, index) => (
            <Box
              key={item.id || index}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1fr 110px 2fr auto",
                },
                gap: 1.5,
                alignItems: "start",
              }}
            >
              <Campo
                label="Nome do bônus"
                value={item.nome}
                disabled={!podeEditar || salvando}
                onChange={(v) => atualizarBonus(index, "nome", v)}
              />

              <Campo
                label="Valor"
                type="number"
                value={item.valor ?? 0}
                disabled={!podeEditar || salvando}
                onChange={(v) => atualizarBonus(index, "valor", numero(v))}
              />

              <Select
                multiple
                fullWidth
                size="small"
                displayEmpty
                disabled={!podeEditar || salvando}
                value={item.pericias || []}
                onChange={(e) =>
                  atualizarBonus(index, "pericias", e.target.value)
                }
                renderValue={(selecionadas) =>
                  selecionadas.length
                    ? PERICIAS.filter((p) => selecionadas.includes(p.id))
                        .map((p) => p.nome)
                        .join(", ")
                    : "Selecionar perícias"
                }
                sx={{
                  color: CORES.texto,
                  bgcolor: "#100E16",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: CORES.borda,
                  },
                }}
              >
                {PERICIAS.map((pericia) => (
                  <MenuItem key={pericia.id} value={pericia.id}>
                    {pericia.grupo}: {pericia.nome}
                  </MenuItem>
                ))}
              </Select>

              <Button
                color="error"
                disabled={!podeEditar || salvando}
                onClick={() => removerBonus(index)}
              >
                Remover
              </Button>
            </Box>
          ))}
        </Box>

        <Button
          sx={{ mt: 2, color: CORES.destaque }}
          disabled={!podeEditar || salvando}
          onClick={adicionarBonus}
        >
          + Adicionar bônus
        </Button>
      </Painel>

      {PERICIAS_NODIE.map((grupo, indice) => {
        const listaPericias = obterPericias(grupo);
        const tituloGrupo =
          grupo.titulo || grupo.nome || grupo.label || grupo.grupo || grupo.id;

        return (
          <Painel
            key={grupo.id || tituloGrupo || indice}
            titulo={tituloGrupo || `Grupo de perícias ${indice + 1}`}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Perícia", "Fórmula", "Base", "Bônus", "Total"].map(
                      (titulo) => (
                        <TableCell
                          key={titulo}
                          sx={{
                            color: CORES.secundario,
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {titulo}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {obterPericias(grupo).map((pericia) => {
                    const formulaIndex = Number(formulas[pericia.id] ?? 0);
                    const calculo = calcularPericia(
                      pericia,
                      atributos,
                      bonus,
                      formulaIndex,
                    );

                    const alternativas = pericia.formulas || [];

                    const formulaTexto = (formula) =>
                      formula.length === 1
                        ? formula[0]
                        : `(${formula.join(" + ")}) / ${formula.length}`;

                    return (
                      <TableRow key={pericia.id}>
                        <TableCell
                          sx={{
                            color: CORES.texto,
                            fontWeight: 600,
                            minWidth: 150,
                          }}
                        >
                          {pericia.nome}
                        </TableCell>

                        <TableCell sx={{ minWidth: 170 }}>
                          {alternativas.length > 1 ? (
                            <Select
                              size="small"
                              fullWidth
                              value={formulaIndex}
                              disabled={!podeEditar || salvando}
                              onChange={(e) =>
                                atualizarFormula(pericia.id, e.target.value)
                              }
                              sx={{
                                color: CORES.texto,
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: CORES.borda,
                                },
                              }}
                            >
                              {alternativas.map((formula, i) => (
                                <MenuItem key={i} value={i}>
                                  {formulaTexto(formula)}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: CORES.secundario }}
                            >
                              {formulaTexto(alternativas[0] || [])}
                            </Typography>
                          )}
                        </TableCell>

                        <TableCell sx={{ color: CORES.texto }}>
                          {calculo.base}
                        </TableCell>
                        <TableCell
                          sx={{
                            color:
                              calculo.bonus > 0
                                ? "#86EFAC"
                                : calculo.bonus < 0
                                  ? "#FCA5A5"
                                  : CORES.secundario,
                          }}
                        >
                          {calculo.bonus > 0 ? "+" : ""}
                          {calculo.bonus}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: CORES.destaque,
                            fontWeight: 800,
                          }}
                        >
                          {calculo.total}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Painel>
        );
      })}

      <Painel titulo="Características e anotações">
        <Box sx={{ display: "grid", gap: 2 }}>
          {[
            ["caracteristicasRaciais", "Características raciais"],
            ["habilidadesEspeciais", "Habilidades especiais"],
            ["idiomasNoDie", "Idiomas"],
            ["observacoesNoDie", "Observações"],
          ].map(([id, label]) => (
            <TextField
              key={id}
              fullWidth
              multiline
              minRows={3}
              label={label}
              value={dados[id] ?? ""}
              disabled={!podeEditar || salvando}
              onChange={(e) => atualizar(id, e.target.value)}
              sx={estiloCampo}
            />
          ))}
        </Box>
      </Painel>
    </Box>
  );
}
