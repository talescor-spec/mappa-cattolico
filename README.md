# Fideora

Fideora é um aplicativo católico multilíngue para acompanhar a fé no dia a dia. A base atual reúne Evangelho/reflexão, Rosário, orações, novenas, perfil e progresso, com uma identidade visual premium e uma única marca internacional.

## Idiomas

- Italiano
- Français
- Español
- Português (Brasil)
- English
- Deutsch

## Stack

- React 18 + Vite 8
- Capacitor 8 para iOS
- Supabase Auth + PostgreSQL/RLS para conta e progresso sincronizado
- RevenueCat Capacitor para StoreKit/assinaturas
- Vercel para preview/web

## Conta e sincronização

A Fideora usa o `auth.users.id` do Supabase como identidade canônica. Esse mesmo UUID é usado como RevenueCat `appUserID`, evitando criar identidades de assinatura diferentes por reinstalação/dispositivo.

O perfil possui login por link seguro de e-mail, sincronização de nome/idioma/Rosário/novenas, logout e início de exclusão de conta dentro do app. As tabelas `fideora_profiles` e `fideora_progress` têm RLS own-row e privilégios mínimos para o role autenticado.

## Segurança e App Store

Consulte:

- `SECURITY.md`
- `docs/APP_STORE_REVIEW_GATE.md`
- `.github/skills/apple-appstore-reviewer/SKILL.md`
- `docs/APPLE_INTEGRATION.md`

Execute antes de mudanças de release:

```bash
npm ci
npm audit --omit=dev --audit-level=moderate
npm run appstore:preflight
npm run build
```

## iOS

O Bundle ID `com.fideora.app` ainda é provisório. Antes do TestFlight precisamos confirmar o identificador definitivo, gerar/auditar o target iOS, configurar callbacks do Supabase Auth, revisar armazenamento seguro da sessão, criar o produto/subscription group no App Store Connect e conectar a oferta ao RevenueCat.
