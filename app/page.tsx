import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-amber-500/30">
            ⏱ 5 a 8 minutos
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Diagnóstico de<br />
            <span className="text-amber-400">Reconhecimento Profissional</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Descubra em poucos minutos quais fatores estão impedindo você de ser mais valorizado, lembrado e reconhecido no trabalho.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { num: '15', label: 'Perguntas' },
            { num: '4', label: 'Dimensões' },
            { num: '4', label: 'Perfis' },
          ].map(({ num, label }) => (
            <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-amber-400">{num}</div>
              <div className="text-sm text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-left space-y-3">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Você vai descobrir</p>
          {[
            'Seu perfil de reconhecimento dentro da empresa',
            'As dimensões que estão travando seu crescimento',
            'Os 3 fatores que estão limitando seu crescimento',
            'Um plano de ação personalizado para virar o jogo',
          ].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="text-amber-400 mt-0.5">✓</span>
              <span className="text-slate-300 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <Link
          href="/quiz"
          className="inline-block w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg px-10 py-4 rounded-xl transition-colors duration-200 shadow-lg shadow-amber-500/25"
        >
          Iniciar Diagnóstico Gratuito →
        </Link>

        <p className="text-slate-500 text-xs">100% gratuito · Resultado imediato · Sem cadastro obrigatório</p>
      </div>
    </main>
  );
}
