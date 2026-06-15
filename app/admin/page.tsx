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
  desafio: string[];
  objetivo: string[];
  preocupacao: string[];
  data: string;
}

const PERFIL_COR: Record<string, string> = {
  invisivel: 'text-red-400 bg-red-500/10 border-red-500/30',
  executor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  reconhecido: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  referencia: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
};
const PERFIL_LABEL: Record<string, string> = {
  invisivel: 'Invisível', executor: 'Executor', reconhecido: 'Reconhecido', referencia: 'Referência',
};
const PERFIL_BAR: Record<string, string> = {
  invisivel: 'bg-red-500', executor: 'bg-orange-500', reconhecido: 'bg-blue-500', referencia: 'bg-emerald-500',
};

function contarOpcoes(dados: Registro[], campo: 'desafio' | 'objetivo' | 'preocupacao') {
  const mapa: Record<string, number> = {};
  dados.forEach(r => {
    (r[campo] ?? []).forEach((op: string) => {
      mapa[op] = (mapa[op] ?? 0) + 1;
    });
  });
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}

function contarCampo(dados: Registro[], campo: keyof Registro) {
  const mapa: Record<string, number> = {};
  dados.forEach(r => {
    const val = String(r[campo] ?? 'Não informado');
    mapa[val] = (mapa[val] ?? 0) + 1;
  });
  return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
}

function Barra({ valor, max, cor, label, qtd }: { valor: number; max: number; cor: string; label: string; qtd: number }) {
  const pct = max > 0 ? (valor / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-300 truncate max-w-[80%]">{label}</span>
        <span className="text-slate-400 ml-2 flex-shrink-0">{qtd}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DimBarra({ label, valor, cor }: { label: string; valor: number; cor: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{valor}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${cor}`} style={{ width: `${valor}%` }} />
      </div>
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

function SecaoExtras({ titulo, dados, campo, cor }: { titulo: string; dados: Registro[]; campo: 'desafio' | 'objetivo' | 'preocupacao'; cor: string }) {
  const opcoes = contarOpcoes(dados, campo);
  const max = opcoes[0]?.[1] ?? 1;
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      <h2 className="text-white font-bold text-sm uppercase tracking-wider">{titulo}</h2>
      {opcoes.length === 0 ? (
        <p className="text-slate-500 text-sm">Sem dados ainda</p>
      ) : (
        <div className="space-y-3">
          {opcoes.map(([label, qtd]) => (
            <Barra key={label} label={label} valor={qtd} max={max} qtd={qtd} cor={cor} />
          ))}
        </div>
      )}
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
  const [senhaLocal, setSenhaLocal] = useState('');

  const buscarDados = useCallback(async (secret: string) => {
    setCarregando(true);
    try {
      const res = await fetch(`/api/dados?secret=${secret}`);
      if (!res.ok) { setErro('Senha incorreta'); setAutenticado(false); return; }
      setDados(await res.json());
      setUltimaAtt(new Date().toLocaleTimeString('pt-BR'));
      setErro('');
    } catch { setErro('Erro ao carregar dados'); }
    finally { setCarregando(false); }
  }, []);

  function entrar() {
    if (!senha) return;
    setSenhaLocal(senha);
    setAutenticado(true);
    buscarDados(senha);
  }

  useEffect(() => {
    if (!autenticado) return;
    const interval = setInterval(() => buscarDados(senhaLocal), 30000);
    return () => clearInterval(interval);
  }, [autenticado, senhaLocal, buscarDados]);

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
            <button onClick={entrar} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 rounded-xl transition-colors">
              Entrar
            </button>
          </div>
        </div>
      </main>
    );
  }

  const total = dados.length;
  const mediaPontuacao = total ? Math.round(dados.reduce((a, r) => a + r.pontuacao, 0) / total) : 0;
  const mediaVis = total ? Math.round(dados.reduce((a, r) => a + r.visibilidade, 0) / total) : 0;
  const mediaVal = total ? Math.round(dados.reduce((a, r) => a + r.valor_percebido, 0) / total) : 0;
  const mediaInf = total ? Math.round(dados.reduce((a, r) => a + r.influencia, 0) / total) : 0;
  const mediaRel = total ? Math.round(dados.reduce((a, r) => a + r.relacionamento, 0) / total) : 0;

  const porPerfil = ['invisivel', 'executor', 'reconhecido', 'referencia'].map(p => ({
    perfil: p, qtd: dados.filter(r => r.perfil === p).length,
  }));
  const porCargo = contarCampo(dados, 'cargo');
  const porEmpresa = contarCampo(dados, 'empresa_tamanho');
  const maxCargo = porCargo[0]?.[1] ?? 1;
  const maxEmpresa = porEmpresa[0]?.[1] ?? 1;

  return (
    <main className="min-h-screen bg-[#0d1117] px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">Painel Admin</h1>
            <p className="text-slate-500 text-sm">Atualiza a cada 30s · Última: {ultimaAtt}</p>
          </div>
          <button onClick={() => buscarDados(senhaLocal)} disabled={carregando}
            className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-lg transition-colors disabled:opacity-50">
            {carregando ? 'Atualizando...' : '↻ Atualizar'}
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card label="Total de respostas" valor={total} />
          <Card label="Pontuação média" valor={`${mediaPontuacao}/75`} />
          <Card label="Quiz 1" valor={dados.filter(r => r.origem === 'quiz1').length} sub="respostas" />
          <Card label="Quiz 2" valor={dados.filter(r => r.origem === 'quiz2').length} sub="respostas" />
        </div>

        {/* Perfis + Dimensões */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Distribuição de Perfis</h2>
            <div className="space-y-3">
              {porPerfil.map(({ perfil, qtd }) => (
                <div key={perfil} className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border w-24 text-center flex-shrink-0 ${PERFIL_COR[perfil]}`}>
                    {PERFIL_LABEL[perfil]}
                  </span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${PERFIL_BAR[perfil]}`}
                      style={{ width: total ? `${(qtd / total) * 100}%` : '0%' }} />
                  </div>
                  <span className="text-white font-bold text-sm w-5 text-right">{qtd}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Média por Dimensão</h2>
            <div className="space-y-3">
              <DimBarra label="Visibilidade" valor={mediaVis} cor="bg-amber-500" />
              <DimBarra label="Valor Percebido" valor={mediaVal} cor="bg-blue-500" />
              <DimBarra label="Influência" valor={mediaInf} cor="bg-purple-500" />
              <DimBarra label="Relacionamento" valor={mediaRel} cor="bg-emerald-500" />
            </div>
          </div>
        </div>

        {/* Cargo + Empresa */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Por Cargo</h2>
            <div className="space-y-3">
              {porCargo.length === 0 ? <p className="text-slate-500 text-sm">Sem dados</p> :
                porCargo.map(([label, qtd]) => (
                  <Barra key={label} label={label} valor={qtd} max={maxCargo} qtd={qtd} cor="bg-amber-500" />
                ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-bold text-sm uppercase tracking-wider">Por Tamanho de Empresa</h2>
            <div className="space-y-3">
              {porEmpresa.length === 0 ? <p className="text-slate-500 text-sm">Sem dados</p> :
                porEmpresa.map(([label, qtd]) => (
                  <Barra key={label} label={label} valor={qtd} max={maxEmpresa} qtd={qtd} cor="bg-blue-500" />
                ))}
            </div>
          </div>
        </div>

        {/* Extras */}
        <SecaoExtras titulo="Maiores Desafios" dados={dados} campo="desafio" cor="bg-red-500" />
        <SecaoExtras titulo="Objetivos para os Próximos 12 Meses" dados={dados} campo="objetivo" cor="bg-emerald-500" />
        <SecaoExtras titulo="Principais Preocupações" dados={dados} campo="preocupacao" cor="bg-purple-500" />

        {/* Tabela */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-white font-bold">Todas as Respostas ({total})</h2>
          </div>
          {total === 0 ? (
            <div className="p-10 text-center text-slate-500">Nenhuma resposta ainda</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Nome','Cargo','Email','Telefone','Empresa','Pontos','Perfil','Origem','Data'].map(h => (
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
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{r.empresa_tamanho || '—'}</td>
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
