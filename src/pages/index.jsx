import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import { auth } from "../../firebase-config";
import { ReadByFirebaseUid } from "../services/usuarios";
import LocalStorageCache from "../services/localstorage.cache";

import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import MailOutline from "@mui/icons-material/MailOutline";
import LockOutlined from "@mui/icons-material/LockOutlined";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#A78BFA",
      contrastText: "#171323",
    },
    secondary: {
      main: "#C4B5FD",
    },
    background: {
      default: "#0B0A10",
      paper: "#15131D",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [showPassword, setShowPassword] = React.useState(false);

  const [errors, setErrors] = React.useState({});
  const [loginError, setLoginError] = React.useState("");

  const [resetOpen, setResetOpen] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState("");
  const [resetError, setResetError] = React.useState("");
  const [resetSuccess, setResetSuccess] = React.useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    const newErrors = {
      email: !normalizedEmail,
      password: !password,
    };

    setErrors(newErrors);
    setLoginError("");

    if (newErrors.email || newErrors.password) return;

    setLoading(true);

    try {
      // 1. Autentica a conta no Firebase Authentication.
      const credential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      const firebaseUser = credential.user;

      // 2. Busca o perfil pelo UID, que deve ser o ID do documento.
      const userData = await ReadByFirebaseUid({
        uid: firebaseUser.uid,
      });

      // 3. Confere se existe um perfil correspondente.
      if (!userData) {
        await signOut(auth);

        setLoginError(
          "Não encontramos seu cadastro vinculado a esta conta. Verifique o cadastro no Firestore.",
        );

        return;
      }

      // 4. Confere se o perfil corresponde à conta autenticada.
      if (userData.fbId !== firebaseUser.uid) {
        await signOut(auth);

        setLoginError(
          "O cadastro não corresponde à conta autenticada. Confira o campo fbId no Firestore.",
        );

        return;
      }

      // 5. Confere se a conta está ativa.
      if (userData.ativo !== true) {
        await signOut(auth);

        setLoginError(
          "Sua conta está desativada. Entre em contato com o administrador.",
        );

        return;
      }

      // 6. Identifica o tipo de usuário.
      const userType = String(userData.tipoDeUsuario || "")
        .trim()
        .toLowerCase();

      const isAdmin = ["a", "admin", "administrador"].includes(userType);

      const isPlayer = ["c", "p", "player", "jogador"].includes(userType);

      if (!isAdmin && !isPlayer) {
        await signOut(auth);

        setLoginError("Seu perfil não possui um tipo de acesso válido.");

        return;
      }

      // 7. Salva os dados utilizados pelo layout atual.
      const usuarioLogado = {
        ...userData,
        fbId: firebaseUser.uid,
        email: firebaseUser.email || userData.email,
      };

      localStorage.setItem("isAuth", "true");
      localStorage.setItem("user", JSON.stringify(usuarioLogado));

      const cache = new LocalStorageCache();
      cache.removeItem("cargas");
      cache.removeItem("clientes");

      // 8. Encaminha para a área correspondente.
      if (isAdmin) {
        await router.replace("/dashboard");
      } else {
        await router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Erro ao entrar no No Die:", error);

      const messages = {
        "auth/invalid-email": "Informe um endereço de e-mail válido.",

        "auth/user-disabled":
          "Esta conta está desativada no Firebase Authentication.",

        "auth/user-not-found": "E-mail ou senha inválidos.",

        "auth/wrong-password": "E-mail ou senha inválidos.",

        "auth/invalid-credential": "E-mail ou senha inválidos.",

        "auth/too-many-requests":
          "Muitas tentativas. Aguarde um pouco ou redefina sua senha.",

        "auth/network-request-failed":
          "Falha de conexão. Verifique sua internet e tente novamente.",

        "permission-denied":
          "O Firestore bloqueou a consulta. Confira as regras e o ID do documento em usuarios.",

        unavailable:
          "O Firestore está temporariamente indisponível. Tente novamente.",
      };

      setLoginError(
        messages[error.code] ||
          "Não foi possível entrar. Verifique o cadastro e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    const normalizedEmail = resetEmail.trim();

    if (!normalizedEmail) {
      setResetError("Informe seu e-mail.");
      return;
    }

    setResetLoading(true);
    setResetError("");

    try {
      await sendPasswordResetEmail(auth, normalizedEmail);

      setResetOpen(false);
      setResetSuccess(true);
      setResetEmail("");
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);

      const messages = {
        "auth/invalid-email": "Informe um e-mail válido.",
        "auth/user-not-found":
          "Não foi possível localizar uma conta com esse e-mail.",
        "auth/too-many-requests":
          "Muitas tentativas. Aguarde um pouco antes de tentar novamente.",
      };

      setResetError(
        messages[error.code] ||
          "Não foi possível enviar o e-mail. Tente novamente.",
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Head>
        <title>No Die | Sua jornada começa aqui</title>

        <meta
          name="description"
          content="No Die — gerencie personagens, campanhas, atributos, magias e aventuras de RPG."
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="theme-color" content="#0B0A10" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        />
      )}

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          px: 2,
          py: 5,
          background: `
            radial-gradient(
              ellipse at 50% 0%,
              rgba(124, 58, 237, 0.17),
              transparent 55%
            ),
            radial-gradient(
              ellipse at 100% 100%,
              rgba(91, 33, 182, 0.10),
              transparent 45%
            ),
            #0B0A10
          `,
        }}
      >
        {/* Elementos decorativos de fundo */}
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            border: "1px solid rgba(167, 139, 250, 0.08)",
            top: -190,
            left: -130,
            pointerEvents: "none",
          }}
        />

        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            border: "1px solid rgba(167, 139, 250, 0.06)",
            bottom: -160,
            right: -100,
            pointerEvents: "none",
          }}
        />

        <Container
          maxWidth="sm"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              maxWidth: 430,
              mx: "auto",
              p: {
                xs: 3,
                sm: 5,
              },
              border: "1px solid rgba(196, 181, 253, 0.13)",
              borderRadius: 4,
              background: "rgba(21, 19, 29, 0.94)",
              boxShadow: "0 24px 90px rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(18px)",
            }}
          >
            {/* Identidade No Die */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 66,
                  height: 66,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 3,
                  border: "1px solid rgba(196, 181, 253, 0.28)",
                  background: "linear-gradient(145deg, #31204D, #191522)",
                  color: "#C4B5FD",
                  mb: 2,
                }}
              >
                <AutoAwesome sx={{ fontSize: 34 }} />
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: "2.6rem",
                    sm: "3rem",
                  },
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  lineHeight: 1.1,
                  color: "#F5F3FF",
                }}
              >
                NO DIE
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  color: "#A78BFA",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                }}
              >
                Seu mundo. Suas regras.
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  color: "#A5A0B2",
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 1.7,
                }}
              >
                Suas histórias merecem mais do que uma ficha.
                <br />
                Entre e continue sua jornada.
              </Typography>
            </Box>

            <Typography
              component="h2"
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#F5F3FF",
                mb: 0.5,
              }}
            >
              Entrar na sua conta
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#888397",
                mb: 2,
              }}
            >
              Acesse seus personagens e campanhas.
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate>
              <TextField
                fullWidth
                required
                type="email"
                name="email"
                label="E-mail"
                autoComplete="email"
                autoFocus
                value={email}
                disabled={loading}
                error={Boolean(errors.email)}
                helperText={errors.email ? "Informe seu e-mail." : ""}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    email: false,
                  }));
                  setLoginError("");
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutline sx={{ color: "#8D859F" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1.5,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0F0D15",
                    "& fieldset": {
                      borderColor: "#302B3B",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7661A8",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#A78BFA",
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                required
                name="password"
                label="Senha"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                disabled={loading}
                error={Boolean(errors.password)}
                helperText={errors.password ? "Informe sua senha." : ""}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    password: false,
                  }));
                  setLoginError("");
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#8D859F" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#0F0D15",
                    "& fieldset": {
                      borderColor: "#302B3B",
                    },
                    "&:hover fieldset": {
                      borderColor: "#7661A8",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#A78BFA",
                    },
                  },
                }}
              />

              {loginError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {loginError}
                </Alert>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 1,
                }}
              >
                <Button
                  type="button"
                  size="small"
                  onClick={() => {
                    setResetEmail(email);
                    setResetError("");
                    setResetOpen(true);
                  }}
                  sx={{
                    color: "#B8A6EA",
                    "&:hover": {
                      backgroundColor: "rgba(167, 139, 250, 0.08)",
                    },
                  }}
                >
                  Esqueceu a senha?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  color: "#171323",
                  background: "linear-gradient(90deg, #A78BFA, #C4B5FD)",
                  fontWeight: 800,
                  fontSize: 15,
                  boxShadow: "0 5px 22px rgba(167, 139, 250, 0.16)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #B69EFF, #D4C7FF)",
                    boxShadow: "0 7px 28px rgba(167, 139, 250, 0.25)",
                  },
                }}
              >
                {loading ? "Entrando..." : "Entrar no No Die"}
              </Button>
            </Box>

            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: "1px solid #302B3B",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#777184",
                  letterSpacing: "0.08em",
                }}
              >
                NO DIE RPG PLATFORM
              </Typography>

              <Typography
                sx={{
                  fontSize: 11,
                  color: "#555064",
                  mt: 1,
                }}
              >
                Gerencie suas fichas. Viva suas histórias.
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              color: "#5E586D",
              fontSize: 11,
              mt: 3,
            }}
          >
            © {new Date().getFullYear()} No Die. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>

      {/* Recuperação de senha */}
      <Dialog
        open={resetOpen}
        onClose={() => {
          if (!resetLoading) setResetOpen(false);
        }}
        fullWidth
        maxWidth="xs"
      >
        <Box component="form" onSubmit={handleResetPassword}>
          <DialogTitle>Recuperar senha</DialogTitle>

          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              Informe o e-mail associado à sua conta. Você receberá um link para
              redefinir sua senha.
            </DialogContentText>

            <TextField
              autoFocus
              fullWidth
              required
              type="email"
              name="reset-email"
              label="E-mail"
              autoComplete="email"
              value={resetEmail}
              disabled={resetLoading}
              onChange={(event) => {
                setResetEmail(event.target.value);
                setResetError("");
              }}
              error={Boolean(resetError)}
              helperText={resetError}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setResetOpen(false)} disabled={resetLoading}>
              Cancelar
            </Button>

            <Button type="submit" variant="contained" disabled={resetLoading}>
              {resetLoading ? "Enviando..." : "Enviar link"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={resetSuccess}
        autoHideDuration={6000}
        onClose={() => setResetSuccess(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setResetSuccess(false)}
        >
          Se a conta estiver cadastrada, você receberá as instruções de
          recuperação no e-mail informado.
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
