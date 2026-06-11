import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { calcularResultado } from '@/lib/quiz';

export async function POST(req: NextRequest) {
  try {
    const { nome, email, respostas } = await req.json();

    if (!respostas || respostas.length !== 15) {
      return NextResponse.json({ error: 'Respostas inválidas' }, { status: 400 });
    }

    const resultado = calcularResultado(respostas);
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS resultados_quiz (
        id SERIAL PRIMARY KEY,
        nome TEXT,
        email TEXT,
        pontuacao INTEGER NOT NULL,
        perfil TEXT NOT NULL,
        visibilidade INTEGER NOT NULL,
        valor_percebido INTEGER NOT NULL,
        influencia INTEGER NOT NULL,
        relacionamento INTEGER NOT NULL,
        respostas JSONB NOT NULL,
        criado_em TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const [row] = await sql`
      INSERT INTO resultados_quiz (nome, email, pontuacao, perfil, visibilidade, valor_percebido, influencia, relacionamento, respostas)
      VALUES (${nome || null}, ${email || null}, ${resultado.pontuacao}, ${resultado.perfil},
              ${resultado.visibilidade}, ${resultado.valor}, ${resultado.influencia},
              ${resultado.relacionamento}, ${JSON.stringify(respostas)})
      RETURNING id
    `;

    return NextResponse.json({ id: row.id, resultado });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
