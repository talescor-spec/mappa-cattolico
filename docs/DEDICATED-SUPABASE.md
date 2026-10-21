# Fideora — projeto Supabase exclusivo

Atualização: 21/10/2026. Decisão atual do titular: reaproveitar e renomear o projeto vazio sysuottboucultzzaagv para Fideora.

## Destino escolhido — decisão atual

- Projeto existente: sysuottboucultzzaagv (https://sysuottboucultzzaagv.supabase.co).
- Organização apresentada pelo titular: talescor-spec’s Org.
- Nome exibido atualmente: talescor-spec’s Project. Nome autorizado: Fideora.
- Região apresentada no print: us-west-2. Reaproveitar este projeto preserva sua região; Frankfurt não se aplica a esta decisão.
- O titular confirmou que Public, Auth, Storage e Edge Functions estão vazios e autorizou editar/renomear/reutilizar o projeto. O print confirma ausência de tabelas e views em public; os demais estados são confirmação do titular.
- Acesso liberado na conexão Supabase da organização vmrhiclzffhlmjwvzhcz. Schema aplicado e validado. Nome de exibição ainda é talescor-spec’s Project; a ferramenta de banco não oferece mudança de nome ou configuração de Auth e a conexão do navegador não respondeu nesta etapa.
- O pedido atual substitui a criação de outro projeto junto do Herbalia. Não é necessária contratação de plano nem liberação de vaga para reaproveitar este projeto já existente.

## Tentativa anterior de criar outro projeto

O estimador `get_cost` retornou US$ 0/mês. A criação foi tentada uma vez e rejeitada pelo Supabase: o membro talescor-spec atingiu o limite de dois projetos gratuitos ativos entre organizações onde é administrador ou proprietário. Não houve criação parcial; a listagem da conexão continua mostrando apenas herbalia. Essa conexão é restrita à organização escolhida e não permite identificar o outro projeto contabilizado pelo limite global do usuário.

Esse bloqueio motivou a decisão posterior de reutilizar o projeto vazio existente. Não foi solicitado upgrade, contratado plano, pausado ou excluído qualquer projeto. O aplicativo continua no backend atual até existir um novo projeto configurado e validado.

## Auditoria da origem

Consulta somente de leitura ao projeto metrics-dashboard (`kgyqpedwgilotlwyhmnb`) confirmou:

| Tabela | Registros |
|---|---:|
| fideora_profiles | 0 |
| fideora_progress | 0 |
| fideora_study_entries | 0 |

Não há registros nessas três tabelas para copiar neste momento. Isso não significa que não existam dados locais nos dispositivos ou usuários na autenticação compartilhada. Não copiar todos os usuários de Auth do Funnel Metrics para o projeto novo. Reconferir as contagens imediatamente antes da troca. Preservar os dados locais do app e a identidade de compras RevenueCat; restauração e novo login devem ser validados em build assinado.

## Configuração preparada para execução após acesso

1. Conectar o projeto existente sysuottboucultzzaagv, conferir seu ID e região, e renomeá-lo para Fideora. A configuração desse projeto não requer pausar ou excluir outros projetos.
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

## SQL de instalação preparado

FIDEORA-SETUP.sql reúne as seis migrações já versionadas, em uma transação, com proteção que recusa schema public com tabelas/views ou presença de usuários/buckets. O cabeçalho identifica o único destino autorizado. A proteção por conteúdo não substitui conferir o ID no painel; não é possível comprovar o project ref apenas pelo banco padrão.

Pacote aplicado com sucesso somente em sysuottboucultzzaagv, migração 20261021181147_fideora_dedicated_initial_schema. A instalação e os testes do banco estão descritos abaixo. Não executar novamente: a proteção inicial recusa um schema já ocupado. Não executar no Funnel Metrics ou no Herbalia.

Após conexão, configurar Site URL https://fideora.app e redirects exatos, validar SMTP, obter somente a chave publishable e então atualizar URL/chave/CSP/callback no app. A branch Premium prepara o hostname e a chave publishable do backend exclusivo; a produção web mantém o backend antigo até concluir Auth/SMTP e validar a troca.

## Instalação e verificação concluídas — 21/10/2026

- Metadata confirmada por API: ID sysuottboucultzzaagv, organização vmrhiclzffhlmjwvzhcz, região us-west-2, ACTIVE_HEALTHY. Nome de exibição continua talescor-spec’s Project.
- Antes da migração: nenhuma tabela/view em public, nenhum usuário Auth, nenhum bucket e nenhuma Edge Function.
- Migração fideora_dedicated_initial_schema aplicada com sucesso, versão 20261021181147.
- Três tabelas com RLS ativo e nove políticas: fideora_profiles, fideora_progress, fideora_study_entries. authenticated recebe apenas SELECT/INSERT/UPDATE. anon não recebe acesso a tabelas nem à função de exclusão.
- Teste transacional real de dez propriedades passou: visibilidade própria, atualização própria, bloqueio de escrita entre usuários, rejeição de inserção em outro usuário, rejeição de escrita antiga, remoção do conteúdo de tombstone, bloqueio anônimo, exclusão própria com cascade e preservação do outro usuário. Os dois usuários fictícios e dados de teste foram revertidos por ROLLBACK. Consulta posterior confirmou Auth e dados vazios.
- Script reproduzível: SUPABASE-ISOLATION-TEST.sql. Usar apenas no projeto dedicado com autorização de teste.
- Data API com a chave publishable: /auth/v1/settings retornou 200, e-mail habilitado, inscrição habilitada e confirmação de e-mail obrigatória. As três tabelas retornaram 401 para chamada anônima, como esperado.
- Advisor de segurança apresenta somente um aviso intencional sobre public.fideora_delete_own_account() ser SECURITY DEFINER e executável por authenticated. A função não aceita usuário alvo, deriva auth.uid(), exige sessão e usa search_path vazio. Testes confirmaram bloqueio anônimo e preservação do outro usuário. Referência: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable. Não é descrito como zero avisos.
- Cliente preparado na branch Premium: URL e chave publishable correspondentes ao projeto exclusivo, CSP HTTPS/WSS restrito ao novo host e callback padrão https://fideora.app. Vercel não apresenta variáveis de ambiente que substituam esses valores. Nenhuma chave secret/service_role foi obtida ou adicionada ao cliente.
- Build passou, 20 testes passaram e 24 verificações estruturais passaram. Isso não comprova login real por e-mail, compra StoreKit, TestFlight ou aprovação Apple.

## Pendências para ativar o backend na produção

1. Renomear o projeto no painel para Fideora: https://supabase.com/dashboard/project/sysuottboucultzzaagv/settings/general.
2. Auth URLs: https://supabase.com/dashboard/project/sysuottboucultzzaagv/auth/url-configuration. Site URL https://fideora.app; Redirect URLs exatos https://fideora.app e https://fideora.app/. O app também aceita código/link de e-mail manualmente; retorno automático para iOS não é declarado validado.
3. SMTP: https://supabase.com/dashboard/project/sysuottboucultzzaagv/auth/smtp. Configurar o envio público com o provedor da caixa support@fideora.app e seus dados reais de SMTP. O titular deve inserir a senha diretamente no painel. A existência da caixa não configura o SMTP do Supabase. O remetente deve ser autorizado no provedor. Manter a confirmação de e-mail.
4. Validar com o titular um recebimento e login reais e só então preparar e publicar o mesmo ajuste no main. Nenhum e-mail foi enviado pelo agente. Produção continua no projeto compartilhado até esse aceite; não afirmar migração concluída.

O conector de banco não oferece edição de nome, Site URL, Redirect URLs ou SMTP. A conexão do navegador não respondeu às tentativas de acesso e de reconexão nesta etapa; nenhuma sessão alternativa foi usada. As três ações acima permanecem necessárias no painel.

### Campos de SMTP para o painel

Ativar Custom SMTP no projeto sysuottboucultzzaagv e preencher:

| Campo | Valor |
|---|---|
| Sender email | support@fideora.app |
| Sender name | Fideora |
| Host | br878.hostgator.com.br |
| Port | 587 (TLS/STARTTLS) |
| Username | support@fideora.app |
| Password | Senha da caixa de e-mail, inserida pelo titular diretamente no painel |

O servidor br878 foi identificado no cPanel da hospedagem existente. A HostGator documenta o uso do servidor da hospedagem, usuário com endereço completo e porta 587 com TLS. Nenhuma senha foi lida ou salva no repositório. Referências: https://supabase.com/docs/guides/auth/auth-smtp e https://suporte.hostgator.com.br/hc/pt-br/articles/30812261267731-Como-configurar-o-recebimento-e-envio-de-e-mails-no-aplicativo-Gmail-Android-iOS.

### Preview conferido

- Commit do app: 54bc3091fd2546997008b7183211fb4d94b8632a.
- Preview READY: https://mappa-cattolico-3225qzau9-thales-projects-54040b4e.vercel.app.
- HTML e bundle JavaScript publicados retornaram HTTP 200 por acesso autenticado. O bundle contém o hostname novo e não contém o hostname antigo. A CSP entregue aponta HTTPS/WSS somente ao projeto dedicado.
- GitHub Security & Build Check 39652197485 passou. O workflow iOS Simulator 39652187002 ainda estava em execução na última consulta; não é declarado aprovado.
- Inspeção visual e login real permanecem pendentes devido à conexão indisponível do navegador e à configuração Auth/SMTP ainda necessária. A produção fideora.app não foi promovida para este preview.
