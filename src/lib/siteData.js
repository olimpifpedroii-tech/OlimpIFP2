// Static mock data for the OlimpIFP2 site frontend.
// Replace these arrays with real API calls when wiring the backend.

export const NAV_LINKS = [
  { label: "Início", path: "/" },
  { label: "O Projeto", path: "/projeto" },
  { label: "O Lugar", path: "/lugar" },
  { label: "Olimpíadas", path: "/olimpiadas" },
  { label: "Conquistas", path: "/conquistas" },
  { label: "Galeria", path: "/galeria" },
  { label: "Notícias", path: "/noticias" },
  { label: "Contato", path: "/contato" },
];



export const PILLARS = [
  { icon: "Award", title: "Excelência", text: "Buscamos sempre nos superar." },
  { icon: "Lightbulb", title: "Inovação", text: "Estimulamos ideias e soluções criativas." },
  { icon: "Handshake", title: "Colaboração", text: "Acreditamos na força do trabalho em equipe." },
  { icon: "ShieldCheck", title: "Ética", text: "Agimos com respeito, responsabilidade e integridade." },
  { icon: "Rocket", title: "Impacto", text: "Transformamos vidas e construímos o futuro." },
];

export const FEATURE_BAR = [
  { icon: "Users", text: "Estudo em equipe" },
  { icon: "Lightbulb", text: "Curiosidade que move o conhecimento" },
  { icon: "Target", text: "Foco nos objetivos" },
  { icon: "TrendingUp", text: "Excelência que constrói o futuro" },
];

export const OLYMPIAD_AREAS = [
  "Todas", "Matemática", "Ciências da Natureza", "Tecnologia", "Linguagens", "Humanas", "Empreendedorismo", "Interdisciplinares",
];

export const OLYMPIADS = [
  { name: "OBMEP", area: "Matemática", level: "Do 6º ano ao 3º EM", desc: "Olimpíada Brasileira de Matemática das Escolas Públicas.", medal: "Ouro" },
  { name: "OBI", area: "Tecnologia", level: "Ensino Médio", desc: "Olimpíada Brasileira de Informática.", medal: "Prata" },
  { name: "OBM", area: "Matemática", level: "Ensino Médio", desc: "Olimpíada Brasileira de Matemática.", medal: "Ouro" },
  { name: "ONC", area: "Ciências da Natureza", level: "Do 8º ano ao 3º EM", desc: "Olimpíada Nacional de Ciências.", medal: "Bronze" },
  { name: "OBQ", area: "Ciências da Natureza", level: "Ensino Médio", desc: "Olimpíada Brasileira de Química.", medal: "Prata" },
  { name: "OBF", area: "Ciências da Natureza", level: "Ensino Médio", desc: "Olimpíada Brasileira de Física.", medal: "Ouro" },
  { name: "OBB", area: "Ciências da Natureza", level: "Ensino Médio", desc: "Olimpíada Brasileira de Biologia.", medal: "Bronze" },
  { name: "OBNE", area: "Empreendedorismo", level: "Ensino Médio", desc: "Olimpíada Brasileira de Negócios e Empreendedorismo.", medal: "Ouro" },
  { name: "OPL", area: "Linguagens", level: "Do 6º ao 9º ano", desc: "Olimpíada de Língua Portuguesa.", medal: "Prata" },
  { name: "OBH", area: "Humanas", level: "Ensino Médio", desc: "Olimpíada Brasileira de História.", medal: "Honra" },
  { name: "OBA", area: "Ciências da Natureza", level: "Do 6º ano ao 3º EM", desc: "Olimpíada Brasileira de Astronomia e Astronáutica.", medal: "Bronze" },
  { name: "OBI Jr", area: "Tecnologia", level: "Do 6º ao 9º ano", desc: "Modalidade de iniciantes da OBI.", medal: "Prata" },
];



export const NEWS = [
  { id: 1, date: "12 MAI 2025", category: "Premiações", title: "Estudantes do IFPI Campus Pedro II conquistam 18 medalhas na OBMEP 2024", summary: "Resultado histórico para o campus com 6 ouros, 7 pratas, 5 bronzes e menções honrosas.", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f3?w=600&h=400&fit=crop", views: 1240, readTime: "4 min" },
  { id: 2, date: "05 MAI 2025", category: "Olimpíadas", title: "Inscrições abertas para a OBI 2025", summary: "Participe da Olimpíada Brasileira de Informática e desafie seus limites! Inscrições até 30 de junho.", image: "https://images.unsplash.com/photo-1526374965328-7f61d4c18cb0?w=600&h=400&fit=crop", views: 890, readTime: "3 min" },
  { id: 3, date: "28 ABR 2025", category: "Projeto", title: "OlimpIFP2 realiza cerimônia de entrega de medalhas", summary: "Estudantes foram homenageados em evento que celebrou as conquistas do ano.", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop", views: 1560, readTime: "5 min" },
  { id: 4, date: "15 ABR 2025", category: "Eventos", title: "Aulão preparatório para a OBMEP reúne mais de 100 estudantes", summary: "Encontro marcou o início da temporada de olimpíadas do conhecimento.", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=400&fit=crop", views: 720, readTime: "3 min" },
  { id: 5, date: "02 ABR 2025", category: "Institucional", title: "Campus Pedro II firma parceria com projeto de extensão", summary: "Iniciativa amplia o apoio aos estudantes participantes das olimpíadas.", image: "https://images.unsplash.com/photo-1517245386807-bb43f82fee33?w=600&h=400&fit=crop", views: 540, readTime: "2 min" },
  { id: 6, date: "20 MAR 2025", category: "Premiações", title: "Estudante do campus é destaque nacional na OBM", summary: "Aluno do 3º ano conquista medalha de ouro em competição nacional.", image: "https://images.unsplash.com/photo-1606761568499-6d2451b23ee9?w=600&h=400&fit=crop", views: 2100, readTime: "4 min" },
];

export const GALLERY_ALBUMS = [
  { id: 1, date: "07 JUN 2026", title: "Aplicação da OBMEP 2026", category: "Aplicações", photos: 122, image: "https://images.unsplash.com/photo-1503676267111-225ef20ad4f0?w=500&h=350&fit=crop" },
  { id: 2, date: "22 MAI 2026", title: "Cerimônia de Premiação 2025", category: "Premiações", photos: 89, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=350&fit=crop" },
  { id: 3, date: "10 MAI 2026", title: "Aulão de Preparação OBMEP", category: "Aulas e Oficinas", photos: 64, image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=350&fit=crop" },
  { id: 4, date: "28 ABR 2026", title: "Palestra: Carreiras em Tecnologia", category: "Palestras", photos: 47, image: "https://images.unsplash.com/photo-1475721027785-f74eccf877d2?w=500&h=350&fit=crop" },
  { id: 5, date: "15 ABR 2026", title: "Visita Técnica ao Parque Nacional", category: "Visitas e Passeios", photos: 73, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&h=350&fit=crop" },
  { id: 6, date: "03 ABR 2026", title: "Reunião da Equipe Olímpica", category: "Equipe e Reuniões", photos: 38, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=350&fit=crop" },
  { id: 7, date: "18 MAR 2026", title: "Bastidores da Aplicação OBI", category: "Bastidores", photos: 52, image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500&h=350&fit=crop" },
  { id: 8, date: "05 MAR 2026", title: "Oficina de Lógica de Programação", category: "Aulas e Oficinas", photos: 41, image: "https://images.unsplash.com/photo-1531482615723-e294e3a8c5c9?w=500&h=350&fit=crop" },
];

export const GALLERY_CATEGORIES = [
  "Todos", "Premiações", "Aplicações", "Aulas e Oficinas", "Palestras", "Visitas e Passeios", "Equipe e Reuniões", "Bastidores",
];



export const MEDAL_TYPES = ["Todas", "Ouro", "Prata", "Bronze", "Honra ao Mérito", "Menção Honrosa"];