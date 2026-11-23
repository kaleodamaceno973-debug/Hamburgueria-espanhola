import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: LayoutProps<"/conta">) {
  return (
    <div className="container-x pb-24 pt-28 md:pt-40">
      <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)]"><span className="slant">Minha conta</span></h1>
      <div className="mt-6"><AccountNav /></div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
