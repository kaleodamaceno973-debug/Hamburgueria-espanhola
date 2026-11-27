import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CityId } from '../data/brand';
import { MENU_ITEMS, MenuItem } from '../data/menu';

export interface CartEntry {
  itemId: string;
  quantity: number;
  note?: string;
}

export interface FlyParticle {
  id: number;
  startX: number;
  startY: number;
  image: string | null;
}

interface OrderContextValue {
  selectedCity: CityId;
  setSelectedCity: (city: CityId) => void;
  cart: CartEntry[];
  addToCart: (item: MenuItem, quantity?: number, note?: string, origin?: { x: number; y: number }) => void;
  updateQty: (index: number, delta: number) => void;
  removeEntry: (index: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isReserveOpen: boolean;
  setIsReserveOpen: (open: boolean) => void;
  activeProduct: MenuItem | null;
  setActiveProduct: (item: MenuItem | null) => void;
  cartBounceKey: number;
  flyParticles: FlyParticle[];
}

const STORAGE_CART_KEY = 'bv_cart_v1';
const STORAGE_CITY_KEY = 'bv_city_v1';

const OrderContext = createContext<OrderContextValue | null>(null);

const MENU_BY_ID = new Map<string, MenuItem>(MENU_ITEMS.map((item) => [item.id, item]));

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<CityId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CITY_KEY);
      if (saved === 'bilbao' || saved === 'zaragoza' || saved === 'burgos') {
        return saved;
      }
    } catch {
      // ignore storage failure
    }
    return 'bilbao';
  });

  const [cart, setCart] = useState<CartEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (e): e is CartEntry =>
          e &&
          typeof e.itemId === 'string' &&
          MENU_BY_ID.has(e.itemId) &&
          typeof e.quantity === 'number' &&
          e.quantity > 0
      );
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<MenuItem | null>(null);
  const [cartBounceKey, setCartBounceKey] = useState(0);
  const [flyParticles, setFlyParticles] = useState<FlyParticle[]>([]);

  const setSelectedCity = useCallback((city: CityId) => {
    setSelectedCityState(city);
    try {
      localStorage.setItem(STORAGE_CITY_KEY, city);
    } catch {
      // ignore storage failure
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage failure
    }
  }, [cart]);

  const addToCart = useCallback(
    (item: MenuItem, quantity = 1, note = '', origin?: { x: number; y: number }) => {
      const cleanNote = note.trim();
      setCart((prev) => {
        const idx = prev.findIndex(
          (entry) => entry.itemId === item.id && (entry.note ?? '') === cleanNote
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [...prev, { itemId: item.id, quantity, note: cleanNote || undefined }];
      });
      setCartBounceKey((k) => k + 1);

      if (origin && typeof window !== 'undefined') {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!reduced) {
          const id = Date.now() + Math.random();
          setFlyParticles((prev) => [...prev, { id, startX: origin.x, startY: origin.y, image: item.image }]);
          window.setTimeout(() => {
            setFlyParticles((prev) => prev.filter((p) => p.id !== id));
          }, 700);
        }
      }
    },
    []
  );

  const updateQty = useCallback((index: number, delta: number) => {
    setCart((prev) => {
      const target = prev[index];
      if (!target) return prev;
      const nextQty = target.quantity + delta;
      if (nextQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const next = [...prev];
      next[index] = { ...target, quantity: nextQty };
      return next;
    });
  }, []);

  const removeEntry = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const { totalCount, totalPrice } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const entry of cart) {
      const menuItem = MENU_BY_ID.get(entry.itemId);
      if (!menuItem) continue;
      count += entry.quantity;
      total += menuItem.price * entry.quantity;
    }
    return { totalCount: count, totalPrice: Math.round(total * 100) / 100 };
  }, [cart]);

  const value = useMemo<OrderContextValue>(
    () => ({
      selectedCity,
      setSelectedCity,
      cart,
      addToCart,
      updateQty,
      removeEntry,
      clearCart,
      totalCount,
      totalPrice,
      isCartOpen,
      setIsCartOpen,
      isReserveOpen,
      setIsReserveOpen,
      activeProduct,
      setActiveProduct,
      cartBounceKey,
      flyParticles,
    }),
    [
      selectedCity,
      setSelectedCity,
      cart,
      addToCart,
      updateQty,
      removeEntry,
      clearCart,
      totalCount,
      totalPrice,
      isCartOpen,
      isReserveOpen,
      activeProduct,
      cartBounceKey,
      flyParticles,
    ]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder debe usarse dentro de OrderProvider');
  return ctx;
}
