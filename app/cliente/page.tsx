"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, User, Calendar, Crown, Home,
  ChevronRight, Clock, MapPin, Scissors,
  Edit2, Check, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Cliente {
  id: string;
  nome: string | null;
  telefone: string | null;
  cpf: string | null;
  email: string | null;
}

interface Agendamento {
  id: string;
  data: string;
  horario: string;
  servico_id: string;
  servico_nome: string | null;
  servico_preco: number | null;
  profissional_id: string;
  profissional_nome: string | null;
  unidade_id: string;
  unidade_nome: string | null;
  status: string;
}

interface ClubeAssinatura {
  id: string;
  plano: string;
  status: string;
  data_inicio: string;
  data_fim: string;
  forma_pagamento: string | null;
  valor_mensal: number | null;
}

type Tab = "inicio" | "agendamentos" | "clube" | "perfil";

export default function ClientePage() {
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [clube, setClube] = useState<ClubeAssinatura | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("inicio");

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nome: "", telefone: "", cpf: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/cliente/login");
        return;
      }
      setUser(user);

      // Perfil
      const { data: profile } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profile) {
        const { data: novo } = await supabase
          .from("clientes")
          .insert({ id: user.id, email: user.email })
          .select()
          .single();
        setCliente(novo);
      } else {
        setCliente(profile);
      }

      // Agendamentos
      const { data: ags } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("cliente_id", user.id)
        .order("data", { ascending: false });
      setAgendamentos(ags ?? []);

      // Clube
      const { data: sub } = await supabase
        .from("clube_assinaturas")
        .select("*")
        .eq("cliente_id", user.id)
        .eq("status", "ativo")
        .order("data_fim", { ascending: false })
        .limit(1)
        .maybeSingle();
      setClube(sub);

      setLoading(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const startEdit = () => {
    setEditForm({ nome: cliente?.nome ?? "", telefone: cliente?.telefone ?? "", cpf: cliente?.cpf ?? "" });
    setEditing(true);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { data } = await supabase
      .from("clientes")
      .update({ ...editForm, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();
    if (data) setCliente(data);
    setEditing(false);
    setSaving(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const proximos = agendamentos
    .filter((a) => a.data >= today && a.status !== "cancelado")
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);
  const historico = agendamentos.filter((a) => a.data < today && a.status !== "cancelado");
  const totalGasto = [...proximos, ...historico]
    .reduce((sum, a) => sum + (a.servico_preco ?? 0), 0);
  const diasRestantes = clube
    ? Math.max(0, Math.ceil((new Date(clube.data_fim).getTime() - Date.now()) / 86400000))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3aab4a] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: "inicio", label: "Início", Icon: Home },
    { id: "agendamentos", label: "Agendamentos", Icon: Calendar },
    { id: "clube", label: "Clube", Icon: Crown },
    { id: "perfil", label: "Perfil", Icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-8">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-display text-3xl text-[#f5f0eb] tracking-wide">
            {cliente?.nome ? `OLÁ, ${cliente.nome.split(" ")[0].toUpperCase()}` : "ÁREA DO CLIENTE"}
          </h1>
          <p className="text-[#a8a8a8] text-sm mt-1">{user?.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 mb-8">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all duration-200 ${
                tab === id ? "bg-[#3aab4a] text-[#111111]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
              }`}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── INÍCIO ── */}
          {tab === "inicio" && (
            <motion.div key="inicio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 p-5">
                  <p className="text-[10px] text-[#a8a8a8] tracking-widest uppercase mb-2">Visitas</p>
                  <p className="font-display text-3xl text-[#f5f0eb]">
                    {agendamentos.filter((a) => a.status !== "cancelado").length}
                  </p>
                </div>
                <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 p-5">
                  <p className="text-[10px] text-[#a8a8a8] tracking-widest uppercase mb-2">Total gasto</p>
                  <p className="font-display text-3xl text-[#3aab4a]">R$ {totalGasto}</p>
                </div>
                {clube ? (
                  <div className="bg-[#3aab4a]/10 rounded-sm ring-1 ring-[#3aab4a]/30 p-5 col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-[#3aab4a] tracking-widest uppercase mb-2">Clube ativo</p>
                    <p className="font-display text-3xl text-[#f5f0eb]">{diasRestantes}d</p>
                    <p className="text-xs text-[#a8a8a8] mt-1">restantes</p>
                  </div>
                ) : (
                  <Link
                    href="/clube"
                    className="hidden sm:flex flex-col justify-between bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 p-5 hover:ring-[#3aab4a]/30 transition-all group"
                  >
                    <p className="text-[10px] text-[#a8a8a8] tracking-widest uppercase mb-2">Clube</p>
                    <p className="text-xs text-[#3aab4a] group-hover:text-[#4ec55e] transition-colors flex items-center gap-1">
                      Conhecer <ChevronRight size={11} />
                    </p>
                  </Link>
                )}
              </div>

              {/* Próximos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg text-[#f5f0eb] tracking-wide">PRÓXIMOS AGENDAMENTOS</h2>
                  {proximos.length > 0 && (
                    <button
                      onClick={() => setTab("agendamentos")}
                      className="text-xs text-[#3aab4a] hover:text-[#4ec55e] transition-colors flex items-center gap-1"
                    >
                      Ver todos <ChevronRight size={12} />
                    </button>
                  )}
                </div>

                {proximos.length === 0 ? (
                  <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 p-10 text-center">
                    <Scissors size={28} className="text-[#a8a8a8]/30 mx-auto mb-3" />
                    <p className="text-[#a8a8a8] text-sm mb-5">Nenhum agendamento próximo</p>
                    <Link
                      href="/agendar"
                      className="inline-flex px-6 py-2.5 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-colors"
                    >
                      Agendar agora
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {proximos.map((a) => <AgendamentoCard key={a.id} ag={a} />)}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── AGENDAMENTOS ── */}
          {tab === "agendamentos" && (
            <motion.div key="agendamentos" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-[#f5f0eb] tracking-wide">AGENDAMENTOS</h2>
                <Link
                  href="/agendar"
                  className="px-5 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-colors"
                >
                  + Novo
                </Link>
              </div>

              {agendamentos.length === 0 ? (
                <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 p-12 text-center">
                  <p className="text-[#a8a8a8] text-sm">Nenhum agendamento encontrado</p>
                </div>
              ) : (
                <>
                  {proximos.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] tracking-widest uppercase text-[#a8a8a8] mb-3">Próximos</p>
                      <div className="space-y-3">
                        {proximos.map((a) => <AgendamentoCard key={a.id} ag={a} showStatus />)}
                      </div>
                    </div>
                  )}
                  {historico.length > 0 && (
                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-[#a8a8a8] mb-3">Histórico</p>
                      <div className="space-y-3">
                        {historico.map((a) => <AgendamentoCard key={a.id} ag={a} showStatus past />)}
                      </div>
                      <div className="mt-4 p-4 bg-[#272727] rounded-sm ring-1 ring-white/5 flex justify-between items-center">
                        <span className="text-[#a8a8a8] text-sm">Total investido</span>
                        <span className="font-display text-2xl text-[#3aab4a]">R$ {totalGasto}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ── CLUBE ── */}
          {tab === "clube" && (
            <motion.div key="clube" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="font-display text-xl text-[#f5f0eb] tracking-wide mb-6">CLUBE DE ASSINATURA</h2>

              {clube ? (
                <div className="bg-[#272727] rounded-sm ring-1 ring-[#3aab4a]/20 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#3aab4a]/5 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-[#3aab4a]/10 ring-1 ring-[#3aab4a]/30 flex items-center justify-center">
                        <Crown size={20} className="text-[#3aab4a]" />
                      </div>
                      <div>
                        <p className="font-display text-xl text-[#f5f0eb]">{clube.plano}</p>
                        <span className="text-xs text-[#3aab4a] tracking-widest uppercase">{clube.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: "Dias restantes", value: `${diasRestantes} dias` },
                        {
                          label: "Vencimento",
                          value: new Date(clube.data_fim + "T00:00:00").toLocaleDateString("pt-BR"),
                        },
                        { label: "Forma de pagamento", value: clube.forma_pagamento ?? "—" },
                        {
                          label: "Valor mensal",
                          value: clube.valor_mensal ? `R$ ${clube.valor_mensal.toFixed(2)}` : "—",
                        },
                      ].map((item) => (
                        <div key={item.label} className="bg-[#1e1e1e] rounded-sm p-4">
                          <p className="text-[10px] text-[#a8a8a8] uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="text-[#f5f0eb] font-medium text-sm">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {diasRestantes <= 7 && (
                      <div className="p-3 bg-yellow-500/10 ring-1 ring-yellow-500/20 rounded-sm">
                        <p className="text-yellow-400 text-xs">
                          ⚠ Sua assinatura vence em breve. Entre em contato com a barbearia para renovar.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1e1e1e] ring-1 ring-white/10 flex items-center justify-center mx-auto mb-4">
                    <Crown size={28} className="text-[#a8a8a8]/30" />
                  </div>
                  <h3 className="font-display text-xl text-[#f5f0eb] mb-2">SEM ASSINATURA ATIVA</h3>
                  <p className="text-[#a8a8a8] text-sm mb-6 max-w-xs mx-auto">
                    Assine o clube e tenha acesso a benefícios exclusivos, descontos e muito mais.
                  </p>
                  <Link
                    href="/clube"
                    className="inline-flex px-8 py-3 bg-[#3aab4a] text-[#111111] text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-[#4ec55e] transition-colors"
                  >
                    Conhecer o clube
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* ── PERFIL ── */}
          {tab === "perfil" && (
            <motion.div key="perfil" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl text-[#f5f0eb] tracking-wide">MEU PERFIL</h2>
                {!editing ? (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 text-[#a8a8a8] text-xs font-medium tracking-wider uppercase rounded-sm hover:border-white/30 hover:text-[#f5f0eb] transition-all"
                  >
                    <Edit2 size={12} /> Editar
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 border border-white/10 text-[#a8a8a8] text-xs rounded-sm hover:border-white/30 transition-all"
                    >
                      <X size={12} /> Cancelar
                    </button>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold rounded-sm hover:bg-[#4ec55e] transition-colors disabled:opacity-50"
                    >
                      <Check size={12} /> {saving ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-[#272727] rounded-sm ring-1 ring-white/5 overflow-hidden">
                {(
                  [
                    { label: "Nome completo", field: "nome", value: cliente?.nome, placeholder: "Seu nome completo", readOnly: false },
                    { label: "E-mail", field: "email", value: cliente?.email ?? user?.email, placeholder: "", readOnly: true },
                    { label: "Telefone / WhatsApp", field: "telefone", value: cliente?.telefone, placeholder: "(21) 99999-9999", readOnly: false },
                    { label: "CPF", field: "cpf", value: cliente?.cpf, placeholder: "000.000.000-00", readOnly: false },
                  ] as { label: string; field: string; value: string | null | undefined; placeholder: string; readOnly: boolean }[]
                ).map(({ label, field, value, placeholder, readOnly }, i, arr) => (
                  <div
                    key={field}
                    className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <span className="text-[#a8a8a8] text-sm w-44 shrink-0">{label}</span>
                    {editing && !readOnly ? (
                      <input
                        type="text"
                        value={editForm[field as keyof typeof editForm] ?? ""}
                        onChange={(e) => setEditForm((f) => ({ ...f, [field]: e.target.value }))}
                        placeholder={placeholder}
                        className="flex-1 bg-[#1e1e1e] ring-1 ring-white/10 rounded-sm px-3 py-2 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all"
                      />
                    ) : (
                      <span className={`text-sm font-medium ${value ? "text-[#f5f0eb]" : "text-[#a8a8a8]/40 italic"}`}>
                        {value || "Não informado"}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Logout */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-[#a8a8a8] text-sm font-medium tracking-wider uppercase rounded-sm hover:border-red-500/40 hover:text-red-400 transition-all"
                >
                  <LogOut size={14} />
                  Sair da conta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgendamentoCard({
  ag: a,
  showStatus,
  past,
}: {
  ag: Agendamento;
  showStatus?: boolean;
  past?: boolean;
}) {
  const date = new Date(a.data + "T00:00:00");
  return (
    <div
      className={`bg-[#272727] rounded-sm ring-1 p-4 flex items-center gap-4 transition-opacity ${
        past ? "ring-white/5 opacity-60" : "ring-white/10"
      }`}
    >
      {/* Date badge */}
      <div className="w-12 h-12 rounded-sm bg-[#1e1e1e] ring-1 ring-white/5 flex flex-col items-center justify-center shrink-0">
        <span className="font-display text-lg text-[#3aab4a] leading-none">{date.getDate()}</span>
        <span className="text-[10px] text-[#a8a8a8] uppercase">
          {date.toLocaleDateString("pt-BR", { month: "short" })}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[#f5f0eb] font-medium text-sm truncate">
          {a.servico_nome ?? a.servico_id}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#a8a8a8]">
          <span className="flex items-center gap-1">
            <Clock size={10} />{a.horario}
          </span>
          <span className="flex items-center gap-1">
            <User size={10} />{a.profissional_nome ?? a.profissional_id}
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <MapPin size={10} />{a.unidade_nome ?? a.unidade_id}
          </span>
        </div>
      </div>

      {/* Price + status */}
      <div className="text-right shrink-0">
        {a.servico_preco != null && (
          <p className="font-display text-lg text-[#3aab4a]">R$ {a.servico_preco}</p>
        )}
        {showStatus && (
          <span className={`text-[10px] uppercase tracking-widest ${
            a.status === "confirmado" ? "text-[#3aab4a]" : "text-[#a8a8a8]"
          }`}>
            {a.status}
          </span>
        )}
      </div>
    </div>
  );
}
