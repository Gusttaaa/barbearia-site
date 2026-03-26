import { Suspense } from "react";
import BookingPageClient from "./BookingPageClient";

export const metadata = {
  title: "Agendar | Barbearia de Primeira",
  description: "Agende seu horário na Barbearia de Primeira. Escolha a unidade, serviço e profissional de sua preferência.",
};

export default function AgendarPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] pt-24 pb-20">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3aab4a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-px bg-[#3aab4a]" />
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
              Reserva online
            </span>
          </div>
          <h1 className="font-display text-[clamp(40px,5vw,64px)] text-[#f5f0eb] leading-[0.9] tracking-tight">
            AGENDAR
          </h1>
          <h1 className="font-display text-[clamp(40px,5vw,64px)] text-[#3aab4a] leading-[0.9] tracking-tight mb-4">
            HORÁRIO
          </h1>
          <p className="text-[#a8a8a8]">
            Escolha a unidade, serviço e profissional. Em menos de 2 minutos.
          </p>
        </div>

        {/* Booking form */}
        <div className="bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 p-6 md:p-8">
          <Suspense fallback={<div className="text-[#a8a8a8] text-sm py-8 text-center">Carregando...</div>}>
            <BookingPageClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
