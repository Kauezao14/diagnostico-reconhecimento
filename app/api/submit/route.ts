import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { getDb } from '@/lib/db';
import { calcularResultado } from '@/lib/quiz';

function sha256(value: string) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

async function enviarEventoFacebook(dados: {
  email: string;
  telefone: string;
  nome: string;
  sourceUrl: string;
  clientIp: string;
  clientUserAgent: string;
}) {
  const pixelId = process.env.FB_PIXEL_ID;
  const token = process.env.FB_CONVERSIONS_TOKEN;
  if (!pixelId || !token) return;

  const primeiroNome = dados.nome.split(' ')[0] ?? '';
  const sobrenome = dados.nome.split(' ').slice(1).join(' ') ?? '';
  const telefoneDigitos = dados.telefone.replace(/\D/g, '');

  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: dados.sourceUrl,
      user_data: {
        em: [sha256(dados.email)],
        ph: telefoneDigitos ? [sha256(telefoneDigitos)] : undefined,
        fn: primeiroNome ? [sha256(primeiroNome)] : undefined,
        ln: sobrenome ? [sha256(sobrenome)] : undefined,
        client_ip_address: dados.clientIp,
        client_user_agent: dados.clientUserAgent,
      },
    }],
  };

  await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, telefone, cargo, empresaTamanho, respostas, extras, origem } = await req.json();

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
        cargo TEXT,
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
        origem TEXT DEFAULT 'quiz1',
        criado_em TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const [row] = await sql`
      INSERT INTO resultados_quiz
        (nome, email, telefone, cargo, empresa_tamanho, pontuacao, perfil, visibilidade, valor_percebido, influencia, relacionamento, respostas, desafio, objetivo, preocupacao, origem)
      VALUES
        (${nome || null}, ${email || null}, ${telefone || null}, ${cargo || null}, ${empresaTamanho || null},
         ${resultado.pontuacao}, ${resultado.perfil},
         ${resultado.visibilidade}, ${resultado.valor}, ${resultado.influencia}, ${resultado.relacionamento},
         ${JSON.stringify(respostas)},
         ${JSON.stringify(extras?.desafio ?? [])},
         ${JSON.stringify(extras?.objetivo ?? [])},
         ${JSON.stringify(extras?.preocupacao ?? [])},
         ${origem || 'quiz1'})
      RETURNING id
    `;

    // Dispara evento Lead no Facebook Conversions API (fire-and-forget)
    if (email) {
      enviarEventoFacebook({
        email,
        telefone: telefone ?? '',
        nome: nome ?? '',
        sourceUrl: req.headers.get('referer') ?? 'https://diagnostico-reconhecimento.vercel.app',
        clientIp: req.headers.get('x-forwarded-for')?.split(',')[0] ?? '',
        clientUserAgent: req.headers.get('user-agent') ?? '',
      }).catch(() => {});
    }

    return NextResponse.json({ id: row.id, resultado });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
