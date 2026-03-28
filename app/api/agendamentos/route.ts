import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profissionalId = searchParams.get("profissionalId");
  const data = searchParams.get("data");

  if (!profissionalId || !data) {
    return NextResponse.json({ error: "Parâmetros faltando" }, { status: 400 });
  }

  const { data: agendamentos, error } = await supabase
    .from("agendamentos")
    .select("horario")
    .eq("profissional_id", profissionalId)
    .eq("data", data)
    .neq("status", "cancelado");

  if (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  return NextResponse.json({ ocupados: agendamentos.map((a) => a.horario) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    profissionalId,
    unidadeId,
    servicoId,
    servicoNome,
    servicoPreco,
    profissionalNome,
    unidadeNome,
    data,
    horario,
    clienteNome,
    clienteTelefone,
    clienteId,
  } = body;

  if (!profissionalId || !unidadeId || !servicoId || !data || !horario || !clienteNome || !clienteTelefone) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  // Se não veio clienteId (não logado), tenta achar pelo telefone
  let resolvedClienteId: string | null = clienteId ?? null;
  if (!resolvedClienteId && clienteTelefone) {
    const { data: match } = await supabase.rpc("find_cliente_by_telefone", {
      p_telefone: clienteTelefone,
    });
    resolvedClienteId = match ?? null;
  }

  const { error } = await supabase.from("agendamentos").insert({
    profissional_id: profissionalId,
    unidade_id: unidadeId,
    servico_id: servicoId,
    servico_nome: servicoNome ?? null,
    servico_preco: servicoPreco ?? null,
    profissional_nome: profissionalNome ?? null,
    unidade_nome: unidadeNome ?? null,
    data,
    horario,
    cliente_nome: clienteNome,
    cliente_telefone: clienteTelefone,
    cliente_id: resolvedClienteId,
    status: "confirmado",
  });

  if (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
