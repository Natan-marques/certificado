import puppeteer from 'puppeteer-core';

export async function generateCertificatePDF(certificado: any, qrCodeDataUrl: string): Promise<Buffer> {
  const isLocal = process.env.NODE_ENV === 'development';
  let browser: any = null;

  try {
    if (isLocal) {
      // Desenvolvimento local: tenta usar o puppeteer padrão ou faz fallback para o Edge
      try {
        const puppeteerFull = require('puppeteer');
        browser = await puppeteerFull.launch({ headless: 'new' });
      } catch (e) {
        browser = await puppeteer.launch({
          executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
          headless: 'new',
        });
      }
    } else {
      // Produção (Hospedagem Compartilhada Hostinger): lazy load do @sparticuz/chromium-min
      const chromium = require('@sparticuz/chromium-min');
      
      browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&family=Jura:wght@700&display=swap');
          
          body {
            margin: 0;
            padding: 0;
            width: 1123px;
            height: 794px;
            font-family: 'Poppins', sans-serif;
            background-color: #f8f9fa;
          }

          .certificate-wrapper {
            width: 1123px;
            height: 794px;
            padding: 40px;
            box-sizing: border-box;
            background-color: #141414;
            position: relative;
          }

          .inner-frame {
            border: 4px solid #0898C6;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding: 60px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            background-color: #141414;
          }

          .logo {
            height: 70px;
            margin-bottom: 40px;
          }

          .cert-label {
            font-family: 'Jura', sans-serif;
            font-size: 14px;
            color: #FF9F00;
            text-transform: uppercase;
            letter-spacing: 6px;
            margin-bottom: 30px;
            font-weight: 700;
          }

          .intro-text {
            font-size: 18px;
            color: #7A7A7A;
            max-width: 800px;
            margin-bottom: 40px;
            line-height: 1.6;
          }

          .nome-aluno {
            font-size: 48px;
            font-weight: 900;
            color: #0898C6;
            margin-bottom: 30px;
            text-transform: uppercase;
            border-bottom: 2px solid #0898C6;
            display: inline-block;
            padding-bottom: 10px;
          }

          .detalhes-curso {
            font-size: 18px;
            color: #7A7A7A;
            line-height: 1.6;
            max-width: 800px;
          }

          .detalhes-curso strong {
            color: #FFFFFF;
            font-weight: 700;
          }

          .footer {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: auto;
            padding-top: 40px;
          }

          .assinatura {
            text-align: left;
          }

          .assinatura-line {
            width: 250px;
            height: 1px;
            background-color: #7A7A7A;
            margin-bottom: 10px;
          }

          .nome-instrutor {
            font-weight: 700;
            font-size: 16px;
            color: #FFFFFF;
            text-transform: uppercase;
          }

          .cargo-instrutor {
            font-size: 12px;
            color: #7A7A7A;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .qrcode-container {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }

          .qrcode-container img {
            width: 90px;
            height: 90px;
            background-color: white;
            padding: 5px;
            border-radius: 4px;
          }

          .codigo-verificacao {
            margin-top: 8px;
            font-size: 10px;
            color: #7A7A7A;
            font-family: monospace;
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <div class="certificate-wrapper">
          <div class="inner-frame">
            <img src="https://targettrust.com.br/wp-content/uploads/2023/01/logott.png" class="logo">
            
            <div class="cert-label">Certificado de Conclusão Profissional</div>
            
            <div class="intro-text">
              A TargetTrust certifica que o profissional abaixo completou com aproveitamento todos os requisitos da formação tecnológica.
            </div>

            <div class="nome-aluno">${certificado.aluno.nome}</div>

            <div class="detalhes-curso">
              concluiu com êxito o treinamento de <strong>${certificado.nomeCurso}</strong>,<br/>
              com carga horária de <strong>${certificado.cargaHoraria} horas</strong>, em 
              <strong>${certificado.dataConclusao.toLocaleDateString('pt-BR')}</strong>.
            </div>
            
            <div class="footer">
              <div class="assinatura">
                <div class="assinatura-line"></div>
                <div class="nome-instrutor">${certificado.nomeInstrutor}</div>
                <div class="cargo-instrutor">Instrutor Responsável</div>
                <div style="font-size: 10px; color: #444; margin-top: 5px;">Porto Alegre, RS - Brasil</div>
              </div>

              <div class="qrcode-container">
                <img src="${qrCodeDataUrl}" alt="QR Code" />
                <div class="codigo-verificacao">PROTOCOLO: ${certificado.codigoVerificacao}</div>
                <div class="codigo-verificacao" style="font-size: 8px;">targettrust.com.br/validar</div>
              </div>
            </div>
          </div>
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

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
}

