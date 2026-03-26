"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "3", label: "Unidades" },
  { value: "10+", label: "Anos de experiência" },
  { value: "50k+", label: "Clientes atendidos" },
  { value: "4.9★", label: "Avaliação média" },
];

export default function SobreNos() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 bg-[#111111] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3aab4a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" as const }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden ring-1 ring-white/10">
              <img
                src="https://placehold.co/480x600/1e1e1e/272727?text=."
                alt="Sobre a Barbearia de Primeira"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#111111]/60 to-transparent" />
              <div className="absolute inset-0 bg-[#3aab4a]/10 mix-blend-multiply" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#3aab4a] p-6 rounded-sm shadow-[0_20px_60px_rgba(58,171,74,0.3)]">
              <p className="font-display text-5xl text-[#111111] leading-none">10</p>
              <p className="font-display text-lg text-[#111111]/80 leading-none">
                ANOS
              </p>
            </div>
          </motion.div>

          {/* Right: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-6 h-px bg-[#3aab4a]" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
                Nossa história
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" as const }}
              className="font-display text-[clamp(40px,5vw,72px)] text-[#f5f0eb] leading-[0.9] tracking-tight mb-2"
            >
              MAIS QUE UMA
            </motion.h2>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" as const }}
              className="font-display text-[clamp(40px,5vw,72px)] text-[#3aab4a] leading-[0.9] tracking-tight mb-6"
            >
              BARBEARIA
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-[#a8a8a8] leading-relaxed mb-4"
            >
              Nascemos no Recreio dos Bandeirantes com um propósito claro:
              elevar o padrão da barbearia carioca. Com a mesma qualidade que
              batizou nosso nome, crescemos para três unidades no Rio de
              Janeiro.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-[#a8a8a8] leading-relaxed mb-10"
            >
              Aqui, cada corte é executado com precisão artesanal. Cada detalhe
              — da temperatura da toalha ao acabamento final — é tratado com o
              cuidado que você merece.
            </motion.p>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="py-4 px-5 bg-[#272727] rounded-sm ring-1 ring-white/5 hover:ring-[#3aab4a]/20 transition-all duration-300"
                >
                  <p className="font-display text-3xl text-[#3aab4a] leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs tracking-wider uppercase text-[#a8a8a8]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
