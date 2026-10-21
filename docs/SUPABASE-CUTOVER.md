# Fideora — ativação do backend exclusivo

Data: 21/10/2026.

- Destino: sysuottboucultzzaagv, nome Fideora, organização vmrhiclzffhlmjwvzhcz, região us-west-2.
- Origem preservada: metrics-dashboard (kgyqpedwgilotlwyhmnb), compartilhada com Funnel Metrics. Nenhum usuário, tabela ou configuração da origem foi alterado nesta ativação.
- Schema dedicado instalado e testado anteriormente: três tabelas com RLS, nove políticas e dez propriedades de isolamento/exclusão verificadas com testes transacionais revertidos. O aviso intencional do advisor para a RPC de exclusão SECURITY DEFINER está documentado na branch Premium em DEDICATED-SUPABASE.md.
- Titular confirmou configuração do painel, recebimento de link e login bem-sucedido. Consulta agregada posterior confirmou um usuário Auth confirmado e com login registrado, um perfil e um registro de progresso. Não foram lidos e-mails, tokens ou sessões do usuário.
- Alteração de produção limitada à URL/chave publishable, callback https://fideora.app e CSP HTTPS/WSS do projeto dedicado. Vercel não apresenta variáveis de ambiente que substituam esses valores. Nenhuma chave secret/service_role foi obtida.
- Versão Premium nativa não foi mesclada ou submetida para Apple Review por esta ativação.
- Nenhuma conta Auth compartilhada foi migrada. Dispositivos que usavam sessão antiga poderão precisar entrar novamente. Dados locais e identidade de compras continuam sujeitos ao fluxo existente; restauração nativa e comportamento em outro dispositivo precisam de teste em build assinado.
- O login confirmado ocorreu na versão preparada, antes da publicação. Validação automática do domínio comprova artefatos, CSP e disponibilidade HTTP; não substitui teste posterior do login pelo titular no domínio final. A conexão do navegador permaneceu indisponível para inspeção visual.

## Validação local

- Build de produção concluído; 10 testes passaram e 24 verificações estruturais passaram.
- Bundle compilado contém somente o hostname dedicado; hostname antigo ausente. Nenhuma variável de ambiente local foi copiada para este checkout.

## Publicação

Aguardando build e conferência da versão de produção. Registrar deployment, commit e resultado HTTP após conclusão.
