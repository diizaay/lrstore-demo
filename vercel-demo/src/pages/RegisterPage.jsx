import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AtSign, Lock, User, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { registerUser } from "../services/api";

const InputField = ({ label, icon: Icon, ...props }) => (
  <label className="block text-sm font-semibold text-slate-600">
    {label}
    <div className="mt-2 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus-within:border-purple-500/60 focus-within:ring-2 focus-within:ring-purple-200/60">
      <Icon className="h-5 w-5 text-purple-500" aria-hidden="true" />
      <input
        {...props}
        className="w-full border-none bg-transparent text-sm placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  </label>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("As palavras-passe nao coincidem.");
      return;
    }

    const identifier = form.identifier.trim();
    if (!identifier) {
      setErrorMsg("Indica um email ou numero de telefone.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      password: form.password,
    };

    if (identifier.includes("@")) {
      payload.email = identifier;
    } else {
      payload.phone = identifier;
    }

    setSubmitting(true);
    try {
      await registerUser(payload);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("[RegisterPage] Erro ao registar:", error);
      const detail = error.response?.data?.detail;
      const message = error.response?.data?.message;
      let friendlyMessage = "";

      if (typeof detail === "string") {
        friendlyMessage = detail;
      } else if (Array.isArray(detail)) {
        friendlyMessage = detail
          .map((item) => item?.msg || item?.message || JSON.stringify(item))
          .join(" | ");
      } else if (detail && typeof detail === "object") {
        friendlyMessage =
          detail.msg || detail.message || JSON.stringify(detail);
      } else if (typeof message === "string") {
        friendlyMessage = message;
      } else if (typeof error.response?.data === "string") {
        friendlyMessage = error.response.data;
      }

      setErrorMsg(
        friendlyMessage || "Nao conseguimos criar a conta. Tenta novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-[32px] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-200/60">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Criar acesso
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Novo registo
            </h1>
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
            label="Nome completo"
            icon={User}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ex: Marta Braganca"
            autoComplete="name"
            required
          />

          <InputField
            label="Email ou telefone"
            icon={AtSign}
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder="Escolhe o contacto principal"
            autoComplete="email"
            required
          />

          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Palavra-passe"
              icon={Lock}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimo 8 caracteres"
              autoComplete="new-password"
              required
            />
            <InputField
              label="Confirmar palavra-passe"
              icon={Lock}
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repete a palavra-passe"
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Aguarde..." : "Criar conta"}
            <UserPlus className="h-4 w-4" aria-hidden="true" />
          </Button>
        </form>

        <p className="text-sm text-slate-500">
          Ja tens conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text underline decoration-purple-200 underline-offset-4"
          >
            Entrar agora
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

