# Fideora — painel interno de onboarding

## Escopo confirmado
Em 13/11/2026, o usuário escolheu TestFlight e desenvolvimento. O painel não é uma função do app público nem uma permissão ligada à conta. Os convidados do grupo interno podem usá-lo; o grupo atual tem um tester existente. A opção pública Rivedi la presentazione será removida.

## Auditoria antes da implementação
Inspecionados Profile, Onboarding, entryAccess, AuthContext, purchasesClient e o bridge nativo. A configuração de conta, privacidade, assinatura, bundle ID, Keychain e permissões permanece igual à build 10.

| Prioridade | Área | Achado | Evidência | Risco | Correção | Esforço | Confiança |
|---|---|---|---|---|---|---|---|
| P1 | Exposição | Replay da build 10 aparece em todos os perfis | Profile | Ferramenta interna seria entregue aos clientes | Remover ação pública; exigir ambiente nativo de teste verificado | Médio | Verificado |
| P1 | Ambiente | Negar métricas não comprova ser teste | allowsReviewMetrics também retorna false em erro | Falha de verificação poderia habilitar QA em produção | Nova verificação positiva; produção, resultado desconhecido e erro negam acesso | Médio | Verificado |
| P1 | Compra | Cliente normal pula paywall de assinantes | purchasesClient.present | Não permite revisar apresentação da oferta | Preview separado, verificado de novo a cada chamada; só sandbox/debug, com fechamento disponível | Médio | Verificado |
| P1 | Dados | Reset de flags reais interfere com a instalação | entryAccess | Perda de estado ou mudança indevida de acesso | Simulação em memória; não limpar LocalStorage, autenticação nem entitlement | Médio | Verificado |
| P2 | Iteração | Quatro etapas exigem repetir todo o caminho | Onboarding | Testes lentos e pouco precisos | Abrir etapa específica ou simular início, com valores temporários | Baixo | Verificado |

## Ambiente
DEBUG permite ferramentas locais. Release iOS 16+ exige AppTransaction verificado em sandbox/xcode; produção e erro negam. No iOS 15, exige recibo sandbox presente. Web de produção e Vercel preview não ganham permissão por query, armazenamento ou variável pública. O entry de revisão protegido pode mostrar o componente visual isolado, com compra desativada, sem abrir o painel no app real.

Referências primárias consultadas:
- https://developer.apple.com/documentation/storekit/apptransaction
- https://developer.apple.com/documentation/storekit/appstore/environment
- https://developer.apple.com/documentation/storekit/testing-in-app-purchases-with-sandbox
- https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight/

## Jornada de teste
App Store: nenhuma ação de desenvolvimento ou replay no Perfil/gate. TestFlight/debug: Perfil → Ferramentas de desenvolvimento; simular início ou abrir uma etapa, alterar idioma/nome/rotina, fechar/concluir e repetir; dados reais intactos. Visualizar o paywall sandbox mesmo com Premium ativo; cancelar deve voltar à ferramenta. Nova instalação mantém onboarding e hard paywall reais. Restaurar/excluir/gerenciar conta continuam nos caminhos normais. App Review público não é solicitado automaticamente.

## Nota para futura revisão Apple
Development diagnostics are restricted to verified sandbox or debug environments. Production customers do not see them. Simulations use the existing onboarding with temporary state; no real account/onboarding flags are reset and no Premium access is fabricated. Sandbox paywall preview is separately guarded and remains dismissible. Existing StoreKit products, prices, entitlements and account management are unchanged.

## Validação da implementação
58 testes automatizados aprovados: ambiente de produção/erro negado, acesso interno positivo, salto/reinício/conclusão sem gravar dados reais, fechamento sem checkout e preview de oferta separado mesmo para assinante. Build web e sincronização Capacitor iOS aprovadas; o entry de revisão não é empacotado no app. 24 verificações estruturais aprovadas. A compilação assinada e a revisão física do StoreKit são verificações separadas.
