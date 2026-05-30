import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { codigo, turnstileToken } = await request.json();

    if (!codigo) {
      return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ error: "Validação de segurança (CAPTCHA) pendente" }, { status: 400 });
    }

    // Validate Turnstile Token
    const verifyFormData = new FormData();
    verifyFormData.append('secret', process.env.TURNSTILE_SECRET_KEY || '');
    verifyFormData.append('response', turnstileToken);

    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verifyFormData,
    });
    
    const turnstileResult = await turnstileResponse.json();
    
    if (!turnstileResult.success) {
      return NextResponse.json({ error: "Falha na validação de segurança (CAPTCHA)" }, { status: 403 });
    }

    // Proceed to search certificate
    const certificado = await prisma.certificado.findUnique({
      where: { codigoVerificacao: codigo },
      include: { aluno: { select: { nome: true } } }
    });

    if (!certificado || !certificado.ativo) {
      return NextResponse.json({ error: "Certificado não encontrado ou inválido" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        nome_aluno: certificado.aluno.nome,
        nome_curso: certificado.nomeCurso,
        nome_instrutor: certificado.nomeInstrutor,
        carga_horaria: certificado.cargaHoraria,
        data_conclusao: certificado.dataConclusao.toISOString(),
      }
    });

  } catch (error) {
    console.error("Erro na validação do certificado:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
