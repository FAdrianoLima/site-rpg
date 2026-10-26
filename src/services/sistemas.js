import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../../firebase-config";

const sistemasRef = collection(db, "sistemasRPG");

export async function listarSistemas() {
  const snapshot = await getDocs(sistemasRef);

  return snapshot.docs
    .map((item) => ({
      id: item.id,
      ...item.data(),
    }))
    .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
}

async function verificarCodigoDuplicado(codigo, idIgnorado = null) {
  const codigoNormalizado = codigo.trim().toLowerCase();

  const consulta = query(sistemasRef, where("codigo", "==", codigoNormalizado));

  const snapshot = await getDocs(consulta);

  return snapshot.docs.some((item) => item.id !== idIgnorado);
}

export async function criarSistema(dados) {
  const codigo = dados.codigo.trim().toLowerCase();

  if (await verificarCodigoDuplicado(codigo)) {
    throw new Error("Já existe um sistema com esse código.");
  }

  return addDoc(sistemasRef, {
    nome: dados.nome.trim(),
    codigo,
    editora: dados.editora.trim(),
    versao: dados.versao.trim(),
    descricao: dados.descricao.trim(),
    ativo: true,
    oficial: false,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
}

export async function atualizarSistema(id, dados) {
  const codigo = dados.codigo.trim().toLowerCase();

  if (await verificarCodigoDuplicado(codigo, id)) {
    throw new Error("Já existe outro sistema com esse código.");
  }

  return updateDoc(doc(db, "sistemasRPG", id), {
    nome: dados.nome.trim(),
    codigo,
    editora: dados.editora.trim(),
    versao: dados.versao.trim(),
    descricao: dados.descricao.trim(),
    atualizadoEm: serverTimestamp(),
  });
}

export async function alterarStatusSistema(id, ativo) {
  return updateDoc(doc(db, "sistemasRPG", id), {
    ativo,
    atualizadoEm: serverTimestamp(),
  });
}
