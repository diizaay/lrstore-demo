// src/pages/TermosCondicoesPage.js

import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  Globe2,
  AlertCircle,
  Lock,
} from "lucide-react";

const TermosCondicoesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* HERO / TOPO */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 lg:pt-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-pink-500">
              <FileText className="h-3.5 w-3.5" />
              Termos & Condições
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Termos de utilização da LR Store
            </h1>

            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              Ao utilizar o nosso site e fazer compras na LR Store, estás a
              concordar com os termos abaixo. Lê com atenção – queremos que
              tudo esteja claro antes da tua próxima festa glow.
            </p>

            <p className="text-xs text-slate-400">
              Última atualização: 2025
            </p>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          {/* COLUNA ESQUERDA – TERMOS */}
          <section className="space-y-6">
            {/* 1. Aceitação dos termos */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                1. Aceitação dos Termos
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                Ao aceder ao site <span className="font-semibold">LR Store</span>,
                criar uma conta ou realizar uma compra, estás a declarar que
                leste, compreendeste e concordaste com estes Termos & Condições,
                bem como com a nossa{" "}
                <Link
                  to="/politica-privacidade"
                  className="font-semibold text-pink-600 hover:text-pink-500"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Se não concordares com algum ponto, recomendamos que não
                utilizes o site nem efetues compras através da plataforma.
              </p>
            </div>

            {/* 2. Utilização do site */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Globe2 className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  2. Utilização do site
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  • O site destina-se a maiores de 18 anos ou menores com
                  autorização de um responsável.
                </li>
                <li>
                  • Não é permitido usar a plataforma para fins ilegais,
                  fraudulentos ou que prejudiquem a imagem da LR Store.
                </li>
                <li>
                  • Podemos, a qualquer momento, suspender o acesso de
                  utilizadores que violem estes termos ou comprometam a
                  segurança do serviço.
                </li>
              </ul>
            </div>

            {/* 3. Conta de utilizador */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                  <UserRound className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  3. Conta de utilizador & segurança
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  • Ao criar uma conta, deves fornecer informações verdadeiras,
                  completas e atualizadas.
                </li>
                <li>
                  • És responsável por manter a confidencialidade da tua
                  palavra-passe e por todas as ações realizadas na tua conta.
                </li>
                <li>
                  • Caso suspeites de acesso indevido, informa-nos
                  imediatamente através da página{" "}
                  <Link
                    to="/fala-connosco"
                    className="font-semibold text-pink-600 hover:text-pink-500"
                  >
                    Fala connosco
                  </Link>
                  .
                </li>
              </ul>
            </div>

            {/* 4. Pedidos, preços e pagamentos */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  4. Pedidos, preços & pagamentos
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>
                  • Os preços apresentados estão em{" "}
                  <span className="font-semibold">Kwanza (Kz)</span> e podem ser
                  alterados sem aviso prévio, exceto para pedidos já confirmados.
                </li>
                <li>
                  • Um pedido só é considerado confirmado após validação do
                  pagamento pelos nossos parceiros (ex.: Multicaixa Express ou
                  referência).
                </li>
                <li>
                  • Em caso de erro claro de preço ou informação, reservamo-nos
                  o direito de cancelar o pedido e reembolsar o valor pago.
                </li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Para mais detalhes sobre prazos e custos de envio, consulta a
                página{" "}
                <Link
                  to="/envios-entregas"
                  className="font-semibold text-purple-600 hover:text-purple-500"
                >
                  Envios & Entregas
                </Link>
                .
              </p>
            </div>

            {/* 5. Devoluções */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                5. Devoluções, trocas & reembolsos
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                As regras para devoluções, trocas e reembolsos seguem a nossa
                política própria, disponível na página{" "}
                <Link
                  to="/devolucoes"
                  className="font-semibold text-pink-600 hover:text-pink-500"
                >
                  Devoluções & Trocas
                </Link>
                . Em caso de conflito entre os textos, prevalece a política
                específica de devoluções.
              </p>
            </div>

            {/* 6. Propriedade intelectual */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900/90 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  6. Propriedade intelectual
                </h2>
              </div>
              <p className="text-sm text-slate-700">
                Todo o conteúdo do site – incluindo logotipos, textos,
                ilustrações, fotografias, ícones, layouts e elementos visuais –
                é propriedade da LR Store ou utilizado com autorização de
                parceiros, sendo protegido por leis de direitos autorais.
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Não é permitido copiar, reproduzir, distribuir ou modificar
                qualquer parte do site sem autorização escrita da LR Store.
              </p>
            </div>

            {/* 7. Privacidade & dados */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Lock className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  7. Privacidade & proteção de dados
                </h2>
              </div>
              <p className="text-sm text-slate-700">
                Levamos a sério a proteção dos teus dados pessoais. As
                informações recolhidas são utilizadas apenas para processar
                pedidos, melhorar a experiência no site e comunicar novidades,
                quando autorizado.
              </p>
              <p className="mt-2 text-sm text-slate-700">
                O detalhe completo sobre tratamento de dados, cookies e
                partilha com terceiros está descrito na nossa{" "}
                <Link
                  to="/politica-privacidade"
                  className="font-semibold text-purple-600 hover:text-purple-500"
                >
                  Política de Privacidade
                </Link>
                .
              </p>
            </div>

            {/* 8. Alterações dos Termos */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                8. Alterações destes Termos
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                A LR Store pode atualizar estes Termos & Condições sempre que
                necessário, para refletir alterações legais, operacionais ou de
                serviços. As versões atualizadas serão sempre publicadas nesta
                página, com indicação da data da última atualização.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Recomendamos que revisites esta página periodicamente, sobretudo
                antes de realizar novas compras.
              </p>
            </div>
          </section>

          {/* COLUNA DIREITA – RESUMO / INFO RÁPIDA */}
          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Em resumo
                </h2>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>• Usar o site implica concordar com estes termos.</li>
                <li>• Podes criar conta para acompanhar pedidos e histórico.</li>
                <li>• Os preços podem mudar, mas respeitamos pedidos já pagos.</li>
                <li>• Respeitamos a tua privacidade e protegemos os teus dados.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Ligações rápidas
              </h2>
              <div className="space-y-2 text-sm">
                <Link
                  to="/central-de-ajuda"
                  className="block rounded-2xl border border-slate-200 px-4 py-2 text-slate-700 hover:border-pink-400 hover:text-pink-600"
                >
                  Central de Ajuda
                </Link>
                <Link
                  to="/envios-entregas"
                  className="block rounded-2xl border border-slate-200 px-4 py-2 text-slate-700 hover:border-pink-400 hover:text-pink-600"
                >
                  Envios & Entregas
                </Link>
                <Link
                  to="/devolucoes"
                  className="block rounded-2xl border border-slate-200 px-4 py-2 text-slate-700 hover:border-pink-400 hover:text-pink-600"
                >
                  Devoluções & Trocas
                </Link>
                <Link
                  to="/fala-connosco"
                  className="block rounded-2xl border border-slate-200 px-4 py-2 text-slate-700 hover:border-pink-400 hover:text-pink-600"
                >
                  Fala connosco
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 p-[1px]">
              <div className="rounded-[1.4rem] bg-white/95 px-4 py-4 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">
                  Dúvidas sobre algum ponto?
                </p>
                <p className="mt-1">
                  Esta página é um resumo de como funcionam os nossos serviços,
                  mas não substitui aconselhamento jurídico profissional. Se
                  tiveres alguma dúvida específica, fala com a nossa equipa na
                  página{" "}
                  <Link
                    to="/fala-connosco"
                    className="font-semibold text-pink-600 hover:text-pink-500"
                  >
                    Fala connosco
                  </Link>
                  .
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TermosCondicoesPage;
