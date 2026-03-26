import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { servicos, categorias } from "@/lib/data/servicos";

export const metadata = {
  title: "Serviços | Barbearia de Primeira",
  description: "Catálogo completo de serviços da Barbearia de Primeira: cortes, barba, combos e mais.",
};

const icones: Record<string, string> = {
  cabelo: "✂️",
  barba: "🧔",
  combo: "👑",
  outros: "✨",
};

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3aab4a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 relative z-10">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#3aab4a]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
              Tabela de preços
            </span>
          </div>
          <h1 className="font-display text-[clamp(40px,6vw,80px)] text-[#f5f0eb] leading-[0.9] tracking-tight">
            NOSSOS
          </h1>
          <h1 className="font-display text-[clamp(40px,6vw,80px)] text-[#3aab4a] leading-[0.9] tracking-tight mb-4">
            SERVIÇOS
          </h1>
          <p className="text-[#a8a8a8] max-w-lg">
            Todos os serviços realizados por profissionais especializados com
            produtos de alta qualidade. Preços válidos em todas as unidades.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {categorias.map((cat) => {
            const servsCat = servicos.filter((s) => s.categoria === cat.value);
            return (
              <div key={cat.value}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{icones[cat.value]}</span>
                  <h2 className="font-display text-3xl text-[#f5f0eb] tracking-wide">
                    {cat.label.toUpperCase()}
                  </h2>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                {/* Services table */}
                <div className="space-y-2">
                  {servsCat.map((servico) => (
                    <div
                      key={servico.id}
                      className="group flex items-center justify-between p-4 bg-[#272727] rounded-sm ring-1 ring-white/5 hover:ring-[#3aab4a]/30 transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-medium text-[#f5f0eb] text-sm group-hover:text-[#3aab4a] transition-colors duration-200">
                            {servico.nome}
                          </p>
                          {servico.popular && (
                            <span className="text-[9px] tracking-widest uppercase text-[#3aab4a] font-semibold bg-[#3aab4a]/10 px-1.5 py-0.5 rounded-sm">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#a8a8a8] line-clamp-1">
                          {servico.descricao}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="flex items-center gap-1 text-[#a8a8a8] text-xs">
                          <Clock size={11} />
                          {servico.duracao} min
                        </div>
                        <p className="font-display text-xl text-[#3aab4a] min-w-[72px] text-right">
                          R$ {servico.preco}
                        </p>
                        <Link
                          href={`/agendar?servico=${servico.id}`}
                          className="hidden sm:flex items-center gap-1 text-xs text-[#a8a8a8] hover:text-[#3aab4a] transition-colors duration-200 group/link"
                        >
                          Agendar
                          <ArrowRight
                            size={11}
                            className="group-hover/link:translate-x-0.5 transition-transform duration-200"
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#a8a8a8] mb-6">
            Pronto para agendar? Escolha o serviço e marque seu horário.
          </p>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#3aab4a] text-[#111111] font-semibold tracking-widest uppercase text-sm rounded-sm hover:bg-[#4ec55e] active:bg-[#2d8c3a] transition-all duration-200 shadow-[0_0_30px_rgba(58,171,74,0.2)] hover:shadow-[0_0_40px_rgba(58,171,74,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
          >
            Agendar agora
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
