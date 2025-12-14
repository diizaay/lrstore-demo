// src/pages/CentralDeAjudaPage.js

import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Truck,
  Repeat2,
  CreditCard,
  Package,
  Clock,
  ArrowRight,
} from "lucide-react";

const CentralDeAjudaPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Hero / Topo */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-10 lg:pt-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-pink-500">
              <HelpCircle className="h-3.5 w-3.5" />
              Apoio ao cliente
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Central de ajuda
            </h1>

            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Encontra respostas rápidas sobre pedidos, entregas, pagamentos e
              devoluções. Se precisares, a nossa equipa está sempre a um clique
              de distância.
            </p>
          </div>

          {/* Pesquisa rápida */}
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-4 shadow-sm ring-1 ring-slate-200/70 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Pesquisar na central de ajuda (ex.: entrega, pagamento, devolução)"
                className="h-11 bg-white pl-9 text-sm"
              />
            </div>
            <Button
              className="btn-brand h-11 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-semibold text-white hover:from-pink-600 hover:to-purple-600 sm:w-auto"
              type="button"
            >
              Pesquisar
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          {/* Coluna esquerda – atalhos & categorias */}
          <section className="space-y-6">
            {/* Atalhos principais */}
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                to="/faq"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-pink-400/70 hover:shadow-md"
              >
                <div className="inline-flex h-9 items-center rounded-full bg-pink-50 px-3 text-xs font-semibold text-pink-600">
                  FAQ
                </div>
                <h2 className="mt-3 text-base font-semibold text-slate-900">
                  Perguntas frequentes
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Vê as dúvidas mais comuns sobre entregas, pagamentos e
                  utilização da LR Store.
                </p>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-pink-600 group-hover:gap-1.5">
                  Ver FAQ
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>

              <Link
                to="/fala-connosco"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-400/70 hover:shadow-md"
              >
                <div className="inline-flex h-9 items-center rounded-full bg-purple-50 px-3 text-xs font-semibold text-purple-600">
                  Falar connosco
                </div>
                <h2 className="mt-3 text-base font-semibold text-slate-900">
                  Fala diretamente com a equipa
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Envia uma mensagem por email ou WhatsApp, ideal para orçamentos
                  personalizados e dúvidas específicas.
                </p>
                <span className="mt-3 inline-flex items-center text-xs font-semibold text-purple-600 group-hover:gap-1.5">
                  Ir para Fala connosco
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </span>
              </Link>
            </div>

            {/* Categorias principais */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Tópicos principais
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  to="/envios-entregas"
                  className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-pink-400/70 hover:shadow-md"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Envios & entregas
                  </p>
                  <p className="text-xs text-slate-500">
                    Prazo médio de entrega, zonas cobertas, taxas e agendamentos
                    para Luanda e outras províncias.
                  </p>
                  <span className="mt-1 text-xs font-semibold text-pink-600 group-hover:gap-1.5 inline-flex items-center">
                    Ver detalhes
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </Link>

                <Link
                  to="/devolucoes"
                  className="group flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-400/70 hover:shadow-md"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Repeat2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Devoluções & trocas
                  </p>
                  <p className="text-xs text-slate-500">
                    Como solicitar trocas, prazos de devolução, condições dos
                    produtos e processo de reembolso.
                  </p>
                  <span className="mt-1 text-xs font-semibold text-purple-600 group-hover:gap-1.5 inline-flex items-center">
                    Ver políticas
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </Link>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Pagamentos & Multicaixa
                  </p>
                  <p className="text-xs text-slate-500">
                    Tipos de pagamento aceites (Multicaixa Express, referência,
                    pagamentos mock em testes) e segurança.
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Detalhes completos na secção de FAQ.
                  </p>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                    <Package className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    Pedidos & estado da encomenda
                  </p>
                  <p className="text-xs text-slate-500">
                    Como acompanhar o pedido, ver histórico de compras e obter
                    comprovativos para o teu evento.
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Acede em “A minha conta &gt; Meus pedidos”.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Coluna direita – destaque & info extra */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <Clock className="h-3.5 w-3.5" />
                Tempo médio de resposta
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-900">
                A nossa equipa responde rápido
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Em dias úteis, a maioria das mensagens enviadas pela LR Store é
                respondida em menos de{" "}
                <span className="font-semibold text-slate-900">2 horas</span>.
                Para pedidos urgentes, menciona isso na mensagem.
              </p>

              <div className="mt-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 p-[1px]">
                <div className="flex items-center justify-between rounded-[1rem] bg-white/95 px-4 py-3 text-sm text-slate-700">
                  <span>
                    Precisas de apoio para escolher produtos para o teu evento?
                  </span>
                  <Link
                    to="/fala-connosco"
                    className="text-xs font-semibold text-pink-600 hover:text-pink-500 whitespace-nowrap"
                  >
                    Falar com especialista
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                Dica rápida
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Quanto mais detalhes enviares no primeiro contacto (data do
                evento, local, tipo de festa, número de convidados), mais rápido
                conseguimos indicar o kit ideal de produtos neon.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CentralDeAjudaPage;
