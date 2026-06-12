import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">

        {/* Logo / Branding */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl px-6 py-3 shadow-lg shadow-amber-500/30">
            <span className="text-slate-900 font-black text-2xl tracking-tight">LÍDER 10X</span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-1.5 rounded-full border border-amber-500/30">
            ⏱ 2 minutos · Gratuito
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Descubra em 2 minutos se você é{' '}
            <span className="text-amber-400">valorizado</span> e como resolver isso na sua empresa!
          </h1>
          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Identifique os gargalos invisíveis que estão reduzindo sua percepção de valor profissional e receba um plano de ação personalizado.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/quiz"
          className="inline-block w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xl px-10 py-5 rounded-xl transition-colors duration-200 shadow-lg shadow-amber-500/30 uppercase tracking-wide"
        >
          INICIAR →
        </Link>

        <p className="text-slate-500 text-xs">100% gratuito · Resultado imediato · Sem cadastro obrigatório</p>
      </div>
    </main>
  );
}
