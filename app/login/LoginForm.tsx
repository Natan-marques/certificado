"use client";

import { loginAction } from "@/app/actions/auth";
import { useState, useTransition } from "react";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const res = await loginAction(formData);
        if (res?.error) {
          setError(res.error);
        }
      } catch (e) {
        setError("Erro interno do servidor. Tente novamente mais tarde.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm font-bold animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-xs font-black text-[#7A7A7A] uppercase tracking-widest">
          E-mail de Acesso
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A] group-focus-within:text-[#0898C6] transition-colors" />
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            placeholder="seu@email.com"
            className="input-tt pl-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-xs font-black text-[#7A7A7A] uppercase tracking-widest">
          Senha de Segurança
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7A7A7A] group-focus-within:text-[#0898C6] transition-colors" />
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            placeholder="••••••••"
            className="input-tt pl-12"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-black shadow-lg shadow-[#0898C6]/20"
      >
        {isPending ? "Autenticando..." : (
          <>
            <LogIn className="w-5 h-5" />
            Entrar no Sistema
          </>
        )}
      </button>
    </form>
  );
}
