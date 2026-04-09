"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, Calendar, User, MapPin, Scissors, Phone } from "lucide-react";
import { toast } from "sonner";
import { servicos, type Servico } from "@/lib/data/servicos";
import { supabase } from "@/lib/supabase";

// DB types (flat, from Supabase)
interface DBUnidade {
  id: string;
  nome: string;
  bairro: string | null;
  horario_semana: string | null;
}

interface DBProfissional {
  id: string;
  nome: string;
  especialidade: string | null;
  unidade_id: string;
  foto: string | null;
  rating: number;
  ativo: boolean;
}

type Step = "unidade" | "servico" | "profissional" | "horario" | "dados" | "confirmado";

interface Booking {
  unidade?: DBUnidade;
  servico?: Servico;
  profissional?: DBProfissional;
  data?: string;
  horario?: string;
  clienteNome?: string;
  clienteTelefone?: string;
  clienteEmail?: string;
}

const horarios = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00",
];

const stepOrder: Step[] = ["unidade", "servico", "profissional", "horario", "dados"];
const stepLabels = ["Unidade", "Serviço", "Profissional", "Horário", "Dados"];
const stepIcons = [MapPin, Scissors, User, Calendar, Phone];

function getNextDays(n: number) {
  const days: { iso: string; display: string; weekday: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split("T")[0];
    const display = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    const weekday = d.toLocaleDateString("pt-BR", { weekday: "short" });
    days.push({ iso, display, weekday });
  }
  return days;
}

export default function BookingFlow({ initialUnidade, initialServico }: { initialUnidade?: string; initialServico?: string }) {
  const [step, setStep] = useState<Step>("unidade");
  const [booking, setBooking] = useState<Booking>({});
  const [ocupados, setOcupados] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // DB data
  const [dbUnidades, setDbUnidades] = useState<DBUnidade[]>([]);
  const [dbProfissionais, setDbProfissionais] = useState<DBProfissional[]>([]);

  // Pre-select service from URL param
  useEffect(() => {
    if (initialServico) {
      const found = servicos.find((s) => s.id === initialServico);
      if (found) setBooking((b) => ({ ...b, servico: found }));
    }
  }, [initialServico]);

  // Fetch unidades on mount
  useEffect(() => {
    supabase
      .from("unidades")
      .select("id, nome, bairro, horario_semana")
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => {
        const list = data ?? [];
        setDbUnidades(list);
        if (initialUnidade) {
          const found = list.find((u) => u.id === initialUnidade);
          if (found) setBooking((b) => ({ ...b, unidade: found }));
        }
      });
  }, [initialUnidade]);

  // Fetch profissionais when unit is selected
  useEffect(() => {
    if (!booking.unidade) { setDbProfissionais([]); return; }
    supabase
      .from("profissionais")
      .select("*")
      .eq("unidade_id", booking.unidade.id)
      .eq("ativo", true)
      .order("nome")
      .then(({ data }) => setDbProfissionais(data ?? []));
  }, [booking.unidade]);

  // Fetch occupied slots when profissional + date change
  useEffect(() => {
    if (!booking.profissional || !booking.data) return;
    fetch(`/api/agendamentos?profissionalId=${booking.profissional.id}&data=${booking.data}`)
      .then((r) => r.json())
      .then((d) => setOcupados(d.ocupados ?? []))
      .catch(() => setOcupados([]));
  }, [booking.profissional, booking.data]);

  const currentStepIndex = stepOrder.indexOf(step);
  const days = getNextDays(7);

  const goNext = (update: Partial<Booking>) => {
    const updatedBooking = { ...booking, ...update };
    let next = stepOrder[currentStepIndex + 1];
    if (next === "servico" && updatedBooking.servico) next = "profissional";
    setBooking(updatedBooking);
    if (next) setStep(next);
  };

  const goBack = () => {
    let prev = stepOrder[currentStepIndex - 1];
    if (prev === "servico" && booking.servico && initialServico) prev = "unidade";
    if (prev === "unidade") setBooking({});
    if (prev) setStep(prev);
  };

  const confirm = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profissionalId: booking.profissional?.id,
          unidadeId: booking.unidade?.id,
          servicoId: booking.servico?.id,
          servicoNome: booking.servico?.nome,
          servicoPreco: booking.servico?.preco,
          profissionalNome: booking.profissional?.nome,
          unidadeNome: booking.unidade?.nome,
          data: booking.data,
          horario: booking.horario,
          clienteNome: booking.clienteNome,
          clienteTelefone: booking.clienteTelefone,
          clienteId: user?.id ?? null,
          clienteEmail: booking.clienteEmail,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        toast.error("Erro ao confirmar agendamento.", { description: error });
        return;
      }

      setStep("confirmado");
      toast.success("Agendamento confirmado!", {
        description: `${booking.servico?.nome} com ${booking.profissional?.nome} na unidade ${booking.unidade?.nome}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "confirmado") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-[#3aab4a] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(58,171,74,0.4)]">
          <Check size={36} className="text-[#111111]" />
        </div>
        <h2 className="font-display text-4xl text-[#f5f0eb] tracking-wide mb-2">AGENDADO!</h2>
        <p className="text-[#a8a8a8] mb-8 max-w-sm mx-auto">
          Seu agendamento foi confirmado. Você receberá uma confirmação via WhatsApp.
        </p>
        <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 p-6 max-w-sm mx-auto text-left mb-8">
          <div className="space-y-3">
            {[
              { label: "Cliente", value: booking.clienteNome },
              { label: "Serviço", value: booking.servico?.nome },
              { label: "Profissional", value: booking.profissional?.nome },
              { label: "Unidade", value: booking.unidade?.nome },
              { label: "Data", value: booking.data ? new Date(booking.data + "T00:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }) : "" },
              { label: "Horário", value: booking.horario },
              { label: "Valor", value: `R$ ${booking.servico?.preco}` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="text-[#a8a8a8]">{item.label}</span>
                <span className="text-[#f5f0eb] font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => { setStep("unidade"); setBooking({}); setOcupados([]); }}
          className="px-8 py-3 border border-white/10 text-[#f5f0eb] text-sm font-medium tracking-widest uppercase rounded-sm hover:border-[#3aab4a] hover:text-[#3aab4a] transition-all duration-200"
        >
          Novo agendamento
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-center gap-0 mb-12">
        {stepLabels.map((label, i) => {
          const Icon = stepIcons[i];
          const isCompleted = i < currentStepIndex;
          const isCurrent = i === currentStepIndex;
          return (
            <div key={label} className="flex items-center">
              <div className={`flex flex-col items-center gap-1.5 ${i <= currentStepIndex ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ring-1 transition-all duration-300 ${isCompleted ? "bg-[#3aab4a] ring-[#3aab4a]" : isCurrent ? "bg-[#272727] ring-[#3aab4a]" : "bg-[#272727] ring-white/10"}`}>
                  {isCompleted ? <Check size={14} className="text-[#111111]" /> : <Icon size={14} className={isCurrent ? "text-[#3aab4a]" : "text-[#a8a8a8]"} />}
                </div>
                <span className={`text-[10px] tracking-widest uppercase hidden sm:block ${isCurrent ? "text-[#3aab4a]" : "text-[#a8a8a8]"}`}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`w-8 sm:w-14 h-px mx-2 transition-colors duration-300 ${i < currentStepIndex ? "bg-[#3aab4a]" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3, ease: "easeOut" as const }}>

          {/* Unidade */}
          {step === "unidade" && (
            <div>
              <h2 className="font-display text-2xl text-[#f5f0eb] tracking-wide mb-2">ESCOLHA A UNIDADE</h2>
              <p className="text-[#a8a8a8] text-sm mb-6">Selecione qual unidade deseja ser atendido</p>
              {dbUnidades.length === 0 ? (
                <p className="text-[#a8a8a8] text-sm">Carregando unidades...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {dbUnidades.map((u) => (
                    <button key={u.id} onClick={() => goNext({ unidade: u })}
                      className={`group text-left p-5 rounded-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] ${booking.unidade?.id === u.id ? "bg-[#3aab4a]/10 ring-[#3aab4a]" : "bg-[#272727] ring-white/5 hover:ring-[#3aab4a]/50"}`}>
                      <p className="font-display text-xl text-[#f5f0eb] group-hover:text-[#3aab4a] transition-colors duration-200 mb-1">{u.nome.toUpperCase()}</p>
                      <p className="text-xs text-[#a8a8a8] mb-3">{u.bairro}</p>
                      <p className="text-xs text-[#a8a8a8]">{u.horario_semana}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Serviço */}
          {step === "servico" && (
            <div>
              <h2 className="font-display text-2xl text-[#f5f0eb] tracking-wide mb-2">ESCOLHA O SERVIÇO</h2>
              <p className="text-[#a8a8a8] text-sm mb-6">Selecione o serviço desejado</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicos.map((s) => (
                  <button key={s.id} onClick={() => goNext({ servico: s })}
                    className={`group text-left p-4 rounded-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] flex items-center justify-between ${booking.servico?.id === s.id ? "bg-[#3aab4a]/10 ring-[#3aab4a]" : "bg-[#272727] ring-white/5 hover:ring-[#3aab4a]/50"}`}>
                    <div>
                      <p className="font-medium text-[#f5f0eb] text-sm group-hover:text-[#3aab4a] transition-colors duration-200 mb-0.5">
                        {s.nome}
                        {s.popular && <span className="ml-2 text-[10px] text-[#3aab4a] tracking-wider">POPULAR</span>}
                      </p>
                      <p className="text-xs text-[#a8a8a8]">{s.duracao} min</p>
                    </div>
                    <p className="font-display text-xl text-[#3aab4a] ml-4 shrink-0">R$ {s.preco}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Profissional */}
          {step === "profissional" && (
            <div>
              <h2 className="font-display text-2xl text-[#f5f0eb] tracking-wide mb-2">ESCOLHA O PROFISSIONAL</h2>
              <p className="text-[#a8a8a8] text-sm mb-6">Selecione com quem quer ser atendido</p>
              {dbProfissionais.length === 0 ? (
                <p className="text-[#a8a8a8] text-sm">Não há profissionais disponíveis para a unidade selecionada.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {dbProfissionais.map((p) => (
                    <button key={p.id} onClick={() => goNext({ profissional: p })}
                      className={`group text-center p-4 rounded-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] ${booking.profissional?.id === p.id ? "bg-[#3aab4a]/10 ring-[#3aab4a]" : "bg-[#272727] ring-white/5 hover:ring-[#3aab4a]/50"}`}>
                      <img src={p.foto ?? ""} alt={p.nome} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover ring-1 ring-white/10 group-hover:ring-[#3aab4a]/50 transition-all duration-200" />
                      <p className="font-medium text-[#f5f0eb] text-sm mb-0.5 group-hover:text-[#3aab4a] transition-colors duration-200">{p.nome.split(" ")[0]}</p>
                      <p className="text-[10px] text-[#a8a8a8]">{p.especialidade}</p>
                      <p className="text-[10px] text-[#3aab4a] mt-1">★ {p.rating}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Horário */}
          {step === "horario" && (
            <div>
              <h2 className="font-display text-2xl text-[#f5f0eb] tracking-wide mb-2">ESCOLHA O HORÁRIO</h2>
              <p className="text-[#a8a8a8] text-sm mb-6">Selecione a data e o horário de sua preferência</p>
              <div className="flex gap-2 overflow-x-auto p-2 mb-6">
                {days.map((day) => (
                  <button key={day.iso} onClick={() => setBooking((b) => ({ ...b, data: day.iso, horario: undefined }))}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] ${booking.data === day.iso ? "bg-[#3aab4a]/10 ring-[#3aab4a]" : "bg-[#272727] ring-white/5 hover:ring-[#3aab4a]/50"} `}
                  >
                    <span className="text-[10px] tracking-widest uppercase text-[#a8a8a8] mb-1">{day.weekday}</span>
                    <span className={`font-display text-xl ${booking.data === day.iso ? "text-[#3aab4a]" : "text-[#f5f0eb]"}`}>{day.display}</span>
                  </button>
                ))}
              </div>
              {booking.data && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 p-2">
                  {horarios.map((h) => {
                    const isOcupado = ocupados.includes(h);
                    return (
                      <button key={h} disabled={isOcupado} onClick={() => setBooking((b) => ({ ...b, horario: h }))}
                        className={`py-2.5 rounded-sm text-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] ${isOcupado ? "bg-[#1e1e1e] text-[#a8a8a8]/30 ring-white/5 cursor-not-allowed line-through" : booking.horario === h ? "bg-[#3aab4a] text-[#111111] ring-[#3aab4a] font-medium" : "bg-[#272727] text-[#f5f0eb] ring-white/5 hover:ring-[#3aab4a]/50"}`}>
                        {h}
                      </button>
                    );
                  })}
                </div>
              )}
              {booking.data && booking.horario && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-5 bg-[#272727] rounded-sm ring-1 ring-white/5">
                  <p className="text-xs tracking-widest uppercase text-[#a8a8a8] mb-3">Resumo do agendamento</p>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    {[
                      { label: "Serviço", value: booking.servico?.nome },
                      { label: "Profissional", value: booking.profissional?.nome },
                      { label: "Unidade", value: booking.unidade?.nome },
                      { label: "Horário", value: `${booking.horario} — ${new Date(booking.data + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}` },
                    ].map((item) => (
                      <div key={item.label}>
                        <span className="text-[#a8a8a8]">{item.label}: </span>
                        <span className="text-[#f5f0eb] font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[#a8a8a8] text-sm">Total</span>
                    <span className="font-display text-2xl text-[#3aab4a]">R$ {booking.servico?.preco}</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Dados */}
          {step === "dados" && (
            <div>
              <h2 className="font-display text-2xl text-[#f5f0eb] tracking-wide mb-2">SEUS DADOS</h2>
              <p className="text-[#a8a8a8] text-sm mb-8">Informe seus dados para confirmar o agendamento</p>
              <div className="max-w-sm space-y-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#a8a8a8] mb-2">Nome completo</label>
                  <input type="text" value={booking.clienteNome ?? ""} onChange={(e) => setBooking((b) => ({ ...b, clienteNome: e.target.value }))} placeholder="Seu nome"
                    className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#a8a8a8] mb-2">WhatsApp</label>
                  <input type="tel" value={booking.clienteTelefone ?? ""} onChange={(e) => setBooking((b) => ({ ...b, clienteTelefone: e.target.value }))} placeholder="(21) 99999-9999"
                    className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all duration-200" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#a8a8a8] mb-2">E-mail</label>
                  <input type="email" value={booking.clienteEmail ?? ""} onChange={(e) => setBooking((b) => ({ ...b, clienteEmail: e.target.value }))} placeholder="seu@email.com"
                    className="w-full bg-[#272727] ring-1 ring-white/10 rounded-sm px-4 py-3 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all duration-200" />
                </div>
              </div>
              <div className="mt-8 p-5 bg-[#272727] rounded-sm ring-1 ring-white/5 max-w-sm">
                <p className="text-xs tracking-widest uppercase text-[#a8a8a8] mb-3">Resumo</p>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Serviço", value: booking.servico?.nome },
                    { label: "Profissional", value: booking.profissional?.nome },
                    { label: "Data e hora", value: booking.data ? `${booking.horario} · ${new Date(booking.data + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}` : "" },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-[#a8a8a8]">{item.label}</span>
                      <span className="text-[#f5f0eb] font-medium">{item.value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-white/5">
                    <span className="text-[#a8a8a8]">Total</span>
                    <span className="font-display text-lg text-[#3aab4a]">R$ {booking.servico?.preco}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {step !== "unidade" && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          <button onClick={goBack} disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[#f5f0eb] text-sm font-medium tracking-wider uppercase rounded-sm hover:border-white/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] disabled:opacity-40">
            <ArrowLeft size={14} /> Voltar
          </button>

          {step === "horario" && booking.data && booking.horario && (
            <button onClick={() => setStep("dados")}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#3aab4a] text-[#111111] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-all duration-200 shadow-[0_0_20px_rgba(58,171,74,0.3)]">
              Continuar
            </button>
          )}

          {step === "dados" && booking.clienteNome?.trim() && booking.clienteTelefone?.trim() && booking.clienteEmail?.trim() && (
            <button onClick={confirm} disabled={submitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-[#3aab4a] text-[#111111] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-all duration-200 shadow-[0_0_20px_rgba(58,171,74,0.3)] disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Confirmando..." : "Confirmar"}
              {!submitting && <Check size={14} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
