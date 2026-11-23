import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = { title: "Termos de Uso", alternates: { canonical: "/termos" } };

export default function TermsPage() {
  return (
    <LegalPage title="Termos de Uso" updated="novembro de 2026">
      <p><em>Modelo de demonstração: revise com seu jurídico antes de publicar.</em></p>
      <h2>1. Pedidos</h2>
      <p>O pedido é confirmado após a aprovação do pagamento. Preços, taxas e descontos são calculados no momento da finalização e exibidos antes do pagamento.</p>
      <h2>2. Cancelamento e reembolso</h2>
      <ul>
        <li>Você pode cancelar ou remarcar pela sua conta enquanto o pedido não entrou em preparo.</li>
        <li>Pedidos pagos e cancelados nessa etapa são estornados integralmente ao mesmo meio de pagamento.</li>
        <li>Após o preparo, cancelamentos dependem de análise da loja (direito de arrependimento não se aplica a alimentos perecíveis preparados sob demanda).</li>
      </ul>
      <h2>3. Entrega e retirada</h2>
      <p>Os prazos são estimativas. Em caso de atraso relevante, entraremos em contato pelo telefone informado.</p>
      <h2>4. Cupons</h2>
      <p>Cupons são pessoais, não cumulativos e podem ter regras específicas (ex.: primeiro pedido).</p>
      <h2>5. Conta</h2>
      <p>Você é responsável por manter sua senha em sigilo. Podemos suspender contas com indícios de fraude.</p>
      <h2>6. Foro</h2>
      <p>Aplica-se a legislação brasileira, incluindo o Código de Defesa do Consumidor.</p>
    </LegalPage>
  );
}
