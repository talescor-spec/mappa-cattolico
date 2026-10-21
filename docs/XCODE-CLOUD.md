# Fideora — distribuição automática para TestFlight

21/10/2026. Auditoria antes da implementação, conforme .github/skills/apple-appstore-reviewer/SKILL.md.

## Estado inicial

O código e os ajustes de iPhone estão salvos na branch fideora-premium-v1. O GitHub compila e abre uma versão sem assinatura no simulador; não há workflow de distribuição. A build assinada 1.0.0 (1) foi enviada pelo titular e instalada pelo TestFlight. O painel Apple exibe “Get started in Xcode”: não existe produto/workflow Xcode Cloud ativado nesta equipe.

Escolha: Xcode Cloud, adequado ao projeto Capacitor existente. Não migrar o app para Expo apenas para compilar. A ativação inicial exige Xcode no Mac e autorização do repositório; não é uma dependência recorrente do Mac para cada build. Preparar código e validação antes de solicitar essa etapa.

## Riscos

| Prioridade | Área | Achado | Evidência | Impacto | Correção | Esforço | Confiança |
|---|---|---|---|---|---|---|---|
| P1 | Distribuição | CI atual não assina nem envia | ios-simulator.yml usa CODE_SIGNING_ALLOWED=NO | Não entrega atualizações ao iPhone | Xcode Cloud com archive e postação TestFlight | Médio | Verificado |
| P1 | Configuração nativa | Scheme não compartilhado e equipe ausente no Git | ios/App/App.xcodeproj | Onboarding/assinatura remota pode falhar | Scheme App compartilhado e equipe CZ7QKZBQC8 | Baixo | Verificado |
| P1 | Dependências | node_modules e assets são gerados; lock Swift não versionado | Package.swift aponta pacotes npm locais | Checkout limpo não compila sem preparo | Post-clone instala Node compatível, npm ci, testes, preflight e cap sync; versionar resolução Swift real | Médio | Verificado |
| P1 | Versão | 1.0.0 (1) já existe na Apple | TestFlight e teste físico | Primeira build Cloud pode colidir | Ajustar Next Build Number para 2 antes do primeiro envio | Baixo | Verificado |
| P1 | Escopo | main contém outra versão web | Histórico/repositório | Publicação do código errado | Workflow somente para fideora-premium-v1 e grupo interno existente | Baixo | Verificado |
| P2 | Ativação | Primeiro workflow só pode ser criado no Xcode | Painel Apple e documentação oficial | Não concluir pelo navegador | Uma ativação assistida no Mac; manutenção posterior pelo App Store Connect | Baixo | Verificado |

## Jornada e limites

GitHub → preparo e testes → archive assinado na Apple → processamento → grupo Fideora QA Interno → atualização no TestFlight. Sem novos destinatários. Não enviar para App Review. Os cenários de onboarding, grátis, Premium, compra/restauração/expiração, perfil, exclusão, links e offline continuam seguindo IPHONE-V2-REVIEW.md e PREMIUM-STORE-COPY.md; compilação remota não substitui aceite físico.

## Notas de revisão

Italian default, Portuguese optional. Free Genesis/Exodus and daily excerpt; other included books and advanced features require Apple IAP through RevenueCat. Email sync is optional. This change prepares build/distribution infrastructure; no app behavior, prices, entitlements or backend schema change. App Review readiness is not asserted.

## Fontes

- https://developer.apple.com/documentation/xcode/configuring-your-first-xcode-cloud-workflow
- https://developer.apple.com/documentation/xcode/writing-custom-build-scripts
- https://developer.apple.com/documentation/xcode/making-dependencies-available-to-xcode-cloud
- https://developer.apple.com/documentation/xcode/setting-the-next-build-number-for-xcode-cloud-builds
- https://developer.apple.com/documentation/xcode/including-notes-for-testers-with-a-beta-release-of-your-app
