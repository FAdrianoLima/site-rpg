import * as React from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

import { auth, db } from "../../../firebase-config";
import Admin from "../../components/admin";
import {
  identificarModelo,
  criarDadosIniciais,
} from "../../data/modelosFichas";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import NoDieSheet from "../personagens/NoDieSheet";

const CORES = {
  painel: "#15131D",
  borda: "rgba(196, 181, 253, 0.14)",
  texto: "#F5F3FF",
  secundario: "#A5A0B2",
  destaque: "#A78BFA",
};

function ehAdministrador(usuario) {
  const tipo = String(usuario?.tipoDeUsuario || "")
    .trim()
    .toLowerCase();

  return ["a", "admin", "administrador"].includes(tipo);
}

function converterValor(campo, valor) {
  if (campo.tipo === "number") {
    if (valor === "" || valor === null || valor === undefined) {
      return 0;
    }

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
      throw new Error(`O campo "${campo.label}" precisa ser numérico.`);
    }

    return numero;
  }

  return String(valor ?? "");
}

function migrarDadosAntigos(ficha, modelo) {
  const iniciais = criarDadosIniciais(modelo);
  const salvos = ficha.dadosFicha || {};

  // Preserva campos existentes na ficha dinâmica.
  const resultado = { ...iniciais, ...salvos };

  // Importa os atributos antigos quando os novos ainda estão vazios.
  const atributosAntigos = ficha.atributos || {};
  const periciasAntigas = ficha.pericias || {};
  const recursosAntigos = ficha.recursos || {};

  for (const chave of Object.keys(atributosAntigos)) {
    if (
      chave in resultado &&
      (resultado[chave] === "" || resultado[chave] === 0)
    ) {
      resultado[chave] = atributosAntigos[chave];
    }
  }

  if ("pericias" in resultado && !resultado.pericias) {
    resultado.pericias =
      typeof periciasAntigas === "string"
        ? periciasAntigas
        : Object.entries(periciasAntigas)
            .map(([nome, valor]) => `${nome}: ${valor}`)
            .join("\n");
  }

  for (const [chave, valor] of Object.entries(recursosAntigos)) {
    if (
      chave in resultado &&
      (resultado[chave] === "" || resultado[chave] === 0)
    ) {
      resultado[chave] = valor;
    }
  }

  return resultado;
}

export default function FichaPersonagem() {
  const router = useRouter();
  const { id } = router.query;

  const [uid, setUid] = React.useState("");
  const [usuario, setUsuario] = React.useState(null);
  const [ficha, setFicha] = React.useState(null);
  const [modelo, setModelo] = React.useState(null);
  const [dados, setDados] = React.useState({});

  const [carregando, setCarregando] = React.useState(true);
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [sucesso, setSucesso] = React.useState("");
  const [podeEditar, setPodeEditar] = React.useState(false);

  React.useEffect(() => {
    if (!router.isReady || typeof id !== "string") return;

    let cancelado = false;

    const carregar = async (conta) => {
      setCarregando(true);
      setErro("");

      try {
        if (!conta) {
          router.replace("/");
          return;
        }

        let dadosUsuario;

        try {
          dadosUsuario = JSON.parse(localStorage.getItem("user") || "null");
        } catch {
          dadosUsuario = null;
        }

        if (!dadosUsuario) {
          router.replace("/");
          return;
        }

        const snapshot = await getDoc(doc(db, "personagens", id));

        if (!snapshot.exists()) {
          throw new Error("Esta ficha não foi encontrada.");
        }

        const dadosFicha = {
          id: snapshot.id,
          ...snapshot.data(),
        };

        let sistemaCadastrado = {};

        // O No Die é definido no código, não depende do Firestore.
        if (dadosFicha.sistemaId !== "noDie" && dadosFicha.sistemaId) {
          const sistemaSnapshot = await getDoc(
            doc(db, "sistemasRPG", dadosFicha.sistemaId),
          );

          if (sistemaSnapshot.exists()) {
            sistemaCadastrado = sistemaSnapshot.data();
          }
        }

        const modeloEncontrado = identificarModelo({
          id: dadosFicha.sistemaId,
          nome: sistemaCadastrado.nome || dadosFicha.sistemaNome,
          titulo: sistemaCadastrado.titulo,
          versao: sistemaCadastrado.versao,
        });

        if (!modeloEncontrado) {
          throw new Error(
            `Não foi possível identificar o modelo do sistema "${dadosFicha.sistemaNome || "não informado"}". Confira o nome do sistema cadastrado.`,
          );
        }

        const admin = ehAdministrador(dadosUsuario);
        const dono = dadosFicha.usuarioId === conta.uid;
        let mestreDaMesa = false;

        if (dadosFicha.mesaId) {
          const mesaSnapshot = await getDoc(
            doc(db, "mesas", dadosFicha.mesaId),
          );

          if (mesaSnapshot.exists()) {
            mestreDaMesa = mesaSnapshot.data().mestreId === conta.uid;
          }
        }

        if (cancelado) return;

        setUid(conta.uid);
        setUsuario(dadosUsuario);
        setFicha(dadosFicha);
        setModelo(modeloEncontrado);
        setDados(migrarDadosAntigos(dadosFicha, modeloEncontrado));
        setPodeEditar(admin || dono || mestreDaMesa);
      } catch (error) {
        console.error("Erro ao carregar ficha:", error);

        if (!cancelado) {
          setErro(
            error?.code === "permission-denied"
              ? "O Firebase bloqueou o acesso. Confira as regras de segurança."
              : error.message || "Não foi possível abrir esta ficha.",
          );
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, carregar);

    return () => {
      cancelado = true;
      unsubscribe();
    };
  }, [router, router.isReady, id]);

  const alterarCampo = (campo, valor) => {
    setDados((anterior) => ({
      ...anterior,
      [campo.id]: valor,
    }));

    setSucesso("");
  };

  const salvar = async (event) => {
    event.preventDefault();
    setErro("");
    setSucesso("");

    if (!ficha || !modelo || !uid || !podeEditar) {
      setErro("Você não tem permissão para editar esta ficha.");
      return;
    }

    if (!String(ficha.nome || "").trim()) {
      setErro("A ficha precisa ter um nome.");
      return;
    }

    let dadosConvertidos;

    try {
      const ehNoDie = ficha.sistemaId === "noDie" || modelo.id === "noDie";

      if (ehNoDie) {
        // Salva todos os dados personalizados da ficha No Die.
        dadosConvertidos = {
          ...dados,
          atributosNoDie: { ...(dados.atributosNoDie || {}) },
          bonusPericias: [...(dados.bonusPericias || [])],
          formulasPericias: { ...(dados.formulasPericias || {}) },
          pvRegioesAtuais: { ...(dados.pvRegioesAtuais || {}) },
        };
      } else {
        // Mantém o salvamento original dos modelos D&D.
        dadosConvertidos = {};

        for (const secao of modelo.secoes) {
          for (const campo of secao.campos) {
            dadosConvertidos[campo.id] = converterValor(campo, dados[campo.id]);
          }
        }
      }
    } catch (error) {
      setErro(error.message);
      return;
    }

    setSalvando(true);

    try {
      await updateDoc(doc(db, "personagens", ficha.id), {
        dadosFicha: dadosConvertidos,
        atualizadoEm: serverTimestamp(),
      });

      setDados(dadosConvertidos);
      setFicha((anterior) => ({
        ...anterior,
        dadosFicha: dadosConvertidos,
      }));

      setSucesso("Ficha salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar ficha:", error);

      setErro(
        error?.code === "permission-denied"
          ? "O Firebase não autorizou a alteração. Confira as regras do Firestore."
          : "Não foi possível salvar a ficha.",
      );
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <Admin>
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: CORES.destaque }} />
        </Box>
      </Admin>
    );
  }

  if (!ficha || !modelo) {
    return (
      <Admin>
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/personagens")}
            sx={{ mb: 3 }}
          >
            Voltar às fichas
          </Button>

          {erro && <Alert severity="error">{erro}</Alert>}
        </Box>
      </Admin>
    );
  }

  return (
    <Admin>
      <Box sx={{ maxWidth: 1100, mx: "auto", pb: 6, color: CORES.texto }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/personagens")}
          sx={{ color: CORES.destaque, mb: 3 }}
        >
          Todas as fichas
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, overflowWrap: "anywhere" }}
            >
              {ficha.nome}
            </Typography>

            <Typography sx={{ mt: 1, color: CORES.secundario }}>
              {modelo.nome} · {modelo.versao}
            </Typography>
          </Box>

          <Chip
            label={podeEditar ? "Edição permitida" : "Somente visualização"}
            sx={{
              color: CORES.texto,
              bgcolor: podeEditar
                ? "rgba(167,139,250,0.12)"
                : "rgba(165,160,178,0.12)",
            }}
          />
        </Box>

        <Box
          sx={{
            p: 2.5,
            mb: 3,
            border: `1px solid ${CORES.borda}`,
            borderRadius: 3,
            bgcolor: CORES.painel,
          }}
        >
          <Typography fontWeight={700} sx={{ mb: 1.5 }}>
            Campanha
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              label={`Mesa: ${ficha.mesaNome || "Não definida"}`}
              sx={{ color: CORES.texto, bgcolor: "#242032" }}
            />
            <Chip
              label={`Sistema: ${ficha.sistemaNome || modelo.nome}`}
              sx={{ color: CORES.texto, bgcolor: "#242032" }}
            />
          </Box>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}
        {sucesso && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {sucesso}
          </Alert>
        )}

        <Box component="form" onSubmit={salvar}>
          {ficha.sistemaId === "noDie" || modelo.id === "noDie" ? (
            <NoDieSheet
              dados={dados}
              setDados={setDados}
              podeEditar={podeEditar}
              salvando={salvando}
            />
          ) : (
            modelo.secoes.map((secao) => (
              <Box
                key={secao.id}
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 2.5,
                  border: `1px solid ${CORES.borda}`,
                  borderRadius: 3,
                  bgcolor: CORES.painel,
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  {secao.titulo}
                </Typography>

                <Divider sx={{ my: 2, borderColor: CORES.borda }} />

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  {secao.campos.map((campo) => (
                    <Box
                      key={campo.id}
                      sx={{
                        gridColumn:
                          campo.tipo === "textarea" ? "1 / -1" : "auto",
                      }}
                    >
                      <TextField
                        fullWidth
                        label={campo.label}
                        type={campo.tipo === "number" ? "number" : "text"}
                        multiline={campo.tipo === "textarea"}
                        minRows={
                          campo.tipo === "textarea"
                            ? campo.linhas || 3
                            : undefined
                        }
                        value={dados[campo.id] ?? ""}
                        disabled={!podeEditar || salvando}
                        onChange={(event) =>
                          alterarCampo(campo, event.target.value)
                        }
                        helperText={campo.ajuda || ""}
                        inputProps={
                          campo.tipo === "number" ? { step: "any" } : undefined
                        }
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
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))
          )}

          {podeEditar && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                disabled={salvando}
                sx={{
                  bgcolor: CORES.destaque,
                  color: "#171323",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#B69EFF" },
                }}
              >
                {salvando ? "Salvando..." : "Salvar ficha"}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Admin>
  );
}
