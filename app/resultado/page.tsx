'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { ResultadoQuiz } from '@/lib/quiz';

const CORES_PERFIL = {
  invisivel: { bg: 'from-red-900/40 to-slate-900', badge: 'bg-red-500/20 text-red-400 border-red-500/30', icone: '🌑' },
  executor: { bg: 'from-orange-900/40 to-slate-900', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icone: '⚙️' },
  reconhecido: { bg: 'from-blue-900/40 to-slate-900', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icone: '⭐' },
  referencia: { bg: 'from-green-900/40 to-slate-900', badge: 'bg-green-500/20 text-green-400 border-green-500/30', icone: '🏆' },
};

const DIMENSOES = [
  { chave: 'visibilidade' as const, label: 'Visibilidade', desc: 'O quanto você aparece para as pessoas certas' },
  { chave: 'valor' as const, label: 'Valor Percebido', desc: 'O quanto seu impacto é percebido' },
  { chave: 'influencia' as const, label: 'Influência', desc: 'Sua capacidade de gerar confiança e protagonismo' },
  { chave: 'relacionamento' as const, label: 'Relacionamento Estratégico', desc: 'Qualidade da relação com líderes e decisores' },
];

function corBarra(valor: number) {
  if (valor >= 80) return 'bg-green-500';
  if (valor >= 60) return 'bg-blue-500';
  if (valor >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export default function ResultadoPage() {
  const router = useRouter();
  const [resultado, setResultado] = useState<ResultadoQuiz | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('resultado');
    if (!data) {
      router.push('/quiz');
      return;
    }
    setResultado(JSON.parse(data));
  }, [router]);

  if (!resultado) return null;

  const cores = CORES_PERFIL[resultado.perfil];

  return (
    <main className={`min-h-screen bg-gradient-to-br ${cores.bg} px-4 py-12`}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header resultado */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center space-y-4">
          <div className="text-5xl">{cores.icone}</div>
          <div>
            <span className={`inline-block text-sm font-semibold px-4 py-1.5 rounded-full border ${cores.badge}`}>
              Seu perfil
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">{resultado.titulo}</h1>
          <p className="text-slate-300 text-xl leading-relaxed">{resultado.diagnostico}</p>
          <div className="inline-block bg-white/10 rounded-xl px-6 py-3">
            <span className="text-slate-400 text-sm">Pontuação total</span>
            <div className="text-4xl font-bold text-amber-400">{resultado.pontuacao}<span className="text-lg text-slate-400">/75</span></div>
          </div>
        </div>

        {/* Dimensões */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-5">
          <h2 className="text-white font-bold text-lg">Análise por Dimensão</h2>
          {DIMENSOES.map(({ chave, label, desc }) => {
            const valor = chave === 'valor' ? resultado.valor : resultado[chave];
            return (
              <div key={chave} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-slate-200 font-medium text-base">{label}</span>
                    <p className="text-slate-500 text-sm">{desc}</p>
                  </div>
                  <span className="text-slate-300 font-bold text-base ml-4">{valor}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${corBarra(valor)}`}
                    style={{ width: `${valor}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Plano de ação */}
        {resultado.planosDeAcao.length > 0 && (
          <div className="bg-amber-500/10 rounded-2xl p-6 border border-amber-500/20 space-y-4">
            <h2 className="text-amber-400 font-bold text-xl">Os 3 Fatores que Estão Limitando Seu Crescimento</h2>
            <div className="space-y-3">
              {resultado.planosDeAcao.map((acao, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
                  <span className="text-amber-400 font-bold text-base mt-0.5">{i + 1}.</span>
                  <span className="text-slate-300 text-base">{acao}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ebooks */}
        <div className="space-y-4">
          <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-wider">Dê o próximo passo</p>

          {/* Ebook 1 - Feedback que Transforma */}
          <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-2xl p-6 border border-blue-500/20 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-shrink-0 w-28 h-36 bg-gradient-to-br from-blue-600 to-blue-900 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-500/30">
              <div className="text-center px-2">
                <div className="text-blue-200 text-xs font-bold uppercase tracking-wide leading-tight">Feedback que</div>
                <div className="text-white text-sm font-black uppercase">Transforma</div>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <h3 className="text-white font-bold text-lg">EBOOK - Feedback que transforma</h3>
              <p className="text-slate-300 text-sm leading-relaxed">Aprenda a dar e receber feedbacks que realmente mudam comportamentos e aceleram seu crescimento profissional.</p>
              <a
                href="https://pay.kiwify.com.br/e5gogMi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/25 text-sm"
              >
                ADQUIRA AGORA →
              </a>
            </div>
          </div>

          {/* Ebook 2 - Líder 10x */}
          <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 rounded-2xl p-6 border border-amber-500/20 flex flex-col sm:flex-row items-center gap-5">
            <div className="flex-shrink-0">
              <Image src="/lider10x.png" alt="Líder 10X" width={112} height={144} className="rounded-xl shadow-lg shadow-amber-500/20 object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-3">
              <h3 className="text-white font-bold text-lg">EBOOK - Líder 10X</h3>
              <p className="text-slate-300 text-sm leading-relaxed">O guia definitivo para multiplicar sua liderança, reconhecimento e resultados dentro da empresa em 90 dias.</p>
              <a
                href="https://pay.kiwify.com.br/nzi1kns"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/25 text-sm"
              >
                ADQUIRA AGORA →
              </a>
            </div>
          </div>
        </div>

        {/* Refazer */}
        <div className="text-center">
          <Link href="/quiz" className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors text-sm">
            Refazer o diagnóstico
          </Link>
        </div>
      </div>
    </main>
  );
}
