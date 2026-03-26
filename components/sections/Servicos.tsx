"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { servicos } from "@/lib/data/servicos";

const destaque = servicos.filter((s) => s.popular);

const icones: Record<string, string> = {
  s1: "✂️",
  s2: "⚡",
  s3: "🪒",
  s4: "👦",
  s5: "🧔",
  s6: "✨",
  s9: "💎",
  s10: "👑",
};

export default function Servicos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="py-28 bg-[#0c0c0c] relative overflow-hidden"
    >
      {/* Accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3aab4a]/5 blur-[100px] pointer-events-none" />

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
                O que oferecemos
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" as const }}
              className="font-display text-[clamp(40px,5vw,72px)] text-[#f5f0eb] leading-[0.9] tracking-tight"
            >
              NOSSOS
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
              className="font-display text-[clamp(40px,5vw,72px)] text-[#3aab4a] leading-[0.9] tracking-tight"
            >
              SERVIÇOS
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/servicos"
              className="inline-flex items-center gap-2 text-sm text-[#a8a8a8] hover:text-[#3aab4a] transition-colors duration-200 group"
            >
              Ver catálogo completo
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-200"
              />
            </Link>
          </motion.div>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destaque.map((servico, i) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 * i + 0.3,
                ease: "easeOut" as const,
              }}
            >
              <Link
                href={`/agendar?servico=${servico.id}`}
                className="group relative bg-[#272727] rounded-sm ring-1 ring-white/5 p-6 hover:ring-[#3aab4a]/40 hover:bg-[#2f2f2f] transition-all duration-300 flex flex-col h-full block"
              >
                {/* Popular badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-[10px] tracking-widest uppercase text-[#3aab4a] font-medium">
                    Popular
                  </span>
                </div>

                <div className="text-3xl mb-4">{icones[servico.id] ?? "✂️"}</div>

                <h3 className="font-display text-xl text-[#f5f0eb] tracking-wide mb-2 group-hover:text-[#3aab4a] transition-colors duration-200">
                  {servico.nome.toUpperCase()}
                </h3>

                <p className="text-[#a8a8a8] text-sm leading-relaxed mb-4 line-clamp-2">
                  {servico.descricao}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <p className="font-display text-2xl text-[#3aab4a]">
                    R$ {servico.preco}
                  </p>
                  <div className="flex items-center gap-1 text-[#a8a8a8] text-xs">
                    <Clock size={11} />
                    {servico.duracao} min
                  </div>
                </div>

                {/* Hover line */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3aab4a] group-hover:w-full transition-all duration-400 rounded-b-sm" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#3aab4a] text-[#111111] font-semibold tracking-widest uppercase text-sm rounded-sm hover:bg-[#4ec55e] active:bg-[#2d8c3a] transition-all duration-200 shadow-[0_0_30px_rgba(58,171,74,0.2)] hover:shadow-[0_0_40px_rgba(58,171,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
          >
            Agendar agora
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
