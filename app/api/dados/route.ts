import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const apiSecret = process.env.API_SECRET;
  if (!apiSecret) {
    console.error('API_SECRET não configurado.');
    return NextResponse.json({ error: 'Serviço indisponível' }, { status: 503 });
  }

  const authorization = req.headers.get('authorization');
  if (authorization !== `Bearer ${apiSecret}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, nome, email, telefone, cargo, empresa_tamanho,
           pontuacao, perfil, visibilidade, valor_percebido,
           influencia, relacionamento, origem,
           desafio, objetivo, preocupacao,
           to_char(criado_em AT TIME ZONE 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as data
    FROM resultados_quiz
    ORDER BY criado_em DESC
  `;

  return NextResponse.json(rows, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
