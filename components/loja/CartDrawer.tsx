"use client";

import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "./CartContext";
import { toast } from "sonner";

export function CartButton() {
  const { count } = useCart();
  return (
    <SheetTrigger
      className="relative p-2 text-[#f5f0eb] hover:text-[#3aab4a] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] rounded-sm bg-transparent border-0 cursor-pointer"
      aria-label="Abrir carrinho"
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#3aab4a] text-[#111111] text-[10px] font-bold rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </SheetTrigger>
  );
}

export default function CartDrawer() {
  const { items, remove, increment, decrement, total, clear, count } = useCart();

  const handleCheckout = () => {
    clear();
    toast.success("Pedido realizado!", {
      description: "Em breve você receberá a confirmação via WhatsApp.",
    });
  };

  return (
    <Sheet>
      <CartButton />
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-[#1a1a1a] border-l border-white/5 flex flex-col"
      >
        <SheetHeader className="border-b border-white/5 pb-4">
          <SheetTitle className="font-display text-xl tracking-wider text-[#f5f0eb] flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#3aab4a]" />
            CARRINHO
            {count > 0 && (
              <span className="text-sm font-sans text-[#a8a8a8] font-normal ml-1">
                ({count} {count === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#272727] flex items-center justify-center">
              <ShoppingBag size={24} className="text-[#a8a8a8]" />
            </div>
            <div>
              <p className="font-display text-xl text-[#f5f0eb] tracking-wide mb-1">
                CARRINHO VAZIO
              </p>
              <p className="text-[#a8a8a8] text-sm">
                Adicione produtos para continuar
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-3 p-2">
              {items.map(({ produto, quantidade }) => (
                <div
                  key={produto.id}
                  className="flex items-start gap-3 bg-[#272727] rounded-sm p-3 ring-1 ring-white/5"
                >
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-14 h-14 object-cover rounded-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#f5f0eb] text-sm font-medium leading-tight mb-1 line-clamp-2">
                      {produto.nome}
                    </p>
                    <p className="font-display text-lg text-[#3aab4a] leading-none">
                      R$ {produto.preco}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => remove(produto.id)}
                      className="text-[#a8a8a8] hover:text-red-400 transition-colors duration-200"
                      aria-label="Remover"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => decrement(produto.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-sm bg-[#313131] text-[#f5f0eb] hover:bg-[#3aab4a] hover:text-[#111111] transition-all duration-200"
                        aria-label="Diminuir"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-[#f5f0eb]">
                        {quantidade}
                      </span>
                      <button
                        onClick={() => increment(produto.id)}
                        className="w-6 h-6 flex items-center justify-center rounded-sm bg-[#313131] text-[#f5f0eb] hover:bg-[#3aab4a] hover:text-[#111111] transition-all duration-200"
                        aria-label="Aumentar"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-3 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[#a8a8a8] text-sm">Subtotal</span>
                <span className="font-display text-2xl text-[#f5f0eb]">
                  R$ {total}
                </span>
              </div>
              <p className="text-xs text-[#a8a8a8]">
                Frete calculado no checkout. Retirada grátis em qualquer unidade.
              </p>
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#3aab4a] text-[#111111] font-semibold tracking-widest uppercase text-sm rounded-sm hover:bg-[#4ec55e] active:bg-[#2d8c3a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3aab4a] shadow-[0_0_20px_rgba(58,171,74,0.2)]"
              >
                Finalizar Pedido
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
