import * as React from "react";
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
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import { useRouter } from "next/router";
import Admin from "../../components/admin";

import {
  listarSistemas,
  criarSistema,
  atualizarSistema,
  alterarStatusSistema,
} from "../../services/sistemas";

const formularioInicial = {
  nome: "",
  codigo: "",
  editora: "",
  versao: "",
  descricao: "",
};

export default function SistemasPage() {
  const router = useRouter();

  const [sistemas, setSistemas] = React.useState([]);
  const [carregando, setCarregando] = React.useState(true);
  const [salvando, setSalvando] = React.useState(false);
  const [permitido, setPermitido] = React.useState(false);

  const [modalAberto, setModalAberto] = React.useState(false);
  const [sistemaEditando, setSistemaEditando] = React.useState(null);
  const [formulario, setFormulario] = React.useState(formularioInicial);

  const [mensagem, setMensagem] = React.useState("");
  const [tipoMensagem, setTipoMensagem] = React.useState("success");

  const carregarSistemas = React.useCallback(async () => {
    setCarregando(true);

    try {
      const resultado = await listarSistemas();
      setSistemas(resultado);
    } catch (error) {
      console.error("Erro ao carregar sistemas:", error);
      setTipoMensagem("error");
      setMensagem("Não foi possível carregar os sistemas de RPG.");
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    if (!router.isReady) return;

    try {
      const usuario = JSON.parse(localStorage.getItem("user") || "null");
      const autenticado = localStorage.getItem("isAuth") === "true";
      const tipo = String(usuario?.tipoDeUsuario || "")
        .trim()
        .toLowerCase();

      const administrador = ["a", "admin", "administrador"].includes(tipo);

      if (!autenticado || !administrador) {
        router.replace(autenticado ? "/dashboard" : "/");
        return;
      }

      setPermitido(true);
    } catch (error) {
      console.error("Erro ao validar acesso:", error);
      router.replace("/");
    }
  }, [router.isReady, router]);

  React.useEffect(() => {
    if (permitido) {
      carregarSistemas();
    }
  }, [permitido, carregarSistemas]);

  const abrirCadastro = () => {
    setSistemaEditando(null);
    setFormulario(formularioInicial);
    setMensagem("");
    setModalAberto(true);
  };

  const abrirEdicao = (sistema) => {
    setSistemaEditando(sistema);
    setFormulario({
      nome: sistema.nome || "",
      codigo: sistema.codigo || "",
      editora: sistema.editora || "",
      versao: sistema.versao || "",
      descricao: sistema.descricao || "",
    });
    setMensagem("");
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;
    setModalAberto(false);
  };

  const alterarCampo = (event) => {
    const { name, value } = event.target;

    setFormulario((atual) => ({
      ...atual,
      [name]: value,
    }));
  };

  const mostrarMensagem = (texto, tipo = "success") => {
    setMensagem(texto);
    setTipoMensagem(tipo);
  };

  const salvarSistema = async (event) => {
    event.preventDefault();
    setMensagem("");

    if (
      !formulario.nome.trim() ||
      !formulario.codigo.trim() ||
      !formulario.versao.trim()
    ) {
      mostrarMensagem(
        "Preencha o nome, o código e a versão do sistema.",
        "error",
      );
      return;
    }

    setSalvando(true);

    try {
      if (sistemaEditando) {
        await atualizarSistema(sistemaEditando.id, formulario);
        mostrarMensagem("Sistema atualizado com sucesso.");
      } else {
        await criarSistema(formulario);
        mostrarMensagem("Sistema cadastrado com sucesso.");
      }

      setModalAberto(false);
      await carregarSistemas();
    } catch (error) {
      console.error("Erro ao salvar sistema:", error);
      mostrarMensagem(
        error.message || "Não foi possível salvar o sistema.",
        "error",
      );
    } finally {
      setSalvando(false);
    }
  };

  const alternarStatus = async (sistema) => {
    const novoStatus = sistema.ativo !== true;

    const confirmado = window.confirm(
      novoStatus
        ? `Deseja ativar o sistema "${sistema.nome}"?`
        : `Deseja desativar o sistema "${sistema.nome}"?`,
    );

    if (!confirmado) return;

    try {
      await alterarStatusSistema(sistema.id, novoStatus);
      mostrarMensagem(
        novoStatus
          ? "Sistema ativado com sucesso."
          : "Sistema desativado com sucesso.",
      );
      await carregarSistemas();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      mostrarMensagem("Não foi possível alterar o status do sistema.", "error");
    }
  };

  if (!permitido) {
    return null;
  }

  return (
    <Admin>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Sistemas de RPG
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Gerencie os sistemas e suas versões disponíveis no No Die.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={abrirCadastro}
          >
            Novo sistema
          </Button>
        </Box>

        {mensagem && (
          <Alert severity={tipoMensagem} onClose={() => setMensagem("")}>
            {mensagem}
          </Alert>
        )}

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Paper sx={{ p: 2, minWidth: 150, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total de sistemas
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {sistemas.length}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, minWidth: 150, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Sistemas ativos
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {sistemas.filter((item) => item.ativo === true).length}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, minWidth: 150, flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Sistemas inativos
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {sistemas.filter((item) => item.ativo !== true).length}
            </Typography>
          </Paper>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Sistema</strong>
                </TableCell>
                <TableCell>
                  <strong>Código</strong>
                </TableCell>
                <TableCell>
                  <strong>Editora</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Ações</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {carregando ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : sistemas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      Nenhum sistema cadastrado.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clique em “Novo sistema” para começar.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sistemas.map((sistema) => (
                  <TableRow key={sistema.id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{sistema.nome}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Versão {sistema.versao || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>{sistema.codigo}</TableCell>
                    <TableCell>{sistema.editora || "—"}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={sistema.ativo ? "Ativo" : "Inativo"}
                        color={sistema.ativo ? "success" : "default"}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Editar sistema">
                        <IconButton
                          aria-label="Editar sistema"
                          onClick={() => abrirEdicao(sistema)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={sistema.ativo ? "Desativar" : "Ativar"}>
                        <IconButton
                          aria-label={
                            sistema.ativo
                              ? "Desativar sistema"
                              : "Ativar sistema"
                          }
                          onClick={() => alternarStatus(sistema)}
                        >
                          <PowerSettingsNewIcon
                            color={sistema.ativo ? "success" : "disabled"}
                          />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog open={modalAberto} onClose={fecharModal} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={salvarSistema}>
          <DialogTitle>
            {sistemaEditando ? "Editar sistema" : "Cadastrar sistema"}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <TextField
                label="Nome do sistema"
                name="nome"
                value={formulario.nome}
                onChange={alterarCampo}
                required
                fullWidth
              />

              <TextField
                label="Código único"
                name="codigo"
                value={formulario.codigo}
                onChange={alterarCampo}
                required
                fullWidth
                helperText="Ex.: dnd-5e-2014 ou dnd-5e-2024"
              />

              <TextField
                label="Versão"
                name="versao"
                value={formulario.versao}
                onChange={alterarCampo}
                required
                fullWidth
                placeholder="Ex.: 2014"
              />

              <TextField
                label="Editora"
                name="editora"
                value={formulario.editora}
                onChange={alterarCampo}
                fullWidth
              />

              <TextField
                label="Descrição"
                name="descricao"
                value={formulario.descricao}
                onChange={alterarCampo}
                fullWidth
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={fecharModal} disabled={salvando}>
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar sistema"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Admin>
  );
}
