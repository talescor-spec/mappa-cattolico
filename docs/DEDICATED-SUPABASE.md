# Fideora — projeto Supabase exclusivo

Atualização: 21/10/2026. Pedido do titular: criar Fideora na mesma organização do Herbalia.

## Destino escolhido

- Organização: Thales' projects (`vercel_icfg_gMZoq0C5JUM3jIbm6Xome037`).
- Conexão: thales supabase.
- Nome solicitado: Fideora.
- Região prevista: eu-central-1, Frankfurt, considerando o público principal italiano. A região só será efetiva após criação bem-sucedida.

## Resultado da tentativa

O estimador `get_cost` retornou US$ 0/mês. A criação foi tentada uma vez e rejeitada pelo Supabase: o membro talescor-spec atingiu o limite de dois projetos gratuitos ativos entre organizações onde é administrador ou proprietário. Não houve criação parcial; a listagem da conexão continua mostrando apenas herbalia. Essa conexão é restrita à organização escolhida e não permite identificar o outro projeto contabilizado pelo limite global do usuário.

É necessário liberar uma vaga gratuita ou aprovar uma alternativa paga com preço concreto. Não foi solicitado upgrade, contratado plano, pausado ou excluído qualquer projeto. O aplicativo continua no backend atual até existir um novo projeto configurado e validado.

## Auditoria da origem

Consulta somente de leitura ao projeto metrics-dashboard (`kgyqpedwgilotlwyhmnb`) confirmou:

| Tabela | Registros |
|---|---:|
| fideora_profiles | 0 |
| fideora_progress | 0 |
| fideora_study_entries | 0 |

Não há registros nessas três tabelas para copiar neste momento. Isso não significa que não existam dados locais nos dispositivos ou usuários na autenticação compartilhada. Não copiar todos os usuários de Auth do Funnel Metrics para o projeto novo. Reconferir as contagens imediatamente antes da troca. Preservar os dados locais do app e a identidade de compras RevenueCat; restauração e novo login devem ser validados em build assinado.

## Configuração preparada para execução após liberação

1. Criar o projeto no destino escolhido e conferir organização, ID e região efetivos. Garantir que o ID seja diferente de kgyqpedwgilotlwyhmnb e do Herbalia fdpwtslfvhujzrkdkpjh.
2. Aplicar, somente no projeto Fideora novo, as seis migrações versionadas de supabase/migrations em ordem de timestamp. Elas definem três tabelas, políticas por auth.uid(), atualização de progresso, sincronização de estudos e exclusão da própria conta. Executar os advisors e validar ausência de acesso anônimo e isolamento entre dois usuários. A evolução de idiomas do schema pode preservar compatibilidade histórica; a interface permanece apenas IT/PT, com italiano principal.
3. Configurar Auth no projeto novo com Site URL https://fideora.app, redirects exatos https://fideora.app e https://fideora.app/, incluindo callbacks nativos efetivamente utilizados. Configurar remetente e SMTP próprio para uso público; não presumir que a existência de support@fideora.app configura o envio de autenticação automaticamente.
4. O changelog atual informa que novos projetos Free não podem customizar os templates de Auth com SMTP padrão. A configuração de SMTP deve ser validada antes de afirmar que o login por e-mail está pronto para produção.
5. Obter apenas a chave publishable do novo projeto. Atualizar VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY e VITE_AUTH_REDIRECT_URL de forma consistente e revisar os valores padrão em src/lib/supabase.js. Não publicar chave secret/service_role.
6. Atualizar connect-src em vercel.json para os hosts HTTPS/WSS do novo backend. Atualizar o callback padrão em AuthContext.jsx apenas após o allowlist do novo projeto estar configurado. Tratar a sessão antiga e verificar a separação do armazenamento local por conta/projeto.
7. Atualizar src/data/legal.json e páginas geradas com a região real do novo projeto, além da documentação de identidade, implantação e revisão Apple. A região publicada permanece us-west-2 enquanto a troca não ocorrer.
8. Testar build, login e retorno em fideora.app, sincronização consentida, exportação, exclusão da própria conta, restauração de compras e acesso em outro dispositivo. Somente depois publicar o app apontando para o backend novo.
9. Guardar a origem para retorno. A limpeza de tabelas e triggers antigos deve ser uma etapa separada, com autorização e verificação de dependências do Funnel Metrics. Nenhuma limpeza foi executada.

## Referências consultadas

- https://supabase.com/changelog.md
- https://supabase.com/docs/guides/troubleshooting/migrating-auth-users-between-projects
- https://supabase.com/changelog/46599-changes-to-email-template-customisation-on-free-tier
