import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { getSiteContent } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Smash House: endereço, horários, WhatsApp e formulário.",
  alternates: { canonical: "/contato" },
};

export default async function ContactPage() {
  const c = await getSiteContent();
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const items = [
    { icon: MapPin, label: "Endereço", value: c["contact.address"] },
    { icon: Clock, label: "Horário", value: c["topbar.hours"] },
    { icon: Phone, label: "Telefone", value: c["contact.phone"] },
    { icon: Mail, label: "E-mail", value: c["contact.email"] },
  ];
  return (
    <>
      <PageHero eyebrow="Contato" title="Bora conversar" text="Dúvidas, eventos, parcerias ou elogios (a gente adora). Respondemos rápido." />
      <div className="container-x grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal stagger={0.08} className="space-y-3">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><Icon className="size-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            </div>
          ))}
          {wa && (
            <a
              href={`https://wa.me/${wa}?text=${encodeURIComponent("Olá, Smash House! Vim pelo site.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-4 font-bold text-black transition hover:brightness-110"
            >
              <MessageCircle className="size-5" /> Chamar no WhatsApp
            </a>
          )}
        </Reveal>
        <Reveal className="rounded-3xl border border-white/10 bg-[#120e0b] p-6 sm:p-8">
          <h2 className="mb-6 text-2xl font-extrabold">Envie uma mensagem</h2>
          <ContactForm />
        </Reveal>
      </div>
    </>
  );
}
