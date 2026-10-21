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
