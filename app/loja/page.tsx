"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import CartDrawer from "@/components/loja/CartDrawer";
import { CartProvider, useCart } from "@/components/loja/CartContext";
import { produtos, categoriasProduto, type CategoriaProduto } from "@/lib/data/produtos";
import { toast } from "sonner";

function ProdutoCard({ produto }: { produto: (typeof produtos)[number] }) {
  const { add } = useCart();
  const handleAdd = () => {
    add(produto);
    toast.success(`${produto.nome} adicionado ao carrinho`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-[#272727] rounded-sm ring-1 ring-white/5 overflow-hidden hover:ring-[#3aab4a]/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-[#3aab4a]/8 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {produto.destaque && (
          <div className="absolute top-3 left-3 bg-[#3aab4a] text-[#111111] text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-sm">
            Destaque
          </div>
        )}
        {produto.estoque < 10 && (
          <div className="absolute top-3 right-3 bg-[#111111]/80 text-[#f5f0eb] text-[10px] font-medium px-2 py-0.5 rounded-sm">
            Últimas {produto.estoque} unidades
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] tracking-widest uppercase text-[#3aab4a] mb-1 font-medium">
          {categoriasProduto.find((c) => c.value === produto.categoria)?.label}
        </p>
        <h3 className="font-medium text-[#f5f0eb] text-sm mb-1 line-clamp-1 group-hover:text-[#3aab4a] transition-colors duration-200">
          {produto.nome}
        </h3>
        <p className="text-[#a8a8a8] text-xs leading-relaxed mb-4 line-clamp-2">
          {produto.descricao}
        </p>

        <div className="flex items-center justify-between">
          <p className="font-display text-2xl text-[#3aab4a]">R$ {produto.preco}</p>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#3aab4a] text-[#111111] text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#4ec55e] active:bg-[#2d8c3a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a]"
          >
            <ShoppingBag size={12} />
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function LojaContent() {
  const [filtro, setFiltro] = useState<CategoriaProduto | "todos">("todos");
  const { count } = useCart();

  const filtrados =
    filtro === "todos" ? produtos : produtos.filter((p) => p.categoria === filtro);

  return (
    <div className="min-h-screen bg-[#0c0c0c]">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3aab4a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-px bg-[#3aab4a]" />
              <span className="text-xs font-medium tracking-[0.25em] uppercase text-[#3aab4a]">
                Produtos oficiais
              </span>
            </div>
            <h1 className="font-display text-[clamp(40px,6vw,80px)] text-[#f5f0eb] leading-[0.9] tracking-tight">
              NOSSA
            </h1>
            <h1 className="font-display text-[clamp(40px,6vw,80px)] text-[#3aab4a] leading-[0.9] tracking-tight">
              LOJA
            </h1>
          </div>

          {/* Cart */}
          <Sheet>
            <CartDrawer />
          </Sheet>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-medium rounded-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] ${
              filtro === "todos"
                ? "bg-[#3aab4a] text-[#111111] ring-[#3aab4a]"
                : "bg-[#272727] text-[#a8a8a8] ring-white/5 hover:ring-[#3aab4a]/30 hover:text-[#f5f0eb]"
            }`}
          >
            Todos ({produtos.length})
          </button>
          {categoriasProduto.map((cat) => {
            const count = produtos.filter((p) => p.categoria === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setFiltro(cat.value)}
                className={`px-4 py-2 text-xs tracking-widest uppercase font-medium rounded-sm ring-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] ${
                  filtro === cat.value
                    ? "bg-[#3aab4a] text-[#111111] ring-[#3aab4a]"
                    : "bg-[#272727] text-[#a8a8a8] ring-white/5 hover:ring-[#3aab4a]/30 hover:text-[#f5f0eb]"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtrados.map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
        </div>

        {filtrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#a8a8a8]">Nenhum produto encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LojaPage() {
  return (
    <CartProvider>
      <LojaContent />
    </CartProvider>
  );
}
