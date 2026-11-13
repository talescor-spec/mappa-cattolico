# Fideora 1.0.3 — Mappa della Bibbia, primo percorso

## Resultado
A primeira aba passa a Mappa. A página inicial destaca a ficha de Matteo e a comparação interativa dos quatro Evangelhos. Matteo inclui contexto, três temas, estrutura, personagens, referências para o leitor e reflexão que usa o Caderno existente. Conteúdo editorial original em italiano e português. Não é uma coleção completa dos 73 livros: os textos integrais continuam nas edições históricas já creditadas (66 livros).

O onboarding demonstra temas de Matteo e perspectivas dos Evangelhos antes da escolha dos planos. Novas instalações iOS continuam com hard paywall e acesso confirmado exclusivamente pelo RevenueCat. Instalações antigas preservam a introdução gratuita; estrutura e reflexão de Matteo exigem o recurso Premium guides.

Paleta marfim, verde escuro, grafite e dourado discreto; títulos serifados, corpo legível, linhas finas e diagrama vetorial. Sem novas permissões, anúncios, pixels ou esquemas de banco. Preços, produtos, elegibilidade de trial e identidade de assinatura não são alterados.

## Auditoria antes da implementação
A base inspecionada foi fideora-premium-v1, commit 3112f242259859b24774bda6403441fc672b5e06; main serve a landing e não é a base do binário. Foram conferidos gates de entrada, identidade/serialização de compras, autorização de recursos, persistência por conta, configuração Capacitor e pipeline Cloud antes de editar.

| Prioridade | Área | Achado | Evidência | Efeito | Correção | Esforço | Confiança |
|---|---|---|---|---|---|---|---|
| P1 | Distribuição | Publicar o site não atualiza o app instalado | Capacitor usa dist, sem server.url | Alteração pode nunca chegar ao iPhone | Build 1.0.3 pela branch nativa e Xcode Cloud | Médio | Verificado |
| P1 | Compra | Paywall efetivo vem do RevenueCatUI remoto | purchasesClient.present | Alterar apenas o gate React não muda a tela nativa | Oferta da Mappa isolada para a versão nova | Médio | Verificado |
| P1 | Promessa | Corpus histórico atual tem 66 livros | public/bible + preflight | Prometer 73 seria incorreto | Limitar esta versão a Matteo e quatro Evangelhos | Baixo | Verificado |
| P1 | Acesso | Demonstração anterior à compra deve ser limitada | entryAccess + PremiumContext | Demo não pode liberar conta ou app completo | Componentes editoriais de demonstração, sem flags de Premium | Baixo | Testado |
| P2 | Dados | Reflexão precisa sobreviver e pertencer à conta | StudyProvider | Perda ou mistura de notas | Reusar kind note e store do Caderno; testar recarga e troca de conta | Baixo | Testado |
| P2 | Aceite nativo | Navegador não comprova StoreKit nem comportamento físico | Ambiente Linux | Não declarar aprovação de App Review | TestFlight interno e roteiro físico, sem submissão pública automática | Médio | Pendente no dispositivo |

## Jornada de verificação
1. Instalação nova: idioma, valor da Mappa, tema interativo e comparação; nome opcional e rotina; planos.
2. Cancelar ou falhar na compra mantém conteúdo principal bloqueado e conserva restauração/conta/termos/ajuda.
3. Premium confirmado abre Mappa. Instalação antiga livre vê introdução e convite para aprofundar.
4. Abrir Matteo, expandir os três temas, ler estrutura e personagens; cada passagem deve abrir o capítulo/versículo correto.
5. Comparar Matteo, Marco, Luca e Giovanni; clicar na referência de cada um.
6. Salvar reflexão, abrir Caderno, fechar/reabrir e trocar conta. Nenhuma mistura entre contas.
7. Restaurar assinatura, verificar expiração e idioma IT/PT. Preços e trial devem vir dos produtos Apple e da elegibilidade real.
8. Perfil, suporte, termos/privacidade, gestão/exclusão da conta e lembretes continuam disponíveis segundo a versão anterior. Testar offline, inclusive o conteúdo editorial, sem nova compra simulada como autoridade.

## Notas para futura revisão Apple
Fideora adds an original introductory guide to Matthew and a four-Gospel comparison. New iOS installations see limited interactive editorial examples during onboarding, followed by the existing StoreKit/RevenueCat subscription gate. Legacy free installations retain their existing access. To test: confirm a sandbox Premium entitlement, open Mappa → Matteo, follow a passage, compare all four Gospels, save a reflection and open Quaderno. Optional email account and sync are unchanged. Use Restore Purchases at the gate or Profile. No new permissions, payment products or backend schema. Reviewer credentials, if required: [provide through the private App Review channel]. This document is not an App Review approval.

## Prévia editorial
FIDEORA_REVIEW=1 npm run build inclui mappa-review.html para revisão protegida. O build normal e npm run cap:ios não incluem essa entrada. Ela usa os mesmos componentes editoriais, sem motor de compras nem alteração de entitlement. Reflexões da prévia ficam apenas em memória e são identificadas como demonstração.

## Validação
48 testes automatizados, incluindo referências reais IT/PT, comparação, persistência por conta, amostra do onboarding e gates/compra/restauração existentes. 24 verificações estruturais. Compilação web e sincronização Capacitor devem passar antes do push para fideora-premium-v1. Conferência física e estado do upload constam no painel Cloud/TestFlight, não são inferidos destes testes.
