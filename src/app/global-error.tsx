"use client";

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0a0806", color: "#f6efe4", fontFamily: "system-ui, sans-serif", textAlign: "center", padding: 16 }}>
        <div>
          <p style={{ fontSize: "6rem", fontWeight: 900, color: "#ff7a1a", margin: 0 }}>500</p>
          <h1 style={{ fontSize: "1.5rem" }}>Algo deu errado</h1>
          <p style={{ color: "#a99f92" }}>Estamos trabalhando nisso. Tente novamente em instantes.</p>
          <button onClick={() => retry()} style={{ marginTop: 16, background: "#ff7a1a", border: 0, borderRadius: 999, padding: "12px 24px", fontWeight: 700, cursor: "pointer" }}>
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
