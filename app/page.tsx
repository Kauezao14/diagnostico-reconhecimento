import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d1117] flex flex-col items-center">

      {/* Hero com imagem e overlay */}
      <div className="relative w-full max-w-2xl">
        <Image
          src="/lucas-pensando.jpg"
          alt="Lucas"
          width={800}
          height={600}
          className="w-full object-cover h-[55vh] sm:h-[60vh]"
          priority
        />
        {/* Gradient overlay — começa no último quarto */}
        <div className="absolute inset-0" style={{background: 'linear-gradient(to top, #0d1117 0%, #0d1117 8%, rgba(13,17,23,0.85) 18%, rgba(13,17,23,0) 38%)'}} />

        {/* Badge no topo */}
        <div className="absolute top-5 left-0 right-0 flex justify-center">
          <span className="bg-amber-500 text-slate-900 font-black text-sm px-5 py-2 rounded-full shadow-lg shadow-amber-500/40 uppercase tracking-widest">
            DIAGNÓSTICO DE RECONHECIMENTO
          </span>
        </div>
      </div>

      {/* Conteúdo abaixo */}
      <div className="w-full max-w-2xl px-5 pb-12 -mt-2 space-y-7 text-center">

        {/* Pill */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 text-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Gratuito · Resultado em 2 minutos
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight">
            Descubra se você é{' '}
            <span className="text-amber-400 relative">
              valorizado
            </span>
            {' '}e como mudar isso agora!
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Identifique os gargalos invisíveis que estão reduzindo sua percepção de valor e receba um plano de ação personalizado.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/quiz"
            className="group flex items-center justify-center gap-3 w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-900 font-black text-xl py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-amber-500/30 uppercase tracking-wide"
          >
            Iniciar diagnóstico
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </Link>
          <p className="text-slate-600 text-xs">Sem cadastro. Resultado imediato.</p>
        </div>

        {/* Mini social proof */}
        <div className="flex justify-center gap-6 pt-2">
          {[
            { valor: '15', desc: 'Perguntas' },
            { valor: '4', desc: 'Dimensões' },
            { valor: '2min', desc: 'Duração' },
          ].map(({ valor, desc }) => (
            <div key={desc} className="text-center">
              <div className="text-amber-400 font-black text-xl">{valor}</div>
              <div className="text-slate-500 text-xs">{desc}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
