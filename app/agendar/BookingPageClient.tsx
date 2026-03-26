"use client";

import { useSearchParams } from "next/navigation";
import BookingFlow from "@/components/booking/BookingFlow";

export default function BookingPageClient() {
  const params = useSearchParams();
  const unidade = params.get("unidade") ?? undefined;
  const servico = params.get("servico") ?? undefined;
  return <BookingFlow initialUnidade={unidade} initialServico={servico} />;
}
