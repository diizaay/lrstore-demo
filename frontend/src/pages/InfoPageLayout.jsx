import React from "react";

const InfoPageLayout = ({ title, description, children }) => {
  return (
    <div className="bg-slate-50 py-16">
      <div className="mx-auto max-w-6xl px-4 space-y-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="rounded-3xl border border-purple-100 bg-white/95 p-10 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-pink-500">
              LR Store
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {title}
            </h1>
            {description && (
              <p className="mt-4 text-base text-slate-600">{description}</p>
            )}
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-8 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              Experiência
            </p>
            <p className="mt-3 text-2xl font-semibold leading-snug">
              Mais de 10 anos a iluminar eventos com criatividade, inovação e
              logística ágil.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-white/80">
              <div>
                <p className="text-4xl font-bold text-white">+500</p>
                <p>projetos entregues</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">24h</p>
                <p>para respostas comerciais</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6">{children}</div>
      </div>
    </div>
  );
};

export const InfoCard = ({ title, children }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
    <div className="mt-3 text-sm text-slate-600 space-y-3">{children}</div>
  </div>
);

export default InfoPageLayout;
