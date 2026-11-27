import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  BaseCuadrilla,
  OpcionesSeleccionadas,
  ProductoCarta,
  SaborCroqueta,
  calcularPrecioUnitario,
  getProductoById,
} from '../data/carta';

export interface CartItem {
  key: string;
  productoId: string;
  nombre: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  opciones: OpcionesSeleccionadas;
  nota?: string;
}

export interface FlyParticle {
  id: number;
  x: number;
  y: number;
  imagen: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrecio: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  activeProduct: ProductoCarta | null;
  openProductModal: (producto: ProductoCarta, presetBase?: BaseCuadrilla) => void;
  closeProductModal: () => void;
  presetBaseForModal?: BaseCuadrilla;
  addItem: (
    producto: ProductoCarta,
    cantidad: number,
    opciones?: OpcionesSeleccionadas,
    nota?: string,
    sourceEl?: HTMLElement | null
  ) => void;
  updateQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  cartPulseKey: number;
  flyParticles: FlyParticle[];
}

const STORAGE_KEY = 'jeyma_bilbao_pedido_v1';

const CartContext = createContext<CartContextValue | null>(null);

function buildItemKey(productoId: string, opciones: OpcionesSeleccionadas, nota?: string): string {
  return JSON.stringify({
    id: productoId,
    b: opciones.base || '',
    s: opciones.sabor || '',
    p: Boolean(opciones.conPatatas),
    n: (nota || '').trim().toLowerCase(),
  });
}

function hydrateCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Siempre recalcula precioUnitario desde la carta oficial
    return parsed
      .map((row): CartItem | null => {
        if (!row || typeof row.productoId !== 'string') return null;
        const prod = getProductoById(row.productoId);
        if (!prod) return null;
        const opciones: OpcionesSeleccionadas = {
          base: row.opciones?.base === 'Totopos' ? 'Totopos' : prod.eligeBase ? 'Patatas' : undefined,
          sabor: prod.sabores?.includes(row.opciones?.sabor) ? row.opciones.sabor : prod.sabores?.[0],
          conPatatas: prod.extraPatatasPrecio ? Boolean(row.opciones?.conPatatas) : undefined,
        };
        const cantidad = Math.max(1, Math.min(30, Number(row.cantidad) || 1));
        const nota = typeof row.nota === 'string' ? row.nota.slice(0, 140) : undefined;
        return {
          key: buildItemKey(prod.id, opciones, nota),
          productoId: prod.id,
          nombre: prod.nombre,
          imagen: prod.imagen,
          precioUnitario: calcularPrecioUnitario(prod.id, opciones),
          cantidad,
          opciones,
          nota,
        };
      })
      .filter((x): x is CartItem => x !== null);
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => hydrateCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductoCarta | null>(null);
  const [presetBaseForModal, setPresetBaseForModal] = useState<BaseCuadrilla | undefined>(undefined);
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [flyParticles, setFlyParticles] = useState<FlyParticle[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openProductModal = useCallback((producto: ProductoCarta, presetBase?: BaseCuadrilla) => {
    setPresetBaseForModal(presetBase);
    setActiveProduct(producto);
  }, []);

  const closeProductModal = useCallback(() => {
    setActiveProduct(null);
    setPresetBaseForModal(undefined);
  }, []);

  const triggerFly = useCallback((imagen: string, sourceEl?: HTMLElement | null) => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !sourceEl) return;

    const rect = sourceEl.getBoundingClientRect();
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setFlyParticles((prev) => [
      ...prev.slice(-3),
      {
        id,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        imagen,
      },
    ]);
    window.setTimeout(() => {
      setFlyParticles((prev) => prev.filter((p) => p.id !== id));
    }, 680);
  }, []);

  const addItem = useCallback(
    (
      producto: ProductoCarta,
      cantidad: number,
      opciones: OpcionesSeleccionadas = {},
      nota?: string,
      sourceEl?: HTMLElement | null
    ) => {
      const normalizedOps: OpcionesSeleccionadas = {
        base: producto.eligeBase ? opciones.base || 'Patatas' : undefined,
        sabor: producto.sabores ? (opciones.sabor as SaborCroqueta) || producto.sabores[0] : undefined,
        conPatatas: producto.extraPatatasPrecio ? Boolean(opciones.conPatatas) : undefined,
      };
      const cleanNota = nota?.trim() ? nota.trim().slice(0, 140) : undefined;
      const key = buildItemKey(producto.id, normalizedOps, cleanNota);
      const precioUnitario = calcularPrecioUnitario(producto.id, normalizedOps);
      const qtyToAdd = Math.max(1, Math.min(20, cantidad));

      setItems((prev) => {
        const idx = prev.findIndex((i) => i.key === key);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            cantidad: Math.min(30, updated[idx].cantidad + qtyToAdd),
          };
          return updated;
        }
        return [
          ...prev,
          {
            key,
            productoId: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            precioUnitario,
            cantidad: qtyToAdd,
            opciones: normalizedOps,
            nota: cleanNota,
          },
        ];
      });

      setCartPulseKey((k) => k + 1);
      triggerFly(producto.imagen, sourceEl);
    },
    [triggerFly]
  );

  const updateQty = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);
  const totalPrecio = useMemo(
    () =>
      items.reduce(
        (acc, i) => acc + calcularPrecioUnitario(i.productoId, i.opciones) * i.cantidad,
        0
      ),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      totalPrecio,
      isCartOpen,
      openCart,
      closeCart,
      activeProduct,
      openProductModal,
      closeProductModal,
      presetBaseForModal,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      cartPulseKey,
      flyParticles,
    }),
    [
      items,
      totalItems,
      totalPrecio,
      isCartOpen,
      openCart,
      closeCart,
      activeProduct,
      openProductModal,
      closeProductModal,
      presetBaseForModal,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      cartPulseKey,
      flyParticles,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
