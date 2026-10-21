# Fideora Premium — auditoria antes da implementação

21/10/2026. Pedido: aproximadamente 10% grátis e 90% Premium; RevenueCat e StoreKit.

## Resumo executivo
A V1 atual é gratuita, sem interface de compra, sem listener de entitlement e sem SDK key Fideora. O wrapper RevenueCat existe, mas autenticação é sua única chamada. Projeto RevenueCat Fideora criado nesta sessão (0df93c61), ainda sem configuração Apple concluída. Compilações anteriores não comprovam compra.

## Riscos
| Prioridade | Área | Evidência e risco | Correção | Esforço | Confiança |
|---|---|---|---|---|---|
| P0 | Catálogo | Produtos/oferta/paywall Fideora inexistentes | Criar entitlement premium, app iOS, mensal/anual e oferta, verificar configuração Apple | Médio | Verificado |
| P0 | Acesso | Nenhum gate atual; nenhum estado de entitlement | Estado derivado de CustomerInfo, sem booleano local de autoridade | Médio | Verificado |
| P1 | Identidade | LogIn existe na hidratação do perfil; pode falhar junto com o banco | Serializar identidade RevenueCat separadamente do perfil, observar auth e descartar respostas antigas | Médio | Verificado |
| P1 | Compra | Falta restaurar/gerenciar, erro/cancelamento, listener e preço real | UI oficial RevenueCat + CustomerInfo após retorno, restore e gerenciamento acessíveis | Médio | Verificado |
| P1 | Migração | Notas privadas de usuários da V1 não podem ficar retidas pelo novo paywall | Leitura/edição/exclusão/exportação de dados já criados sempre acessíveis | Médio | Decisão |
| P1 | Apple | Contrato pendente, sem archive assinado ou teste físico | Manter bloqueio de release; não alegar compra real até sandbox/TestFlight | Externo | Verificado na sessão anterior |
| P1 | Privacidade | Políticas atuais afirmam nenhum recurso pago; compras geram identificadores/transações | Atualizar políticas, manifesto e rascunho App Privacy; nenhuma integração de anúncios | Pequeno | Verificado |

## Jornada do revisor / aceite
Italiano padrão → onboarding com objetivo/tempo → amostra diária grátis → tocar recurso Premium → paywall → comprar no sandbox → entitlement premium libera → restaurar → perfil/gerenciar assinatura → login/logout/troca de conta → exclusão e exportação → erro/offline. Acesso ao conteúdo já escrito não depende de assinatura.

## Notas de review (rascunho)
Fideora uses RevenueCat/StoreKit for an optional Premium subscription. Daily devotional reading remains free. Full Bible navigation/search, new annotations/studies, editorial guides/lexicon and guided prayer tracks require the premium entitlement. Existing personal content, export, deletion and support remain accessible after expiry. Restore and subscription management are available in Profile. Verify exact configured product IDs and sandbox acceptance in the final release report; this audit is not release approval.
