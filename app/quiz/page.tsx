'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PERGUNTAS, OPCOES_PADRAO, OPCOES_POR_PERGUNTA } from '@/lib/quiz';

export default function QuizPage() {
  const router = useRouter();
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>(Array(15).fill(0));
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [etapa, setEtapa] = useState<'dados' | 'quiz'>('dados');
  const [enviando, setEnviando] = useState(false);

  const pergunta = PERGUNTAS[atual];
  const opcoes = OPCOES_POR_PERGUNTA[pergunta?.id] ?? OPCOES_PADRAO;
  const progresso = Math.round(((atual) / 15) * 100);

  function selecionarResposta(valor: number) {
    const novas = [...respostas];
    novas[atual] = valor;
    setRespostas(novas);

    if (atual < 14) {
      setTimeout(() => setAtual(atual + 1), 300);
    }
  }

  async function finalizar() {
    setEnviando(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, respostas }),
      });
      const data = await res.json();
      if (data.resultado) {
        sessionStorage.setItem('resultado', JSON.stringify(data.resultado));
        router.push('/resultado');
      }
    } catch {
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  if (etapa === 'dados') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Antes de começar</h2>
            <p className="text-slate-400">Preencha para receber seu resultado personalizado</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Seu nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como prefere ser chamado?"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Seu e-mail <span className="text-slate-500">(opcional)</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="para@exemplo.com"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              onClick={() => setEtapa('quiz')}
              disabled={!nome.trim()}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold py-4 rounded-xl transition-colors"
            >
              Começar o Diagnóstico →
            </button>
          </div>
        </div>
      </main>
    );
  }

  const todasRespondidas = respostas.every((r) => r > 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-6">
        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Pergunta {atual + 1} de 15</span>
            <span>{progresso}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Pergunta */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-semibold text-white leading-snug">{pergunta.texto}</h2>

          <div className="space-y-3">
            {opcoes.map((opcao) => (
              <button
                key={opcao.valor}
                onClick={() => selecionarResposta(opcao.valor)}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                  respostas[atual] === opcao.valor
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-500/50 hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{opcao.valor}.</span> {opcao.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setAtual(Math.max(0, atual - 1))}
            disabled={atual === 0}
            className="text-slate-400 hover:text-white disabled:opacity-30 transition-colors text-sm"
          >
            ← Anterior
          </button>

          {atual < 14 ? (
            <button
              onClick={() => respostas[atual] > 0 && setAtual(atual + 1)}
              disabled={respostas[atual] === 0}
              className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white px-6 py-2 rounded-lg transition-colors text-sm"
            >
              Próxima →
            </button>
          ) : (
            <button
              onClick={finalizar}
              disabled={!todasRespondidas || enviando}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              {enviando ? 'Calculando...' : 'Ver meu resultado →'}
            </button>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {PERGUNTAS.map((_, i) => (
            <button
              key={i}
              onClick={() => setAtual(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                respostas[i] > 0 ? 'bg-amber-500' : i === atual ? 'bg-white/50' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
