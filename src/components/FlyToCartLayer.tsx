import { useOrder } from '../context/OrderContext';
import { BRAND_ASSETS } from '../data/brand';

export function FlyToCartLayer() {
  const { flyParticles } = useOrder();

  if (flyParticles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
      {flyParticles.map((p) => (
        <div
          key={p.id}
          className="bv-fly-particle fixed h-12 w-12 overflow-hidden rounded-full border-2 border-[#FFB547] bg-black shadow-lg"
          style={{
            left: p.startX - 24,
            top: p.startY - 24,
          }}
        >
          <img
            src={p.image ?? BRAND_ASSETS.cowIcon}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
