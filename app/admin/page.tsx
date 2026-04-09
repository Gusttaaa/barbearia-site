"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogOut, Calendar, CalendarDays, Users, MapPin, Plus, Check,
  Edit2, Trash2, AlertCircle, Loader2, BarChart2, TrendingUp,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { servicos } from "@/lib/data/servicos";
import type { User } from "@supabase/supabase-js";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DBUnidade {
  id: string;
  nome: string;
  bairro: string | null;
  endereco: string | null;
  telefone: string | null;
  whatsapp: string | null;
  horario_semana: string | null;
  horario_sabado: string | null;
  horario_domingo: string | null;
  ativo: boolean;
}

interface DBProfissional {
  id: string;
  nome: string;
  especialidade: string | null;
  unidade_id: string;
  foto: string | null;
  rating: number;
  ativo: boolean;
  user_id?: string | null;
}

interface DBAgendamento {
  id: string;
  data: string;
  horario: string;
  profissional_id: string;
  profissional_nome: string | null;
  unidade_id: string;
  unidade_nome: string | null;
  servico_id: string;
  servico_nome: string | null;
  servico_preco: number | null;
  cliente_nome: string;
  cliente_telefone: string;
  status: string;
}

type Tab = "agendamentos" | "barbeiros" | "unidades" | "financeiro" | "relatorios" | "agenda";

const HORARIOS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

// ─── Input helper ─────────────────────────────────────────────────────────────

function Field({
  placeholder, value, onChange, type = "text", span,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  span?: boolean;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-[#272727] ring-1 ring-white/10 rounded-sm px-3 py-2.5 text-[#f5f0eb] text-sm placeholder:text-[#a8a8a8]/40 focus:outline-none focus:ring-[#3aab4a] transition-all${span ? " sm:col-span-2" : ""}`}
    />
  );
}

function Sel({
  value, onChange, children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#272727] ring-1 ring-white/10 rounded-sm px-3 py-2.5 text-[#f5f0eb] text-sm focus:outline-none focus:ring-[#3aab4a] transition-all"
    >
      {children}
    </select>
  );
}

function FormActions({
  onSave, onCancel, saving, label = "Salvar",
}: {
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  label?: string;
}) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-1.5 px-5 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold uppercase rounded-sm hover:bg-[#4ec55e] transition-colors disabled:opacity-50"
      >
        <Check size={12} /> {saving ? "Salvando..." : label}
      </button>
      <button
        onClick={onCancel}
        className="px-5 py-2 border border-white/10 text-[#a8a8a8] text-xs rounded-sm hover:border-white/30 transition-all"
      >
        Cancelar
      </button>
    </div>
  );
}

// ─── Agendamentos Tab ─────────────────────────────────────────────────────────

function AgendamentosTab({
  agendamentos,
  profissionais,
  unidades,
  onRefresh,
}: {
  agendamentos: DBAgendamento[];
  profissionais: DBProfissional[];
  unidades: DBUnidade[];
  onRefresh: () => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"proximos" | "hoje" | "todos">("proximos");
  const [saving, setSaving] = useState(false);
  const emptyForm = {
    unidade_id: "", profissional_id: "", servico_id: "",
    data: "", horario: "", cliente_nome: "", cliente_telefone: "",
  };
  const [form, setForm] = useState(emptyForm);

  const today = new Date().toISOString().split("T")[0];
  const filtered = agendamentos.filter((a) => {
    if (filter === "hoje") return a.data === today;
    if (filter === "proximos") return a.data >= today;
    return true;
  });

  const profsFiltrados = profissionais.filter(
    (p) => !form.unidade_id || p.unidade_id === form.unidade_id
  );

  const handleAdd = async () => {
    const { unidade_id, profissional_id, servico_id, data, horario, cliente_nome, cliente_telefone } = form;
    if (!unidade_id || !profissional_id || !servico_id || !data || !horario || !cliente_nome || !cliente_telefone) return;
    setSaving(true);
    const svc = servicos.find((s) => s.id === servico_id);
    const prof = profissionais.find((p) => p.id === profissional_id);
    const unit = unidades.find((u) => u.id === unidade_id);
    await supabase.from("agendamentos").insert({
      profissional_id, profissional_nome: prof?.nome ?? null,
      unidade_id, unidade_nome: unit?.nome ?? null,
      servico_id, servico_nome: svc?.nome ?? null, servico_preco: svc?.preco ?? null,
      data, horario, cliente_nome, cliente_telefone, status: "confirmado",
    });
    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    await onRefresh();
  };

  const handleCancel = async (id: string) => {
    await supabase.from("agendamentos").update({ status: "cancelado" }).eq("id", id);
    await onRefresh();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5">
          {(["proximos", "hoje", "todos"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all ${filter === f ? "bg-[#272727] text-[#f5f0eb]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
                }`}
            >
              {f === "proximos" ? "Próximos" : f === "hoje" ? "Hoje" : "Todos"}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#4ec55e] transition-colors"
        >
          <Plus size={13} /> Adicionar
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 p-5 mb-6">
          <p className="text-[#f5f0eb] text-xs font-medium mb-4">Novo agendamento manual</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <Sel value={form.unidade_id} onChange={(v) => setForm((f) => ({ ...f, unidade_id: v, profissional_id: "" }))}>
              <option value="">Unidade</option>
              {unidades.filter((u) => u.ativo).map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </Sel>
            <Sel value={form.profissional_id} onChange={(v) => setForm((f) => ({ ...f, profissional_id: v }))}>
              <option value="">Barbeiro</option>
              {profsFiltrados.filter((p) => p.ativo).map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </Sel>
            <Sel value={form.servico_id} onChange={(v) => setForm((f) => ({ ...f, servico_id: v }))}>
              <option value="">Serviço</option>
              {servicos.map((s) => <option key={s.id} value={s.id}>{s.nome} — R$ {s.preco}</option>)}
            </Sel>
            <Field type="date" placeholder="Data" value={form.data} onChange={(v) => setForm((f) => ({ ...f, data: v }))} />
            <Sel value={form.horario} onChange={(v) => setForm((f) => ({ ...f, horario: v }))}>
              <option value="">Horário</option>
              {HORARIOS.map((h) => <option key={h} value={h}>{h}</option>)}
            </Sel>
            <Field placeholder="Nome do cliente" value={form.cliente_nome} onChange={(v) => setForm((f) => ({ ...f, cliente_nome: v }))} />
            <Field placeholder="Telefone do cliente" value={form.cliente_telefone} onChange={(v) => setForm((f) => ({ ...f, cliente_telefone: v }))} />
          </div>
          <FormActions onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} label="Confirmar agendamento" />
        </div>
      )}

      {/* Table */}
      <div className="rounded-sm ring-1 ring-white/5 overflow-hidden">
        <div className="hidden md:grid grid-cols-[110px_70px_1fr_1fr_1fr_1fr_80px_90px] px-4 py-2.5 bg-[#1a1a1a] border-b border-white/5 gap-2">
          {["Data", "Hora", "Cliente", "Serviço", "Barbeiro", "Unidade", "Total", ""].map((h) => (
            <span key={h} className="text-[10px] text-[#a8a8a8] tracking-widest uppercase">{h}</span>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-[#a8a8a8] text-sm">Nenhum agendamento encontrado</div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((a) => (
              <div
                key={a.id}
                className={`px-4 py-3 flex flex-col md:grid md:grid-cols-[110px_70px_1fr_1fr_1fr_1fr_80px_90px] md:items-center gap-1 md:gap-2 ${a.status === "cancelado" ? "opacity-40" : ""
                  }`}
              >
                <span className="text-[#f5f0eb] text-xs">
                  {new Date(a.data + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                </span>
                <span className="text-[#a8a8a8] text-xs">{a.horario}</span>
                <div>
                  <p className="text-[#f5f0eb] text-xs font-medium">{a.cliente_nome}</p>
                  <p className="text-[#a8a8a8] text-[10px]">{a.cliente_telefone}</p>
                </div>
                <span className="text-[#f5f0eb] text-xs truncate">{a.servico_nome ?? a.servico_id}</span>
                <span className="text-[#a8a8a8] text-xs truncate">{a.profissional_nome ?? a.profissional_id}</span>
                <span className="text-[#a8a8a8] text-xs truncate">{a.unidade_nome ?? a.unidade_id}</span>
                <span className="text-[#3aab4a] text-xs font-medium">
                  {a.servico_preco != null ? `R$ ${a.servico_preco}` : "—"}
                </span>
                <div className="flex justify-end">
                  {a.status !== "cancelado" ? (
                    <button
                      onClick={() => handleCancel(a.id)}
                      className="px-3 py-1 border border-white/10 text-[#a8a8a8] text-[10px] rounded-sm hover:border-red-500/40 hover:text-red-400 transition-all uppercase tracking-wider"
                    >
                      Cancelar
                    </button>
                  ) : (
                    <span className="text-[10px] text-red-400/60 uppercase tracking-wider">Cancelado</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Barbeiros Tab ────────────────────────────────────────────────────────────

type BarbForm = { nome: string; especialidade: string; unidade_id: string; foto: string; rating: string };

function BarbeiroForm({
  form, setForm, unidades, onSave, onCancel, saving, title,
}: {
  form: BarbForm;
  setForm: React.Dispatch<React.SetStateAction<BarbForm>>;
  unidades: DBUnidade[];
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 p-4 mb-4">
      <p className="text-[#f5f0eb] text-xs font-medium mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field placeholder="Nome completo" value={form.nome} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} />
        <Field placeholder="Especialidade" value={form.especialidade} onChange={(v) => setForm((f) => ({ ...f, especialidade: v }))} />
        <Sel value={form.unidade_id} onChange={(v) => setForm((f) => ({ ...f, unidade_id: v }))}>
          <option value="">Unidade</option>
          {unidades.map((u) => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </Sel>
        <Field placeholder="Rating (ex: 4.9)" value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
        <Field placeholder="URL da foto (opcional)" value={form.foto} onChange={(v) => setForm((f) => ({ ...f, foto: v }))} span />
      </div>
      <FormActions onSave={onSave} onCancel={onCancel} saving={saving} />
    </div>
  );
}

function BarbeirosTab({
  profissionais,
  unidades,
  onRefresh,
}: {
  profissionais: DBProfissional[];
  unidades: DBUnidade[];
  onRefresh: () => Promise<void>;
}) {
  const emptyForm: BarbForm = { nome: "", especialidade: "", unidade_id: "", foto: "", rating: "5.0" };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BarbForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.nome || !form.unidade_id) return;
    setSaving(true);
    const iniciais = form.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    await supabase.from("profissionais").insert({
      id: crypto.randomUUID(),
      nome: form.nome,
      especialidade: form.especialidade || null,
      unidade_id: form.unidade_id,
      foto: form.foto || `https://placehold.co/200x200/1e1e1e/3aab4a?text=${iniciais}`,
      rating: parseFloat(form.rating) || 5.0,
      ativo: true,
    });
    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    await onRefresh();
  };

  const startEdit = (p: DBProfissional) => {
    setEditingId(p.id);
    setForm({ nome: p.nome, especialidade: p.especialidade ?? "", unidade_id: p.unidade_id, foto: p.foto ?? "", rating: String(p.rating) });
    setShowForm(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await supabase.from("profissionais").update({
      nome: form.nome,
      especialidade: form.especialidade || null,
      unidade_id: form.unidade_id,
      foto: form.foto || null,
      rating: parseFloat(form.rating) || 5.0,
    }).eq("id", editingId);
    setSaving(false);
    setEditingId(null);
    await onRefresh();
  };

  const handleToggle = async (p: DBProfissional) => {
    await supabase.from("profissionais").update({ ativo: !p.ativo }).eq("id", p.id);
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remover barbeiro? Agendamentos existentes não serão afetados.")) return;
    await supabase.from("profissionais").delete().eq("id", id);
    await onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#a8a8a8] text-sm">{profissionais.length} profissionais</p>
        <button
          onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#4ec55e] transition-colors"
        >
          <Plus size={13} /> Adicionar
        </button>
      </div>

      {showForm && (
        <BarbeiroForm form={form} setForm={setForm} unidades={unidades} onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} title="Novo barbeiro" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profissionais.map((p) => (
          <div key={p.id} className={`bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 overflow-hidden ${!p.ativo ? "opacity-50" : ""}`}>
            {editingId === p.id ? (
              <div className="p-4">
                <BarbeiroForm form={form} setForm={setForm} unidades={unidades} onSave={handleSaveEdit} onCancel={() => setEditingId(null)} saving={saving} title="Editar barbeiro" />
              </div>
            ) : (
              <>
                <div className="p-4 flex items-center gap-3">
                  <img src={p.foto ?? ""} alt={p.nome} className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[#f5f0eb] font-medium text-sm truncate">{p.nome}</p>
                    <p className="text-[#a8a8a8] text-xs">{p.especialidade}</p>
                    <p className="text-[10px] text-[#a8a8a8] mt-0.5">
                      {unidades.find((u) => u.id === p.unidade_id)?.nome ?? p.unidade_id} · ★ {p.rating}
                    </p>
                  </div>
                </div>
                <div className="flex border-t border-white/5 divide-x divide-white/5">
                  <button onClick={() => startEdit(p)} className="flex-1 py-2 text-[10px] text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 transition-all flex items-center justify-center gap-1">
                    <Edit2 size={11} /> Editar
                  </button>
                  <button onClick={() => handleToggle(p)} className="flex-1 py-2 text-[10px] text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 transition-all">
                    {p.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 py-2 text-[10px] text-[#a8a8a8] hover:text-red-400 hover:bg-white/5 transition-all flex items-center justify-center gap-1">
                    <Trash2 size={11} /> Remover
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Unidades Tab ─────────────────────────────────────────────────────────────

type UnitForm = {
  nome: string; bairro: string; endereco: string; telefone: string;
  whatsapp: string; horario_semana: string; horario_sabado: string; horario_domingo: string;
};

const UNIT_FIELDS: { key: keyof UnitForm; placeholder: string; span?: boolean }[] = [
  { key: "nome", placeholder: "Nome da unidade" },
  { key: "bairro", placeholder: "Bairro" },
  { key: "endereco", placeholder: "Endereço completo", span: true },
  { key: "telefone", placeholder: "Telefone" },
  { key: "whatsapp", placeholder: "WhatsApp (ex: 5521999990001)" },
  { key: "horario_semana", placeholder: "Seg–Sex (ex: Seg–Sex: 9h às 20h)", span: true },
  { key: "horario_sabado", placeholder: "Sábado (ex: Sáb: 9h às 18h)" },
  { key: "horario_domingo", placeholder: "Domingo (ex: Dom: Fechado)" },
];

function UnidadeFormPanel({
  form, setForm, onSave, onCancel, saving, title,
}: {
  form: UnitForm;
  setForm: React.Dispatch<React.SetStateAction<UnitForm>>;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  title: string;
}) {
  return (
    <div className="bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 p-4 mb-4">
      <p className="text-[#f5f0eb] text-xs font-medium mb-3">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {UNIT_FIELDS.map(({ key, placeholder, span }) => (
          <Field key={key} placeholder={placeholder} value={form[key]} onChange={(v) => setForm((f) => ({ ...f, [key]: v }))} span={span} />
        ))}
      </div>
      <FormActions onSave={onSave} onCancel={onCancel} saving={saving} />
    </div>
  );
}

function UnidadesTab({
  unidades,
  onRefresh,
}: {
  unidades: DBUnidade[];
  onRefresh: () => Promise<void>;
}) {
  const emptyForm: UnitForm = { nome: "", bairro: "", endereco: "", telefone: "", whatsapp: "", horario_semana: "", horario_sabado: "", horario_domingo: "" };
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UnitForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!form.nome) return;
    setSaving(true);
    const id = form.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    await supabase.from("unidades").insert({ id, ...form, ativo: true });
    setSaving(false);
    setShowForm(false);
    setForm(emptyForm);
    await onRefresh();
  };

  const startEdit = (u: DBUnidade) => {
    setEditingId(u.id);
    setForm({
      nome: u.nome, bairro: u.bairro ?? "", endereco: u.endereco ?? "",
      telefone: u.telefone ?? "", whatsapp: u.whatsapp ?? "",
      horario_semana: u.horario_semana ?? "", horario_sabado: u.horario_sabado ?? "", horario_domingo: u.horario_domingo ?? "",
    });
    setShowForm(false);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    await supabase.from("unidades").update(form).eq("id", editingId);
    setSaving(false);
    setEditingId(null);
    await onRefresh();
  };

  const handleToggle = async (u: DBUnidade) => {
    await supabase.from("unidades").update({ ativo: !u.ativo }).eq("id", u.id);
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remover unidade? Profissionais vinculados não serão afetados.")) return;
    await supabase.from("unidades").delete().eq("id", id);
    await onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[#a8a8a8] text-sm">{unidades.length} unidades</p>
        <button
          onClick={() => { setShowForm((v) => !v); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#4ec55e] transition-colors"
        >
          <Plus size={13} /> Adicionar
        </button>
      </div>

      {showForm && (
        <UnidadeFormPanel form={form} setForm={setForm} onSave={handleAdd} onCancel={() => setShowForm(false)} saving={saving} title="Nova unidade" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {unidades.map((u) => (
          <div key={u.id} className={`bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 overflow-hidden ${!u.ativo ? "opacity-50" : ""}`}>
            {editingId === u.id ? (
              <div className="p-4">
                <UnidadeFormPanel form={form} setForm={setForm} onSave={handleSaveEdit} onCancel={() => setEditingId(null)} saving={saving} title="Editar unidade" />
              </div>
            ) : (
              <>
                <div className="p-4">
                  <p className="font-display text-lg text-[#f5f0eb] mb-2">{u.nome.toUpperCase()}</p>
                  <div className="space-y-0.5">
                    {[u.bairro, u.endereco, u.telefone, u.horario_semana, u.horario_sabado, u.horario_domingo].filter(Boolean).map((v, i) => (
                      <p key={i} className="text-[#a8a8a8] text-xs">{v}</p>
                    ))}
                  </div>
                  {!u.ativo && <span className="text-[10px] text-red-400 uppercase tracking-wider mt-2 block">Inativa</span>}
                </div>
                <div className="flex border-t border-white/5 divide-x divide-white/5">
                  <button onClick={() => startEdit(u)} className="flex-1 py-2 text-[10px] text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 transition-all flex items-center justify-center gap-1">
                    <Edit2 size={11} /> Editar
                  </button>
                  <button onClick={() => handleToggle(u)} className="flex-1 py-2 text-[10px] text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 transition-all">
                    {u.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button onClick={() => handleDelete(u.id)} className="flex-1 py-2 text-[10px] text-[#a8a8a8] hover:text-red-400 hover:bg-white/5 transition-all flex items-center justify-center gap-1">
                    <Trash2 size={11} /> Remover
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

type FinPeriod = "7d" | "30d" | "ano" | "tudo";

const FIN_PERIODS: { key: FinPeriod; label: string }[] = [
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "ano", label: "Este ano" },
  { key: "tudo", label: "Tudo" },
];

function getAgsByPeriod(ags: DBAgendamento[], period: FinPeriod) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return ags.filter((a) => {
    const d = new Date(a.data + "T00:00:00");
    if (period === "7d") {
      const from = new Date(); from.setDate(from.getDate() - 6); from.setHours(0, 0, 0, 0);
      return d >= from && d <= now;
    }
    if (period === "30d") {
      const from = new Date(); from.setDate(from.getDate() - 29); from.setHours(0, 0, 0, 0);
      return d >= from && d <= now;
    }
    if (period === "ano") return d.getFullYear() === now.getFullYear();
    return true;
  });
}

function KpiCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-[#1a1a1a] ring-1 ring-white/5 rounded-sm p-4">
      <p className="text-[#a8a8a8] text-[10px] uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-2xl font-semibold ${accent ? "text-[#3aab4a]" : "text-[#f5f0eb]"}`}>{value}</p>
      {sub && <p className="text-[#a8a8a8] text-xs mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-[#3aab4a] rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Financeiro Tab ───────────────────────────────────────────────────────────

function FinanceiroTab({ agendamentos }: { agendamentos: DBAgendamento[] }) {
  const [period, setPeriod] = useState<FinPeriod>("30d");
  const [commRate, setCommRate] = useState("40");

  const subset = getAgsByPeriod(agendamentos, period);
  const confirmed = subset.filter((a) => a.status !== "cancelado");
  const cancelledCount = subset.filter((a) => a.status === "cancelado").length;
  const totalRevenue = confirmed.reduce((s, a) => s + (a.servico_preco ?? 0), 0);
  const avgTicket = confirmed.length > 0 ? totalRevenue / confirmed.length : 0;
  const rate = Math.min(100, Math.max(0, parseFloat(commRate) || 0)) / 100;

  // Receita por unidade
  const byUnit: Record<string, { nome: string; receita: number; count: number }> = {};
  for (const a of confirmed) {
    const k = a.unidade_id;
    if (!byUnit[k]) byUnit[k] = { nome: a.unidade_nome ?? a.unidade_id, receita: 0, count: 0 };
    byUnit[k].receita += a.servico_preco ?? 0;
    byUnit[k].count++;
  }
  const unitRows = Object.values(byUnit).sort((a, b) => b.receita - a.receita);
  const maxUnit = unitRows[0]?.receita ?? 1;

  // Receita por barbeiro
  const byBarber: Record<string, { nome: string; receita: number; count: number }> = {};
  for (const a of confirmed) {
    const k = a.profissional_id;
    if (!byBarber[k]) byBarber[k] = { nome: a.profissional_nome ?? a.profissional_id, receita: 0, count: 0 };
    byBarber[k].receita += a.servico_preco ?? 0;
    byBarber[k].count++;
  }
  const barberRows = Object.values(byBarber).sort((a, b) => b.receita - a.receita);
  const maxBarber = barberRows[0]?.receita ?? 1;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5">
          {FIN_PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all ${period === key ? "bg-[#272727] text-[#f5f0eb]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#a8a8a8] text-xs">Comissão barbeiro:</span>
          <input
            type="number" min="0" max="100"
            value={commRate}
            onChange={(e) => setCommRate(e.target.value)}
            className="w-16 bg-[#272727] ring-1 ring-white/10 rounded-sm px-2 py-1.5 text-[#f5f0eb] text-xs text-center focus:outline-none focus:ring-[#3aab4a] transition-all"
          />
          <span className="text-[#a8a8a8] text-xs">%</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Receita total" value={`R$ ${totalRevenue.toFixed(0)}`} sub={`${confirmed.length} atendimento${confirmed.length !== 1 ? "s" : ""}`} accent />
        <KpiCard label="Ticket médio" value={`R$ ${avgTicket.toFixed(0)}`} />
        <KpiCard label="Cancelamentos" value={String(cancelledCount)} sub={subset.length > 0 ? `${Math.round((cancelledCount / subset.length) * 100)}% do total` : "—"} />
        <KpiCard label="Est. comissões" value={`R$ ${Math.round(totalRevenue * rate)}`} sub={`${commRate}% da receita`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Por unidade */}
        <div className="bg-[#1a1a1a] ring-1 ring-white/5 rounded-sm p-4">
          <p className="text-[#f5f0eb] text-xs font-medium mb-4 uppercase tracking-widest">Receita por Unidade</p>
          {unitRows.length === 0 ? (
            <p className="text-[#a8a8a8] text-sm">Sem dados no período</p>
          ) : (
            <div className="space-y-3">
              {unitRows.map((u) => (
                <div key={u.nome} className="flex items-center gap-3">
                  <span className="text-[#f5f0eb] text-xs w-28 truncate shrink-0">{u.nome}</span>
                  <MiniBar value={u.receita} max={maxUnit} />
                  <span className="text-[#3aab4a] text-xs whitespace-nowrap">R$ {u.receita}</span>
                  <span className="text-[#a8a8a8] text-[10px] w-14 text-right shrink-0">{u.count} atend.</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Por barbeiro */}
        <div className="bg-[#1a1a1a] ring-1 ring-white/5 rounded-sm p-4">
          <p className="text-[#f5f0eb] text-xs font-medium mb-4 uppercase tracking-widest">Ranking Barbeiros</p>
          {barberRows.length === 0 ? (
            <p className="text-[#a8a8a8] text-sm">Sem dados no período</p>
          ) : (
            <div className="space-y-3">
              {barberRows.map((b, i) => (
                <div key={b.nome} className="flex items-center gap-3">
                  <span className="text-[#a8a8a8] text-[10px] w-4 shrink-0">{i + 1}</span>
                  <span className="text-[#f5f0eb] text-xs w-24 truncate shrink-0">{b.nome}</span>
                  <MiniBar value={b.receita} max={maxBarber} />
                  <span className="text-[#3aab4a] text-xs whitespace-nowrap">R$ {b.receita}</span>
                  <span className="text-[#a8a8a8] text-[10px] text-right px-2">
                    comiss. R$ {Math.round(b.receita * rate)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Relatórios Tab ───────────────────────────────────────────────────────────

function RelatoriosTab({ agendamentos }: { agendamentos: DBAgendamento[] }) {
  const confirmed = agendamentos.filter((a) => a.status !== "cancelado");

  // Horários de pico
  const horarioCounts: Record<string, number> = {};
  for (const a of confirmed) horarioCounts[a.horario] = (horarioCounts[a.horario] ?? 0) + 1;
  const horariosOrdered = HORARIOS.map((h) => ({ h, count: horarioCounts[h] ?? 0 }));
  const maxHorario = Math.max(...horariosOrdered.map((x) => x.count), 1);

  // Serviços mais populares
  const servicoCounts: Record<string, { nome: string; count: number }> = {};
  for (const a of confirmed) {
    const k = a.servico_id;
    if (!servicoCounts[k]) servicoCounts[k] = { nome: a.servico_nome ?? a.servico_id, count: 0 };
    servicoCounts[k].count++;
  }
  const servicoRows = Object.values(servicoCounts).sort((a, b) => b.count - a.count).slice(0, 8);
  const maxServico = servicoRows[0]?.count ?? 1;

  // Ranking barbeiros por atendimentos
  const barberCounts: Record<string, { nome: string; count: number }> = {};
  for (const a of confirmed) {
    const k = a.profissional_id;
    if (!barberCounts[k]) barberCounts[k] = { nome: a.profissional_nome ?? a.profissional_id, count: 0 };
    barberCounts[k].count++;
  }
  const barberCountRows = Object.values(barberCounts).sort((a, b) => b.count - a.count);
  const maxBarberCount = barberCountRows[0]?.count ?? 1;

  // Taxa de retorno
  const clientMap: Record<string, number> = {};
  for (const a of confirmed) clientMap[a.cliente_telefone] = (clientMap[a.cliente_telefone] ?? 0) + 1;
  const totalClientes = Object.keys(clientMap).length;
  const retornantes = Object.values(clientMap).filter((c) => c > 1).length;
  const retentionRate = totalClientes > 0 ? Math.round((retornantes / totalClientes) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Taxa de retorno */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard label="Clientes únicos" value={String(totalClientes)} />
        <KpiCard label="Clientes recorrentes" value={String(retornantes)} sub="2+ visitas" />
        <KpiCard label="Taxa de retorno" value={`${retentionRate}%`} accent />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Horários de pico */}
        <div className="bg-[#1a1a1a] ring-1 ring-white/5 rounded-sm p-4">
          <p className="text-[#f5f0eb] text-xs font-medium mb-4 uppercase tracking-widest">Horários de Pico</p>
          <div className="space-y-2">
            {horariosOrdered.map(({ h, count }) => (
              <div key={h} className="flex items-center gap-3">
                <span className="text-[#a8a8a8] text-[10px] w-10 shrink-0 font-mono">{h}</span>
                <MiniBar value={count} max={maxHorario} />
                <span className="text-[#a8a8a8] text-[10px] w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Serviços populares */}
        <div className="bg-[#1a1a1a] ring-1 ring-white/5 rounded-sm p-4">
          <p className="text-[#f5f0eb] text-xs font-medium mb-4 uppercase tracking-widest">Serviços Mais Populares</p>
          {servicoRows.length === 0 ? (
            <p className="text-[#a8a8a8] text-sm">Sem dados</p>
          ) : (
            <div className="space-y-3">
              {servicoRows.map((s, i) => (
                <div key={s.nome} className="flex items-center gap-3">
                  <span className="text-[#a8a8a8] text-[10px] w-4 shrink-0">{i + 1}</span>
                  <span className="text-[#f5f0eb] text-xs w-32 truncate shrink-0">{s.nome}</span>
                  <MiniBar value={s.count} max={maxServico} />
                  <span className="text-[#a8a8a8] text-[10px] w-6 text-right shrink-0">{s.count}x</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ranking barbeiros */}
      <div className="bg-[#1a1a1a] ring-1 ring-white/5 rounded-sm p-4">
        <p className="text-[#f5f0eb] text-xs font-medium mb-4 uppercase tracking-widest">Ranking de Barbeiros por Atendimentos</p>
        {barberCountRows.length === 0 ? (
          <p className="text-[#a8a8a8] text-sm">Sem dados</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {barberCountRows.map((b, i) => (
              <div key={b.nome} className="flex items-center gap-3">
                <span className="text-[#a8a8a8] text-[10px] w-4 shrink-0">{i + 1}</span>
                <span className="text-[#f5f0eb] text-xs w-32 truncate shrink-0">{b.nome}</span>
                <MiniBar value={b.count} max={maxBarberCount} />
                <span className="text-[#a8a8a8] text-[10px] w-14 text-right shrink-0">{b.count} atend.</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Agenda Tab ──────────────────────────────────────────────────────────────

const AGENDA_WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function getWeekDates(anchor: Date): Date[] {
  const d = new Date(anchor);
  const dow = d.getDay();
  const toMon = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + toMon);
  return Array.from({ length: 6 }, (_, i) => {
    const dd = new Date(d);
    dd.setDate(d.getDate() + i);
    return dd;
  });
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function AgendaTab({
  agendamentos,
  profissionais,
  fixedProfissionalId,
  isAdmin,
}: {
  agendamentos: DBAgendamento[];
  profissionais: DBProfissional[];
  fixedProfissionalId: string | null;
  isAdmin: boolean;
}) {
  const today = fmtDate(new Date());
  const [view, setView] = useState<"dia" | "semana">("semana");
  const [selectedProfId, setSelectedProfId] = useState<string>(
    fixedProfissionalId ?? profissionais.find((p) => p.ativo)?.id ?? ""
  );
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const weekDates = getWeekDates(currentDate);
  const profAtivo = profissionais.find((p) => p.id === selectedProfId);

  const agsFiltrados = agendamentos.filter(
    (a) => a.profissional_id === selectedProfId && a.status !== "cancelado"
  );

  const agsNoDia = (dateStr: string) =>
    agsFiltrados.filter((a) => a.data === dateStr);

  const prevDay = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const nextDay = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  const prevWeek = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  const nextWeek = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });

  return (
    <div>
      {/* Top bar: selector (admin) + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap p-2">
          {isAdmin && (
            <select
              value={selectedProfId}
              onChange={(e) => setSelectedProfId(e.target.value)}
              className="bg-[#1a1a1a] ring-1 ring-white/10 rounded-sm px-3 py-2 text-[#f5f0eb] text-sm focus:outline-none focus:ring-[#3aab4a] transition-all"
            >
              <option value="">Selecionar barbeiro…</option>
              {profissionais.filter((p) => p.ativo).map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          )}
          {profAtivo && (
            <div className="flex items-center gap-2 pl-1">
              {profAtivo.foto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profAtivo.foto} alt={profAtivo.nome} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10" />
              )}
              <div className="flex flex-col justify-center sm:flex-row items-center gap-2">
                <span className="text-[#f5f0eb] text-sm font-medium">{profAtivo.nome}</span>
                {profAtivo.especialidade && (
                  <span className="text-[#a8a8a8] text-xs">— {profAtivo.especialidade}</span>
                )}
              </div>
            </div>
          )}
          {!profAtivo && isAdmin && (
            <span className="text-[#a8a8a8] text-sm">Selecione um barbeiro para ver a agenda</span>
          )}
        </div>
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 ml-2">
          {(["semana", "dia"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all ${view === v ? "bg-[#272727] text-[#f5f0eb]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
                }`}
            >
              {v === "dia" ? "Dia" : "Semana"}
            </button>
          ))}
        </div>
      </div>

      {!selectedProfId ? null : view === "semana" ? (
        /* ── Week view ──────────────────────────────────────────────── */
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={prevWeek} className="p-2 text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 rounded-sm transition-all">
              <ChevronLeft size={15} />
            </button>
            <span className="text-[#f5f0eb] text-sm font-medium">
              {weekDates[0].toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              {" — "}
              {weekDates[5].toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            <button onClick={nextWeek} className="p-2 text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 rounded-sm transition-all">
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 p-2">
            {weekDates.map((date, i) => {
              const ds = fmtDate(date);
              const dayAgs = agsNoDia(ds);
              const isToday = ds === today;
              const isPast = ds < today;
              return (
                <div
                  key={ds}
                  onClick={() => { setCurrentDate(new Date(date)); setView("dia"); }}
                  className={`rounded-sm p-3 cursor-pointer transition-all ring-1 ${isToday
                      ? "bg-[#1a2a1a] ring-[#3aab4a]/40 hover:ring-[#3aab4a]"
                      : "bg-[#1a1a1a] ring-white/5 hover:ring-white/20"
                    }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${isToday ? "text-[#3aab4a]" : isPast ? "text-[#a8a8a8]/40" : "text-[#a8a8a8]"
                      }`}>
                      {AGENDA_WEEK_DAYS[i]}
                    </span>
                    <span className={`text-xl font-semibold leading-none ${isToday ? "text-[#3aab4a]" : isPast ? "text-[#f5f0eb]/25" : "text-[#f5f0eb]"
                      }`}>
                      {date.getDate()}
                    </span>
                  </div>
                  {dayAgs.length === 0 ? (
                    <p className="text-[#a8a8a8]/25 text-[10px]">Livre</p>
                  ) : (
                    <div className="space-y-1">
                      {dayAgs.slice(0, 3).map((ag) => (
                        <div key={ag.id} className="text-[10px] bg-[#3aab4a]/15 text-[#4ec55e] rounded-sm px-1.5 py-0.5 truncate">
                          {ag.horario} · {ag.cliente_nome.split(" ")[0]}
                        </div>
                      ))}
                      {dayAgs.length > 3 && (
                        <p className="text-[#a8a8a8] text-[10px]">+{dayAgs.length - 3} mais</p>
                      )}
                    </div>
                  )}
                  <div className={`mt-2 pt-2 border-t ${isToday ? "border-[#3aab4a]/20" : "border-white/5"}`}>
                    <span className="text-[10px] text-[#a8a8a8]">{dayAgs.length} agend.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── Day view ───────────────────────────────────────────────── */
        <div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={prevDay} className="p-2 text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 rounded-sm transition-all">
              <ChevronLeft size={15} />
            </button>
            <span className="text-[#f5f0eb] text-sm font-medium capitalize">
              {currentDate.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              {fmtDate(currentDate) === today && (
                <span className="ml-2 text-[#3aab4a] text-xs font-sans normal-case">(Hoje)</span>
              )}
            </span>
            <button onClick={nextDay} className="p-2 text-[#a8a8a8] hover:text-[#f5f0eb] hover:bg-white/5 rounded-sm transition-all">
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="space-y-1">
            {HORARIOS.map((h) => {
              const ag = agsNoDia(fmtDate(currentDate)).find((a) => a.horario === h);
              return (
                <div
                  key={h}
                  className={`flex gap-3 items-center px-4 py-3 rounded-sm ring-1 transition-all ${ag ? "bg-[#1a2a1a] ring-[#3aab4a]/25" : "bg-[#1a1a1a] ring-white/5"
                    }`}
                >
                  <span className="text-[#a8a8a8] text-xs w-10 shrink-0 font-mono">{h}</span>
                  <div className="w-px h-4 bg-white/10 shrink-0" />
                  {ag ? (
                    <div className="flex-1 flex flex-wrap items-center gap-3">
                      <span className="text-[#f5f0eb] text-sm font-medium">{ag.cliente_nome}</span>
                      <span className="text-[#a8a8a8] text-xs">{ag.cliente_telefone}</span>
                      <span className="text-[10px] bg-[#3aab4a]/15 text-[#4ec55e] px-2 py-0.5 rounded-sm">
                        {ag.servico_nome}
                      </span>
                      {ag.servico_preco !== null && (
                        <span className="text-[#a8a8a8] text-xs">R$ {ag.servico_preco}</span>
                      )}
                      <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-sm ${ag.status === "confirmado"
                          ? "bg-[#3aab4a]/15 text-[#4ec55e]"
                          : "bg-yellow-400/10 text-yellow-400"
                        }`}>
                        {ag.status}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#a8a8a8]/30 text-xs">Disponível</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBarbeiro, setIsBarbeiro] = useState(false);
  const [barbeiroProfissional, setBarbeiroProfissional] = useState<DBProfissional | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("agendamentos");
  const [agendamentos, setAgendamentos] = useState<DBAgendamento[]>([]);
  const [profissionais, setProfissionais] = useState<DBProfissional[]>([]);
  const [unidades, setUnidades] = useState<DBUnidade[]>([]);

  const loadData = useCallback(async () => {
    const [{ data: ags }, { data: profs }, { data: units }] = await Promise.all([
      supabase.from("agendamentos").select("*").order("data", { ascending: false }).limit(300),
      supabase.from("profissionais").select("*").order("nome"),
      supabase.from("unidades").select("*").order("nome"),
    ]);
    setAgendamentos(ags ?? []);
    setProfissionais(profs ?? []);
    setUnidades(units ?? []);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/cliente/login"); return; }
      setUser(user);

      const [{ data: adminRow }, { data: profRow }] = await Promise.all([
        supabase.from("admins").select("id").eq("id", user.id).maybeSingle(),
        supabase.from("profissionais").select("*").eq("user_id", user.id).maybeSingle(),
      ]);

      if (adminRow) {
        setIsAdmin(true);
        await loadData();
      } else if (profRow) {
        setIsBarbeiro(true);
        setBarbeiroProfissional(profRow);
        const { data: ags } = await supabase
          .from("agendamentos")
          .select("*")
          .eq("profissional_id", profRow.id)
          .order("data", { ascending: false });
        setAgendamentos(ags ?? []);
        setProfissionais([profRow]);
      }

      setLoading(false);
    });
  }, [router, loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#3aab4a] animate-spin" />
      </div>
    );
  }

  if (!isAdmin && !isBarbeiro) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center gap-4 px-4">
        <AlertCircle size={40} className="text-red-400" />
        <h1 className="font-display text-2xl text-[#f5f0eb]">ACESSO NEGADO</h1>
        <p className="text-[#a8a8a8] text-sm text-center">Você não tem permissão para acessar esta área.</p>
        <Link href="/" className="mt-2 px-6 py-2.5 bg-[#272727] ring-1 ring-white/10 text-[#f5f0eb] text-sm rounded-sm hover:ring-white/30 transition-all">
          Voltar ao site
        </Link>
      </div>
    );
  }

  if (isBarbeiro && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-16">
        <div className="border-b border-white/5 bg-[#111111] sticky top-16 z-10">
          <div className="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
            <span className="font-display text-sm tracking-widest text-[#f5f0eb]">
              MINHA AGENDA
              <span className="ml-3 text-[#a8a8a8] text-xs font-sans normal-case tracking-normal hidden sm:inline">
                {barbeiroProfissional?.nome}
              </span>
            </span>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
              className="flex items-center gap-1.5 text-[#a8a8a8] text-xs hover:text-red-400 transition-colors"
            >
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <AgendaTab
            agendamentos={agendamentos}
            profissionais={profissionais}
            fixedProfissionalId={barbeiroProfissional?.id ?? null}
            isAdmin={false}
          />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "agendamentos" as Tab, label: "Agendamentos", Icon: Calendar, count: agendamentos.filter((a) => a.data >= new Date().toISOString().split("T")[0] && a.status !== "cancelado").length },
    { id: "barbeiros" as Tab, label: "Barbeiros", Icon: Users, count: profissionais.filter((p) => p.ativo).length },
    { id: "unidades" as Tab, label: "Unidades", Icon: MapPin, count: unidades.filter((u) => u.ativo).length },
    { id: "agenda" as Tab, label: "Agenda", Icon: CalendarDays, count: null },
    { id: "financeiro" as Tab, label: "Financeiro", Icon: TrendingUp, count: null },
    { id: "relatorios" as Tab, label: "Relatórios", Icon: BarChart2, count: null },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-16">
      {/* Sub-header */}
      <div className="border-b border-white/5 bg-[#111111] sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
          <span className="font-display text-sm tracking-widest text-[#f5f0eb]">
            PAINEL ADMIN
            <span className="ml-3 text-[#a8a8a8] text-xs font-sans normal-case tracking-normal hidden sm:inline">
              {user?.email}
            </span>
          </span>
          <button
            onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            className="flex items-center gap-1.5 text-[#a8a8a8] text-xs hover:text-red-400 transition-colors"
          >
            <LogOut size={13} /> Sair
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 mb-8 w-full overflow-x-auto md:overflow-visible">
          {tabs.map(({ id, label, Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-sm transition-all ${tab === id ? "bg-[#3aab4a] text-[#111111]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
                }`}
            >
              <Icon size={13} />
              {label}
              {count !== null && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === id ? "bg-[#111111]/20" : "bg-white/10"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full overflow-x-auto md:overflow-visible"
        >

          {tab === "agendamentos" && (
            <AgendamentosTab agendamentos={agendamentos} profissionais={profissionais} unidades={unidades} onRefresh={loadData} />
          )}
          {tab === "barbeiros" && (
            <BarbeirosTab profissionais={profissionais} unidades={unidades} onRefresh={loadData} />
          )}
          {tab === "unidades" && (
            <UnidadesTab unidades={unidades} onRefresh={loadData} />
          )}
          {tab === "agenda" && (
            <AgendaTab
              agendamentos={agendamentos}
              profissionais={profissionais}
              fixedProfissionalId={null}
              isAdmin={true}
            />
          )}
          {tab === "financeiro" && (
            <FinanceiroTab agendamentos={agendamentos} />
          )}
          {tab === "relatorios" && (
            <RelatoriosTab agendamentos={agendamentos} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
