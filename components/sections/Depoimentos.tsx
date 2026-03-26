"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const depoimentos = [
  {
    id: 1,
    nome: "Rafael Mendes",
    texto:
      "Melhor barbearia do Recreio, sem dúvida. O Carlos faz um degradê perfeito, saio de lá com o cabelo impecável toda vez.",
    unidade: "Recreio",
    rating: 5,
  },
  {
    id: 2,
    nome: "Thiago Barbosa",
    texto:
      "Assino o plano Plus há 6 meses e valeu cada centavo. Prioridade no agendamento e o atendimento é sempre top.",
    unidade: "Barra",
    rating: 5,
  },
  {
    id: 3,
    nome: "Lucas Figueiredo",
    texto:
      "A barba ficou exatamente como eu queria. Profissionais técnicos e caprichosos. Recomendo pra todo mundo.",
    unidade: "Guanabara",
    rating: 5,
  },
  {
    id: 4,
    nome: "Pedro Alves",
    texto:
      "Ambiente excelente, produtos de qualidade e os barbeiros são muito qualificados. Minha barbearia de confiança.",
    unidade: "Recreio",
    rating: 5,
  },
  {
    id: 5,
    nome: "Felipe Nunes",
    texto:
      "Levei meu filho pela primeira vez e ele adorou. Foram super pacientes com ele e o corte ficou ótimo!",
    unidade: "Barra",
    rating: 5,
  },
];

export default function Depoimentos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + depoimentos.length) % depoimentos.length);
  const next = () => setCurrent((c) => (c + 1) % depoimentos.length);

  const visible = [
    depoimentos[current],
    depoimentos[(current + 1) % depoimentos.length],
    depoimentos[(current + 2) % depoimentos.length],
  ];

  return (
    <section ref={ref} className="py-28 bg-[#0c0c0c] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3aab4a]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-6 h-px bg-[#3aab4a]" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
                O que dizem
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" as const }}
              className="font-display text-[clamp(40px,5vw,72px)] leading-[0.9] tracking-tight"
            >
              <span className="text-[#f5f0eb]">DEPOI</span>
              <span className="text-[#3aab4a]">MENTOS</span>
            </motion.h2>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/10 text-[#f5f0eb] hover:border-[#3aab4a] hover:text-[#3aab4a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center rounded-sm border border-white/10 text-[#f5f0eb] hover:border-[#3aab4a] hover:text-[#3aab4a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
              aria-label="Próximo"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((dep, i) => (
            <motion.div
              key={`${dep.id}-${current}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`bg-[#272727] rounded-sm p-6 ring-1 ring-white/5 ${
                i === 1 ? "ring-[#3aab4a]/20" : ""
              }`}
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: dep.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={13}
                    className="text-[#3aab4a] fill-[#3aab4a]"
                  />
                ))}
              </div>

              <p className="text-[#f5f0eb] leading-relaxed mb-6 font-heading text-lg italic">
                &ldquo;{dep.texto}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-[#f5f0eb]">
                    {dep.nome}
                  </p>
                  <p className="text-xs text-[#a8a8a8]">
                    Unidade {dep.unidade}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3aab4a]/20 flex items-center justify-center">
                  <span className="font-display text-sm text-[#3aab4a]">
                    {dep.nome[0]}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {depoimentos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-200 rounded-full focus-visible:outline-none ${
                i === current
                  ? "w-6 h-1.5 bg-[#3aab4a]"
                  : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
