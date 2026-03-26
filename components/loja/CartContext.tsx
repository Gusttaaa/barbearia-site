"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type Produto } from "@/lib/data/produtos";

interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (produto: Produto) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  total: number;
  count: number;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (produto: Produto) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.produto.id === produto.id);
      if (existing) {
        return prev.map((i) =>
          i.produto.id === produto.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.produto.id !== id));

  const increment = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.produto.id === id ? { ...i, quantidade: i.quantidade + 1 } : i))
    );

  const decrement = (id: string) =>
    setItems((prev) =>
      prev
        .map((i) => (i.produto.id === id ? { ...i, quantidade: i.quantidade - 1 } : i))
        .filter((i) => i.quantidade > 0)
    );

  const clear = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.produto.preco * i.quantidade, 0);
  const count = items.reduce((sum, i) => sum + i.quantidade, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, increment, decrement, total, count, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
