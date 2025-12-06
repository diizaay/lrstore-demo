// src/pages/DevolucoesPage.js

import React from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  Receipt,
  ShieldCheck,
  AlertTriangle,
  Info,
  Inbox,
} from "lucide-react";

const DevolucoesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* TOPO / HERO */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 lg:pt-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-pink-500">
              <RotateCcw className="h-3.5 w-3.5" />
              Devoluções & Trocas
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Política de devoluções da LR Store
            </h1>

            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Queremos que a tua experiência glow seja impecável. Se algo não
              correu como esperado, aqui encontras as regras para trocas,
              devoluções e análise de produtos com defeito.
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          {/* COLUNA ESQUERDA – REGRAS PRINCIPAIS */}
          <section className="space-y-6">
            {/* Prazos & condições gerais */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Prazos & condições gerais
                  </h2>
                  <p className="text-xs text-slate-500">
                    Aplica-se a compras realizadas na LR Store, salvo indicação
                    específica na página do produto.
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <p>
                    Podes solicitar devolução ou troca até{" "}
                    <span className="font-semibold">7 dias corridos</span>{" "}
                    depois da entrega, desde que o produto esteja em perfeitas
                    condições, sem uso e na embalagem original sempre que
                    possível.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <p>
                    Para produtos com defeito ou avaria, o pedido deve ser feito
                    idealmente em até{" "}
                    <span className="font-semibold">48 horas</span> após a
                    receção, enviando fotos e descrição do problema.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-pink-500" />
                  <p>
                    A análise de cada caso é feita pela equipa LR Store e, quando
                    necessário, podemos solicitar mais informações ou imagens do
                    produto.
                  </p>
                </li>
              </ul>
            </div>

            {/* Passo a passo para pedir devolução */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Como pedir uma devolução ou troca
                  </h2>
                  <p className="text-xs text-slate-500">
                    O processo é simples e tudo começa com o número do teu
                    pedido.
                  </p>
                </div>
              </div>

              <ol className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    1
                  </span>
                  <p>
                    Acede à área{" "}
                    <span className="font-semibold">“A minha conta &gt; Meus pedidos”</span>{" "}
                    e confirma o número do pedido que pretendes analisar.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    2
                  </span>
                  <p>
                    Vai à página{" "}
                    <Link
                      to="/fala-connosco"
                      className="font-semibold text-pink-600 hover:text-pink-500"
                    >
                      Fala connosco
                    </Link>{" "}
                    e envia uma mensagem indicando o número do pedido, o
                    produto, o motivo da devolução e, se houver defeito, fotos
                    que mostrem o problema.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    3
                  </span>
                  <p>
                    A nossa equipa responde por email indicando os próximos
                    passos, ponto de entrega ou recolha e, quando aplicável, as
                    opções de reembolso ou vale-crédito.
                  </p>
                </li>
              </ol>
            </div>

            {/* Produtos com defeito & garantia */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Produtos com defeito ou em falta
                  </h2>
                  <p className="text-xs text-slate-500">
                    Se algo não chegou como deveria, tratamos de corrigir.
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p>
                    Em caso de produto danificado, avariado ou com quantidade
                    incorreta, pedimos que tires fotos da caixa e dos itens
                    afetados para facilitar a análise.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p>
                    Após confirmação, podemos oferecer{" "}
                    <span className="font-semibold">
                      reposição do produto, crédito em loja ou reembolso
                    </span>
                    , dependendo do caso e da disponibilidade em stock.
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p>
                    Se o erro for da LR Store ou do transporte, os custos de
                    devolução não serão cobrados ao cliente.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          {/* COLUNA DIREITA – ALERTAS & INFO EXTRA */}
          <aside className="space-y-6">
            {/* O que não pode ser devolvido */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Itens que não aceitam devolução
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm text-slate-600">
                Por questões de segurança, higiene ou personalização, alguns
                artigos não podem ser devolvidos, exceto em casos de defeito:
              </p>

              <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                <li>• Produtos usados ou com sinais evidentes de utilização.</li>
                <li>
                  • Artigos consumíveis já abertos (por exemplo, líquidos
                  específicos, sprays, etc.).
                </li>
                <li>
                  • Produtos personalizados ou produzidos sob medida para um
                  evento específico.
                </li>
              </ul>
            </div>

            {/* Resumo rápido */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                  <RotateCcw className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Resumo rápido
                  </h2>
                </div>
              </div>

              <div className="mt-3 grid gap-3 text-xs text-slate-600">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="font-semibold text-slate-900">
                    7 dias para devolução
                  </p>
                  <p>
                    Para arrependimento ou troca, com produto em bom estado e
                    embalagem preservada.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="font-semibold text-slate-900">
                    48h para relatar defeitos
                  </p>
                  <p>
                    Quanto mais rápido partilhares fotos e detalhes, mais
                    ágil será a solução.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="font-semibold text-slate-900">
                    Custos de envio
                  </p>
                  <p>
                    Quando o motivo não é defeito ou erro da LR Store, os
                    custos de transporte podem ser cobrados.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 p-[1px]">
              <div className="flex items-start gap-3 rounded-[1.4rem] bg-white/95 px-4 py-4 text-sm text-slate-700">
                <Info className="mt-1 h-4 w-4 text-pink-500" />
                <div>
                  <p className="font-semibold text-slate-900">
                    Precisas de ajuda com uma devolução?
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Consulta também a{" "}
                    <Link
                      to="/central-de-ajuda"
                      className="font-semibold text-purple-600 hover:text-purple-500"
                    >
                      Central de Ajuda
                    </Link>{" "}
                    ou fala diretamente com a equipa na página{" "}
                    <Link
                      to="/fala-connosco"
                      className="font-semibold text-pink-600 hover:text-pink-500"
                    >
                      Fala connosco
                    </Link>
                    . Estamos aqui para garantir que o teu evento continua a
                    brilhar.
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

export default DevolucoesPage;
