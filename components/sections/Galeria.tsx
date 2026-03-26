"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const fotos = [
  { id: 1, w: 400, h: 500, alt: "Corte degradê" },
  { id: 2, w: 400, h: 300, alt: "Barba navalha" },
  { id: 3, w: 400, h: 300, alt: "Ambiente barbearia" },
  { id: 4, w: 400, h: 500, alt: "Corte clássico" },
  { id: 5, w: 400, h: 300, alt: "Detalhe corte" },
  { id: 6, w: 400, h: 300, alt: "Produto profissional" },
];

export default function Galeria() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 bg-[#0c0c0c] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-6 h-px bg-[#3aab4a]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
              Nosso trabalho
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" as const }}
            className="font-display text-[clamp(40px,5vw,72px)] text-[#f5f0eb] leading-[0.9] tracking-tight"
          >
            GALERIA
          </motion.h2>
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {fotos.map((foto, i) => (
            <motion.div
              key={foto.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.08 * i + 0.2,
                ease: "easeOut" as const,
              }}
              className="group relative break-inside-avoid overflow-hidden rounded-sm ring-1 ring-white/5 cursor-pointer"
            >
              <img
                src={`https://placehold.co/${foto.w}x${foto.h}/1e1e1e/272727?text=.`}
                alt={foto.alt}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-[#3aab4a]/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-xs tracking-widest uppercase text-[#f5f0eb] font-medium">
                  {foto.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <a
            href="https://instagram.com/barbearia.de.primeira"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#a8a8a8] hover:text-[#3aab4a] transition-colors duration-200 group"
          >
            <span>Ver mais no Instagram</span>
            <span className="text-[#3aab4a] group-hover:translate-x-1 transition-transform duration-200">
              @barbearia.de.primeira
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
