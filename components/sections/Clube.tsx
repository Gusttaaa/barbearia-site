"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Check, Star, Crown, Zap } from "lucide-react";

const planos = [
  {
    id: "basico",
    nome: "Básico",
    preco: 79,
    icon: Zap,
    descricao: "Perfeito para quem quer manter o visual em dia",
    beneficios: [
      "1 corte por mês",
      "10% desconto em serviços",
      "Prioridade de agendamento",
      "Acesso ao app",
    ],
    destaque: false,
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
      "15% desconto em serviços",
      "Prioridade máxima",
      "Produtos com 10% off",
      "Acesso ao app",
    ],
    destaque: true,
  },
  {
    id: "premium",
    nome: "Premium",
    preco: 199,
    icon: Crown,
    descricao: "Experiência completa e ilimitada para os mais exigentes",
    beneficios: [
      "Cortes ilimitados",
      "Barbas ilimitadas",
      "20% desconto em serviços",
      "Agendamento VIP",
      "Produtos com 20% off",
      "Atendimento prioritário",
      "Kit de boas-vindas",
    ],
    destaque: false,
  },
];

export default function Clube() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-[#111111] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3aab4a]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3aab4a]/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3aab4a]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="w-6 h-px bg-[#3aab4a]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
              Exclusividade
            </span>
            <div className="w-6 h-px bg-[#3aab4a]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" as const }}
            className="font-display text-[clamp(40px,5vw,72px)] text-[#f5f0eb] leading-[0.9] tracking-tight"
          >
            CLUBE DE
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
            className="font-display text-[clamp(40px,5vw,72px)] text-[#3aab4a] leading-[0.9] tracking-tight mb-4"
          >
            ASSINATURAS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[#a8a8a8] max-w-xl mx-auto"
          >
            Assine um plano e garanta mais por menos. Prioridade, descontos e a
            qualidade que você já conhece — todo mês.
          </motion.p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {planos.map((plano, i) => {
            const Icon = plano.icon;
            return (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.1 * i + 0.4,
                  ease: "easeOut" as const,
                }}
                className={`relative rounded-sm p-8 flex flex-col ring-1 transition-all duration-300 ${
                  plano.destaque
                    ? "bg-[#3aab4a] ring-[#3aab4a] shadow-[0_0_60px_rgba(58,171,74,0.25)] scale-[1.02]"
                    : "bg-[#272727] ring-white/5 hover:ring-[#3aab4a]/30"
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111111] text-[#3aab4a] text-[10px] font-semibold tracking-widest uppercase px-4 py-1 rounded-full border border-[#3aab4a]/30">
                    Mais popular
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center mb-4 ${
                      plano.destaque ? "bg-[#111111]/20" : "bg-[#3aab4a]/10"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={plano.destaque ? "text-[#111111]" : "text-[#3aab4a]"}
                    />
                  </div>
                  <h3
                    className={`font-display text-3xl tracking-wide mb-1 ${
                      plano.destaque ? "text-[#111111]" : "text-[#f5f0eb]"
                    }`}
                  >
                    {plano.nome.toUpperCase()}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      plano.destaque ? "text-[#111111]/70" : "text-[#a8a8a8]"
                    }`}
                  >
                    {plano.descricao}
                  </p>
                </div>

                <div className="mb-6">
                  <span
                    className={`font-display text-5xl leading-none ${
                      plano.destaque ? "text-[#111111]" : "text-[#f5f0eb]"
                    }`}
                  >
                    R$ {plano.preco}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      plano.destaque ? "text-[#111111]/60" : "text-[#a8a8a8]"
                    }`}
                  >
                    /mês
                  </span>
                </div>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-center gap-2.5">
                      <Check
                        size={14}
                        className={
                          plano.destaque ? "text-[#111111]" : "text-[#3aab4a]"
                        }
                      />
                      <span
                        className={`text-sm ${
                          plano.destaque ? "text-[#111111]/80" : "text-[#a8a8a8]"
                        }`}
                      >
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/clube"
                  className={`block text-center py-3 rounded-sm font-semibold tracking-widest uppercase text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                    plano.destaque
                      ? "bg-[#111111] text-[#3aab4a] hover:bg-[#1a1a1a] focus-visible:ring-[#111111]"
                      : "bg-[#3aab4a] text-[#111111] hover:bg-[#4ec55e] focus-visible:ring-[#3aab4a]"
                  }`}
                >
                  Assinar {plano.nome}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
