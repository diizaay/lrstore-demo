import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  PartyPopper,
  Lightbulb,
  ShieldCheck,
  HeartHandshake,
  Globe2,
  Star,
  Clock,
  Truck,
  ArrowRight,
} from "lucide-react";

const SobreNosPage = () => {
  const stats = [
    { label: "Eventos atendidos", value: "+500" },
    { label: "Clientes recorrentes", value: "72%" },
    { label: "Avaliação média", value: "4.9★" },
  ];

  const pillars = [
    {
      icon: Sparkles,
      title: "Especialistas em glow",
      description:
        "Somos focados em produtos neon e glow para festas, ativações de marca e experiências imersivas.",
    },
    {
      icon: Lightbulb,
      title: "Curadoria inteligente",
      description:
        "Ajudamos a montar kits completos, alinhados ao mood da festa, ao espaço e ao orçamento.",
    },
    {
      icon: ShieldCheck,
      title: "Segurança & qualidade",
      description:
        "Produtos testados, alinhados às melhores práticas de segurança para uso em eventos.",
    },
    {
      icon: HeartHandshake,
      title: "Parceria verdadeira",
      description:
        "Estamos presentes do pré-planeamento à entrega, com suporte humano e atenção ao detalhe.",
    },
  ];

  const steps = [
    {
      title: "1. Entendemos o teu evento",
      description:
        "Tipo de festa, número de pessoas, local, horário, luz ambiente e estilo desejado.",
    },
    {
      title: "2. Criamos um kit personalizado",
      description:
        "Combinamos produtos glow, quantidades ideais e sugestões de uso para maximizar o impacto.",
    },
    {
      title: "3. Validamos contigo",
      description:
        "Ajustamos produtos, cores e quantidades até tudo ficar exatamente como imaginaste.",
    },
    {
      title: "4. Entrega rápida & suporte",
      description:
        "Entregas rápidas em Luanda e acompanhamento para qualquer dúvida antes do evento.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-purple-600">
            <PartyPopper className="h-4 w-4" />
            Sobre nós
          </span>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            A LR Store nasceu para fazer a tua festa brilhar.
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Unimos design, tecnologia e curadoria de produtos neon para
            transformar qualquer espaço numa experiência glow memorável – seja
            para festas particulares, eventos corporativos ou ativações de
            marca.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 space-y-12">
        {/* QUEM SOMOS */}
        <section className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr] items-start">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Quem somos
            </h2>
            <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
              A LR Store é uma loja online especializada em produtos neon e
              glow para eventos em Angola. O nosso foco é simples: tornar mais
              fácil, rápido e seguro montar uma experiência visual incrível,
              sem complicações.
            </p>
            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
              Trabalhamos tanto com clientes particulares que querem uma festa
              inesquecível, como com marcas e agências que precisam de
              consistência, estética e logística eficiente. Por isso, cada
              detalhe da LR Store foi pensado para o contexto real das festas em
              Angola – da escolha de produtos às opções de pagamento e entrega.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="">
                  <p className="text-xl font-bold text-purple-700">
                    {item.value}
                  </p>
                  <p className="text-xs text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                <Globe2 className="h-4 w-4" />
                Feito para o cenário angolano
              </div>
              <p className="text-sm text-slate-600">
                Entendemos os desafios reais de organizar eventos em Luanda e
                noutras províncias: prazos apertados, logística, stock limitado
                e necessidade de confiança na entrega.
              </p>
              <p className="text-sm text-slate-600">
                Por isso, criámos uma experiência de compra clara, com catálogo
                especializado, métodos de pagamento locais e suporte próximo da
                nossa equipa.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Star className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Catálogo focado em neon e efeitos glow.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Resposta rápida em canais digitais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Opções de entrega ágeis em Luanda.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* PILARES */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                O que torna a LR Store diferente
              </h2>
              <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                Não vendemos apenas produtos soltos. Pensamos em experiências
                completas, com foco no impacto visual, segurança e simplicidade
                para quem organiza o evento.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={pillar.title}
                  className="border-slate-200 shadow-sm rounded-3xl bg-white"
                >
                  <CardContent className="flex gap-4 p-5">
                    <div className="mt-1 rounded-2xl bg-purple-50 p-3 text-purple-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {pillar.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* COMO TRABALHAMOS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Como trabalhamos com o teu evento
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Quer estejas a organizar uma festa pequena em casa ou um grande
            lançamento de marca, seguimos sempre uma lógica simples e clara:
          </p>

          <div className="relative mt-4 grid gap-6 md:grid-cols-2">
            {steps.map((step, index) => (
              <Card
                key={step.title}
                className="border-slate-200 shadow-sm rounded-3xl bg-white"
              >
                <CardContent className="p-5">
                  <div className="inline-flex items-center justify-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-pink-600">
                    Passo {index + 1}
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* COMPROMISSO */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Compromisso com segurança e qualidade
            </h2>
            <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
              Trabalhar com luzes, cores e efeitos em eventos exige cuidado.
              Por isso, escolhemos fornecedores e produtos com critérios claros
              de qualidade, durabilidade e segurança.
            </p>
            <p className="mt-2 text-sm md:text-base text-slate-600 leading-relaxed">
              Atualizamos constantemente o nosso catálogo de acordo com a
              experiência em eventos reais, feedback dos clientes e tendências
              internacionais de festas glow.
            </p>
          </div>

          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                <ShieldCheck className="h-4 w-4" />
                Confiança LR Store
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Star className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Produtos testados e validados em eventos reais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>
                    Equipa disponível para esclarecer dúvidas antes da compra.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Foco em transparência, proximidade e suporte.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA FINAL */}
        <section className="mt-4">
          <div className="rounded-[1.8rem] bg-gradient-to-r from-pink-500 to-purple-600 p-[1px] shadow-md">
            <div className="flex flex-col gap-4 rounded-[1.6rem] bg-white px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600">
                  Próximo passo
                </p>
                <h3 className="mt-2 text-lg md:text-xl font-semibold text-slate-900">
                  Vamos montar juntos o kit glow perfeito para o teu evento.
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Partilha o tipo de festa, data e número de pessoas – ajudamos
                  a desenhar a combinação ideal.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:opacity-90"
                >
                  <Link to="/fala-connosco">
                    Falar com a equipa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-50"
                >
                  <Link to="/produtos">Ver catálogo de produtos</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SobreNosPage;
