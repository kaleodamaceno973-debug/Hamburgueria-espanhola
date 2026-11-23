import Link from "next/link";
import { cn } from "@/lib/utils";

export function BurgerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden fill="none">
      <path d="M6 24C6 11 18 3 32 3s26 8 26 21H6Z" fill="currentColor" />
      <g fill="#0a0806">
        <ellipse cx="22" cy="13" rx="2" ry="1.2" />
        <ellipse cx="32" cy="9" rx="2" ry="1.2" />
        <ellipse cx="42" cy="13" rx="2" ry="1.2" />
        <ellipse cx="27" cy="18" rx="2" ry="1.2" />
        <ellipse cx="37" cy="18" rx="2" ry="1.2" />
      </g>
      <path d="M3 30c4 0 4 3 8 3s4-3 8-3 4 3 8 3 4-3 8-3 4 3 8 3 4-3 8-3 4 3 8 3" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="5" y="37" width="54" height="6" rx="3" fill="currentColor" />
      <path d="M6 47h52c0 4-3 7-7 7H13c-4 0-7-3-7-7Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className={cn("group flex items-center gap-2.5 text-primary", className)} aria-label="Smash House — início">
      <BurgerMark className="h-9 w-10 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
      <span className="font-display text-[1.35rem] leading-[0.85] text-foreground">
        Smash
        <br />
        House
      </span>
    </Link>
  );
}
