import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  HelpCircle,
  MessageCircle,
  CreditCard,
  Truck,
  RotateCcw,
  Package,
  User,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqData = [
  {
    category: "Pagamentos",
    icon: CreditCard,
    items: [
      {
        question: "Que métodos de pagamento posso usar?",
        answer:
          "Podes pagar com Multicaixa (Express ou Referência). Estamos a trabalhar para adicionar outros métodos digitais no futuro.",
      },
      {
        question: "O pagamento é feito antes ou depois da entrega?",
        answer:
          "O pagamento é sempre confirmado antes do envio. Só após a confirmação do pagamento é que o pedido segue para preparação e entrega.",
      },
      {
        question: "O meu pagamento não foi confirmado. O que faço?",
        answer:
          "Se o pagamento falhar ou não aparecer como confirmado, guarda o comprovativo (se existir) e entra em contacto com a nossa equipa através da página Fala Connosco ou por WhatsApp. Vamos verificar o estado da transação.",
      },
    ],
  },
  {
    category: "Envios & Entregas",
    icon: Truck,
    items: [
      {
        question: "Quais são as zonas de entrega?",
        answer:
          "No momento, fazemos entregas em Luanda (zonas urbanas principais). Para outras localizações, podes falar connosco para analisarmos alternativas.",
      },
      {
        question: "Qual é o prazo de entrega?",
        answer:
          "Após a confirmação do pagamento, o prazo padrão é de 24h–72h úteis em Luanda, podendo variar conforme a zona e o volume de pedidos.",
      },
      {
        question: "Posso agendar a entrega para um horário específico?",
        answer:
          "Tentamos sempre alinhar com o horário do teu evento. Indica a data e uma janela de horário na finalização do pedido ou fala connosco para alinharmos melhor.",
      },
    ],
  },
  {
    category: "Devoluções & trocas",
    icon: RotateCcw,
    items: [
      {
        question: "Posso devolver um produto se não gostar?",
        answer:
          "Os produtos podem ser elegíveis para devolução em casos específicos, como defeito de fabrico ou problemas no transporte. Para outros motivos, analisamos caso a caso.",
      },
      {
        question: "O que faço se o produto chegar danificado?",
        answer:
          "Tira fotos do produto e da embalagem no momento em que o receberes e entra em contacto connosco em até 24h. A equipa irá acompanhar e orientar o processo de troca.",
      },
      {
        question: "Quanto tempo leva para uma troca ser concluída?",
        answer:
          "Depois da análise e aprovação da troca, organizamos o levantamento e o reenvio o mais rápido possível, normalmente dentro de alguns dias úteis em Luanda.",
      },
    ],
  },
  {
    category: "Produtos & stock",
    icon: Package,
    items: [
      {
        question: "Os produtos neon são reutilizáveis?",
        answer:
          "Depende do tipo de produto. Alguns são descartáveis (como certos itens glow), enquanto outros são reutilizáveis. Esta informação aparece na descrição de cada produto.",
      },
      {
        question: "Os produtos brilham melhor em que tipo de ambiente?",
        answer:
          "O efeito glow é mais intenso em ambientes com pouca luz ou escuros. Para eventos, recomenda-se reduzir ao máximo a iluminação ambiente para um resultado mais forte.",
      },
      {
        question: "O stock apresentado no site é atualizado?",
        answer:
          "Sim, o stock é gerido em tempo real. Caso haja algum erro ou rutura inesperada, a nossa equipa entra em contacto contigo rapidamente para ajustar o pedido.",
      },
    ],
  },
  {
    category: "Conta & suporte",
    icon: User,
    items: [
      {
        question: "Preciso de criar conta para comprar?",
        answer:
          "Recomendamos criar conta para acompanhares pedidos, guardares favoritos e teres acesso mais rápido a futuras compras, mas poderás ter opções de checkout rápido em algumas situações.",
      },
      {
        question: "Como entro em contacto com o suporte?",
        answer:
          "Podes usar a página Fala Connosco, enviar email para suporte@lrstore.ao ou falar por telefone/WhatsApp. Os contactos estão sempre visíveis nas páginas de suporte.",
      },
      {
        question: "A LR Store atende empresas e marcas?",
        answer:
          "Sim! Trabalhamos com marcas, agências e eventos corporativos. Se precisas de um volume maior ou ativação específica, fala connosco para criarmos um plano personalizado.",
      },
    ],
  },
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.27em] text-pink-600">
            <HelpCircle className="h-4 w-4" />
            FAQ • Apoio ao cliente
          </span>

          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Perguntas frequentes sobre a LR Store.
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Reunimos as dúvidas mais comuns sobre pagamentos, entregas, produtos
            e suporte para facilitar a tua experiência. Se não encontrares a
            resposta aqui, a nossa equipa está pronta para ajudar.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 space-y-10">
        {/* HIGHLIGHT + CTA */}
        <section className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] items-start">
          <Card className="border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-600">
                <MessageCircle className="h-4 w-4" />
                Apoio ao cliente LR Store
              </div>
              <h2 className="text-lg md:text-xl font-semibold text-slate-900">
                Antes de falar connosco, vale a pena dar uma vista de olhos por
                aqui.
              </h2>
              <p className="text-sm text-slate-600">
                Muitos dos pedidos que recebemos todos os dias estão ligados a
                prazos de entrega, confirmação de pagamento e trocas. Por isso
                organizámos tudo em categorias simples de navegar.
              </p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Informações claras sobre pagamentos e segurança.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Explicações sobre prazos, entregas e possíveis atrasos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-pink-500" />
                  <span>Regras de devolução, troca e resolução de problemas.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="rounded-[1.8rem] bg-gradient-to-r from-pink-500 to-purple-600 p-[1px] shadow-md">
            <div className="flex h-full flex-col justify-between rounded-[1.6rem] bg-white px-6 py-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.27em] text-pink-600">
                  Ainda com dúvidas?
                </p>
                <h3 className="mt-2 text-lg md:text-xl font-semibold text-slate-900">
                  Fala diretamente com a nossa equipa de suporte.
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Se o teu caso for específico ou urgente, é melhor falares
                  connosco por canais diretos. Estamos aqui para ajudar a tua
                  festa a correr sem stress.
                </p>
                <div className="mt-4 space-y-1 text-sm text-slate-700">
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    suporte@lrstore.ao
                  </p>
                  <p>
                    <span className="font-semibold">Telefone / WhatsApp:</span>{" "}
                    +244 923 456 789
                  </p>
                  <p className="text-xs text-slate-500">
                    Atendimento em dias úteis, com foco em eventos e entregas
                    próximas.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:opacity-90"
                >
                  <Link to="/fala-connosco">
                    Falar connosco
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ LISTA */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Navega pelas categorias
              </h2>
              <p className="mt-1 text-sm text-slate-600 max-w-xl">
                Clica numa categoria para ver perguntas e respostas detalhadas.
                Podes abrir várias secções conforme vais precisando.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {faqData.map((group) => {
              const Icon = group.icon;
              return (
                <Card
                  key={group.category}
                  className="border-slate-200 shadow-sm rounded-3xl bg-white"
                >
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="rounded-2xl bg-purple-50 p-3 text-purple-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {group.category}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Perguntas frequentes relacionadas a{" "}
                          {group.category.toLowerCase()}.
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="space-y-2">
                      {group.items.map((item, index) => (
                        <AccordionItem
                          key={item.question}
                          value={`${group.category}-${index}`}
                          className="border border-slate-200 rounded-2xl px-3"
                        >
                          <AccordionTrigger className="text-left text-sm font-medium text-slate-800 hover:text-pink-600">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-slate-600 pb-3">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default FaqPage;
