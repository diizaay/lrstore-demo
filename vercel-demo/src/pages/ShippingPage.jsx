// src/pages/EnviosEntregasPage.js

import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  MapPin,
  Clock,
  Package,
  Info,
  AlertCircle,
} from "lucide-react";

const EnviosEntregasPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* HERO / TOPO */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 lg:pt-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-pink-500">
              <Truck className="h-3.5 w-3.5" />
              Envios & Entregas
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Como funcionam os envios da LR Store
            </h1>

            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Aqui encontras as informações sobre prazos, zonas de entrega e
              condições especiais para pedidos neon. Se ainda tiveres dúvidas,
              podes sempre falar com a nossa equipa de apoio ao cliente.
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          {/* COLUNA ESQUERDA – REGRAS E DETALHES */}
          <section className="space-y-6">
            {/* Tipos de envio */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Modalidades de envio
                  </h2>
                  <p className="text-xs text-slate-500">
                    Escolhe a opção que melhor se adapta à urgência do teu
                    evento.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Luanda – Entrega express
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Entrega no mesmo dia
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Para pedidos confirmados até às{" "}
                    <span className="font-semibold">15h</span> em dias úteis.
                    Ideal para eventos de última hora.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Luanda – Standard
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Entrega em 1–2 dias úteis
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Para pedidos confirmados após as 15h ou em campanhas com
                    grande volume de encomendas.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Outras províncias
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    3–7 dias úteis
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    As entregas fora de Luanda são realizadas com parceiros
                    logísticos. O prazo exato depende da transportadora e da
                    localidade.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Levantamento em parceiro
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Ponto de recolha
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Em algumas zonas poderás levantar a encomenda num parceiro
                    LR Store. A indicação é feita no checkout quando disponível.
                  </p>
                </div>
              </div>
            </div>

            {/* Zonas e taxas */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Zonas de entrega & taxas aproximadas
                  </h2>
                  <p className="text-xs text-slate-500">
                    Os valores podem variar em campanhas especiais ou
                    negociações para grandes eventos.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-xs text-slate-600 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Luanda – Zona urbana
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Entrega a partir de 1 500 Kz
                  </p>
                  <p className="mt-1">
                    Inclui zonas centrais e principais bairros com fácil
                    acesso. Valor final mostrado no checkout.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Luanda – Periferia
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Entrega a partir de 2 500 Kz
                  </p>
                  <p className="mt-1">
                    Zonas com maior distância ou vias de acesso limitadas podem
                    ter um custo adicional.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-slate-400">
                    Outras províncias
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    Valor sob consulta
                  </p>
                  <p className="mt-1">
                    O custo varia de acordo com a transportadora e o volume do
                    pedido. Em grandes quantidades, podemos negociar condições
                    especiais.
                  </p>
                </div>
              </div>
            </div>

            {/* Prazos & preparação */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Preparação da encomenda
                  </h2>
                  <p className="text-xs text-slate-500">
                    Queremos que tudo chegue a tempo e em perfeitas condições
                    para o teu evento.
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <p>
                    Pedidos pagos até às{" "}
                    <span className="font-semibold">12h</span> são normalmente
                    preparados no próprio dia.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <p>
                    Em campanhas especiais (Black Friday, datas festivas, etc.)
                    os prazos podem ter um acréscimo de 1–2 dias úteis.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <p>
                    Produtos personalizados ou kits especiais podem ter um prazo
                    de preparação próprio, indicado na página do produto ou
                    durante o checkout.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          {/* COLUNA DIREITA – INFO EXTRA / ALERTAS */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Acompanhar o teu pedido
                  </h2>
                  <p className="text-xs text-slate-500">
                    Vê o estado da encomenda em tempo real.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Assim que o pagamento é confirmado, o pedido aparece na área{" "}
                <span className="font-semibold text-slate-900">
                  “A minha conta &gt; Meus pedidos”
                </span>{" "}
                com o estado atualizado (em preparação, em rota, entregue).
              </p>

              <p className="mt-3 text-xs text-slate-500">
                Se tiveres dúvidas sobre o estado da entrega, podes enviar o
                número do pedido via{" "}
                <Link
                  to="/fala-connosco"
                  className="font-semibold text-pink-600 hover:text-pink-500"
                >
                  Fala connosco
                </Link>{" "}
                para receber ajuda rápida.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Quando devo fazer o pedido para o meu evento?
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Para evitar imprevistos, recomendamos:
              </p>

              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                <li>• Em Luanda: fazer o pedido com pelo menos 2–3 dias úteis.</li>
                <li>
                  • Outras províncias: idealmente 7–10 dias antes do evento.
                </li>
                <li>
                  • Eventos grandes ou corporativos: falar com a nossa equipa
                  para garantir stock e melhor opção logística.
                </li>
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 p-[1px]">
              <div className="flex items-start gap-3 rounded-[1.4rem] bg-white/95 px-4 py-4 text-sm text-slate-700">
                <Info className="mt-1 h-4 w-4 text-pink-500" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Ainda com dúvidas sobre envios?
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Vê a nossa{" "}
                    <Link
                      to="/faq"
                      className="font-semibold text-pink-600 hover:text-pink-500"
                    >
                      página de FAQ
                    </Link>{" "}
                    ou fala diretamente com a equipa na página{" "}
                    <Link
                      to="/fala-connosco"
                      className="font-semibold text-purple-600 hover:text-purple-500"
                    >
                      Fala connosco
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default EnviosEntregasPage;
