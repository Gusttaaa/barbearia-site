"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LogOut, Calendar, Users, MapPin, Plus, Check,
  Edit2, Trash2, AlertCircle, Loader2,
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

type Tab = "agendamentos" | "barbeiros" | "unidades";

const HORARIOS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00",
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
              className={`px-4 py-1.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-all ${
                filter === f ? "bg-[#272727] text-[#f5f0eb]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
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
                className={`px-4 py-3 flex flex-col md:grid md:grid-cols-[110px_70px_1fr_1fr_1fr_1fr_80px_90px] md:items-center gap-1 md:gap-2 ${
                  a.status === "cancelado" ? "opacity-40" : ""
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
      id: `p${Date.now()}`,
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
  { key: "nome",            placeholder: "Nome da unidade" },
  { key: "bairro",          placeholder: "Bairro" },
  { key: "endereco",        placeholder: "Endereço completo", span: true },
  { key: "telefone",        placeholder: "Telefone" },
  { key: "whatsapp",        placeholder: "WhatsApp (ex: 5521999990001)" },
  { key: "horario_semana",  placeholder: "Seg–Sex (ex: Seg–Sex: 9h às 20h)", span: true },
  { key: "horario_sabado",  placeholder: "Sábado (ex: Sáb: 9h às 18h)" },
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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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
      const { data: adminRow } = await supabase.from("admins").select("id").eq("id", user.id).maybeSingle();
      if (!adminRow) { setLoading(false); return; }
      setIsAdmin(true);
      await loadData();
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

  if (!isAdmin) {
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

  const tabs = [
    { id: "agendamentos" as Tab, label: "Agendamentos", Icon: Calendar, count: agendamentos.filter((a) => a.data >= new Date().toISOString().split("T")[0] && a.status !== "cancelado").length },
    { id: "barbeiros" as Tab, label: "Barbeiros", Icon: Users, count: profissionais.filter((p) => p.ativo).length },
    { id: "unidades" as Tab, label: "Unidades", Icon: MapPin, count: unidades.filter((u) => u.ativo).length },
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
        <div className="flex gap-1 p-1 bg-[#1a1a1a] rounded-sm ring-1 ring-white/5 mb-8 w-fit">
          {tabs.map(({ id, label, Icon, count }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-medium tracking-wider uppercase rounded-sm transition-all ${
                tab === id ? "bg-[#3aab4a] text-[#111111]" : "text-[#a8a8a8] hover:text-[#f5f0eb]"
              }`}
            >
              <Icon size={13} />
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tab === id ? "bg-[#111111]/20" : "bg-white/10"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {tab === "agendamentos" && (
            <AgendamentosTab agendamentos={agendamentos} profissionais={profissionais} unidades={unidades} onRefresh={loadData} />
          )}
          {tab === "barbeiros" && (
            <BarbeirosTab profissionais={profissionais} unidades={unidades} onRefresh={loadData} />
          )}
          {tab === "unidades" && (
            <UnidadesTab unidades={unidades} onRefresh={loadData} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
