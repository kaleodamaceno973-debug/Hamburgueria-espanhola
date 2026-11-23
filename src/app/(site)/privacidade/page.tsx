import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = { title: "Política de Privacidade", alternates: { canonical: "/privacidade" } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de Privacidade" updated="novembro de 2026">
      <p>
        Esta política explica como a Smash House (“nós”) coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018 — LGPD). <em>Modelo de demonstração: revise com seu jurídico antes de publicar.</em>
      </p>
      <h2>1. Dados que coletamos</h2>
      <ul>
        <li>Cadastro: nome, e-mail, telefone e senha (armazenada apenas como hash criptográfico).</li>
        <li>Pedidos: itens, endereço de entrega, horário agendado e observações.</li>
        <li>Pagamento: processado pelo provedor (ex.: Stripe). Não armazenamos dados de cartão.</li>
        <li>Navegação: cookies essenciais (sessão e carrinho) e, com seu consentimento, cookies de desempenho.</li>
      </ul>
      <h2>2. Finalidades e bases legais</h2>
      <ul>
        <li>Execução de contrato: preparar e entregar seu pedido, emitir comprovantes e prestar suporte.</li>
        <li>Legítimo interesse: prevenção a fraudes e melhoria do serviço.</li>
        <li>Consentimento: comunicações de marketing (newsletter) e cookies não essenciais.</li>
        <li>Obrigação legal: guarda de registros fiscais e de acesso.</li>
      </ul>
      <h2>3. Compartilhamento</h2>
      <p>Compartilhamos dados apenas com operadores necessários: provedor de pagamento, serviço de e-mail, hospedagem e parceiros de entrega — sempre no limite da finalidade.</p>
      <h2>4. Seus direitos</h2>
      <p>Você pode solicitar confirmação, acesso, correção, anonimização, portabilidade, eliminação de dados e revogação de consentimento pelo e-mail informado na página de contato.</p>
      <h2>5. Segurança e retenção</h2>
      <p>Usamos conexão criptografada (HTTPS), senhas com hash, controle de acesso por perfil e mantemos os dados pelo tempo necessário às finalidades e obrigações legais.</p>
      <h2>6. Cookies</h2>
      <p>No primeiro acesso você escolhe entre “Só essenciais” ou “Aceitar todos”. Para mudar a escolha, limpe os dados do site no navegador.</p>
      <h2>7. Encarregado (DPO)</h2>
      <p>Contato do encarregado: privacidade@smashhouse.com.br.</p>
    </LegalPage>
  );
}
