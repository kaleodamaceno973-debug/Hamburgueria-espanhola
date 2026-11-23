import { cn } from "@/lib/utils";

/** Marquee infinito em CSS puro (GPU), pausa no hover; respeita reduced-motion. */
export function Marquee({
  children,
  className,
  reverse = false,
  duration = 30,
}: {
  children: React.ReactNode;
  className?: string;
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <div className={cn("group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]", className)}>
      <div
        className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : "normal" } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
