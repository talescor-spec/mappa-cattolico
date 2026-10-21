# Fideora — domínio e e-mail

21/10/2026. Pedido autorizado: conectar o domínio comprado na GoDaddy à Vercel e integrar e-mail HostGator.

## Auditoria antes de alterar o código

Fideora é um app IT/PT de leitura, estudo e oração. A produção web continua na V1 gratuita; as assinaturas Apple/RevenueCat estão na branch Premium aguardando testes nativos. O domínio não altera permissões, dados, preços ou assinatura.

| Prioridade | Área | Evidência | Risco | Tratamento | Esforço | Confiança |
|---|---|---|---|---|---|---|
| P1 | Links | Metadados e paywall usam o endereço Vercel anterior | Identidade de marca e políticas inconsistentes | Publicar páginas legais atuais no domínio e atualizar URLs IT/PT | Baixo | Verificado |
| P1 | Login | Backend compartilhado; painel Supabase aberto está em outra conta | Alterar URL global pode afetar outros apps; novo callback não confirmado | Preservar callback atual até adicionar URL exata do novo domínio na conta correta | Externo | Verificado |
| P1 | E-mail | cPanel acessível, mas o portal de criação de plano de e-mail exige login | Não é possível confirmar provisionamento da caixa | Preparar domínio e registros; completar a caixa após acesso ao portal | Externo | Verificado |
| P2 | DNS | GoDaddy mantém NS; Vercel fornece A/CNAME próprios do projeto | Apontar MX para o site faria e-mail falhar | Separar registros web e mail; preservar NS e demais registros | Baixo | Verificado |

## Aceite

Abrir domínio em HTTPS → confirmar redirecionamento www → conferir páginas legais IT/PT → links no app/RevenueCat/App Store → validar DNS de e-mail → provisionar caixa e testar envio/recepção com o titular. Revisão Apple e testes de compra permanecem separados.

## Notas para review

Official website and legal URLs use https://fideora.app. Italian is primary and Portuguese is supported. The domain change does not alter purchase entitlements. Apple IAP acceptance and signed TestFlight validation remain pending.

## Estado inicial

- GoDaddy é o registrador e DNS autoritativo: ns31.domaincontrol.com e ns32.domaincontrol.com.
- Vercel: projeto mappa-cattolico; domínio apex e www cadastrados e verificados. Registros A do apex já foram salvos e o site respondeu HTTPS 200.
- HostGator: domínio adicionado ao cPanel com raiz separada. Conta de e-mail ainda não criada; portal solicita login.
- App Store: contato de review continua necessário para salvar descrições e notas. Não houve submissão.

## Integrações salvas

- Apex A: 216.198.79.1 e 64.29.17.1, exatamente os alvos retornados pela Vercel para este projeto.
- www CNAME: a1c78520ab217f83.vercel-dns-017.com; Vercel configura redirecionamento 308 para fideora.app.
- E-mail HostGator: mail A 108.167.132.224; MX @ prioridade 0 → mail.fideora.app; SPF `v=spf1 mx include:websitewelcome.com ~all`; DKIM default._domainkey copiado da chave pública gerada no cPanel. O mecanismo SPF `a` do modelo HostGator foi omitido porque o apex aponta para a Vercel, que não é emissor de e-mail.
- Nameservers, SOA e política DMARC existentes preservados. Nenhuma senha criada, plano pago contratado ou mensagem enviada.
- A caixa support@fideora.app ainda não foi provisionada: portal HostGator está na tela de login. DNS não comprova existência ou entrega de uma caixa.
- Callback Supabase permanece no endereço Vercel autorizado. O painel está autenticado em outra conta, sem acesso ao projeto compartilhado metrics-dashboard. O conector consegue ler esse projeto, mas não oferece edição de Auth URL Configuration. Antes de trocar o callback do app, adicionar exatamente https://fideora.app e https://fideora.app/ na lista do projeto correto, preservando os outros aplicativos e a Site URL global.
- Produção web: alteração limitada a páginas legais atuais, referência canônica e URLs de documentação. Funcionalidades Premium não publicadas por essa alteração.
- Validação local da integração: 10 testes da base de produção, build e 24 verificações estruturais passaram. Testes de compra/Trial do app continuam pendentes.

## Resultado verificado em produção

- PR #5 incorporada ao main: `a1c976c28c2e4c38711a67f4df4c4da6af6bb4d1`.
- Deployment Vercel `dpl_5LHZnDh3kbBuHoh4SJJX3WtwCdPQ`: READY, com aliases fideora.app e www.fideora.app atribuídos.
- HTTPS: raiz 200; www redireciona 308 para https://fideora.app/. Raiz e páginas privacy/terms/support responderam 200. Canonical da raiz aponta para https://fideora.app/.
- DNS público consultado: A, CNAME, MX, SPF e DKIM correspondem aos registros salvos. Isso não equivale a teste de entrega de e-mail.
- CI Security & Build da integração: sucesso, run 39637628202. Testes locais, build e verificações estruturais passaram.
- RevenueCat: URLs de termos e privacidade IT/PT verificadas na tabela Localization. Offering default mostra Published após publicar a alteração. Preços dinâmicos e regras de trial preservados; números de prévia Test Store não representam preços Apple.
- App Store / App Privacy: URLs IT e PT salvas no novo domínio. Alterações serão lançadas com a próxima versão. Não houve submissão à revisão.
- App Store / versão 1.0.0: descrições, Support URL e Marketing URL IT/PT preparados com o domínio novo. Permanecem sem salvar na página de versão enquanto faltar contato de review. Os valores pessoais eventualmente preenchidos pelo titular foram preservados.
- Evidência visual do site: assets/fideora-domain-live.jpg.

## Próximos acessos necessários

1. Entrar no portal HostGator aberto para confirmar o serviço de e-mail disponível, provisionar support@fideora.app e testar envio/recepção. Se houver contratação, solicitar autorização para o preço concreto antes de comprar. A senha da caixa deve ser definida pelo titular.
2. Abrir a conta Supabase com acesso ao projeto kgyqpedwgilotlwyhmnb, autorizar as URLs exatas indicadas acima e só então alterar o callback do app. Site URL global e demais apps devem ser preservados.
3. Completar os dados reais de contato da revisão Apple, salvar os metadados e executar o aceite StoreKit em build assinado antes de submeter.

## Atualização HostGator após login do titular — 21/10/2026

- Login no Portal do Cliente confirmado. Plano M ativo inclui e-mail básico cPanel/Roundcube, sem contratar Titan ou iniciar teste pago.
- Plataforma cPanel ativada para fideora.app; painel exibiu “E-mail cPanel ativo com sucesso!”. O aviso informa que próximos domínios adicionados ao plano recebem cPanel automaticamente e essa escolha não permite migrar para Titan gratuito.
- Cadastro da primeira caixa preparado: support@fideora.app, quota de 1024 MB, sem armazenamento ilimitado.
- Caixa ainda NÃO criada. A confirmação da senha está vazia e o botão de criação está desabilitado. O campo senha apresentava preenchimento mascarado do navegador; nenhuma senha foi lida, gerada, copiada ou enviada pelo agente.
- Handoff ao titular para definir uma senha própria, confirmá-la e submeter “Criar Conta de E-mail”. Política do navegador exige que o titular conclua a entrada, confirmação e submissão de novas credenciais. Evidência: assets/fideora-mail-setup.jpg.
- Teste de entrega de e-mail e atualização dos canais públicos de suporte aguardam existência confirmada da caixa. Nenhuma mensagem enviada. Callback Supabase continua pendente do acesso à conta correta, conforme seção anterior.

## Caixa criada pelo titular — 21/10/2026

- Titular confirmou a criação de support@fideora.app após definir a senha no portal HostGator.
- Suporte e privacidade IT/PT atualizados com o contato privado support@fideora.app, incluindo link mailto nas páginas públicas e no conteúdo exibido dentro do app. Issues continuam como alternativa para relatos técnicos públicos sem dados pessoais.
- Não houve acesso ao conteúdo da caixa, leitura de senha nem envio de mensagens. A verificação adicional do painel ficou indisponível por demora da conexão do navegador; não é apresentada como concluída.
- DNS e acesso HTTPS às páginas serão conferidos após publicação. Entrega de mensagens ainda não foi testada. O retorno de autenticação Supabase permanece no endereço antigo até acesso à conta correta.
