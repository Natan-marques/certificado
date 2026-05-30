import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export async function generateCertificatePDF(certificado: any, qrCodeDataUrl: string): Promise<Buffer> {
  const isLocal = process.env.NODE_ENV === 'development';

  let browser;

  if (isLocal) {
    // For local development on Windows/Mac, you might need to point to a local Chrome executable
    // or we can try using the sparticuz executable if it works locally.
    // Generally @sparticuz/chromium is meant for AWS Lambda / Linux.
    // As a fallback for local, we require puppeteer (full) to be installed or a local executable.
    try {
      const puppeteerFull = require('puppeteer');
      browser = await puppeteerFull.launch({ headless: 'new' });
    } catch (e) {
      // If puppeteer full is not installed, fallback to Edge/Chrome path (Windows default)
      browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', // Fallback for Windows
        headless: 'new',
      });
    }
  } else {
    // Production (Linux VPS)
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const page = await browser.newPage();

  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          width: 1123px;
          height: 794px;
          font-family: 'Inter', sans-serif;
          background-image: url('${process.env.NEXTAUTH_URL}/templates/certificado.png');
          background-size: 1123px 794px;
          background-repeat: no-repeat;
          position: relative;
          color: #333;
        }

        .nome-aluno {
          position: absolute;
          top: 320px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 42px;
          font-weight: 700;
          color: #1f2937;
        }

        .detalhes-curso {
          position: absolute;
          top: 420px;
          left: 100px;
          right: 100px;
          text-align: center;
          font-size: 22px;
          line-height: 1.5;
        }

        .assinatura {
          position: absolute;
          bottom: 120px;
          left: 150px;
          text-align: center;
        }

        .assinatura .nome-instrutor {
          font-weight: 600;
          font-size: 20px;
          border-top: 1px solid #333;
          padding-top: 5px;
          width: 300px;
        }

        .qrcode-container {
          position: absolute;
          bottom: 50px;
          right: 50px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qrcode-container img {
          width: 120px;
          height: 120px;
        }

        .codigo-verificacao {
          margin-top: 5px;
          font-size: 12px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <div class="nome-aluno">${certificado.aluno.nome}</div>
      <div class="detalhes-curso">
        Concluiu com êxito o curso de <strong>${certificado.nomeCurso}</strong>,<br/>
        com carga horária de <strong>${certificado.cargaHoraria} horas</strong>, em 
        <strong>${certificado.dataConclusao.toLocaleDateString('pt-BR')}</strong>.
      </div>
      
      <div class="assinatura">
        <div class="nome-instrutor">${certificado.nomeInstrutor}</div>
        <div style="font-size: 14px; margin-top: 2px;">Instrutor</div>
      </div>

      <div class="qrcode-container">
        <img src="${qrCodeDataUrl}" alt="QR Code de Validação" />
        <div class="codigo-verificacao">Cód: ${certificado.codigoVerificacao}</div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    width: '1123px',
    height: '794px',
    printBackground: true,
  });

  await browser.close();

  return Buffer.from(pdfBuffer);
}
