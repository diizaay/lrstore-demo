import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sendSupportMessage } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Phone,
  MessageSquare,
  Headphones,
  ArrowRight,
} from "lucide-react";

const FalaConnoscoPage = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setFeedback("");
      await sendSupportMessage(form);

      setFeedback("Mensagem enviada! A nossa equipa responderá em breve.");
      setForm((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));
    } catch (error) {
      setFeedback(
        "Ocorreu um erro ao enviar a mensagem. Por favor, tenta novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-purple-600">
            <Headphones className="h-4 w-4" />
            Apoio ao cliente
          </span>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Fala Connosco
          </h1>
          <p className="mt-2 text-slate-600 max-w-xl">
            Estamos aqui para ajudar! Escolhe o teu canal preferido ou envia-nos
            uma mensagem pelo formulário ao lado.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto mt-12 max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr]">
          {/* LEFT SIDEBAR */}
          <section className="space-y-6">
            {/* EMAIL */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-pink-100 p-3 text-pink-600">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    Email
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    suporte@lrstore.ao
                  </h3>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Resposta média: menos de 2 horas.
              </p>
            </div>

            {/* WHATSAPP */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-green-100 p-3 text-green-600">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                    WhatsApp
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    +244 923 456 789
                  </h3>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Atendimento de segunda a sábado das 9h às 20h.
              </p>
            </div>

            {/* PRIORITÁRIO */}
            <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 p-[1px] shadow-md">
              <div className="rounded-[1.4rem] bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-600 p-2 text-white">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-purple-800">
                    Atendimento prioritário
                  </h3>
                </div>

                <p className="mt-2 text-sm text-slate-600">
                  Clientes registados recebem suporte mais rápido e status de
                  pedidos atualizado em tempo real.
                </p>
              </div>
            </div>
          </section>

          {/* FORM */}
          <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">
              Envia uma mensagem
            </h2>
            <p className="text-sm text-slate-500">
              Preenche o formulário e responderemos por email.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Nome + Email */}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-slate-500">
                  Nome completo
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </label>

                <label className="text-sm text-slate-500">
                  Email
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2"
                    required
                  />
                </label>
              </div>

              {/* Telefone + Assunto */}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-slate-500">
                  Telefone
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </label>

                <label className="text-sm text-slate-500">
                  Assunto
                  <Input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="mt-2"
                  />
                </label>
              </div>

              {/* Mensagem */}
              <label className="text-sm text-slate-500">
                Mensagem
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="mt-2 h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-pink-500 focus:ring-pink-500"
                ></textarea>
              </label>

              {/* FEEDBACK */}
              {feedback && (
                <div className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm text-pink-700">
                  {feedback}
                </div>
              )}

              {/* BOTÃO */}
              <Button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:opacity-90 transition"
                disabled={submitting}
              >
                {submitting ? "A enviar..." : "Enviar mensagem"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FalaConnoscoPage;
