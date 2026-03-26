"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const planos = [
  {
    id: "basico",
    nome: "Básico",
    preco: 79,
    icon: Zap,
    descricao: "Para quem quer manter o visual em dia com praticidade",
    beneficios: [
      "1 corte por mês",
      "10% desconto em serviços avulsos",
      "Prioridade de agendamento",
      "Acesso ao app exclusivo",
    ],
    nao: ["Barba inclusa", "Produtos com desconto"],
    destaque: false,
    cor: "#272727",
  },
  {
    id: "plus",
    nome: "Plus",
    preco: 129,
    icon: Star,
    descricao: "O equilíbrio perfeito entre custo e benefício",
    beneficios: [
      "2 cortes por mês",
      "1 barba por mês",
      "15% desconto em serviços avulsos",
      "Prioridade máxima de agendamento",
      "Produtos com 10% de desconto",
      "Acesso ao app exclusivo",
    ],
    nao: [],
    destaque: true,
    cor: "#3aab4a",
  },
  {
    id: "premium",
    nome: "Premium",
    preco: 199,
    icon: Crown,
    descricao: "A experiência completa para os mais exigentes",
    beneficios: [
      "Cortes ilimitados",
      "Barbas ilimitadas",
      "20% desconto em serviços avulsos",
      "Agendamento VIP",
      "Produtos com 20% de desconto",
      "Atendimento prioritário",
      "Kit de boas-vindas exclusivo",
      "Acesso antecipado a promoções",
    ],
    nao: [],
    destaque: false,
    cor: "#272727",
  },
];

const faqs = [
  {
    q: "Como funciona o clube de assinaturas?",
    a: "Ao assinar um plano, você paga mensalmente e tem acesso a todos os benefícios do seu plano durante o período ativo. Os cortes e serviços inclusos renovam todo mês.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim! Não há fidelidade. Você pode cancelar ou pausar sua assinatura a qualquer momento diretamente pelo app ou entrando em contato conosco.",
  },
  {
    q: "Os benefícios valem em todas as unidades?",
    a: "Sim. Seu plano é válido em todas as nossas unidades: Recreio, Barra e Guanabara.",
  },
  {
    q: "Posso usar em qualquer barbeiro?",
    a: "Sim. Os benefícios do clube são válidos com qualquer profissional em qualquer unidade.",
  },
  {
    q: "Como funcionam os descontos em produtos?",
    a: "Os percentuais de desconto se aplicam a todos os produtos disponíveis na nossa loja física e online.",
  },
];

export default function ClubePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleAssinar = (plano: string) => {
    toast.success(`Assinatura ${plano} iniciada!`, {
      description: "Em breve você receberá as instruções de pagamento via WhatsApp.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* Hero */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3aab4a]/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#3aab4a]/6 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-6 h-px bg-[#3aab4a]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
              Exclusividade
            </span>
            <div className="w-6 h-px bg-[#3aab4a]" />
          </div>
          <h1 className="font-display text-[clamp(48px,7vw,96px)] text-[#f5f0eb] leading-[0.9] tracking-tight">
            CLUBE DE
          </h1>
          <h1 className="font-display text-[clamp(48px,7vw,96px)] text-[#3aab4a] leading-[0.9] tracking-tight mb-6">
            ASSINATURAS
          </h1>
          <p className="text-[#a8a8a8] max-w-lg mx-auto leading-relaxed">
            Trate-se como merece. Planos mensais com acesso prioritário,
            descontos exclusivos e a qualidade Barbearia de Primeira — todo mês.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {planos.map((plano, i) => {
            const Icon = plano.icon;
            return (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-sm p-8 flex flex-col ring-1 ${
                  plano.destaque
                    ? "bg-[#3aab4a] ring-[#3aab4a] shadow-[0_0_60px_rgba(58,171,74,0.25)] md:scale-[1.04]"
                    : "bg-[#272727] ring-white/5"
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111111] text-[#3aab4a] text-[10px] font-semibold tracking-widest uppercase px-4 py-1 rounded-full border border-[#3aab4a]/30 whitespace-nowrap">
                    Mais popular
                  </div>
                )}

                <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 ${plano.destaque ? "bg-[#111111]/20" : "bg-[#3aab4a]/10"}`}>
                  <Icon size={18} className={plano.destaque ? "text-[#111111]" : "text-[#3aab4a]"} />
                </div>

                <h3 className={`font-display text-3xl tracking-wide mb-1 ${plano.destaque ? "text-[#111111]" : "text-[#f5f0eb]"}`}>
                  {plano.nome.toUpperCase()}
                </h3>
                <p className={`text-sm mb-6 leading-relaxed ${plano.destaque ? "text-[#111111]/70" : "text-[#a8a8a8]"}`}>
                  {plano.descricao}
                </p>

                <div className="mb-6">
                  <span className={`font-display text-5xl leading-none ${plano.destaque ? "text-[#111111]" : "text-[#f5f0eb]"}`}>
                    R$ {plano.preco}
                  </span>
                  <span className={`text-sm ml-1 ${plano.destaque ? "text-[#111111]/60" : "text-[#a8a8a8]"}`}>/mês</span>
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-center gap-2.5 text-sm">
                      <Check size={13} className={plano.destaque ? "text-[#111111]" : "text-[#3aab4a]"} />
                      <span className={plano.destaque ? "text-[#111111]/80" : "text-[#a8a8a8]"}>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleAssinar(plano.nome)}
                  className={`w-full py-3 rounded-sm font-semibold tracking-widest uppercase text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] ${
                    plano.destaque
                      ? "bg-[#111111] text-[#3aab4a] hover:bg-[#1a1a1a] focus-visible:ring-[#111111]"
                      : "bg-[#3aab4a] text-[#111111] hover:bg-[#4ec55e] focus-visible:ring-[#3aab4a] shadow-[0_0_20px_rgba(58,171,74,0.2)]"
                  }`}
                >
                  Assinar {plano.nome}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-[#3aab4a]" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
                Dúvidas frequentes
              </span>
              <div className="w-6 h-px bg-[#3aab4a]" />
            </div>
            <h2 className="font-display text-4xl text-[#f5f0eb] tracking-tight">FAQ</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#272727] rounded-sm ring-1 ring-white/5 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] focus-visible:ring-inset"
                >
                  <span className="font-medium text-[#f5f0eb] pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#a8a8a8] shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-[#a8a8a8] text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
