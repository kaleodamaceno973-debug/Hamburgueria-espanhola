import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "./social-icons";
import { getSiteContent } from "@/server/catalog";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { BRAND } from "@/lib/constants";

const LINKS = [
  { href: "/cardapio", label: "Cardápio" },
  { href: "/sobre", label: "Nossa história" },
  { href: "/contato", label: "Contato" },
  { href: "/conta", label: "Minha conta" },
];

export async function Footer() {
  const c = await getSiteContent();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#070504]">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1.2fr_1.4fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">{BRAND.tagline}</p>
          <div className="flex gap-2">
            {[
              { icon: InstagramIcon, label: "Instagram" },
              { icon: FacebookIcon, label: "Facebook" },
              { icon: YoutubeIcon, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`${BRAND.name} no ${label}`}
                className="grid size-10 place-items-center rounded-full border border-white/10 text-foreground/70 transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Links rápidos</h2>
          <ul className="space-y-2.5 text-sm">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-foreground/75 transition hover:text-primary">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Fale com a gente</h2>
          <ul className="space-y-3 text-sm text-foreground/75">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" />{c["contact.address"]}</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 size-4 shrink-0 text-primary" />{c["contact.phone"]}</li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 size-4 shrink-0 text-primary" />{c["contact.email"]}</li>
            <li className="flex gap-2.5"><Clock className="mt-0.5 size-4 shrink-0 text-primary" />{c["topbar.hours"]}</li>
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">Newsletter</h2>
          <p className="mb-4 text-sm text-muted-foreground">Ofertas exclusivas e lançamentos antes de todo mundo.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {BRAND.name}. Todos os direitos reservados.</p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/privacidade" className="hover:text-primary">Política de Privacidade</Link>
            <Link href="/termos" className="hover:text-primary">Termos de Uso</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
