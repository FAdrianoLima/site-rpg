import axios from "axios";

import { getApp, getApps, initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  signOut,
} from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../firebase-config";

const usuariosRef = collection(db, "usuarios");

/**
 * Normaliza o e-mail para evitar diferenças por espaços ou maiúsculas.
 */
function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

/**
 * Usa uma instância secundária do Firebase Auth.
 *
 * Assim, criar um usuário não substitui a sessão do administrador
 * que está utilizando o painel.
 */
function getUserCreationAuth() {
  const defaultApp = getApp();

  const secondaryAppName = "NoDieUserCreation";

  const existingApp = getApps().find((app) => app.name === secondaryAppName);

  const secondaryApp =
    existingApp || initializeApp(defaultApp.options, secondaryAppName);

  return getAuth(secondaryApp);
}

/**
 * Lista todos os usuários cadastrados no Firestore.
 */
export async function ReadAll() {
  const snapshot = await getDocs(usuariosRef);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

/**
 * Busca um usuário pelo ID do documento no Firestore.
 */
export async function Read({ id }) {
  if (!id) {
    throw new Error("O ID do usuário é obrigatório.");
  }

  const snapshot = await getDoc(doc(db, "usuarios", id));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}

/**
 * Busca o perfil pelo UID do Firebase Authentication,
 * armazenado no campo fbId do documento.
 */
export async function ReadByFirebaseUid({ uid }) {
  if (!uid) {
    throw new Error("O UID do Firebase é obrigatório.");
  }

  const consulta = query(usuariosRef, where("fbId", "==", uid));

  const snapshot = await getDocs(consulta);

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...item.data(),
  };
}

/**
 * Busca um usuário pelo e-mail normalizado.
 */
export async function ReadByEmail({ email }) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return null;
  }

  const consulta = query(usuariosRef, where("email", "==", normalizedEmail));

  const snapshot = await getDocs(consulta);

  if (snapshot.empty) {
    return null;
  }

  const item = snapshot.docs[0];

  return {
    id: item.id,
    ...item.data(),
  };
}

/**
 * Cria uma conta no Firebase Authentication e seu registro no Firestore.
 *
 * Campos mantidos:
 * nome, email, ativo, tipoDeUsuario, clienteId e fbId.
 */
export async function Create({
  nome,
  email,
  senha,
  ativo = false,
  tipoDeUsuario = "",
  clienteId = null,
}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = String(nome || "").trim();

  if (!normalizedName) {
    throw new Error("O nome do usuário é obrigatório.");
  }

  if (!normalizedEmail) {
    throw new Error("O e-mail do usuário é obrigatório.");
  }

  if (!senha || String(senha).length < 6) {
    throw new Error("A senha deve ter pelo menos 6 caracteres.");
  }

  const usuarioExistente = await ReadByEmail({
    email: normalizedEmail,
  });

  if (usuarioExistente) {
    throw new Error("Já existe um usuário cadastrado com esse e-mail.");
  }

  const creationAuth = getUserCreationAuth();

  let credential = null;

  try {
    credential = await createUserWithEmailAndPassword(
      creationAuth,
      normalizedEmail,
      senha,
    );

    const usuario = {
      fbId: credential.user.uid,
      nome: normalizedName,
      email: normalizedEmail,
      ativo: Boolean(ativo),
      tipoDeUsuario,
      clienteId: clienteId || null,
    };

    try {
      const documento = await addDoc(usuariosRef, usuario);

      return {
        id: documento.id,
        ...usuario,
      };
    } catch (firestoreError) {
      // Evita deixar uma conta de autenticação órfã
      // caso o registro no Firestore falhe.
      try {
        await deleteUser(credential.user);
      } catch (rollbackError) {
        console.error(
          "Não foi possível remover a conta criada após a falha no Firestore:",
          rollbackError,
        );
      }

      throw firestoreError;
    }
  } finally {
    // A sessão secundária não deve permanecer autenticada.
    try {
      if (creationAuth.currentUser) {
        await signOut(creationAuth);
      }
    } catch (error) {
      console.error(
        "Não foi possível encerrar a sessão secundária do Firebase:",
        error,
      );
    }
  }
}

/**
 * Atualiza os dados do usuário no Firestore.
 */
export async function Update({
  id,
  fbId,
  nome,
  email,
  ativo,
  tipoDeUsuario,
  clienteId,
}) {
  if (!id) {
    throw new Error("O ID do documento é obrigatório.");
  }

  const dadosAtuais = await Read({ id });

  if (!dadosAtuais) {
    throw new Error("Usuário não encontrado.");
  }

  const normalizedEmail =
    email !== undefined ? normalizeEmail(email) : dadosAtuais.email;

  if (email !== undefined && !normalizedEmail) {
    throw new Error("O e-mail do usuário é obrigatório.");
  }

  if (email !== undefined && normalizedEmail !== dadosAtuais.email) {
    const usuarioExistente = await ReadByEmail({
      email: normalizedEmail,
    });

    if (usuarioExistente && usuarioExistente.id !== id) {
      throw new Error("Já existe um usuário cadastrado com esse e-mail.");
    }
  }

  const dadosAtualizados = {};

  if (nome !== undefined) {
    const normalizedName = String(nome).trim();

    if (!normalizedName) {
      throw new Error("O nome do usuário é obrigatório.");
    }

    dadosAtualizados.nome = normalizedName;
  }

  if (email !== undefined) {
    dadosAtualizados.email = normalizedEmail;
  }

  if (ativo !== undefined) {
    dadosAtualizados.ativo = Boolean(ativo);
  }

  if (tipoDeUsuario !== undefined) {
    dadosAtualizados.tipoDeUsuario = tipoDeUsuario;
  }

  if (clienteId !== undefined) {
    dadosAtualizados.clienteId = clienteId || null;
  }

  if (fbId !== undefined) {
    dadosAtualizados.fbId = fbId;
  }

  await updateDoc(doc(db, "usuarios", id), dadosAtualizados);

  return {
    ...dadosAtuais,
    ...dadosAtualizados,
    id,
  };
}

/**
 * Exclui o registro do usuário no Firestore.
 *
 * Atenção: isso NÃO exclui a conta do Firebase Authentication.
 */
export async function Delete({ id }) {
  if (!id) {
    throw new Error("O ID do usuário é obrigatório.");
  }

  const usuario = await Read({ id });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  await deleteDoc(doc(db, "usuarios", id));

  return {
    id,
    success: true,
  };
}

/**
 * Consulta endereço pelo CEP usando o ViaCEP.
 */
export async function GetAddressFromCep({ cep }) {
  const normalizedCep = String(cep || "").replace(/\D/g, "");

  if (normalizedCep.length !== 8) {
    throw new Error("Informe um CEP válido com 8 dígitos.");
  }

  const response = await axios.get(
    `https://viacep.com.br/ws/${normalizedCep}/json/`,
  );

  if (response.data?.erro) {
    throw new Error("CEP não encontrado.");
  }

  return response.data;
}

/**
 * Mantida para compatibilidade com código existente.
 * Não deve ser usada para gerar ou armazenar senhas de usuários.
 */
export function makeRandomString(length = 8) {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  return Array.from({ length }, () =>
    caracteres.charAt(Math.floor(Math.random() * caracteres.length)),
  ).join("");
}
