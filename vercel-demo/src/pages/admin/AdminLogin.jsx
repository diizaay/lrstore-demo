import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const { login, isAuthenticated, loading, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const response = await login(form.email, form.password);
      if (!response?.user?.is_admin) {
        setErrorMsg("Esta conta não tem permissão de administrador.");
        return;
      }
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("[AdminLogin] Erro ao fazer login:", error);
      setErrorMsg(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          "Não foi possível iniciar sessão."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!loading && isAuthenticated) {
    if (user?.is_admin) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/conta" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-[36px] border border-white/10 bg-white/5 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.6)] backdrop-blur-lg">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-purple-200">
            Área restrita
          </p>
          <h1 className="text-3xl font-semibold leading-tight">
            LR Store Admin
          </h1>
          <p className="text-sm text-slate-200">
            Aceda ao painel inserindo as suas credenciais administrativas.
          </p>
        </div>

        {errorMsg && (
          <p className="mt-6 rounded-2xl border border-red-200/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <label className="block text-sm text-slate-200">
            Email corporativo
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@lrstore.com"
              autoComplete="username"
              required
              className="mt-2 border-white/20 bg-white/10 text-white placeholder:text-slate-400"
            />
          </label>

          <label className="block text-sm text-slate-200">
            Palavra-passe
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="mt-2 border-white/20 bg-white/10 text-white placeholder:text-slate-400"
            />
          </label>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-white text-slate-900 shadow-lg shadow-slate-900/20 hover:bg-slate-100"
          >
            {submitting ? "A entrar..." : "Entrar no painel"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Precisas de fazer compras como cliente?
          <Link
            to="/login"
            className="ml-2 font-semibold text-white underline decoration-white/40 underline-offset-4"
          >
            Voltar ao login da loja
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
