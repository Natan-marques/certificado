import LoginForm from "./LoginForm";
import { Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 bg-[#141414]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#1E1E1E] border border-white/5 text-[#0898C6] mb-8 shadow-2xl">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight uppercase">
            Acesso <span className="text-[#0898C6]">Restrito</span>
          </h1>
          <div className="h-1 w-20 bg-[#0898C6] mx-auto mt-4 rounded-full"></div>
          <p className="mt-6 text-[#7A7A7A] font-medium uppercase tracking-[0.2em] text-xs">
            Painel Administrativo TargetTrust
          </p>
        </div>

        <div className="card-tt p-8 md:p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <LoginForm />
        </div>

        <div className="mt-12 text-center">
          <p className="text-[#7A7A7A] text-[10px] font-bold uppercase tracking-[0.3em]">
            Ambiente Seguro 256-bit SSL
          </p>
        </div>
      </div>
    </div>
  );
}
