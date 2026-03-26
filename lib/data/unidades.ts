export interface Unidade {
  id: string;
  nome: string;
  bairro: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  horarios: {
    semana: string;
    sabado: string;
    domingo: string;
  };
  instagram: string;
  mapUrl: string;
  foto: string;
}

export const unidades: Unidade[] = [
  {
    id: "recreio",
    nome: "Recreio",
    bairro: "Recreio dos Bandeirantes",
    endereco: "Av. das Américas, 18.000 — Recreio dos Bandeirantes, RJ",
    telefone: "(21) 9 9999-0001",
    whatsapp: "5521999990001",
    horarios: {
      semana: "Seg–Sex: 9h às 20h",
      sabado: "Sáb: 9h às 18h",
      domingo: "Dom: Fechado",
    },
    instagram: "https://instagram.com/barbearia.de.primeira",
    mapUrl: "https://maps.google.com/?q=Recreio+dos+Bandeirantes+Rio+de+Janeiro",
    foto: "https://placehold.co/600x400/272727/3aab4a?text=Unidade+Recreio",
  },
  {
    id: "barra",
    nome: "Barra",
    bairro: "Barra da Tijuca",
    endereco: "Av. das Américas, 7.700 — Barra da Tijuca, RJ",
    telefone: "(21) 9 9999-0002",
    whatsapp: "5521999990002",
    horarios: {
      semana: "Seg–Sex: 9h às 20h",
      sabado: "Sáb: 9h às 18h",
      domingo: "Dom: Fechado",
    },
    instagram: "https://instagram.com/barbearia.de.primeira",
    mapUrl: "https://maps.google.com/?q=Barra+da+Tijuca+Rio+de+Janeiro",
    foto: "https://placehold.co/600x400/272727/3aab4a?text=Unidade+Barra",
  },
  {
    id: "guanabara",
    nome: "Guanabara",
    bairro: "Guanabara",
    endereco: "Rua Paracatu, 100 — Guanabara, RJ",
    telefone: "(21) 9 9999-0003",
    whatsapp: "5521999990003",
    horarios: {
      semana: "Seg–Sex: 9h às 20h",
      sabado: "Sáb: 9h às 18h",
      domingo: "Dom: Fechado",
    },
    instagram: "https://instagram.com/barbearia.de.primeira",
    mapUrl: "https://maps.google.com/?q=Guanabara+Rio+de+Janeiro",
    foto: "https://placehold.co/600x400/272727/3aab4a?text=Unidade+Guanabara",
  },
];
