# Fideora — paywall visual premium, 13/11/2026

## Escopo e auditoria inicial
O usuário pediu CTA de teste por 3 dias no mensal e 7 no anual, preços/detalhes minimalistas e visual premium semelhante ao Herbalia. Preservar hard paywall, preços/produtos existentes, elegibilidade Apple e acesso por entitlement. O checkout é RevenueCatUI remoto: alterar somente React não modifica o paywall efetivo.

Referência conferida: Herbalia, `src/features/premium/paywall-screen.tsx`, branch `codex/herbalia-hard-paywall-20261109`: hero fotográfico, planos compactos, rodapé com CTA e condições, seleção anual/mensal e adaptação a telas menores. No Fideora foram inspecionados os quatro paywalls publicados, compras serializadas, gate de instalação e notas Apple existentes. Nenhuma configuração de autenticação, privacidade, permissão ou capacidade nativa muda.

| Prioridade | Área | Achado e evidência | Risco | Correção | Esforço | Confiança |
|---|---|---|---|---|---|---|
| P1 | Trial | O editor mostra estado padrão sem oferta; o CTA exige regra de elegibilidade | Prometer grátis a conta inelegível | CTA por duração real da oferta; fallback pago e teste das duas seleções | Médio | Verificado |
| P1 | Preço | Valores do editor são exemplos em USD | Confundir mock com preço real | Manter variáveis da loja e total anual claro, equivalente mensal secundário | Baixo | Verificado |
| P1 | Acesso | Hard e legado têm fechamentos diferentes | Remover hard gate ou prender usuário legado | Preservar Account/Restore no hard e X no legado | Baixo | Verificado |
| P2 | Visual | Layout publicado é majoritariamente texto e listas | Experiência pouco visual/congruente | Hero fotográfico original, marfim/verde/dourado e hierarquia editorial compacta | Médio | Verificado |
| P2 | Telas pequenas | Benefícios, planos e termos competem por espaço | CTA/planos inacessíveis ou texto minúsculo | Hero/conteúdo adaptável; planos e CTA juntos; termos legíveis e rolagem | Médio | A verificar no editor |

## Jornada de revisão
Elegível IT/PT: selecionar anual e mensal, conferir trial e CTA correspondentes; verificar cobrança posterior, total anual e equivalente mensal. Inelegível: CTA sem promessa grátis. Conferir iPhone compacto e grande, modo escuro, restauração/Termos/Privacidade; hard mantém conta acessível e legado seu fechamento. Revisão física de preço localizado, elegibilidade e confirmação Apple é separada da prévia do editor. Não iniciar compra para validar o visual.

## Nota para futura revisão Apple
The native paywall presentation is refined with an editorial image and plan-aware trial calls to action. Introductory copy is restricted to store-eligible customers and uses the selected product's offer duration. Standard billing totals, renewal, restore and legal links remain visible. Existing subscription products, prices, entitlement checks and new-install access gate are retained.

## Referências primárias
- https://developer.apple.com/design/human-interface-guidelines/apple-in-app-purchase
- https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/variables
- https://www.revenuecat.com/docs/tools/paywalls/creating-paywalls/supporting-offers

## Imagem original
Asset: public/fideora-paywall-hero-v3.png. Criado com o gerador de imagens integrado, como fotografia editorial (não captura do app). Prompt: fotografia de uma Bíblia de linho verde escuro com pequena cruz dourada e fita marfim, sobre travertino claro, caderno sem marca e pequeno ramo de oliveira; luz natural lateral, sombra de arco, paleta marfim/verde/dourado, composição horizontal minimalista, adulta e sóbria; sem pessoas, texto legível, logos ou interface. O arquivo original foi preservado.

## Resultado e validação
Em preparação. Publicação e estados conferidos serão registrados após a revisão.
