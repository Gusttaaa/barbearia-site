"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MapPin, Clock, MessageCircle, ArrowRight } from "lucide-react";
import { unidades } from "@/lib/data/unidades";

export default function Unidades() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="unidades"
      ref={ref}
      className="py-28 bg-[#111111] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3aab4a]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-6 h-px bg-[#3aab4a]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
              Onde nos encontrar
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" as const }}
            className="font-display text-[clamp(40px,5vw,72px)] text-[#f5f0eb] leading-[0.9] tracking-tight"
          >
            NOSSAS
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" as const }}
            className="font-display text-[clamp(40px,5vw,72px)] text-[#3aab4a] leading-[0.9] tracking-tight"
          >
            UNIDADES
          </motion.h2>
        </div>

        {/* Units grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {unidades.map((unidade, i) => (
            <motion.div
              key={unidade.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.1 * i + 0.3,
                ease: "easeOut" as const,
              }}
              className="group bg-[#272727] rounded-sm ring-1 ring-white/5 overflow-hidden hover:ring-[#3aab4a]/30 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Unit image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={unidade.foto}
                  alt={`Unidade ${unidade.nome}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#272727] to-transparent" />
                <div className="absolute inset-0 bg-[#3aab4a]/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-display text-3xl text-[#f5f0eb] tracking-wide leading-none">
                    {unidade.nome.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Unit info */}
              <div className="p-6">
                <div className="flex items-start gap-2 mb-3">
                  <MapPin
                    size={14}
                    className="text-[#3aab4a] mt-0.5 shrink-0"
                  />

      
                  <p className="text-[#a8a8a8] text-sm leading-relaxed">
                    {(unidade.endereco || "").split("—").map((part, idx, arr) => (
                      <span key={idx}>
                        {part.trim()}
                        {idx < arr.length - 1 && <><br /></>}
                      </span>
                    ))}
               
                  </p>
                </div>

                <div className="space-y-1 mb-5">
                  {[
                    unidade.horarios.semana,
                    unidade.horarios.sabado,
                    unidade.horarios.domingo,
                  ].map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <Clock size={12} className="text-[#a8a8a8] shrink-0" />
                      <p className="text-[#a8a8a8] text-xs">{h}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-stretch lg:flex-row gap-2">
                  <a
                    href={`https://wa.me/${unidade.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
                  >
                    <MessageCircle size={13} />
                    WhatsApp
                  </a>
                  <Link
                    href={`/agendar?unidade=${unidade.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-white/10 text-[#f5f0eb] text-xs font-semibold tracking-widest uppercase rounded-sm hover:border-[#3aab4a] hover:text-[#3aab4a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
                  >
                    Agendar
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
