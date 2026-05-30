"use client";

import { useState, useTransition } from "react";
import { searchAlunos, createManualCertificate } from "@/app/actions/admin";
import { logoutAction } from "@/app/actions/auth";

export default function AdminClient() {
  const [query, setQuery] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [selectedAluno, setSelectedAluno] = useState<any | null>(null);
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  
  const [isPendingSearch, startTransitionSearch] = useTransition();
  const [isPendingCreate, startTransitionCreate] = useTransition();

  const [message, setMessage] = useState<{type: 'error' | 'success', text: string, code?: string} | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 3) {
      startTransitionSearch(async () => {
        const results = await searchAlunos(value);
        setAlunos(results);
      });
    } else {
      setAlunos([]);
    }
  };

  const selectAluno = (aluno: any) => {
    setSelectedAluno(aluno);
    setNome(aluno.nome);
    setEmail(aluno.email);
    setQuery("");
    setAlunos([]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    startTransitionCreate(async () => {
      const res = await createManualCertificate(formData);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else if (res.success && res.codigoVerificacao) {
        setMessage({ 
          type: 'success', 
          text: 'Certificado criado com sucesso!', 
          code: res.codigoVerificacao 
        });
        // Clear course fields, keep student if desired or clear all
      }
    });
  };

  return (
    <div className="max-w-4xl p-6 mx-auto bg-white rounded shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerar Certificado Manual</h2>
        <button onClick={() => logoutAction()} className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50">
          Sair
        </button>
      </div>

      <div className="mb-8 relative">
        <label className="block mb-2 text-sm font-medium text-gray-700">Buscar Aluno Existente (Nome ou Email)</label>
        <input 
          type="text" 
          value={query}
          onChange={handleSearch}
          placeholder="Digite para buscar..."
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {isPendingSearch && <p className="mt-1 text-xs text-gray-500">Buscando...</p>}
        
        {alunos.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-200 rounded shadow max-h-60">
            {alunos.map(aluno => (
              <li 
                key={aluno.id} 
                onClick={() => selectAluno(aluno)}
                className="p-3 border-b cursor-pointer hover:bg-blue-50 last:border-b-0"
              >
                <div className="font-semibold">{aluno.nome}</div>
                <div className="text-sm text-gray-600">{aluno.email}</div>
                {aluno.certificados.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">
                    Certificados: {aluno.certificados.map((c:any) => c.nomeCurso).join(', ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nome do Aluno</label>
            <input 
              name="nome" 
              required 
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email do Aluno</label>
            <input 
              name="email" 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nome do Curso</label>
            <input 
              name="nomeCurso" 
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Nome do Instrutor</label>
            <input 
              name="nomeInstrutor" 
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Carga Horária (horas)</label>
            <input 
              name="cargaHoraria" 
              type="number" 
              required 
              min="1"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Data de Conclusão</label>
            <input 
              name="dataConclusao" 
              type="date" 
              required 
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            <p>{message.text}</p>
            {message.code && (
              <div className="mt-2">
                <span className="font-mono text-lg font-bold">{message.code}</span>
                <a 
                  href={`/api/certificado/download?codigo=${message.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1 ml-4 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Baixar PDF
                </a>
              </div>
            )}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPendingCreate}
          className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPendingCreate ? "Gerando..." : "Gerar Certificado"}
        </button>
      </form>
    </div>
  );
}
