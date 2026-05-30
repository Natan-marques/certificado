import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = request.headers.get("X-API-Key");

  if (!apiKey || apiKey !== process.env.MOODLE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nome = searchParams.get("nome");
  const email = searchParams.get("email");
  const curso = searchParams.get("curso");
  const conclusao = searchParams.get("conclusao");
  const instrutor = searchParams.get("instrutor");
  const carga_horaria = searchParams.get("carga_horaria");

  if (!nome || !email || !curso || !conclusao || !instrutor || !carga_horaria) {
    return NextResponse.json({ error: "Parâmetros incompletos" }, { status: 400 });
  }

  try {
    const dataConclusao = new Date(conclusao);

    const aluno = await prisma.aluno.upsert({
      where: { email },
      update: { nome },
      create: { nome, email },
    });

    const certificadoExistente = await prisma.certificado.findFirst({
      where: {
        alunoId: aluno.id,
        nomeCurso: curso,
        ativo: true
      }
    });

    if (certificadoExistente) {
      return NextResponse.json({
        success: true,
        message: "Certificado já existente",
        codigo_verificacao: certificadoExistente.codigoVerificacao
      });
    }

    const codigoVerificacao = nanoid(21);

    const certificado = await prisma.certificado.create({
      data: {
        alunoId: aluno.id,
        codigoVerificacao,
        nomeCurso: curso,
        nomeInstrutor: instrutor,
        cargaHoraria: parseInt(carga_horaria, 10),
        dataConclusao,
        origem: "automatico",
        ativo: true,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Certificado gerado com sucesso",
      codigo_verificacao: certificado.codigoVerificacao
    });
  } catch (error) {
    console.error("Erro na API do Moodle:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
