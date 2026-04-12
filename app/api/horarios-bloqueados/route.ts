import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSupabaseServerClient } from "@/lib/supabase-server";

async function requireAdmin(): Promise<NextResponse | null> {
  const serverSupabase = await createSupabaseServerClient();
  const { data: { user } } = await serverSupabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: adminRow } = await serverSupabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminRow) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  return null;
}

// GET ?profissionalId=...&data=YYYY-MM-DD
//     ?profissionalId=...&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
// Public — used by the booking flow to determine slot availability
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const profissionalId = searchParams.get("profissionalId");
  const data = searchParams.get("data");
  const dataInicio = searchParams.get("dataInicio");
  const dataFim = searchParams.get("dataFim");

  if (!profissionalId) {
    return NextResponse.json({ error: "profissionalId obrigatório" }, { status: 400 });
  }
  if (!data && !(dataInicio && dataFim)) {
    return NextResponse.json({ error: "data ou dataInicio+dataFim obrigatório" }, { status: 400 });
  }

  let query = supabase
    .from("horarios_bloqueados")
    .select("id, horario, data")
    .eq("profissional_id", profissionalId);

  if (data) {
    query = query.eq("data", data);
  } else {
    query = query.gte("data", dataInicio!).lte("data", dataFim!);
  }

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: "Erro interno" }, { status: 500 });

  const result = rows ?? [];

  if (data) {
    const diaInteiro = result.find((r) => r.horario === null) ?? null;
    const bloqueados = result.filter((r) => r.horario !== null).map((r) => r.horario as string);
    return NextResponse.json({
      diaBloqueado: !!diaInteiro,
      bloqueados,
      rows: result,
    });
  }

  return NextResponse.json({ rows: result });
}

// POST { profissionalId, data, horario?, motivo? } — admin only
export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const body = await request.json();
  const { profissionalId, data, horario, motivo } = body;

  if (!profissionalId || !data) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const { error } = await supabase.from("horarios_bloqueados").insert({
    profissional_id: profissionalId,
    data,
    horario: horario ?? null,
    motivo: motivo ?? null,
  });

  if (error) {
    if (error.code === "23505") return NextResponse.json({ success: true }); // já bloqueado
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

// DELETE ?id=UUID — admin only
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID faltando" }, { status: 400 });

  const { error } = await supabase.from("horarios_bloqueados").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Erro interno" }, { status: 500 });

  return NextResponse.json({ success: true });
}
