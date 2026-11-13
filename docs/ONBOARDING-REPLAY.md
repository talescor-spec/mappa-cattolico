# Rever a apresentação no Perfil

> Registro histórico da build 10. A opção pública foi substituída pelo painel interno descrito em [INTERNAL-QA.md](INTERNAL-QA.md), conforme o escopo corrigido pelo usuário em 13/11/2026.

## Auditoria antes da alteração
O app instalado guarda a conclusão do onboarding no dispositivo, independentemente de a conta estar conectada. Atualmente só a entrada inicial monta a apresentação. O usuário precisa de um acesso permanente pelo Perfil.

| Prioridade | Área | Achado | Evidência | Risco | Correção proposta | Esforço | Confiança |
|---|---|---|---|---|---|---|---|
| P1 | Acesso | Reiniciar flags de instalação confunde replay com novo usuário | App + entryAccess | Bloqueio ou mudança indevida de acesso | Abrir apresentação em um modal do Perfil, sem alterar flags ou entitlement | Baixo | Verificado |
| P2 | Preferências | A conclusão normal salva nome e rotina; idioma é global | Onboarding.finish + LanguageContext | Rever a apresentação pode sobrescrever preferências | Modo replay com escolhas temporárias e fechamento próprio | Baixo | Verificado |
| P2 | Compra | Usuário já assinante deve poder rever sem novo checkout | PremiumContext + purchasesClient | Checkout desnecessário ou tentativa de acesso fictício | Replay termina no Perfil; motor de compra permanece inalterado | Baixo | Verificado |

Nenhuma mudança nativa, de conta, pagamento, permissões ou backend. A apresentação inicial e seu hard paywall mantêm o comportamento atual. Revisão física no iPhone continua separada dos testes automatizados e da compilação.

## Jornada de verificação
Perfil → Rever apresentação / Rivedi la presentazione → quatro etapas reais → Voltar ao Perfil. Fechar em qualquer etapa e repetir. Conferir nome, idioma, rotina, conta, notas e assinatura antes/depois. Uma instalação nova deve continuar chegando ao paywall normal.

## Nota para futura revisão Apple
Profile now includes a replay of the introductory presentation. It uses temporary settings and returns to Profile without changing onboarding completion, login, subscriptions or stored preferences. New-user onboarding and StoreKit checkout remain unchanged.

## Validação
50 testes aprovados, incluindo o usuário conectado com assinatura, conclusão e reabertura sem alterar armazenamento, idioma global, flags de entrada ou acesso. Compilação web, sincronização iOS e 24 verificações estruturais aprovadas.
