import * as React from "react";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../firebase-config";
import Admin from "../../components/admin";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import {
  identificarModelo,
  criarDadosIniciais,
} from "../../data/modelosFichas";

const CORES = {
  painel: "#15131D",
  borda: "rgba(196, 181, 253, 0.14)",
  texto: "#F5F3FF",
  secundario: "#A5A0B2",
  destaque: "#A78BFA",
};

function nomeSistema(sistema) {
  return sistema?.nome || sistema?.titulo || "Sistema sem nome";
}

function nomeMesa(mesa) {
  return mesa?.nome || "Mesa sem nome";
}

function tipoUsuario(usuario) {
  return String(usuario?.tipoDeUsuario || "")
    .trim()
    .toLowerCase();
}

function ehAdministrador(usuario) {
  return ["a", "admin", "administrador"].includes(tipoUsuario(usuario));
}

export default function Personagens() {
  const router = useRouter();

  const [usuario, setUsuario] = React.useState(null);
  const [uid, setUid] = React.useState("");
  const [carregando, setCarregando] = React.useState(true);
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const [busca, setBusca] = React.useState("");

  const [fichas, setFichas] = React.useState([]);
  const [mesas, setMesas] = React.useState([]);
  const [sistemas, setSistemas] = React.useState([]);

  const [dialogAberto, setDialogAberto] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [mesaId, setMesaId] = React.useState("");
  const [sistemaId, setSistemaId] = React.useState("");
  const [descricao, setDescricao] = React.useState("");

  const carregarDados = React.useCallback(async (idUsuario, dadosUsuario) => {
    setCarregando(true);
    setErro("");

    try {
      const admin = ehAdministrador(dadosUsuario);

      const consultas = [
        getDocs(collection(db, "sistemasRPG")),
        admin
          ? getDocs(collection(db, "mesas"))
          : getDocs(
              query(
                collection(db, "mesas"),
                where("participantesIds", "array-contains", idUsuario),
              ),
            ),
        admin
          ? getDocs(collection(db, "personagens"))
          : getDocs(
              query(
                collection(db, "personagens"),
                where("usuarioId", "==", idUsuario),
              ),
            ),
      ];

      const [sistemasSnapshot, mesasSnapshot, fichasSnapshot] =
        await Promise.all(consultas);

      const sistemasCarregados = sistemasSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      const noDieExiste = sistemasCarregados.some(
        (sistema) => sistema.id === "noDie",
      );

      setSistemas(
        noDieExiste
          ? sistemasCarregados
          : [
              {
                id: "noDie",
                nome: "No Die",
                versao: "Sistema próprio",
              },
              ...sistemasCarregados,
            ],
      );

      setMesas(
        mesasSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );

      setFichas(
        fichasSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );
    } catch (error) {
      console.error("Erro ao carregar fichas:", error);

      setErro(
        error?.code === "permission-denied"
          ? "O Firebase bloqueou a consulta. Precisamos configurar as regras de acesso das fichas, mesas e sistemas."
          : "Não foi possível carregar as fichas. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    let dadosUsuario = null;

    try {
      dadosUsuario = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      dadosUsuario = null;
    }

    setUsuario(dadosUsuario);

    const unsubscribe = onAuthStateChanged(auth, async (conta) => {
      if (!conta) {
        setCarregando(false);
        router.replace("/");
        return;
      }

      setUid(conta.uid);
      await carregarDados(conta.uid, dadosUsuario);
    });

    return () => unsubscribe();
  }, [carregarDados, router]);

  const fichasFiltradas = fichas.filter((ficha) => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return true;

    return [ficha.nome, ficha.mesaNome, ficha.sistemaNome].some((valor) =>
      String(valor || "")
        .toLowerCase()
        .includes(termo),
    );
  });

  const abrirCriacao = () => {
    setNome("");
    setMesaId("");
    setSistemaId("");
    setDescricao("");
    setErro("");
    setDialogAberto(true);
  };

  const criarFicha = async (event) => {
    event.preventDefault();
    setErro("");

    if (!uid) {
      setErro("Sua sessão não foi identificada. Entre novamente.");
      return;
    }

    if (!nome.trim() || !mesaId || !sistemaId) {
      setErro("Informe o nome da ficha, a mesa e o sistema.");
      return;
    }

    const mesaSelecionada = mesas.find((item) => item.id === mesaId);
    const sistemaSelecionado = sistemas.find((item) => item.id === sistemaId);

    if (!mesaSelecionada || !sistemaSelecionado) {
      setErro("A mesa ou o sistema selecionado não foi encontrado.");
      return;
    }

    const sistemaNoDie =
      sistemaSelecionado.id === "noDie" ||
      sistemaSelecionado.sistemaId === "noDie";

    const sistemaFinal = sistemaNoDie
      ? {
          id: "noDie",
          nome: "No Die",
          versao: "Sistema próprio",
        }
      : sistemaSelecionado;

    const modeloFicha = identificarModelo({
      id: sistemaFinal.id,
      sistemaId: sistemaFinal.id,
      nome: sistemaFinal.nome || sistemaFinal.titulo,
      versao: sistemaFinal.versao,
    });

    setSalvando(true);

    try {
      const dadosIniciais = criarDadosIniciais(modeloFicha);

      const novaFicha = {
        nome: nome.trim(),
        descricao: descricao.trim(),

        usuarioId: uid,
        usuarioNome: usuario?.nome || usuario?.email || "",

        mesaId: mesaSelecionada.id,
        mesaNome: nomeMesa(mesaSelecionada),

        sistemaId: sistemaFinal.id,
        sistemaNome: sistemaFinal.nome || nomeSistema(sistemaFinal),

        dadosFicha: dadosIniciais,

        // Mantém compatibilidade com fichas antigas.
        atributos: {},
        pericias: {},
        recursos: {},

        criadoEm: serverTimestamp(),
        atualizadoEm: serverTimestamp(),
      };

      const documento = await addDoc(collection(db, "personagens"), novaFicha);

      setDialogAberto(false);
      await router.push(`/personagens/${documento.id}`);
    } catch (error) {
      console.error("Erro ao criar ficha:", error);

      setErro(
        error?.code === "permission-denied"
          ? "Você não tem permissão para criar fichas. Verifique as regras do Firestore."
          : "Não foi possível criar a ficha. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Admin>
      <Box sx={{ color: CORES.texto, pb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Minhas fichas
            </Typography>
            <Typography sx={{ color: CORES.secundario, mt: 1 }}>
              Organize seus personagens, sistemas e campanhas.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirCriacao}
            sx={{
              bgcolor: CORES.destaque,
              color: "#171323",
              fontWeight: 800,
              "&:hover": { bgcolor: "#B69EFF" },
            }}
          >
            Nova ficha
          </Button>
        </Box>

        <TextField
          fullWidth
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por personagem, mesa ou sistema..."
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: CORES.secundario }} />
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              bgcolor: CORES.painel,
              color: CORES.texto,
              "& fieldset": { borderColor: CORES.borda },
            },
          }}
        />

        {erro && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        )}

        {carregando ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: CORES.destaque }} />
          </Box>
        ) : fichasFiltradas.length === 0 ? (
          <Box
            sx={{
              p: { xs: 3, sm: 6 },
              textAlign: "center",
              border: `1px dashed ${CORES.borda}`,
              borderRadius: 3,
              bgcolor: CORES.painel,
            }}
          >
            <PersonOutlineIcon
              sx={{ fontSize: 48, color: CORES.destaque, mb: 1 }}
            />
            <Typography variant="h6" fontWeight={700}>
              {busca ? "Nenhuma ficha encontrada" : "Sua aventura começa aqui"}
            </Typography>
            <Typography sx={{ color: CORES.secundario, mt: 1, mb: 3 }}>
              {busca
                ? "Experimente buscar por outro nome, mesa ou sistema."
                : "Crie sua primeira ficha e escolha em qual mesa ela vai jogar."}
            </Typography>
            {!busca && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={abrirCriacao}
                sx={{ bgcolor: CORES.destaque, color: "#171323" }}
              >
                Criar primeira ficha
              </Button>
            )}
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {fichasFiltradas.map((ficha) => (
              <Box
                key={ficha.id}
                onClick={() => router.push(`/personagens/${ficha.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/personagens/${ficha.id}`);
                  }
                }}
                sx={{
                  p: 2.5,
                  cursor: "pointer",
                  bgcolor: CORES.painel,
                  border: `1px solid ${CORES.borda}`,
                  borderRadius: 3,
                  transition: "border-color 0.2s, transform 0.2s",
                  "&:hover": {
                    borderColor: CORES.destaque,
                    transform: "translateY(-2px)",
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${CORES.destaque}`,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" fontWeight={800} noWrap>
                      {ficha.nome || "Personagem sem nome"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: CORES.secundario, mt: 0.5 }}
                    >
                      {ficha.descricao || "Nenhuma descrição adicionada."}
                    </Typography>
                  </Box>

                  <ArrowForwardIcon sx={{ color: CORES.destaque, mt: 0.5 }} />
                </Box>

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2.5 }}
                >
                  <Chip
                    icon={<GroupsIcon />}
                    label={ficha.mesaNome || "Mesa não definida"}
                    size="small"
                    sx={{
                      color: CORES.texto,
                      bgcolor: "rgba(167,139,250,0.10)",
                      maxWidth: "100%",
                    }}
                  />
                  <Chip
                    icon={<AutoAwesomeIcon />}
                    label={ficha.sistemaNome || "Sistema não definido"}
                    size="small"
                    sx={{
                      color: CORES.texto,
                      bgcolor: "rgba(167,139,250,0.10)",
                      maxWidth: "100%",
                    }}
                  />
                </Box>

                {ehAdministrador(usuario) && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 2, color: CORES.secundario }}
                  >
                    Jogador: {ficha.usuarioNome || "Não informado"}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Dialog
          open={dialogAberto}
          onClose={() => !salvando && setDialogAberto(false)}
          fullWidth
          maxWidth="sm"
        >
          <Box component="form" onSubmit={criarFicha}>
            <DialogTitle>Nova ficha de personagem</DialogTitle>

            <DialogContent>
              <Typography
                variant="body2"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                Escolha um nome para identificar o personagem na sua lista.
              </Typography>

              {erro && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {erro}
                </Alert>
              )}

              <TextField
                fullWidth
                required
                autoFocus
                label="Nome do personagem"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                inputProps={{ maxLength: 100 }}
                sx={{ mt: 1, mb: 2 }}
              />

              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel id="mesa-label">Mesa</InputLabel>
                <Select
                  labelId="mesa-label"
                  value={mesaId}
                  label="Mesa"
                  onChange={(event) => setMesaId(event.target.value)}
                >
                  {mesas.map((mesa) => (
                    <MenuItem key={mesa.id} value={mesa.id}>
                      {nomeMesa(mesa)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel id="sistema-label">Sistema de RPG</InputLabel>
                <Select
                  labelId="sistema-label"
                  value={sistemaId}
                  label="Sistema de RPG"
                  onChange={(event) => setSistemaId(event.target.value)}
                >
                  {sistemas.map((sistema) => (
                    <MenuItem key={sistema.id} value={sistema.id}>
                      {nomeSistema(sistema)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Descrição (opcional)"
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
              />

              {mesas.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Você ainda não participa de nenhuma mesa disponível.
                </Alert>
              )}

              {sistemas.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Ainda não há sistemas de RPG cadastrados.
                </Alert>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setDialogAberto(false)}
                disabled={salvando}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  salvando || mesas.length === 0 || sistemas.length === 0
                }
                sx={{ bgcolor: CORES.destaque, color: "#171323" }}
              >
                {salvando ? "Criando..." : "Criar ficha"}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Admin>
  );
}
