# Fideora / MDB — rastreamento Meta

Pixel solicitado por Thales: **Pixel RLG / 2184650478741381**. Não criar outro pixel, outro produto, campanha ou assinatura de ferramenta.

## Site

- Página: `/mappa-della-bibbia/`. Os links de bio `/social/instagram`, `/social/facebook`, `/social/tiktok`, `/social/youtube` continuam redirecionando para ela.
- Meta: PageView e ViewContent na página; Lead somente depois da captura validada pelo servidor. Identificadores de oferta neutros, sem nome/email/notas nos parâmetros dos eventos.
- CheckoutRedirect e AppStoreClick são eventos personalizados de saída. **Não** representam compra ou assinatura.
- `/mappa-della-bibbia/grazie/` tem PageView. A Mundpay pode enviar o visitante para essa URL mesmo após recusa: por isso a página nunca dispara Purchase por conta própria.
- InitiateCheckout, AddPaymentInfo e Purchase pertencem à integração nativa do checkout. Não duplicar esses eventos na página com IDs diferentes.
- Dados pessoais de prefill e tokens assinados de recuperação são removidos do URL depois da leitura dos campos e antes do carregamento da Meta. Preferências negativas existentes, DNT, GPC e `fm_test=1` impedem carregamento/envios.
- A exceção CSP para a Meta é restrita ao caminho da nova coleção. A política web foi atualizada sem alterar as declarações do app nativo.
- Publicação validada em 17/11: pixel `2184650478741381` com estado `loaded` na página canônica de vendas e na página de retorno, sem erros no console. Os dois caminhos permitem os domínios da Meta na CSP; `/app/` mantém a política anterior. Os 17 testes focados e o build do site passaram. Não foi feita compra real para validar Purchase de ponta a ponta.

## Produtos

Livro Mundpay: `3891abcc-aaa1-4bae-bd7b-b316a853f717` — Mappa della Bibbia — Edizione Studio Cattolica. Checkout `01a1e740-380f-71d4-b88f-e8c4124b323f`, €39.

Assinatura Hotmart: Fideora Premium – Mappa della Bibbia; checkout `X108495940M`, oferta mensal `e792z6va`, 3 dias grátis e €7,99/mês na Itália.

Em 17/11, o Pixel RLG foi salvo no produto Hotmart `8973641`. A tela confirmou **Evento via Web — Configurado**, com **Vendas realizadas** e **Visitas na Página de pagamento**, todos os métodos e valor real da transação. O envio CAPI não foi configurado; depende de token válido.

Em 17/11, o Pixel RLG foi salvo no novo produto Mundpay com status **Active**. O token CAPI existente foi reutilizado do produto **Mappa della Bibbia MDB-IT** (`01a0961c-388c-7234-b58a-68908ac56515`), após orientação de Thales e confirmação de que ele usa o mesmo pixel `2184650478741381`. Os eventos `initiate_checkout`, `add_payment_info` e `purchase` foram habilitados. O produto original não foi alterado. Nenhum token é armazenado neste repositório. O status do cadastro não substitui uma validação de entrega de eventos à Meta com uma transação real.

## UTMify

Em 17/11, foi encontrada uma integração Mundpay → UTMify ativa, mas o novo livro não estava entre os produtos selecionados. O produto `3891abcc-aaa1-4bae-bd7b-b316a853f717` foi incluído e salvo na integração existente. A seleção foi confirmada ao reabrir a edição, preservando os demais produtos, eventos e meios de pagamento.

Na Hotmart, o webhook **Utmify** já estava ativo para **Todos os produtos**, incluindo o Fideora. Nenhum webhook duplicado foi criado.

O painel UTMify exigiu login e depois confirmação 2FA; a verificação do recebimento e da atribuição fica pendente até o usuário concluir a confirmação. Não foi enviada compra fictícia para a integração de produção. Uma transação real não é necessária para testar o carregamento do pixel ou a montagem de URLs; uma compra aprovada confirma o fluxo financeiro completo.

Preservar as UTMs existentes e validar separadamente a integração nativa de cada checkout. O script de UTMs da UTMify e seu pixel de otimização ainda não foram instalados nesta página; a navegação atual monta os links diretamente em JavaScript. Validar também `xcod` no fluxo Hotmart, pois os UTMs estruturados não são enviados no webhook Hotmart. O pixel da Meta não comprova recebimento de pedidos pela UTMify. Não declarar esta etapa completa antes da verificação do painel e dos parâmetros.

## Apple: implementação necessária

A auditoria do código atual não encontrou Meta SDK, configuração de Meta App ID/Client Token, coleta do `$fbAnonId` nem integração de ATT com RevenueCat. Essa parte exige configuração do aplicativo na Meta e uma nova versão iOS; não é resolvida pelo pixel da página.

1. Identificar/configurar o Meta App do Fideora, associar app iOS e fonte de eventos/dataset. O Meta App ID é diferente do ID do Pixel RLG. A fonte CAPI precisa estar associada ao Meta App.
2. Instalar e inicializar o Meta SDK no app Capacitor/iOS. Manter sinais de instalação/ativação. Desativar receita/compra automática do SDK quando RevenueCat for o emissor dessas compras.
3. Configurar Purchases e enviar `$fbAnonId` e os identificadores permitidos antes da primeira compra. Integrar os estados ATT conforme as permissões reais; não criar identificadores fictícios ou presumir autorização.
4. No projeto RevenueCat `0df93c61`, configurar Meta Ads via CAPI com o dataset associado e token correto. Separar sandbox de produção.
5. Mapear StartTrial, Subscribe/conversão do trial e renovações. Escolher e manter uma base de receita consistente; a integração documentada do RevenueCat envia USD, não o preço nominal em EUR.
6. Testar entrega e elegibilidade na Meta, além de recebimento no RevenueCat. Aceitação de evento não garante atribuição nem elegibilidade para otimização de campanhas.
7. Atualizar as declarações de privacidade/ATT, validar o binário e publicar uma nova versão iOS antes de declarar essa integração ativa.

Os campaign links da Apple existentes continuam úteis para análises agregadas por campanha, sujeitos a limites de privacidade; não são um vínculo individual entre clique web e cliente RevenueCat. Uma integração futura com UTMify deve manter vendas sem origem como não atribuídas e não inventar campanha para usuários anônimos.

Referências: https://www.revenuecat.com/docs/integrations/attribution/meta-ads ; https://www.revenuecat.com/docs/integrations/attribution/reference/meta-ads ; https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
