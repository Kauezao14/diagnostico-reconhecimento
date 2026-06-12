'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PERGUNTAS, OPCOES_PADRAO, OPCOES_POR_PERGUNTA, calcularResultado } from '@/lib/quiz';

const TAMANHOS_EMPRESA = ['Até 10 funcionários', '11 a 50 funcionários', '51 a 100 funcionários', 'Mais de 100 funcionários'];

const PERGUNTAS_EXTRAS = [
  {
    id: 'desafio',
    texto: 'Qual é o seu maior desafio profissional atualmente?',
    opcoes: [
      'Falta de reconhecimento pelo meu trabalho',
      'Falta de oportunidades de crescimento',
      'Dificuldade para liderar pessoas',
      'Excesso de trabalho e pressão',
      'Falta de apoio da liderança',
      'Dificuldade de comunicação e influência',
    ],
  },
  {
    id: 'objetivo',
    texto: 'Qual resultado você mais gostaria de conquistar nos próximos 12 meses?',
    opcoes: [
      'Ser promovido(a)',
      'Receber aumento salarial',
      'Assumir uma posição de liderança',
      'Ser reconhecido(a) dentro da empresa',
      'Melhorar meu desempenho profissional',
      'Ter mais equilíbrio entre vida e trabalho',
    ],
  },
  {
    id: 'preocupacao',
    texto: 'O que mais preocupa você em relação à sua carreira hoje?',
    opcoes: [
      'Ficar estagnado(a) no mesmo cargo',
      'Não ser valorizado(a) pelo que entrego',
      'Perder espaço para outros profissionais',
      'Não estar preparado(a) para novas oportunidades',
      'Ser desligado(a) da empresa',
      'Não alcançar meus objetivos profissionais',
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>(Array(15).fill(0));
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [empresaTamanho, setEmpresaTamanho] = useState('');
  const [cargo, setCargo] = useState('');
  const [etapa, setEtapa] = useState<'dados' | 'quiz' | 'extras'>('dados');
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<{ email?: string; telefone?: string }>({});
  const [extras, setExtras] = useState<Record<string, string[]>>({ desafio: [], objetivo: [], preocupacao: [] });

  function formatarTelefone(valor: string) {
    const digits = valor.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  function validarEmail(valor: string) {
    if (!valor) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  }

  function validarTelefone(valor: string) {
    if (!valor) return true;
    const digits = valor.replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11;
  }

  function avancarParaQuiz() {
    const novosErros: { email?: string; telefone?: string } = {};
    if (email && !validarEmail(email)) novosErros.email = 'Digite um e-mail válido (ex: nome@gmail.com)';
    if (telefone && !validarTelefone(telefone)) novosErros.telefone = 'Digite um número completo com DDD (ex: (11) 99999-9999)';
    if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }
    setErros({});
    setEtapa('quiz');
  }

  function toggleExtra(id: string, opcao: string) {
    setExtras((prev) => {
      const atual = prev[id] ?? [];
      return { ...prev, [id]: atual.includes(opcao) ? atual.filter((o) => o !== opcao) : [...atual, opcao] };
    });
  }

  function selecionarResposta(valor: number) {
    const novas = [...respostas];
    novas[atual] = valor;
    setRespostas(novas);
    if (atual < 14) setTimeout(() => setAtual(atual + 1), 300);
  }

  async function finalizar() {
    setEnviando(true);
    const resultado = calcularResultado(respostas);
    sessionStorage.setItem('resultado', JSON.stringify(resultado));
    router.push('/resultado');

    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, telefone, cargo, empresaTamanho, respostas, extras }),
    }).catch(() => {});
  }

  // ── ETAPA: DADOS ──
  if (etapa === 'dados') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Antes de começar</h2>
            <p className="text-slate-400">Preencha para receber seu resultado personalizado</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10 space-y-4">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Seu nome <span className="text-red-400">*</span></label>
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
                onChange={(e) => { setEmail(e.target.value); setErros((p) => ({ ...p, email: undefined })); }}
                placeholder="nome@gmail.com"
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors ${erros.email ? 'border-red-500' : 'border-white/20 focus:border-amber-500'}`}
              />
              {erros.email && <p className="text-red-400 text-xs mt-1">{erros.email}</p>}
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Seu WhatsApp <span className="text-slate-500">(opcional)</span></label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => { setTelefone(formatarTelefone(e.target.value)); setErros((p) => ({ ...p, telefone: undefined })); }}
                placeholder="(11) 99999-9999"
                className={`w-full bg-white/10 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors ${erros.telefone ? 'border-red-500' : 'border-white/20 focus:border-amber-500'}`}
              />
              {erros.telefone && <p className="text-red-400 text-xs mt-1">{erros.telefone}</p>}
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Função <span className="text-slate-500">(opcional)</span></label>
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full bg-slate-800 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="">Selecione sua função</option>
                <option value="Diretor / Gerente">Diretor / Gerente</option>
                <option value="Supervisor / Coordenador">Supervisor / Coordenador</option>
                <option value="Líder / Encarregado">Líder / Encarregado</option>
                <option value="Funcionário">Funcionário</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2">Quantos funcionários tem em sua empresa? <span className="text-slate-500">(opcional)</span></label>
              <div className="grid grid-cols-2 gap-2">
                {TAMANHOS_EMPRESA.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEmpresaTamanho(t === empresaTamanho ? '' : t)}
                    className={`px-3 py-2.5 rounded-lg border text-sm transition-all ${
                      empresaTamanho === t
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-500/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={avancarParaQuiz}
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

  // ── ETAPA: PERGUNTAS EXTRAS (múltipla escolha) ──
  if (etapa === 'extras') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Quase lá!</h2>
            <p className="text-slate-400">Mais 3 perguntas rápidas para personalizar ainda mais seu diagnóstico</p>
          </div>

          {PERGUNTAS_EXTRAS.map((perg) => (
            <div key={perg.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
              <h3 className="text-white font-semibold text-base leading-snug">{perg.texto}</h3>
              <p className="text-slate-500 text-xs">Pode selecionar mais de uma opção</p>
              <div className="space-y-2">
                {perg.opcoes.map((opcao) => {
                  const selecionado = extras[perg.id]?.includes(opcao);
                  return (
                    <button
                      key={opcao}
                      onClick={() => toggleExtra(perg.id, opcao)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                        selecionado
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-500/40 hover:bg-white/10'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center text-xs ${selecionado ? 'bg-amber-500 border-amber-500 text-slate-900' : 'border-white/30'}`}>
                        {selecionado && '✓'}
                      </span>
                      <span className="text-sm">{opcao}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <button
            onClick={finalizar}
            disabled={enviando}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-900 font-bold py-4 rounded-xl transition-colors text-lg"
          >
            {enviando ? 'Gerando seu relatório...' : 'Ver meu resultado →'}
          </button>
        </div>
      </main>
    );
  }

  // ── ETAPA: QUIZ ──
  const pergunta = PERGUNTAS[atual];
  const opcoes = OPCOES_POR_PERGUNTA[pergunta?.id] ?? OPCOES_PADRAO;
  const progresso = Math.round((atual / 15) * 100);
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
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${progresso}%` }} />
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
              onClick={() => todasRespondidas && setEtapa('extras')}
              disabled={!todasRespondidas}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-900 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Continuar →
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
