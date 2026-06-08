"use client";

import { useState, useTransition } from "react";
import { searchAlunos, createManualCertificate } from "@/app/actions/admin";
import { logoutAction } from "@/app/actions/auth";
import { 
  Users, 
  PlusCircle, 
  Search, 
  LogOut, 
  Award, 
  Calendar, 
  Clock, 
  User, 
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";

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
          text: 'Certificado protocolado com sucesso no sistema!', 
          code: res.codigoVerificacao 
        });
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 bg-[#141414]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 pb-8 border-b border-white/5 gap-6">
        <div>
          <h2 className="text-3xl font-display font-black text-white uppercase tracking-tight">
            Painel de <span className="text-[#0898C6]">Gestão</span>
          </h2>
          <p className="text-[#7A7A7A] font-bold uppercase tracking-[0.2em] text-xs mt-2">
            Administração de Certificados e Alunos
          </p>
        </div>
        <button 
          onClick={() => logoutAction()} 
          className="btn-secondary py-2 px-6 flex items-center gap-2 text-sm uppercase tracking-widest font-black"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Busca e Seleção */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card-tt p-6">
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0898C6]" />
              Localizar Aluno
            </h3>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A] group-focus-within:text-[#0898C6] transition-colors" />
              <input 
                type="text" 
                value={query}
                onChange={handleSearch}
                placeholder="Nome ou e-mail..."
                className="input-tt pl-12 text-sm"
              />
              {isPendingSearch && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#0898C6] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {alunos.length > 0 && (
              <ul className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {alunos.map(aluno => (
                  <li 
                    key={aluno.id} 
                    onClick={() => selectAluno(aluno)}
                    className="p-4 bg-[#141414] border border-white/5 rounded-lg cursor-pointer hover:border-[#0898C6]/50 transition-all group"
                  >
                    <div className="font-bold text-white text-sm group-hover:text-[#0898C6] transition-colors">{aluno.nome}</div>
                    <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wider mt-1">{aluno.email}</div>
                  </li>
                ))}
              </ul>
            )}

            {selectedAluno && !query && (
              <div className="mt-6 p-4 bg-[#0898C6]/5 border border-[#0898C6]/20 rounded-lg">
                <div className="text-[10px] font-black text-[#0898C6] uppercase tracking-[0.2em] mb-2">Aluno Selecionado</div>
                <div className="font-black text-white">{selectedAluno.nome}</div>
                <button 
                  onClick={() => setSelectedAluno(null)}
                  className="mt-3 text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-300"
                >
                  [ Desmarcar ]
                </button>
              </div>
            )}
          </div>

          <div className="card-tt p-6">
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF9F00]" />
              Estatísticas Rápidas
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#7A7A7A] uppercase">Total Emitidos</span>
                <span className="text-xl font-display font-black text-white">1.284</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#141414] rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#7A7A7A] uppercase">Ativos (30 dias)</span>
                <span className="text-xl font-display font-black text-[#0898C6]">42</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário de Emissão */}
        <div className="lg:col-span-2">
          <div className="card-tt p-8 md:p-10">
            <h3 className="text-xl font-display font-black text-white uppercase tracking-tight mb-8 flex items-center gap-3">
              <PlusCircle className="w-6 h-6 text-[#0898C6]" />
              Emitir Novo <span className="text-[#0898C6]">Certificado</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#7A7A7A] uppercase tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3" /> Nome do Aluno
                  </label>
                  <input 
                    name="nome" 
                    required 
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Nome completo do profissional"
                    className="input-tt" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#7A7A7A] uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> E-mail de Registro
                  </label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                    className="input-tt" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#7A7A7A] uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Título da Formação
                  </label>
                  <input 
                    name="nomeCurso" 
                    required 
                    placeholder="Ex: Formação Full Stack Developer"
                    className="input-tt" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#7A7A7A] uppercase tracking-widest flex items-center gap-2">
                    <Award className="w-3 h-3" /> Instrutor Responsável
                  </label>
                  <input 
                    name="nomeInstrutor" 
                    required 
                    placeholder="Nome do instrutor"
                    className="input-tt" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#7A7A7A] uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Carga Horária (H)
                  </label>
                  <input 
                    name="cargaHoraria" 
                    type="number" 
                    required 
                    min="1"
                    placeholder="Ex: 40"
                    className="input-tt" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#7A7A7A] uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Data de Conclusão
                  </label>
                  <input 
                    name="dataConclusao" 
                    type="date" 
                    required 
                    className="input-tt [color-scheme:dark]" 
                  />
                </div>
              </div>

              {message && (
                <div className={`p-6 rounded-xl border-2 animate-in zoom-in-95 duration-300 ${message.type === 'error' ? 'border-red-500/20 bg-red-500/5 text-red-400' : 'border-[#22C55E]/20 bg-[#22C55E]/5 text-[#22C55E]'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    <span className="font-black uppercase tracking-widest text-sm">{message.text}</span>
                  </div>
                  
                  {message.code && (
                    <div className="mt-4 p-6 bg-[#141414] rounded-lg border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <span className="block text-[10px] font-black text-[#7A7A7A] uppercase tracking-[0.3em] mb-1">Código de Autenticidade</span>
                        <span className="text-3xl font-display font-black text-white tracking-widest">{message.code}</span>
                      </div>
                      <a 
                        href={`/api/certificado/download?codigo=${message.code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-3 px-8 flex items-center gap-2 text-xs uppercase tracking-widest"
                      >
                        <FileText className="w-4 h-4" />
                        Baixar PDF
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-6 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={isPendingCreate}
                  className="btn-primary w-full md:w-auto px-12 py-4 text-sm uppercase tracking-[0.2em] font-black shadow-xl shadow-[#0898C6]/20"
                >
                  {isPendingCreate ? "Processando Registro..." : "Protocolar Certificado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
