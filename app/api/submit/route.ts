import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { calcularResultado } from '@/lib/quiz';

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone, empresaTamanho, respostas, extras } = await req.json();

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
        telefone TEXT,
        empresa_tamanho TEXT,
        pontuacao INTEGER NOT NULL,
        perfil TEXT NOT NULL,
        visibilidade INTEGER NOT NULL,
        valor_percebido INTEGER NOT NULL,
        influencia INTEGER NOT NULL,
        relacionamento INTEGER NOT NULL,
        respostas JSONB NOT NULL,
        desafio JSONB,
        objetivo JSONB,
        preocupacao JSONB,
        criado_em TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const [row] = await sql`
      INSERT INTO resultados_quiz
        (nome, email, telefone, empresa_tamanho, pontuacao, perfil, visibilidade, valor_percebido, influencia, relacionamento, respostas, desafio, objetivo, preocupacao)
      VALUES
        (${nome || null}, ${email || null}, ${telefone || null}, ${empresaTamanho || null},
         ${resultado.pontuacao}, ${resultado.perfil},
         ${resultado.visibilidade}, ${resultado.valor}, ${resultado.influencia}, ${resultado.relacionamento},
         ${JSON.stringify(respostas)},
         ${JSON.stringify(extras?.desafio ?? [])},
         ${JSON.stringify(extras?.objetivo ?? [])},
         ${JSON.stringify(extras?.preocupacao ?? [])})
      RETURNING id
    `;

    return NextResponse.json({ id: row.id, resultado });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
