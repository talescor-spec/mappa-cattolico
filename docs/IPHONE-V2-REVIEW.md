# Fideora — ajustes após teste físico da build 1

21/10/2026. Auditoria inicial, antes das alterações. Evidência: prints IMG_4985 a IMG_4995 fornecidos pelo titular. Não publicar prints de compra que contenham endereço de e-mail ou dados da transação.

## Resumo

Apple exibiu compra anual sandbox bem-sucedida e a tela do app confirmou Premium ativo. Restauração, expiração, troca de conta e exclusão nativas ainda não têm aceite. Esta revisão atende ajustes de onboarding, perfil, acesso gratuito e comunicação das edições. Nenhuma compra externa, alteração de preços ou criação automática de conta será introduzida.

## Riscos e correções previstas

| Prioridade | Área | Achado | Evidência | Impacto | Correção | Esforço | Confiança |
|---|---|---|---|---|---|---|---|
| P2 | Onboarding | Fechamento visualmente pesado e rodapé com dois links colados | IMG_4985–4987 | Distração e acabamento | Ícone menor, área de toque preservada; retirar CTA gratuito redundante | Baixo | Verificado |
| P2 | Personalização | Nome só aparece no Perfil | IMG_4993 | Jornada inicial impessoal | Nome opcional no onboarding, local, reutilizado no login explícito | Baixo | Verificado |
| P1 | Conta | Premium ativo seguido de formulário de login induz confusão | IMG_4994–4995 | Expectativa de conta criada por compra | Separar assinatura Apple e sincronização opcional; recolher formulário após assinatura | Baixo | Verificado |
| P1 | Acesso | Grátis só mostra a leitura diária | Código e requisito do titular | Novo acesso parcial precisa respeitar gates | Liberar Gênesis/Êxodo, bloquear outros livros e navegação entre limites; manter ferramentas Premium | Médio | Verificado |
| P1 | Conteúdo | Copy destaca contagem e sugere abrangência do cânon | IMG_4987–4988 | Não prometer livros ausentes ao público católico | Remover número dos destaques; descrever edições incluídas; preservar aviso de deuterocanônicos em Fontes/Termos | Baixo | Verificado |
| P2 | Preço | App italiano mostra BRL | IMG_4988–4989 | Tradução não determina moeda | Preservar preço da loja Apple; explicar contexto ao titular | Baixo | Comportamento esperado |

## Jornada a verificar

1. Instalação/abertura: italiano inicial e português selecionável.
2. Onboarding: nome opcional, objetivo, tempo e resumo; fechar em qualquer etapa; sem CTA gratuito no rodapé.
3. Conta: perfil local separado de sincronização; nome informado acompanha solicitação explícita de login.
4. Grátis: Gênesis/Êxodo completos e trecho diário; seletor mostra os demais com cadeado.
5. Premium: seleção de livro bloqueado, busca, anotação nova, glossário e ferramentas avançadas abrem oferta.
6. Compra: anual com trial apenas se elegível e mensal sem trial; verificar novamente no build assinado novo.
7. Restauração/expiração: preservar restauração e leitura/exportação de conteúdo pessoal existente.
8. Perfil: Premium ativo com sincronização opcional recolhida; conta já autenticada exibe controles de nuvem/exclusão.
9. Exclusão: somente conta QA, aviso de que assinatura Apple é gerenciada separadamente.
10. Fontes/links: edições históricas identificadas, aviso de ausência dos deuterocanônicos acessível.
11. Estados: offline, seleção persistida de livro Premium após expiração e fronteiras da navegação.

## Notas de review

Free reading now includes Genesis and Exodus plus the daily devotional excerpt. Other books and advanced study/prayer tools require Premium. Purchase does not require email authentication; optional email login enables sync. Existing personal data remains accessible/exportable after expiry. See PREMIUM-STORE-COPY.md for the final bilingual store copy and review steps. No signed-device acceptance is claimed for this new revision until tested.

## Verificação da revisão

Código: aec9e2a67f390b9761c01c685f8b807c95d19427, branch fideora-premium-v1. Testes locais: 21 aprovados; build/Capacitor sync e 24 verificações de preflight aprovados. CI iOS compilou e abriu o app no simulador com sucesso: https://github.com/talescor-spec/mappa-cattolico/actions/runs/39669431128. Nome e idioma foram preservados após recarregar o preview. Essa verificação não substitui o teste de compras no aparelho.

Preview: https://mappa-cattolico-213t5dpga-thales-projects-54040b4e.vercel.app. No navegador real foram conferidos onboarding de quatro etapas, nome na saudação e Perfil, ausência do CTA gratuito no rodapé, cópia IT/PT e ausência de overflow horizontal nas telas verificadas em 320 e 390 pontos. Ícone de fechar: 16 pontos; alvo de toque: 44 pontos. Gênesis e Êxodo aparecem gratuitos; selecionar Levítico ou avançar de Êxodo 40 abre Premium. A leitura diária exibiu somente Lucas 24,13–35, com troca de capítulo desabilitada. Não simular assinatura por flag local para validar compras.

Paywall remoto wfc1f6a56c9adc4b9a: textos italiano e português sem contagem numérica publicados na RevenueCat e conferidos na lista Published. Variáveis de preço, trial e pacotes preservados. A loja Apple determina a moeda, independentemente do idioma do app. A descrição das edições e a ausência dos deuterocanônicos permanecem acessíveis em Fontes/Termos; não anunciar uma Bíblia católica completa.

![Onboarding em português, com nome opcional e fechamento reduzido](assets/fideora-v2-onboarding.jpg)

## Atualizar o projeto existente no Mac

Fechar o Xcode e abrir o Terminal na pasta do projeto já usado para o build 1. O comando abaixo atualiza somente para o código revisado; não usa reset nem descarta ajustes locais. Se o Git apontar conflito, interromper e revisar os arquivos indicados. O arquivo project.pbxproj desta revisão não mudou em relação ao código anterior, para preservar a equipe Apple escolhida localmente.

```sh
bash <<'FIDEORA_UPDATE'
set -e
test -f ios/App/App.xcodeproj/project.pbxproj
FIDEORA_EXTERNAL_STORAGE=""
for FIDEORA_HD in /Volumes/"THALES HD 500GB"*; do
  [ -d "$FIDEORA_HD" ] || continue
  FIDEORA_EXTERNAL_STORAGE="$FIDEORA_HD/Fideora-Build"
  break
done
test -n "$FIDEORA_EXTERNAL_STORAGE"
mkdir -p "$FIDEORA_EXTERNAL_STORAGE/npm-cache"
git fetch origin fideora-premium-v1
git checkout aec9e2a67f390b9761c01c685f8b807c95d19427
npm ci --cache "$FIDEORA_EXTERNAL_STORAGE/npm-cache"
npm run cap:ios
open ios/App/App.xcodeproj
FIDEORA_UPDATE
```

No target App → General: manter Version 1.0.0 e trocar Build para **2** (ou um número superior se 2 já tiver sido usado). Confirmar equipe CZ7QKZBQC8 em Signing & Capabilities. Product → Archive → Distribute App → App Store Connect → Upload. DerivedData e Archives já foram confirmados no HD externo pelo titular; não refazer a configuração com caminhos contendo %20. Esse procedimento usa o checkout existente; não afirma que ele já foi movido para o HD externo.

O nome no onboarding aparece na primeira instalação; quem já concluiu pode alterá-lo no Perfil. Após instalar a nova build, testar restauração, expiração, troca de conta e exclusão com uma conta QA antes de App Review. O perfil Premium sem login deve oferecer sincronização opcional recolhida. A revisão ainda não foi enviada ao TestFlight nem à App Review.
