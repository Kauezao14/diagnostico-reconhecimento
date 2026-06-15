'use client';

import { useEffect, useState, useCallback } from 'react';

interface Registro {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  empresa_tamanho: string;
  pontuacao: number;
  perfil: string;
  visibilidade: number;
  valor_percebido: number;
  influencia: number;
  relacionamento: number;
  origem: string;
  data: string;
}

const PERFIL_COR: Record<string, string> = {
  invisivel: 'text-red-400 bg-red-500/10 border-red-500/30',
  executor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  reconhecido: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  referencia: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
};

const PERFIL_LABEL: Record<string, string> = {
  invisivel: 'Invisível',
  executor: 'Executor',
  reconhecido: 'Reconhecido',
  referencia: 'Referência',
};

function Barra({ valor, cor }: { valor: number; cor: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cor}`} style={{ width: `${valor}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-8 text-right">{valor}%</span>
    </div>
  );
}

function Card({ label, valor, sub }: { label: string; valor: string | number; sub?: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-1">
      <div className="text-slate-400 text-xs uppercase tracking-wider">{label}</div>
      <div className="text-3xl font-black text-white">{valor}</div>
      {sub && <div className="text-slate-500 text-xs">{sub}</div>}
    </div>
  );
}

export default function AdminPage() {
  const [senha, setSenha] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [dados, setDados] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [ultimaAtt, setUltimaAtt] = useState('');

  const buscarDados = useCallback(async (secret: string) => {
    setCarregando(true);
    try {
      const res = await fetch(`/api/dados?secret=${secret}`);
      if (!res.ok) { setErro('Senha incorreta'); setAutenticado(false); return; }
      const json = await res.json();
      setDados(json);
      setUltimaAtt(new Date().toLocaleTimeString('pt-BR'));
      setErro('');
    } catch {
      setErro('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }, []);

  function entrar() {
    if (!senha) return;
    setAutenticado(true);
    buscarDados(senha);
  }

  useEffect(() => {
    if (!autenticado) return;
    const interval = setInterval(() => buscarDados(senha), 30000);
    return () => clearInterval(interval);
  }, [autenticado, senha, buscarDados]);

  if (!autenticado) {
    return (
      <main className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-white">Painel Admin</h1>
            <p className="text-slate-500 text-sm">Diagnóstico de Reconhecimento</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && entrar()}
              placeholder="Senha de acesso"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            {erro && <p className="text-red-400 text-sm">{erro}</p>}
            <button
              onClick={entrar}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Métricas
  const total = dados.length;
  const mediaPontuacao = total ? Math.round(dados.reduce((a, r) => a + r.pontuacao, 0) / total) : 0;
  const mediaVis = total ? Math.round(dados.reduce((a, r) => a + r.visibilidade, 0) / total) : 0;
  const mediaVal = total ? Math.round(dados.reduce((a, r) => a + r.valor_percebido, 0) / total) : 0;
  const mediaInf = total ? Math.round(dados.reduce((a, r) => a + r.influencia, 0) / total) : 0;
  const mediaRel = total ? Math.round(dados.reduce((a, r) => a + r.relacionamento, 0) / total) : 0;

  const porPerfil = ['invisivel', 'executor', 'reconhecido', 'referencia'].map(p => ({
    perfil: p,
    qtd: dados.filter(r => r.perfil === p).length,
  }));

  const porOrigem = [
    { label: 'Quiz 1', qtd: dados.filter(r => r.origem === 'quiz1').length },
    { label: 'Quiz 2', qtd: dados.filter(r => r.origem === 'quiz2').length },
  ];

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Painel Admin</h1>
            <p className="text-slate-500 text-sm">Atualiza automaticamente a cada 30s · Última: {ultimaAtt}</p>
          </div>
          <button
            onClick={() => buscarDados(senha)}
            disabled={carregando}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {carregando ? 'Atualizando...' : '↻ Atualizar'}
          </button>
        </div>

        {/* Cards métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card label="Total de respostas" valor={total} />
          <Card label="Pontuação média" valor={`${mediaPontuacao}/75`} />
          <Card label="Quiz 1" valor={porOrigem[0].qtd} sub="respostas" />
          <Card label="Quiz 2" valor={porOrigem[1].qtd} sub="respostas" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Perfis */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Distribuição de Perfis</h2>
            <div className="space-y-3">
              {porPerfil.map(({ perfil, qtd }) => (
                <div key={perfil} className="flex items-center justify-between gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${PERFIL_COR[perfil]}`}>
                    {PERFIL_LABEL[perfil]}
                  </span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${perfil === 'invisivel' ? 'bg-red-500' : perfil === 'executor' ? 'bg-orange-500' : perfil === 'reconhecido' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                      style={{ width: total ? `${(qtd / total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-6 text-right">{qtd}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensões */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Média por Dimensão</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-slate-300 text-sm">Visibilidade</span>
                <Barra valor={mediaVis} cor="bg-amber-500" />
              </div>
              <div className="space-y-1">
                <span className="text-slate-300 text-sm">Valor Percebido</span>
                <Barra valor={mediaVal} cor="bg-blue-500" />
              </div>
              <div className="space-y-1">
                <span className="text-slate-300 text-sm">Influência</span>
                <Barra valor={mediaInf} cor="bg-purple-500" />
              </div>
              <div className="space-y-1">
                <span className="text-slate-300 text-sm">Relacionamento</span>
                <Barra valor={mediaRel} cor="bg-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-white font-bold">Respostas ({total})</h2>
          </div>
          {total === 0 ? (
            <div className="p-10 text-center text-slate-500">Nenhuma resposta ainda</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Nome', 'Cargo', 'Email', 'Telefone', 'Pontos', 'Perfil', 'Origem', 'Data'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-slate-400 font-medium text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.map((r, i) => (
                    <tr key={r.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                      <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{r.nome || '—'}</td>
                      <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{r.cargo || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{r.email || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{r.telefone || '—'}</td>
                      <td className="px-4 py-3 text-amber-400 font-bold">{r.pontuacao}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${PERFIL_COR[r.perfil]}`}>
                          {PERFIL_LABEL[r.perfil] || r.perfil}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{r.origem === 'quiz2' ? 'Quiz 2' : 'Quiz 1'}</td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
