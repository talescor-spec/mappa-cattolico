# Fideora — preparação e aceite TestFlight

21/10/2026. App Apple 6825337165, Bundle ID com.fideora.app, equipe CZ7QKZBQC8.

## Resumo e estado

A versão Premium em italiano/português usa o backend exclusivo e os planos Apple/RevenueCat configurados. O workflow iOS Simulator 39652187002 compilou e abriu o commit de código 54bc3091fd2546997008b7183211fb4d94b8632a com sucesso. As revisões posteriores da branch até b4329504bb79013bca4b81f698cae99be09a6cc3 alteram apenas documentação. Isso não é archive assinado nem build TestFlight. A sessão Apple e os certificados do Mac não estão disponíveis neste ambiente Linux. A conexão do navegador não respondeu nas etapas recentes; estado atual de builds processadas e contato de review não foi inspecionado novamente.

O titular informou aceite do contrato Apple e confirmou recebimento de e-mail/login no backend exclusivo. O banco confirmou usuário autenticado e perfil/progresso criados. Não repetir o aceite do contrato como pendência já conhecida; verificar apenas se o portal apresenta uma nova exigência.

## Riscos para a próxima etapa

| Prioridade | Área | Constatação | Evidência | Impacto para review | Correção | Esforço | Confiança |
|---|---|---|---|---|---|---|---|
| P0 | Distribuição | Archive assinado/upload não comprovados | CI usa CODE_SIGNING_ALLOWED=NO | Não há release candidata validada | Assinar e enviar pelo Xcode; conferir processamento | Médio | Verificado |
| P1 | Compras | Compra/restauração/expiração não testadas em iPhone | Sem transações de aceite registradas | Premium pode falhar no aparelho | Executar cenários abaixo no sandbox | Médio | Verificado |
| P1 | Conta | Login e exclusão nativos não aceitos em aparelho | Login web confirmado; preflight/CI somente | Jornada de conta pode falhar no iPhone | Testar código/link, relançamento e exclusão de conta QA | Médio | Verificado |
| P1 | App Store | Contato, screenshots finais e publicação de privacidade sem aceite final | Registro anterior e gate permanente | Impede submissão completa | Conferir build final e preencher dados reais no portal | Médio | Estado atual não reconferido |

## Preparar no Mac

Pré-requisitos: Xcode com componentes iOS instalados e conta Apple Developer adicionada; Node 22 ou 24; Git. O app usa recursos empacotados, não uma URL web remota. A branch correta é fideora-premium-v1; main ainda contém a versão web gratuita.

Os comandos abaixo criam uma pasta nova na Mesa, sem substituir projetos existentes. Nenhuma senha ou chave privada deve ser colocada no Terminal ou no chat.

```sh
FIDEORA_TESTFLIGHT_DIR="$(mktemp -d "$HOME/Desktop/Fideora-TestFlight.XXXXXX")"
git clone --single-branch --branch fideora-premium-v1 https://github.com/talescor-spec/mappa-cattolico.git "$FIDEORA_TESTFLIGHT_DIR"
cd "$FIDEORA_TESTFLIGHT_DIR"
git checkout b4329504bb79013bca4b81f698cae99be09a6cc3
npm ci
npm run cap:ios
open ios/App/App.xcodeproj
```

No Xcode:

1. Selecione o target App e Signing & Capabilities. Ative Automatically manage signing e escolha a equipe CZ7QKZBQC8. Preserve o Bundle ID com.fideora.app.
2. Confira versão 1.0.0 e build. O projeto usa build 1; se esse número já tiver sido enviado para essa versão, escolha um número superior antes de arquivar.
3. Selecione um destino genérico de aparelho iOS, não um simulador. Use Product → Archive.
4. No Organizer, selecione o archive e Distribute App → App Store Connect → Upload. Conclua os passos que a versão instalada do Xcode apresentar.
5. Após processamento, abra https://appstoreconnect.apple.com/apps/6825337165/testflight. Confira Bundle ID, versão e build. Responda à criptografia conforme a build real; o projeto declara ITSAppUsesNonExemptEncryption=false.
6. Disponibilize a build ao grupo interno de QA do Fideora. A criação/convite de pessoas deve usar os destinatários realmente autorizados. Instale pelo TestFlight no iPhone.

Não selecionar submissão pública para App Review nesta etapa. O gate de revisão exige os resultados abaixo e o acabamento do registro Apple.

## Jornada e resultados a registrar no iPhone

| Passo | Verificação | Resultado esperado |
|---|---|---|
| 1. Instalação | Abrir uma instalação nova pelo TestFlight | Carrega sem tela vazia; italiano inicial |
| 2. Onboarding | Percorrer, escolher idioma, fechar oferta | IT/PT funcionam; caminho gratuito acessível |
| 3. Login | Solicitar e-mail e inserir código/link no próprio app | Sessão no backend exclusivo; relançamento preserva conta. Retorno automático via Safari não é declarado validado |
| 4. Grátis | Devocional diário/reflexão e orações básicas | Funcionam sem assinatura e sem conta obrigatória |
| 5. Paywall | Abrir recurso Premium | Preço localizado, período, restauração, termos e privacidade visíveis |
| 6. Compra | Testar mensal e anual com identidades QA elegíveis | Ambos liberam premium; mensal sem trial; anual mostra sete dias apenas se elegível; valor anual integral claro |
| 7. Restauração | Mesmo Apple ID após reinstalação; testar sessão visitante e login | Acesso restaurado corretamente; cancelamento/erro não travam o app |
| 8. Conta | Conferir identidade e sincronização consentida | UUID Supabase corresponde à identidade RevenueCat após login; conta diferente não recebe notas/progresso alheios |
| 9. Exclusão | Excluir somente conta QA criada para o teste | Exclusão parte do app, remove dados próprios e explica que assinatura Apple é cancelada separadamente |
| 10. Links | Abrir suporte, privacidade, termos e gestão de assinatura | Páginas corretas em fideora.app e gestão Apple acessíveis |
| 11. Estados | Sem rede, cancelamento da compra e expiração | Erros recuperáveis; acesso expira corretamente; dados pessoais existentes continuam legíveis/exportáveis |

Apple define as compras do TestFlight como sandbox e acelera renovações. Não esperar sete dias corridos para concluir cenários de expiração; registrar a configuração efetivamente usada. Não usar alteração de flag local como evidência de compra. Registrar build, iOS/aparelho, cenário, resultado, data e referência da transação de teste sem publicar recibos, tokens ou dados pessoais.

Valores base configurados na Itália: €19/mês e €59/ano. Em outro storefront, comparar com o preço localizado Apple, não com um número fixo em euros. O paywall deve refletir a elegibilidade Apple, inclusive em restauração e assinaturas anteriores.

## Notas de review preparadas

Usar a descrição Premium e Review notes de PREMIUM-STORE-COPY.md. Italian is the default language; Portuguese can be selected in onboarding/Profile. The daily devotional and basic prayers are free. Premium features open the RevenueCat paywall. Both subscriptions unlock the same premium entitlement. Purchase, restore and subscription management are available without mandatory account creation. An optional account provides sync; deletion is in Profile and does not cancel an Apple subscription. Provide a verified review account if necessary: [REVIEW EMAIL / ACCESS INSTRUCTIONS — not supplied]. Do not invent credentials or mark signed-device checks as passed before execution.

## Referências oficiais consultadas

- https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases
- https://developer.apple.com/help/app-store-connect/test-a-beta-version/testing-subscriptions-and-in-app-purchases-in-testflight/
- CI: https://github.com/talescor-spec/mappa-cattolico/actions/runs/39652187002
- Gate permanente: APP_STORE_REVIEW_GATE.md e .github/skills/apple-appstore-reviewer/SKILL.md.
