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
