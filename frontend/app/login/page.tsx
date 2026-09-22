import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Acceso Corporativo | Syverluma',
  description: 'Iniciar sesión en el ERP y Matriz de Control de Corporación Syverluma S.A.C.'
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Iniciando sistema seguro...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}