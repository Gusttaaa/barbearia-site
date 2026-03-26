export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  unidadeId: string;
  foto: string;
  rating: number;
  cortesRealizados: number;
}

export const profissionais: Profissional[] = [
  // Recreio
  {
    id: "p1",
    nome: "Carlos Silva",
    especialidade: "Degradê & Navalhado",
    unidadeId: "recreio",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=CS",
    rating: 4.9,
    cortesRealizados: 1240,
  },
  {
    id: "p2",
    nome: "Rodrigo Lima",
    especialidade: "Barba & Estilo",
    unidadeId: "recreio",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=RL",
    rating: 4.8,
    cortesRealizados: 980,
  },
  {
    id: "p3",
    nome: "Felipe Souza",
    especialidade: "Corte Clássico",
    unidadeId: "recreio",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=FS",
    rating: 4.7,
    cortesRealizados: 760,
  },

  // Barra
  {
    id: "p4",
    nome: "Anderson Costa",
    especialidade: "Skin Fade",
    unidadeId: "barra",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=AC",
    rating: 4.9,
    cortesRealizados: 1100,
  },
  {
    id: "p5",
    nome: "Lucas Ferreira",
    especialidade: "Barba Premium",
    unidadeId: "barra",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=LF",
    rating: 4.8,
    cortesRealizados: 870,
  },
  {
    id: "p6",
    nome: "Diego Alves",
    especialidade: "Corte Moderno",
    unidadeId: "barra",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=DA",
    rating: 4.7,
    cortesRealizados: 620,
  },

  // Guanabara
  {
    id: "p7",
    nome: "Marcos Oliveira",
    especialidade: "Degradê & Coloração",
    unidadeId: "guanabara",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=MO",
    rating: 4.9,
    cortesRealizados: 1350,
  },
  {
    id: "p8",
    nome: "Bruno Santos",
    especialidade: "Corte & Barba",
    unidadeId: "guanabara",
    foto: "https://placehold.co/200x200/1e1e1e/3aab4a?text=BS",
    rating: 4.8,
    cortesRealizados: 890,
  },
];
