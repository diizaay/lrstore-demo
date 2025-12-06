import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Fingerprint,
  Mail,
  Globe2,
  UserRound,
  FileSearch,
  Bell,
} from "lucide-react";

const PoliticaPrivacidadePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 lg:pt-12">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-purple-600">
              <Shield className="h-3.5 w-3.5" />
              Privacidade
            </span>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Política de Privacidade
            </h1>

            <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
              A tua privacidade é uma prioridade na LR Store. Explicamos aqui
              como recolhemos, tratamos e protegemos os teus dados pessoais.
            </p>

            <p className="text-xs text-slate-400">Atualizado em 2025</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          {/* LEFT SIDE */}
          <section className="space-y-6">
            {/* 1. Introdução */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                1. Introdução
              </h2>
              <p className="mt-3 text-sm text-slate-700">
                Esta Política de Privacidade descreve como a{" "}
                <span className="font-semibold">LR Store</span> recolhe,
                armazena, utiliza e protege os dados pessoais dos utilizadores
                do nosso site, em conformidade com as melhores práticas de
                segurança digital.
              </p>
            </div>

            {/* 2. Dados que recolhemos */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                  <UserRound className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  2. Dados que recolhemos
                </h2>
              </div>

              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Nome completo</li>
                <li>• Email</li>
                <li>• Número de telefone</li>
                <li>• Endereço completo (quando necessário para envios)</li>
                <li>• Histórico de compras e preferências</li>
                <li>• Dados de navegação (cookies, páginas visitadas, IP)</li>
              </ul>
            </div>

            {/* 3. Como usamos os dados */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                  <Mail className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  3. Como usamos os teus dados
                </h2>
              </div>

              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Processar pedidos e pagamentos</li>
                <li>• Enviar confirmações e atualizações de encomendas</li>
                <li>• Gerir a tua conta e histórico</li>
                <li>• Melhorar a experiência de navegação</li>
                <li>• Enviar campanhas ou promoções (opcional)</li>
              </ul>
            </div>

            {/* 4. Cookies */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Fingerprint className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  4. Cookies & tecnologias semelhantes
                </h2>
              </div>

              <p className="text-sm text-slate-700">
                Utilizamos cookies para:
              </p>

              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>• Lembrar as tuas preferências</li>
                <li>• Guardar produtos no carrinho</li>
                <li>• Medir desempenho e melhorar o site</li>
                <li>• Analisar tráfego e comportamento de navegação</li>
              </ul>

              <p className="mt-3 text-xs text-slate-500">
                Podes desativar cookies no teu navegador, mas isso pode afetar o
                funcionamento do site.
              </p>
            </div>

            {/* 5. Partilha de dados */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Globe2 className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  5. Com quem partilhamos os dados
                </h2>
              </div>

              <p className="text-sm text-slate-700">
                Os teus dados podem ser partilhados apenas com:
              </p>

              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>• Processadores de pagamento (ex.: Multicaixa)</li>
                <li>• Serviços de entrega e logística</li>
                <li>• Serviços de email e notificação</li>
                <li>• Ferramentas de análise (Google Analytics, etc.)</li>
              </ul>

              <p className="mt-3 text-xs text-slate-500">
                Nunca vendemos os teus dados a terceiros.
              </p>
            </div>

            {/* 6. Segurança */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Lock className="h-4 w-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  6. Segurança & proteção de dados
                </h2>
              </div>

              <p className="text-sm text-slate-700">
                Implementamos medidas avançadas de segurança:
              </p>

              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li>• Encriptação SSL</li>
                <li>• Tokens de sessão seguros</li>
                <li>• Acesso restrito a dados sensíveis</li>
                <li>• Monitorização de tentativas de acesso</li>
              </ul>
            </div>

            {/* 7. Direitos do utilizador */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                7. Os teus direitos
              </h2>

              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Aceder aos teus dados</li>
                <li>• Corrigir informações incorretas</li>
                <li>• Pedir eliminação da conta</li>
                <li>• Desativar comunicações promocionais</li>
              </ul>

              <p className="mt-2 text-xs text-slate-500">
                Para exercer estes direitos, basta contactar-nos através da
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

            {/* 8. Atualizações */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                8. Atualizações desta política
              </h2>

              <p className="mt-3 text-sm text-slate-700">
                Podemos atualizar esta política ocasionalmente para cumprir leis
                e melhorar práticas internas. A versão mais recente será sempre
                publicada nesta página.
              </p>
            </div>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">
            {/* Resumo */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-200 text-slate-700">
                  <FileSearch className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Resumo rápido
                </h2>
              </div>

              <ul className="space-y-2 text-xs text-slate-600">
                <li>• Recolhemos dados para melhorar a tua experiência</li>
                <li>• Protegemos os teus dados com segurança avançada</li>
                <li>• Não vendemos informações a terceiros</li>
                <li>• Podes pedir remoção dos teus dados quando quiseres</li>
              </ul>
            </div>

            {/* Contactar */}
            <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-purple-500 p-[1px]">
              <div className="rounded-[1.4rem] bg-white px-5 py-5 text-xs text-slate-600">
                <p className="font-semibold text-slate-900">
                  Tens alguma dúvida?
                </p>
                <p className="mt-1">
                  Contacta-nos diretamente pela página{" "}
                  <Link
                    to="/fala-connosco"
                    className="font-semibold text-pink-600 hover:text-pink-500"
                  >
                    Fala connosco
                  </Link>
                  . Estamos prontos para ajudar!
                </p>
              </div>
            </div>

            {/* Notificações */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-600">
                  <Bell className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Gestão de cookies
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Podes controlar cookies e permissões através das definições do
                teu navegador (Chrome, Safari, Firefox ou Edge).
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PoliticaPrivacidadePage;
