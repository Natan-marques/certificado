import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateCertificatePDF } from "@/lib/pdf";
import QRCode from "qrcode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codigo = searchParams.get("codigo");

  if (!codigo) {
    return NextResponse.json({ error: "Código de verificação não fornecido" }, { status: 400 });
  }

  try {
    const certificado = await prisma.certificado.findUnique({
      where: { codigoVerificacao: codigo },
      include: { aluno: true }
    });

    if (!certificado || !certificado.ativo) {
      return NextResponse.json({ error: "Certificado não encontrado ou inativo" }, { status: 404 });
    }

    const validatorUrl = `${process.env.NEXTAUTH_URL}/validar?codigo=${codigo}`;
    const qrCodeDataUrl = await QRCode.toDataURL(validatorUrl, { errorCorrectionLevel: 'M', margin: 1 });

    const pdfBuffer = await generateCertificatePDF(certificado, qrCodeDataUrl);

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${codigo}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json({ error: "Erro interno ao gerar PDF" }, { status: 500 });
  }
}
