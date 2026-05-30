"use client";

import { loginAction } from "@/app/actions/auth";
import { useState, useTransition } from "react";

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
        setError("Erro interno do servidor.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="p-3 text-sm text-red-500 bg-red-100 rounded">{error}</div>}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          className="p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">Senha</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="p-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        type="submit" 
        disabled={isPending}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
