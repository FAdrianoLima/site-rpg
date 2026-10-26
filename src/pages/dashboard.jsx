import * as React from "react";
import { useRouter } from "next/router";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

import Admin from "../components/admin";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const CORES = {
  fundo: "#0B0A10",
  painel: "#15131D",
  borda: "rgba(196, 181, 253, 0.14)",
  texto: "#F5F3FF",
  secundario: "#A5A0B2",
  destaque: "#A78BFA",
};

function CardIndicador({ titulo, valor, descricao, icon }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        bgcolor: CORES.painel,
        color: CORES.texto,
        border: `1px solid ${CORES.borda}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "rgba(167,139,250,0.12)",
            color: CORES.destaque,
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>

        <Typography variant="h4" sx={{ fontWeight: 800, color: CORES.texto }}>
          {valor}
        </Typography>
      </Box>

      <Typography sx={{ mt: 2, fontWeight: 700 }}>{titulo}</Typography>

      <Typography variant="body2" sx={{ mt: 0.5, color: CORES.secundario }}>
        {descricao}
      </Typography>
    </Paper>
  );
}

function AcaoRapida({ titulo, descricao, icon, onClick }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: "100%",
        bgcolor: CORES.painel,
        color: CORES.texto,
        border: `1px solid ${CORES.borda}`,
        borderRadius: 3,
        transition: "border-color 0.2s",
        "&:hover": {
          borderColor: CORES.destaque,
        },
      }}
    >
      <Avatar
        sx={{
          mb: 2,
          bgcolor: "rgba(167,139,250,0.12)",
          color: CORES.destaque,
        }}
      >
        {icon}
      </Avatar>

      <Typography fontWeight={700}>{titulo}</Typography>

      <Typography
        variant="body2"
        sx={{
          color: CORES.secundario,
          mt: 0.75,
          mb: 2,
          minHeight: 40,
        }}
      >
        {descricao}
      </Typography>

      <Button
        onClick={onClick}
        endIcon={<ArrowForwardIcon />}
        sx={{ px: 0, color: CORES.destaque }}
      >
        Acessar
      </Button>
    </Paper>
  );
}

export default function Dashboard() {
  const router = useRouter();

  const [carregando, setCarregando] = React.useState(true);
  const [erro, setErro] = React.useState("");

  const [dados, setDados] = React.useState({
    usuarios: 0,
    mesas: 0,
    sistemas: 0,
    personagens: 0,
  });

  const carregarDados = React.useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const [usuarios, mesas, sistemas, personagens] = await Promise.all([
        getDocs(collection(db, "usuarios")),
        getDocs(collection(db, "mesas")),
        getDocs(collection(db, "sistemasRPG")),
        getDocs(collection(db, "personagens")),
      ]);

      setDados({
        usuarios: usuarios.size,
        mesas: mesas.size,
        sistemas: sistemas.size,
        personagens: personagens.size,
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard No Die:", error);

      setErro(
        error?.code === "permission-denied"
          ? "O Firebase não permitiu consultar os dados. Verifique as regras de acesso do Firestore."
          : "Não foi possível carregar os indicadores. Verifique sua conexão e as coleções do Firebase.",
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  React.useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const irPara = (rota) => {
    router.push(rota);
  };

  return (
    <Admin>
      <Box
        sx={{
          minHeight: "100%",
          pb: 4,
          color: CORES.texto,
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.04em",
              }}
            >
              Painel No Die
            </Typography>

            <Typography sx={{ mt: 1, color: CORES.secundario }}>
              Gerencie os sistemas, as mesas e os personagens da plataforma.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={carregarDados}
            disabled={carregando}
            sx={{
              color: CORES.texto,
              borderColor: CORES.borda,
            }}
          >
            Atualizar
          </Button>
        </Box>

        {erro && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        )}

        {/* Indicadores */}
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <CardIndicador
              titulo="Usuários"
              valor={carregando ? "—" : dados.usuarios}
              descricao="Contas cadastradas"
              icon={<PeopleAltOutlinedIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardIndicador
              titulo="Mesas"
              valor={carregando ? "—" : dados.mesas}
              descricao="Campanhas cadastradas"
              icon={<GroupsOutlinedIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardIndicador
              titulo="Sistemas"
              valor={carregando ? "—" : dados.sistemas}
              descricao="Sistemas de RPG disponíveis"
              icon={<AutoAwesomeOutlinedIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <CardIndicador
              titulo="Personagens"
              valor={carregando ? "—" : dados.personagens}
              descricao="Fichas cadastradas"
              icon={<ShieldOutlinedIcon />}
            />
          </Grid>
        </Grid>

        {/* Atalhos administrativos */}
        <Box sx={{ mt: 5, mb: 2 }}>
          <Typography variant="h5" fontWeight={800}>
            Administração
          </Typography>

          <Typography sx={{ mt: 0.75, color: CORES.secundario }}>
            Gerencie os principais recursos da plataforma.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={4}>
            <AcaoRapida
              titulo="Usuários"
              descricao="Cadastre jogadores, administradores e gerencie os acessos."
              icon={<PeopleAltOutlinedIcon />}
              onClick={() => irPara("/usuarios")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AcaoRapida
              titulo="Mesas e campanhas"
              descricao="Organize mestres, participantes e campanhas."
              icon={<GroupsOutlinedIcon />}
              onClick={() => irPara("/mesas")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AcaoRapida
              titulo="Sistemas de RPG"
              descricao="Configure atributos, fórmulas, perícias e recursos."
              icon={<AutoAwesomeOutlinedIcon />}
              onClick={() => irPara("/sistemas")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AcaoRapida
              titulo="Personagens"
              descricao="Consulte e gerencie as fichas conforme as permissões."
              icon={<ShieldOutlinedIcon />}
              onClick={() => irPara("/personagens")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AcaoRapida
              titulo="Criar sistema"
              descricao="Cadastre um novo RPG para disponibilizar na plataforma."
              icon={<AddIcon />}
              onClick={() => irPara("/sistemas/novo")}
            />
          </Grid>
        </Grid>

        {carregando && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <CircularProgress sx={{ color: CORES.destaque }} />
          </Box>
        )}
      </Box>
    </Admin>
  );
}
