# Avaliações e lembretes no iPhone

O convite automático usa StoreKit após três conclusões em dias locais distintos. A conclusão pode ser a leitura diária, o terço guiado ou a novena completa. O convite aguarda a tela Hoje e uma pausa de dois segundos. O app limita as tentativas a duas em 365 dias, com intervalo mínimo de 90 dias.

Perfil → Lembretes permite configurar leitura e oração em italiano ou português. O iOS solicita autorização quando a pessoa salva o primeiro lembrete. Um toque em uma notificação abre a leitura diária ou a oração guiada, respeitando o acesso ao conteúdo. Perfil → Avaliar Fideora abre a página da App Store.

## Verificação para a próxima versão

| Área | Verificação |
| --- | --- |
| StoreKit | Em build de desenvolvimento, completar atividades em três dias distintos, voltar a Hoje e verificar a folha do sistema. Conferir ausência de convite durante onboarding, compra, restauração, erro e retorno de uma notificação. TestFlight pode validar a regra e o link manual, mas o sistema suprime a folha automática nesse ambiente. |
| Lembretes | Em iPhone, verificar permissão negada e concedida, agendamento em IT/PT, alteração de horário, desligamento e abertura do destino com o app aberto, em segundo plano e encerrado. |
| Acesso | Confirmar abertura do destino após desbloqueio normal pelo trial ou assinatura. Verificar os fluxos de suporte, restauração e exclusão existentes. |
| Privacidade | Conferir a descrição de interações de produto no App Store Connect contra a política e o manifesto já existentes. A integração recebe apenas tipo do evento, idioma, ID aleatório por evento e hora de recebimento. |
| Painel | O Email Studio mostra contagens do Fideora nos últimos 30 dias, sem atribuição a campanhas. Uma tentativa registrada não indica que a folha apareceu nem que a pessoa publicou uma nota. Conferir avaliações e distribuição de estrelas no App Store Connect. |

Nota para App Review: “After three completed activities on separate days, Fideora may use the standard StoreKit review prompt on the Today screen. Optional local reminders are configured in Profile and open the relevant activity. The persistent review link opens the App Store. Existing Apple IAP and restore flows are unchanged.”

## Integração com o Funnel Metrics

Em `integrations/funnel-metrics`, o SQL amplia a lista de eventos existente e cria a contagem de acesso exclusivo ao servidor. `review-events.mjs` atende a ação `app-review` no módulo `growth/index.ts` de `dashboard-daily-leads`. O relatório autenticado inclui `app_reviews`, renderizado no painel Fideora do Email Studio. O app exclui compilações de teste antes de enviar. A verificação do coletor usa `is_test: true`.
