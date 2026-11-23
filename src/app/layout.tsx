import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Kaushan_Script } from "next/font/google";
import { ToasterLazy } from "@/components/site/toaster-lazy";
import "./globals.css";
import { BRAND } from "@/lib/constants";
import { siteUrl } from "@/lib/utils";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"], display: "swap" });
const barlow = Barlow({ variable: "--font-barlow", weight: ["400", "500", "600", "700", "800"], subsets: ["latin"], display: "swap" });
const script = Kaushan_Script({ variable: "--font-script", weight: "400", subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${BRAND.name} — Smash Burgers Artesanais`, template: `%s · ${BRAND.name}` },
  description:
    "Smash burgers artesanais prensados na chapa, ingredientes frescos e entrega rápida. Peça online com Pix ou cartão e acompanhe seu pedido em tempo real.",
  keywords: ["smash burger", "hamburgueria", "delivery", "burger artesanal", "São Paulo"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: BRAND.name,
    images: [{ url: "/images/hero-1.webp", width: 1600, height: 1138, alt: "Smash burger Smash House" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0806",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Marca a página para animações antes da hidratação (evita "flash" de conteúdo). */
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${barlow.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <ToasterLazy />
      </body>
    </html>
  );
}
