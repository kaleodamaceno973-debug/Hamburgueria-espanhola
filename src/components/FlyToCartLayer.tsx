import React, { useEffect, useState } from 'react';
import { FlyParticle, useCart } from './CartContext';

const Particle: React.FC<{ particle: FlyParticle }> = ({ particle }) => {
  const [flying, setFlying] = useState(false);
  const [target, setTarget] = useState({ dx: 0, dy: -200 });

  useEffect(() => {
    const cartBtn = document.getElementById('header-cart-button');
    if (cartBtn) {
      const r = cartBtn.getBoundingClientRect();
      setTarget({
        dx: r.left + r.width / 2 - particle.x,
        dy: r.top + r.height / 2 - particle.y,
      });
    }
    const raf = requestAnimationFrame(() => setFlying(true));
    return () => cancelAnimationFrame(raf);
  }, [particle.x, particle.y]);

  return (
    <div
      className="fixed z-[90] pointer-events-none w-12 h-12 -ml-6 -mt-6 rounded-full overflow-hidden border-2 border-[#A8873A] shadow-lg transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        left: particle.x,
        top: particle.y,
        transform: flying
          ? `translate3d(${target.dx}px, ${target.dy}px, 0) scale(0.32)`
          : 'translate3d(0, 0, 0) scale(1)',
        opacity: flying ? 0.15 : 1,
      }}
      aria-hidden="true"
    >
      <img src={particle.imagen} alt="" className="w-full h-full object-cover" />
    </div>
  );
};

export const FlyToCartLayer: React.FC = () => {
  const { flyParticles } = useCart();
  if (flyParticles.length === 0) return null;

  return (
    <>
      {flyParticles.map((p) => (
        <Particle key={p.id} particle={p} />
      ))}
    </>
  );
};
