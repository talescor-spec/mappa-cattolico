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
- navegação inferior com cinco áreas: Oggi/Today/Hoje, Bibbia/Bible/Bíblia, Prega/Pray/Rezar, Percorsi/Paths/Caminhos e Profilo/Profile/Perfil

## Stack

- React 18
- Vite 5
- Lucide React
- LocalStorage para progresso e preferências nesta etapa
- Vercel para deploy

## Próximas camadas previstas

1. Revisão de segurança e hardening antes de integrar pagamentos
2. Autenticação e sincronização de progresso com Supabase
3. StoreKit/RevenueCat para trial e assinatura no iOS
4. Eventos de funil para Funnel Metrics
5. Fonte dinâmica para liturgia/evangelho diário
6. Empacotamento e publicação na App Store

## Desenvolvimento

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
```

---

**Fideora — Sua fé, todos os dias.**
