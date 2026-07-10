'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { ResultadoQuiz } from '@/lib/quiz';

const PERFIS = {
  invisivel: {
    cor: 'from-red-500/20 to-transparent',
    borda: 'border-red-500/30',
    badge: 'bg-red-500/15 text-red-400',
    icone: '🌑',
    accent: 'text-red-400',
  },
  executor: {
    cor: 'from-orange-500/20 to-transparent',
    borda: 'border-orange-500/30',
    badge: 'bg-orange-500/15 text-orange-400',
    icone: '⚙️',
    accent: 'text-orange-400',
  },
  reconhecido: {
    cor: 'from-blue-500/20 to-transparent',
    borda: 'border-blue-500/30',
    badge: 'bg-blue-500/15 text-blue-400',
    icone: '⭐',
    accent: 'text-blue-400',
  },
  referencia: {
    cor: 'from-emerald-500/20 to-transparent',
    borda: 'border-emerald-500/30',
    badge: 'bg-emerald-500/15 text-emerald-400',
    icone: '🏆',
    accent: 'text-emerald-400',
  },
};

const DIMENSOES = [
  { chave: 'visibilidade' as const, label: 'Visibilidade', desc: 'Você aparece para as pessoas certas' },
  { chave: 'valor' as const, label: 'Valor Percebido', desc: 'Seu impacto é reconhecido' },
  { chave: 'influencia' as const, label: 'Influência', desc: 'Você gera confiança e protagonismo' },
  { chave: 'relacionamento' as const, label: 'Relacionamento', desc: 'Qualidade das relações estratégicas' },
];

function corBarra(v: number) {
  if (v >= 80) return 'bg-emerald-500';
  if (v >= 60) return 'bg-blue-500';
  if (v >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function labelNivel(v: number) {
  if (v >= 80) return { txt: 'Excelente', cor: 'text-emerald-400' };
  if (v >= 60) return { txt: 'Bom', cor: 'text-blue-400' };
  if (v >= 40) return { txt: 'Regular', cor: 'text-amber-400' };
  return { txt: 'Crítico', cor: 'text-red-400' };
}

const CARGOS_LIDERANCA = ['Diretor / Gerente', 'Supervisor / Coordenador'];

export default function ResultadoPage() {
  const router = useRouter();
  const [resultado, setResultado] = useState<ResultadoQuiz | null>(null);
  const [cargo, setCargo] = useState<string>('');

  useEffect(() => {
    const data = sessionStorage.getItem('resultado');
    if (!data) { router.push('/quiz'); return; }
    setResultado(JSON.parse(data));
    setCargo(sessionStorage.getItem('cargo') ?? '');
  }, [router]);

  if (!resultado) return null;

  const p = PERFIS[resultado.perfil];
  const pct = Math.round((resultado.pontuacao / 75) * 100);
  const isLideranca = CARGOS_LIDERANCA.includes(cargo);

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Card perfil */}
        <div className={`relative rounded-3xl border ${p.borda} bg-gradient-to-b ${p.cor} bg-white/3 overflow-hidden`}>
          <div className="p-8 text-center space-y-5">
            <div className="text-6xl">{p.icone}</div>
            <span className={`inline-block text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest ${p.badge}`}>
              Seu Perfil
            </span>
            <h1 className={`text-4xl font-black ${p.accent}`}>{resultado.titulo}</h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">{resultado.diagnostico}</p>

            {/* Score ring visual */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="text-center">
                <div className="text-5xl font-black text-white">{resultado.pontuacao}</div>
                <div className="text-slate-500 text-sm">de 75 pontos</div>
              </div>
              <div className="h-16 w-px bg-white/10" />
              <div className="text-center">
                <div className={`text-5xl font-black ${p.accent}`}>{pct}%</div>
                <div className="text-slate-500 text-sm">desempenho</div>
              </div>
            </div>

            {/* Barra geral */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mx-4">
              <div
                className={`h-full rounded-full ${corBarra(pct)} transition-all duration-1000`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dimensões */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-6 space-y-5">
          <h2 className="text-white font-bold text-lg">Análise por Dimensão</h2>
          <div className="space-y-4">
            {DIMENSOES.map(({ chave, label, desc }) => {
              const valor = chave === 'valor' ? resultado.valor : resultado[chave];
              const nivel = labelNivel(valor);
              return (
                <div key={chave} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-white font-semibold text-sm">{label}</span>
                      <span className="text-slate-500 text-xs ml-2">· {desc}</span>
                    </div>
                    <span className={`text-xs font-bold ${nivel.cor}`}>{nivel.txt} · {valor}%</span>
                  </div>
                  <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${corBarra(valor)} transition-all duration-700`}
                      style={{ width: `${valor}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Fatores */}
        {resultado.planosDeAcao.length > 0 && (
          <div className="bg-amber-500/8 border border-amber-500/20 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center text-amber-400 font-black text-sm">!</div>
              <h2 className="text-amber-400 font-bold text-lg">Os 3 Fatores que Limitam Seu Crescimento</h2>
            </div>
            <div className="space-y-3">
              {resultado.planosDeAcao.map((acao, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/4 rounded-2xl p-4 border border-white/5">
                  <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-black text-sm flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-slate-200 text-base leading-snug">{acao}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Divisor */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Acelere seu crescimento</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {isLideranca ? (
          /* Sessão Estratégica Individual (Diretor/Gerente e Supervisor/Coordenador) */
          <div className="bg-white/3 border border-white/8 rounded-3xl p-5 flex gap-5 items-center hover:border-amber-500/30 transition-colors">
            <Image src="/lucas-terno.png" alt="Sessão Estratégica Individual" width={90} height={116} className="rounded-2xl object-cover flex-shrink-0 shadow-xl" />
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">SESSÃO INDIVIDUAL</p>
                <h3 className="text-white font-bold text-lg leading-tight">Sessão Estratégica Individual</h3>
                <p className="text-slate-400 text-sm mt-1 leading-snug">Uma conversa 1:1 pra analisar seu diagnóstico e montar seu plano de reconhecimento. Por R$29,90.</p>
              </div>
              <a
                href="https://pay.kiwify.com.br/taFoXTZ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-amber-500/20"
              >
                Quero minha sessão →
              </a>
            </div>
          </div>
        ) : (
          /* Protocolo do Funcionário Valorizado */
          <div className="bg-white/3 border border-white/8 rounded-3xl p-5 flex gap-5 items-center hover:border-amber-500/30 transition-colors">
            <Image src="/lucas-terno.png" alt="Protocolo do Funcionário Valorizado" width={90} height={116} className="rounded-2xl object-cover flex-shrink-0 shadow-xl" />
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">CURSO</p>
                <h3 className="text-white font-bold text-lg leading-tight">Protocolo do Funcionário Valorizado</h3>
                <p className="text-slate-400 text-sm mt-1 leading-snug">O passo a passo pra sair da invisibilidade, ser reconhecido e ganhar o que você merece.</p>
              </div>
              <a
                href="https://3sprodutividade.com.br/protocolo-reconhecimento"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-amber-500/20"
              >
                Quero acessar →
              </a>
            </div>
          </div>
        )}

        {/* Refazer */}
        <div className="text-center pb-4">
          <Link href="/quiz" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
            Refazer o diagnóstico
          </Link>
        </div>

      </div>
    </main>
  );
}
