import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AtSign, LogIn, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";

const InputField = ({ label, icon: Icon, ...props }) => (
  <label className="block text-sm font-medium text-slate-600">
    {label}
    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-200/60">
      <Icon className="h-5 w-5 text-purple-500" aria-hidden="true" />
      <input
        {...props}
        className="w-full bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  </label>
);

const LoginPage = () => {
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const response = await login(form.identifier, form.password);
      if (response?.user?.is_admin) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/conta", { replace: true });
      }
    } catch (error) {
      console.error("[LoginPage] Erro ao fazer login:", error);
      setErrorMsg(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Nao foi possivel entrar. Verifica os dados e tenta novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!authLoading && isAuthenticated) {
    return <Navigate to={user?.is_admin ? "/admin" : "/conta"} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200/60">
            <LogIn className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Area reservada
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Entrar</h1>
          </div>
        </div>

        {errorMsg && (
          <p
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email ou telefone"
            icon={AtSign}
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder="ex: maria@email.com"
            autoComplete="username"
            required
          />

          <InputField
            label="Palavra-passe"
            icon={Lock}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="********"
            autoComplete="current-password"
            required
          />

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "A entrar..." : "Entrar"}
            <LogIn className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        <p className="text-sm text-slate-500">
          Ainda nao tens conta?{" "}
          <Link
            to="/registrar"
            className="font-semibold text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text underline decoration-purple-200 underline-offset-4"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
