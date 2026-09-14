# Fideora

Fideora é a evolução internacional do antigo **Mappa del Cattolico**: um aplicativo de fé católica com experiência premium e uma única marca para diferentes idiomas.

## Experiência atual

- Home diária com leitura/reflexão e atalhos de oração
- Santo Rosário com progresso salvo
- Orações tradicionais
- Novenas com acompanhamento de 9 dias
- Perfil, nome do usuário e sequência de uso
- Interface responsiva preparada para safe areas de iPhone/PWA
- Marca única **Fideora** em todos os idiomas

## Idiomas

- Italiano
- Francês
- Espanhol
- Português (Brasil)
- Inglês
- Alemão

A interface e o conteúdo essencial são localizados, enquanto o nome **Fideora** permanece igual em todos os mercados.

## Direção visual

O redesign usa uma linguagem mais editorial e premium:

- base ivory/branca
- verde profundo como cor institucional
- dourado discreto como acento
- tipografia editorial com Playfair Display + DM Sans
- cards mais limpos e menos sombras
- navegação inferior com cinco áreas: Hoje, Bíblia, Prega, Percursos e Perfil

## Stack

- React 18
- Vite 8
- Lucide React
- Capacitor 8 para o container iOS
- RevenueCat Capacitor para StoreKit/entitlements
- LocalStorage validado para progresso e preferências nesta etapa
- Vercel para preview/web

## Segurança

A branch Fideora inclui:

- Content Security Policy e headers defensivos no Vercel
- proteção contra versionamento acidental de `.env`/segredos
- regras explícitas para chaves públicas vs. server-only
- validação/sanitização do estado salvo no navegador
- `package-lock.json` para builds reproduzíveis
- CI com `npm ci`, auditoria de dependências e build
- Dependabot semanal

Consulte [`SECURITY.md`](./SECURITY.md) para as regras antes de conectar Supabase, Apple ou RevenueCat.

## iOS / assinatura

A base de iOS e RevenueCat já foi iniciada, mas nenhuma credencial real está no repositório. Consulte [`docs/APPLE_INTEGRATION.md`](./docs/APPLE_INTEGRATION.md).

Scripts úteis:

```bash
npm install
npm run dev
npm run build
npm run cap:ios
npm run ios:open
```

O projeto nativo iOS será gerado/sincronizado com Capacitor antes dos testes no Xcode/TestFlight.

## Próximas camadas

1. Autenticação e sincronização de progresso com Supabase
2. vincular RevenueCat à identidade autenticada
3. configurar produtos/trial no App Store Connect e RevenueCat
4. gerar/sincronizar o projeto iOS e habilitar In-App Purchase no Xcode
5. implementar paywall + Restore Purchases
6. eventos de assinatura para Funnel Metrics
7. fonte dinâmica revisada para liturgia/evangelho diário
8. TestFlight e submissão à App Store

---

**Fideora — Sua fé, todos os dias.**
