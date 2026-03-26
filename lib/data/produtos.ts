export type CategoriaProduto = "pomada" | "shampoo" | "barba" | "acessorios";

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaProduto;
  imagem: string;
  destaque?: boolean;
  estoque: number;
}

export const produtos: Produto[] = [
  {
    id: "prod1",
    nome: "Pomada Modeladora Strong",
    descricao:
      "Fixação forte com acabamento opaco. Ideal para degradê e penteados modernos.",
    preco: 45,
    categoria: "pomada",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Pomada+Strong",
    destaque: true,
    estoque: 50,
  },
  {
    id: "prod2",
    nome: "Pomada Aquosa Shine",
    descricao: "Fixação média com brilho intenso. Efeito molhado e durável.",
    preco: 42,
    categoria: "pomada",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Pomada+Aquosa",
    estoque: 35,
  },
  {
    id: "prod3",
    nome: "Clay Matte",
    descricao: "Pasta de argila para texturização e fixação matte ultra.",
    preco: 48,
    categoria: "pomada",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Clay+Matte",
    estoque: 28,
  },
  {
    id: "prod4",
    nome: "Shampoo Anti-Queda",
    descricao: "Shampoo especializado para fortalecer e nutrir os fios.",
    preco: 38,
    categoria: "shampoo",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Shampoo",
    destaque: true,
    estoque: 60,
  },
  {
    id: "prod5",
    nome: "Condicionador Hidratante",
    descricao:
      "Condicionador de uso profissional para cabelos secos e danificados.",
    preco: 35,
    categoria: "shampoo",
    imagem:
      "https://placehold.co/400x400/1e1e1e/3aab4a?text=Condicionador",
    estoque: 45,
  },
  {
    id: "prod6",
    nome: "Óleo de Barba Premium",
    descricao:
      "Blend exclusivo de óleos naturais para hidratação e brilho da barba.",
    preco: 55,
    categoria: "barba",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Oleo+Barba",
    destaque: true,
    estoque: 40,
  },
  {
    id: "prod7",
    nome: "Balm Pós-Barba",
    descricao:
      "Hidratante calmante para uso após barbeamento. Anti-irritação.",
    preco: 40,
    categoria: "barba",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Balm+Barba",
    estoque: 30,
  },
  {
    id: "prod8",
    nome: "Kit Barba Completo",
    descricao:
      "Óleo de barba + Balm + Pente exclusivo Barbearia de Primeira.",
    preco: 120,
    categoria: "barba",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Kit+Barba",
    destaque: true,
    estoque: 20,
  },
  {
    id: "prod9",
    nome: "Pente de Madeira",
    descricao: "Pente artesanal de madeira de bambu. Resistente e sustentável.",
    preco: 30,
    categoria: "acessorios",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Pente",
    estoque: 25,
  },
  {
    id: "prod10",
    nome: "Toalha Premium",
    descricao: "Toalha de algodão premium com logo bordado.",
    preco: 65,
    categoria: "acessorios",
    imagem: "https://placehold.co/400x400/1e1e1e/3aab4a?text=Toalha",
    estoque: 15,
  },
];

export const categoriasProduto: { value: CategoriaProduto; label: string }[] = [
  { value: "pomada", label: "Pomadas" },
  { value: "shampoo", label: "Shampoos" },
  { value: "barba", label: "Barba" },
  { value: "acessorios", label: "Acessórios" },
];
