"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ValidarPage() {
  const [codigo, setCodigo] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Por favor, complete o desafio de segurança.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/certificado/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, turnstileToken: token }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao validar certificado.");
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError("Erro de conexão ao tentar validar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-center text-gray-800">TargetTrust</h1>
        <p className="mb-6 text-sm text-center text-gray-600">Validação de Certificados</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Código de Verificação
            </label>
            <input 
              type="text" 
              required
              placeholder="Ex: V1X2Y3Z..."
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              className="w-full p-3 font-mono text-center uppercase border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-center my-4">
            <Turnstile 
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""} 
              onSuccess={(t) => setToken(t)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !token}
            className="w-full px-4 py-3 font-bold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Validando..." : "Validar Certificado"}
          </button>
        </form>

        {error && (
          <div className="p-4 mt-6 text-red-800 bg-red-100 border border-red-200 rounded">
            <p className="font-semibold text-center">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-6 mt-6 border border-green-200 rounded bg-green-50">
            <div className="flex items-center justify-center mb-4 text-green-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-4 text-lg font-bold text-center text-green-800">Certificado Válido!</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Aluno:</strong> {result.nome_aluno}</p>
              <p><strong>Curso:</strong> {result.nome_curso}</p>
              <p><strong>Carga Horária:</strong> {result.carga_horaria} horas</p>
              <p><strong>Instrutor:</strong> {result.nome_instrutor}</p>
              <p><strong>Conclusão:</strong> {new Date(result.data_conclusao).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="mt-6 text-center">
              <a 
                href={`/api/certificado/download?codigo=${codigo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 text-sm font-medium text-blue-600 transition-colors border border-blue-600 rounded hover:bg-blue-50"
              >
                Baixar PDF Original
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
