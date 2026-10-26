import * as React from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArchiveIcon from "@mui/icons-material/Archive";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase-config";
import Admin from "../../components/admin";

const mesasRef = collection(db, "mesas");

const formularioInicial = {
  nome: "",
  descricao: "",
  sistemaNome: "No Die",
};

export default function MesasPage() {
  const [usuario, setUsuario] = React.useState(null);
  const [mesas, setMesas] = React.useState([]);
  const [formulario, setFormulario] = React.useState(formularioInicial);
  const [mesaEditando, setMesaEditando] = React.useState(null);

  const [modalAberto, setModalAberto] = React.useState(false);
  const [carregando, setCarregando] = React.useState(true);
  const [salvando, setSalvando] = React.useState(false);
  const [erro, setErro] = React.useState("");

  const ehAdmin = usuario?.tipoDeUsuario === "A";

  React.useEffect(() => {
    try {
      const userString = localStorage.getItem("user");

      if (userString) {
        setUsuario(JSON.parse(userString));
      }
    } catch (error) {
      console.error("Não foi possível ler o usuário:", error);
      setErro("Não foi possível identificar o usuário conectado.");
    }
  }, []);

  React.useEffect(() => {
    if (!usuario) return;

    carregarMesas();
    // A função é executada novamente quando o usuário muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  async function carregarMesas() {
    setCarregando(true);
    setErro("");

    try {
      const uid = usuario?.fbId;

      if (!uid) {
        throw new Error(
          "O usuário não possui fbId no cadastro. Verifique o login.",
        );
      }

      let documentos = [];

      if (usuario.tipoDeUsuario === "A") {
        const snapshot = await getDocs(mesasRef);
        documentos = snapshot.docs;
      } else {
        const [mesasComoMestre, mesasComoParticipante] = await Promise.all([
          getDocs(query(mesasRef, where("mestreId", "==", uid))),
          getDocs(
            query(mesasRef, where("participantesIds", "array-contains", uid)),
          ),
        ]);

        const unicos = new Map();

        [...mesasComoMestre.docs, ...mesasComoParticipante.docs].forEach(
          (item) => unicos.set(item.id, item),
        );

        documentos = Array.from(unicos.values());
      }

      const resultado = documentos.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      resultado.sort((a, b) => {
        const dataA = a.criadoEm?.toDate?.()?.getTime?.() || 0;
        const dataB = b.criadoEm?.toDate?.()?.getTime?.() || 0;
        return dataB - dataA;
      });

      setMesas(resultado);
    } catch (error) {
      console.error("Erro ao carregar mesas:", error);
      setErro(
        error.message ||
          "Não foi possível carregar as mesas. Verifique as permissões do Firestore.",
      );
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovaMesa() {
    setMesaEditando(null);
    setFormulario(formularioInicial);
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(mesa) {
    setMesaEditando(mesa);

    setFormulario({
      nome: mesa.nome || "",
      descricao: mesa.descricao || "",
      sistemaNome: mesa.sistemaNome || "No Die",
    });

    setErro("");
    setModalAberto(true);
  }

  function fecharModal() {
    if (salvando) return;

    setModalAberto(false);
    setMesaEditando(null);
    setFormulario(formularioInicial);
  }

  function alterarCampo(campo, valor) {
    setFormulario((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  async function salvarMesa(event) {
    event.preventDefault();
    setErro("");

    const nome = formulario.nome.trim();
    const descricao = formulario.descricao.trim();
    const sistemaNome = formulario.sistemaNome.trim();

    if (!nome) {
      setErro("Informe o nome da mesa.");
      return;
    }

    if (!sistemaNome) {
      setErro("Informe o sistema de RPG.");
      return;
    }

    const uid = usuario?.fbId;

    if (!uid) {
      setErro("Não foi possível identificar o usuário conectado.");
      return;
    }

    setSalvando(true);

    try {
      if (mesaEditando) {
        const podeEditar = ehAdmin || mesaEditando.mestreId === uid;

        if (!podeEditar) {
          throw new Error("Você não tem permissão para editar esta mesa.");
        }

        await updateDoc(doc(db, "mesas", mesaEditando.id), {
          nome,
          descricao,
          sistemaNome,
          atualizadoEm: serverTimestamp(),
        });
      } else {
        await addDoc(mesasRef, {
          nome,
          descricao,
          sistemaNome,

          mestreId: uid,
          mestreNome: usuario.nome || usuario.email || "Mestre",

          participantesIds: [uid],
          quantidadeParticipantes: 1,

          status: "ativa",

          criadoPor: uid,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
        });
      }

      setModalAberto(false);
      setMesaEditando(null);
      setFormulario(formularioInicial);

      await carregarMesas();
    } catch (error) {
      console.error("Erro ao salvar mesa:", error);
      setErro(error.message || "Não foi possível salvar a mesa.");
    } finally {
      setSalvando(false);
    }
  }

  async function alternarStatus(mesa) {
    setErro("");

    const uid = usuario?.fbId;
    const podeEditar = ehAdmin || mesa.mestreId === uid;

    if (!podeEditar) {
      setErro("Somente o mestre ou um administrador pode arquivar a mesa.");
      return;
    }

    const novoStatus = mesa.status === "arquivada" ? "ativa" : "arquivada";

    try {
      await updateDoc(doc(db, "mesas", mesa.id), {
        status: novoStatus,
        atualizadoEm: serverTimestamp(),
      });

      await carregarMesas();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      setErro("Não foi possível alterar o status da mesa.");
    }
  }

  async function excluirMesa(mesa) {
    const uid = usuario?.fbId;
    const podeExcluir = ehAdmin || mesa.mestreId === uid;

    if (!podeExcluir) {
      setErro("Você não tem permissão para excluir esta mesa.");
      return;
    }

    const confirmar = window.confirm(
      `Deseja excluir a mesa "${mesa.nome}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmar) return;

    setErro("");

    try {
      await deleteDoc(doc(db, "mesas", mesa.id));
      await carregarMesas();
    } catch (error) {
      console.error("Erro ao excluir mesa:", error);
      setErro("Não foi possível excluir a mesa.");
    }
  }

  return (
    <Admin>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Mesas de RPG
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Organize campanhas, mestres e participantes.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={carregarMesas}
              disabled={carregando}
            >
              Atualizar
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={abrirNovaMesa}
            >
              Nova mesa
            </Button>
          </Stack>
        </Box>

        {erro && !modalAberto && (
          <Alert severity="error" onClose={() => setErro("")}>
            {erro}
          </Alert>
        )}

        <Paper
          sx={{
            p: 2.5,
            bgcolor: "background.paper",
            border: "1px solid rgba(196,181,253,0.12)",
            borderRadius: 3,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: "rgba(167,139,250,0.13)",
                color: "primary.main",
              }}
            >
              <GroupsIcon fontSize="large" />
            </Box>

            <Box>
              <Typography color="text.secondary" variant="body2">
                Mesas encontradas
              </Typography>

              <Typography variant="h4" fontWeight={800}>
                {carregando ? "—" : mesas.length}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {carregando ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : mesas.length === 0 ? (
          <Paper
            sx={{
              textAlign: "center",
              p: { xs: 3, sm: 6 },
              bgcolor: "background.paper",
              border: "1px dashed rgba(196,181,253,0.25)",
              borderRadius: 3,
            }}
          >
            <GroupsIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />

            <Typography variant="h6" fontWeight={700}>
              Nenhuma mesa por aqui ainda
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Crie sua primeira mesa para começar uma campanha.
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={abrirNovaMesa}
            >
              Criar primeira mesa
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
                xl: "repeat(3, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {mesas.map((mesa) => {
              const podeGerenciar = ehAdmin || mesa.mestreId === usuario?.fbId;

              return (
                <Paper
                  key={mesa.id}
                  sx={{
                    p: 2.5,
                    bgcolor: "background.paper",
                    border: "1px solid rgba(196,181,253,0.12)",
                    borderRadius: 3,
                    minWidth: 0,
                  }}
                >
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ overflowWrap: "anywhere" }}
                        >
                          {mesa.nome}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {mesa.sistemaNome || "Sistema não definido"}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={
                          mesa.status === "arquivada" ? "Arquivada" : "Ativa"
                        }
                        color={
                          mesa.status === "arquivada" ? "default" : "success"
                        }
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        minHeight: 40,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {mesa.descricao || "Sem descrição cadastrada."}
                    </Typography>

                    <Divider sx={{ borderColor: "rgba(196,181,253,0.12)" }} />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        MESTRE
                      </Typography>

                      <Typography variant="body2" fontWeight={600}>
                        {mesa.mestreNome || "Não definido"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        PARTICIPANTES
                      </Typography>

                      <Typography variant="body2">
                        {mesa.participantesIds?.length ??
                          mesa.quantidadeParticipantes ??
                          0}
                      </Typography>
                    </Box>

                    {podeGerenciar && (
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => abrirEdicao(mesa)}
                        >
                          Editar
                        </Button>

                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<ArchiveIcon />}
                          onClick={() => alternarStatus(mesa)}
                        >
                          {mesa.status === "arquivada"
                            ? "Reativar"
                            : "Arquivar"}
                        </Button>

                        {ehAdmin && (
                          <IconButton
                            aria-label={`Excluir mesa ${mesa.nome}`}
                            color="error"
                            onClick={() => excluirMesa(mesa)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Box>
        )}
      </Stack>

      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            backgroundImage: "none",
            border: "1px solid rgba(196,181,253,0.16)",
            borderRadius: 3,
          },
        }}
      >
        <Box component="form" onSubmit={salvarMesa}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {mesaEditando ? "Editar mesa" : "Criar mesa"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              {erro && (
                <Alert severity="error" onClose={() => setErro("")}>
                  {erro}
                </Alert>
              )}

              <TextField
                label="Nome da mesa"
                value={formulario.nome}
                onChange={(event) => alterarCampo("nome", event.target.value)}
                required
                fullWidth
                autoFocus
                inputProps={{ maxLength: 100 }}
              />

              <TextField
                label="Sistema de RPG"
                value={formulario.sistemaNome}
                onChange={(event) =>
                  alterarCampo("sistemaNome", event.target.value)
                }
                required
                fullWidth
                helperText="Por enquanto, informe o nome do sistema. Depois conectaremos ao cadastro de sistemas."
              />

              <TextField
                label="Descrição da campanha"
                value={formulario.descricao}
                onChange={(event) =>
                  alterarCampo("descricao", event.target.value)
                }
                fullWidth
                multiline
                minRows={3}
                inputProps={{ maxLength: 1000 }}
              />

              {mesaEditando && (
                <Alert severity="info">
                  O mestre e os participantes serão mantidos ao editar a mesa.
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={fecharModal} disabled={salvando}>
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={salvando}
              startIcon={
                salvando ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <AddIcon />
                )
              }
            >
              {salvando ? "Salvando..." : "Salvar mesa"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Admin>
  );
}
