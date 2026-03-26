export type Categoria = "cabelo" | "barba" | "combo" | "outros";

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao: number; // minutos
  categoria: Categoria;
  popular?: boolean;
}

export const servicos: Servico[] = [
  // Cabelo
  {
    id: "s1",
    nome: "Corte Tradicional",
    descricao: "Corte clássico com tesoura ou máquina, lavagem e finalização",
    preco: 45,
    duracao: 40,
    categoria: "cabelo",
    popular: true,
  },
  {
    id: "s2",
    nome: "Corte Degradê",
    descricao: "Degradê moderno com acabamento preciso e navalha",
    preco: 55,
    duracao: 45,
    categoria: "cabelo",
    popular: true,
  },
  {
    id: "s3",
    nome: "Corte na Máquina",
    descricao: "Corte simples e rápido com máquina",
    preco: 35,
    duracao: 25,
    categoria: "cabelo",
  },
  {
    id: "s4",
    nome: "Corte Infantil",
    descricao: "Corte para crianças até 10 anos",
    preco: 40,
    duracao: 30,
    categoria: "cabelo",
  },

  // Barba
  {
    id: "s5",
    nome: "Barba Completa",
    descricao:
      "Modelagem completa com navalha, toalha quente e produtos premium",
    preco: 40,
    duracao: 35,
    categoria: "barba",
    popular: true,
  },
  {
    id: "s6",
    nome: "Acabamento de Barba",
    descricao: "Acabamento e alinhamento rápido",
    preco: 25,
    duracao: 20,
    categoria: "barba",
  },
  {
    id: "s7",
    nome: "Bigode",
    descricao: "Modelagem e acabamento de bigode",
    preco: 20,
    duracao: 15,
    categoria: "barba",
  },
  {
    id: "s8",
    nome: "Sobrancelha",
    descricao: "Design e acabamento de sobrancelha masculina",
    preco: 20,
    duracao: 15,
    categoria: "barba",
  },

  // Combo
  {
    id: "s9",
    nome: "Combo Básico",
    descricao: "Corte Tradicional + Barba Completa",
    preco: 75,
    duracao: 70,
    categoria: "combo",
    popular: true,
  },
  {
    id: "s10",
    nome: "Combo Premium",
    descricao: "Corte Degradê + Barba Completa + Sobrancelha",
    preco: 95,
    duracao: 90,
    categoria: "combo",
    popular: true,
  },
  {
    id: "s11",
    nome: "Combo Full",
    descricao: "Corte + Barba + Sobrancelha + Hidratação capilar",
    preco: 115,
    duracao: 110,
    categoria: "combo",
  },

  // Outros
  {
    id: "s12",
    nome: "Hidratação Capilar",
    descricao: "Tratamento intensivo de hidratação com produtos profissionais",
    preco: 30,
    duracao: 30,
    categoria: "outros",
  },
  {
    id: "s13",
    nome: "Coloração",
    descricao: "Coloração e tingimento profissional",
    preco: 70,
    duracao: 60,
    categoria: "outros",
  },
  {
    id: "s14",
    nome: "Pigmentação",
    descricao: "Pigmentação para disfarçar falhas na barba",
    preco: 50,
    duracao: 45,
    categoria: "outros",
  },
];

export const categorias: { value: Categoria; label: string }[] = [
  { value: "cabelo", label: "Cabelo" },
  { value: "barba", label: "Barba" },
  { value: "combo", label: "Combos" },
  { value: "outros", label: "Outros" },
];
