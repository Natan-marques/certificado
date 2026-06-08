import type { Metadata } from "next";
import { Poppins, Jura } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TargetTrust | Validação de Certificados",
  description: "Sistema de emissão e validação de certificados TargetTrust",
  icons: {
    icon: "https://targettrust.com.br/wp-content/uploads/2023/08/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${jura.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#141414] text-white font-sans antialiased">
        <header className="bg-[#141414] border-b border-white/5 sticky top-0 z-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex-shrink-0">
                <a href="/">
                  <img
                    src="https://targettrust.com.br/wp-content/uploads/2023/01/logott.png"
                    alt="TargetTrust Logo"
                    className="h-12 w-auto"
                  />
                </a>
              </div>
              <div className="hidden md:block">
                <span className="text-[#0898C6] font-display text-sm font-bold uppercase tracking-widest">
                  Certificação
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-[#000000] border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8 flex justify-center">
              <img
                src="https://targettrust.com.br/wp-content/uploads/2023/01/logott-rodape.png"
                alt="TargetTrust Rodapé"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-[#7A7A7A] text-sm max-w-md mx-auto mb-8 font-medium">
              Transformando carreiras através da educação tecnológica de alto nível desde 1991.
            </p>
            <div className="pt-8 border-t border-white/5 text-xs text-[#7A7A7A] uppercase tracking-[0.2em] font-bold">
              &copy; {new Date().getFullYear()} TargetTrust - Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
