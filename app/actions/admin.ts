"use server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";
import { auth } from "@/auth";

export async function searchAlunos(query: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  if (!query || query.length < 3) return [];

  const alunos = await prisma.aluno.findMany({
    where: {
      OR: [
        { nome: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 5,
    include: {
      certificados: {
        select: { id: true, nomeCurso: true, dataConclusao: true, codigoVerificacao: true },
        orderBy: { dataConclusao: 'desc' }
      }
    }
  });

  return alunos;
}

export async function createManualCertificate(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const nomeCurso = formData.get("nomeCurso") as string;
  const nomeInstrutor = formData.get("nomeInstrutor") as string;
  const cargaHoraria = parseInt(formData.get("cargaHoraria") as string, 10);
  const dataConclusaoStr = formData.get("dataConclusao") as string;
  
  if (!nome || !email || !nomeCurso || !nomeInstrutor || !cargaHoraria || !dataConclusaoStr) {
    return { error: "Todos os campos são obrigatórios." };
  }

  const dataConclusao = new Date(dataConclusaoStr);

  try {
    // Upsert Aluno
    const aluno = await prisma.aluno.upsert({
      where: { email },
      update: { nome },
      create: { nome, email },
    });

    const codigoVerificacao = nanoid(21);

    const certificado = await prisma.certificado.create({
      data: {
        alunoId: aluno.id,
        codigoVerificacao,
        nomeCurso,
        nomeInstrutor,
        cargaHoraria,
        dataConclusao,
        origem: "manual",
        ativo: true,
      }
    });

    return { success: true, codigoVerificacao };
  } catch (error) {
    console.error("Error creating certificate:", error);
    return { error: "Erro ao gerar o certificado." };
  }
}
