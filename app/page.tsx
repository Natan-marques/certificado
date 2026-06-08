"use client";

import { useState } from "react";
import { ShieldCheck, Search, Award, CheckCircle2 } from "lucide-react";

export default function ValidarCertificado() {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/certificado/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código de certificado inválido ou não encontrado.");
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError("Ocorreu um erro ao processar a validação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 bg-[#141414]">
      <div className="max-w-4xl w-full text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0898C6]/10 border border-[#0898C6]/20 text-[#0898C6] text-xs font-bold uppercase tracking-widest mb-6">
          <ShieldCheck className="w-4 h-4" />
          Protocolo de Autenticidade Ativo
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 uppercase tracking-tight">
          Validação de <span className="text-[#0898C6]">Certificados</span>
        </h1>
        <p className="text-[#7A7A7A] text-lg max-w-2xl mx-auto font-medium">
          Verifique instantaneamente a autenticidade e validade dos certificados profissionais emitidos pela TargetTrust através do código de verificação exclusivo.
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="card-tt p-8 md:p-12 shadow-[0_0_50px_rgba(8,152,198,0.1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-[#FFFFFF] uppercase tracking-widest">
                Código de Verificação
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A] group-focus-within:text-[#0898C6] transition-colors" />
                <input 
                  type="text" 
                  placeholder="EX: ABCD-1234-EFGH"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  className="input-tt pl-12 text-lg font-bold tracking-[0.2em] uppercase"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg uppercase tracking-[0.2em] shadow-lg shadow-[#0898C6]/20"
            >
              {loading ? "Processando..." : "Validar Protocolo"}
            </button>
          </form>

          {error && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-bold text-center uppercase tracking-wider">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-12 p-8 border-2 border-[#22C55E]/20 bg-[#22C55E]/5 rounded-xl animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center justify-center gap-3 text-[#22C55E] font-black uppercase tracking-[0.3em] text-sm mb-8">
                <CheckCircle2 className="w-6 h-6" />
                Certificado Autêntico
              </div>
              
              <div className="space-y-6 text-sm">
                <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-3">
                  <span className="text-[#7A7A7A] font-bold uppercase">Profissional</span>
                  <span className="text-white font-black">{result.nome_aluno}</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-3">
                  <span className="text-[#7A7A7A] font-bold uppercase">Formação</span>
                  <span className="text-white font-black text-right">{result.nome_curso}</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-3">
                  <span className="text-[#7A7A7A] font-bold uppercase">Conclusão</span>
                  <span className="text-white font-black">{new Date(result.data_conclusao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between border-b border-white/5 pb-3">
                  <span className="text-[#7A7A7A] font-bold uppercase">Carga Horária</span>
                  <span className="text-white font-black">{result.carga_horaria} Horas</span>
                </div>
              </div>

              <div className="mt-10">
                <a 
                  href={`/api/certificado/download?codigo=${codigo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full py-3 flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                >
                  <Award className="w-5 h-5" />
                  Visualizar Documento PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
