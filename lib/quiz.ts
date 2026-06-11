export const PERGUNTAS = [
  { id: 1, texto: 'Com que frequência seu gestor reconhece suas entregas?', dimensao: 'relacionamento' },
  { id: 2, texto: 'Quando surge um projeto importante, seu nome costuma ser lembrado?', dimensao: 'visibilidade' },
  { id: 3, texto: 'Você comunica seus resultados de forma clara para liderança?', dimensao: 'valor' },
  { id: 4, texto: 'Quantas pessoas influentes conhecem seu trabalho?', dimensao: 'visibilidade' },
  { id: 5, texto: 'Você recebe convites para participar de iniciativas estratégicas?', dimensao: 'visibilidade' },
  { id: 6, texto: 'Seu trabalho gera resultados mensuráveis?', dimensao: 'valor' },
  { id: 7, texto: 'Você sabe explicar claramente o valor que gera para a empresa?', dimensao: 'valor' },
  { id: 8, texto: 'Seus colegas costumam pedir sua opinião ou ajuda?', dimensao: 'influencia' },
  { id: 9, texto: 'Você recebe feedback positivo regularmente?', dimensao: 'relacionamento' },
  { id: 10, texto: 'Você costuma assumir iniciativas sem ser solicitado?', dimensao: 'influencia' },
  { id: 11, texto: 'Sua liderança conhece seus objetivos de carreira?', dimensao: 'relacionamento' },
  { id: 12, texto: 'Você participa ativamente de reuniões e discussões?', dimensao: 'visibilidade' },
  { id: 13, texto: 'Você consegue demonstrar impacto financeiro ou operacional das suas entregas?', dimensao: 'valor' },
  { id: 14, texto: 'Seu nome é associado a alguma competência específica?', dimensao: 'valor' },
  { id: 15, texto: 'Se seu gestor fosse promovido hoje, ele recomendaria você para assumir mais responsabilidades?', dimensao: 'influencia' },
];

export const OPCOES_PADRAO = [
  { label: 'Nunca', valor: 1 },
  { label: 'Raramente', valor: 2 },
  { label: 'Às vezes', valor: 3 },
  { label: 'Frequentemente', valor: 4 },
  { label: 'Sempre', valor: 5 },
];

export const OPCOES_POR_PERGUNTA: Record<number, { label: string; valor: number }[]> = {
  4: [
    { label: 'Nenhuma', valor: 1 },
    { label: 'Poucas', valor: 2 },
    { label: 'Algumas', valor: 3 },
    { label: 'Muitas', valor: 4 },
    { label: 'Grande parte', valor: 5 },
  ],
  6: [
    { label: 'Nunca', valor: 1 },
    { label: 'Pouco', valor: 2 },
    { label: 'Moderadamente', valor: 3 },
    { label: 'Frequentemente', valor: 4 },
    { label: 'Sempre', valor: 5 },
  ],
  7: [
    { label: 'Nunca', valor: 1 },
    { label: 'Pouco', valor: 2 },
    { label: 'Mais ou menos', valor: 3 },
    { label: 'Bem', valor: 4 },
    { label: 'Muito bem', valor: 5 },
  ],
  11: [
    { label: 'Não conhece', valor: 1 },
    { label: 'Conhece pouco', valor: 2 },
    { label: 'Parcialmente', valor: 3 },
    { label: 'Conhece bem', valor: 4 },
    { label: 'Conhece claramente', valor: 5 },
  ],
  15: [
    { label: 'Não', valor: 1 },
    { label: 'Pouco provável', valor: 2 },
    { label: 'Talvez', valor: 3 },
    { label: 'Provável', valor: 4 },
    { label: 'Muito provável', valor: 5 },
  ],
};

export type Perfil = 'invisivel' | 'executor' | 'reconhecido' | 'referencia';

export interface ResultadoQuiz {
  pontuacao: number;
  perfil: Perfil;
  titulo: string;
  diagnostico: string;
  visibilidade: number;
  valor: number;
  influencia: number;
  relacionamento: number;
  planosDeAcao: string[];
}

export function calcularResultado(respostas: number[]): ResultadoQuiz {
  const pontuacao = respostas.reduce((a, b) => a + b, 0);

  // Pontuações por dimensão (média 0-5)
  const visibilidade = Math.round(([respostas[1], respostas[3], respostas[4], respostas[11]].reduce((a, b) => a + b, 0) / 4) * 20);
  const valor = Math.round(([respostas[5], respostas[6], respostas[12], respostas[13]].reduce((a, b) => a + b, 0) / 4) * 20);
  const influencia = Math.round(([respostas[7], respostas[9], respostas[14]].reduce((a, b) => a + b, 0) / 3) * 20);
  const relacionamento = Math.round(([respostas[0], respostas[8], respostas[10]].reduce((a, b) => a + b, 0) / 3) * 20);

  let perfil: Perfil;
  let titulo: string;
  let diagnostico: string;

  if (pontuacao <= 30) {
    perfil = 'invisivel';
    titulo = 'Invisível Corporativo';
    diagnostico = 'Você entrega mais valor do que o mercado interno percebe. Seu principal problema é visibilidade.';
  } else if (pontuacao <= 45) {
    perfil = 'executor';
    titulo = 'Executor Silencioso';
    diagnostico = 'Você produz resultados, mas ainda não construiu uma reputação forte dentro da empresa.';
  } else if (pontuacao <= 60) {
    perfil = 'reconhecido';
    titulo = 'Profissional Reconhecido';
    diagnostico = 'Você já possui boa percepção de valor, mas ainda pode ampliar influência e oportunidades.';
  } else {
    perfil = 'referencia';
    titulo = 'Referência Interna';
    diagnostico = 'Seu trabalho é reconhecido e você é visto como alguém de confiança e potencial crescimento.';
  }

  const planosDeAcao: string[] = [];
  if (visibilidade < 60) planosDeAcao.push('Aumentar exposição em projetos, reuniões e apresentações.');
  if (valor < 60) planosDeAcao.push('Aprender a comunicar resultados com indicadores mensuráveis.');
  if (influencia < 60) planosDeAcao.push('Desenvolver iniciativa, colaboração e protagonismo.');
  if (relacionamento < 60) planosDeAcao.push('Aumentar conversas de carreira e alinhamento com gestores.');

  return { pontuacao, perfil, titulo, diagnostico, visibilidade, valor, influencia, relacionamento, planosDeAcao };
}
