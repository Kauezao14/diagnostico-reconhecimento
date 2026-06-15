import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, nome, email, telefone, cargo, empresa_tamanho,
           pontuacao, perfil, visibilidade, valor_percebido,
           influencia, relacionamento, origem,
           to_char(criado_em AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as data
    FROM resultados_quiz
    ORDER BY criado_em DESC
  `;

  return NextResponse.json(rows);
}
