# Fideora V1

Italian-first Catholic devotional and Bible-study app, with Portuguese as its only additional language. React/Vite web app and a bundled Capacitor iOS target.

## Features

- Daily editorial devotional selection and reflection, explicitly distinguished from the liturgical lectionary.
- Historical Bible editions in Italian and Portuguese: 66 books and 1,189 chapters per edition, available offline after web precaching and bundled on iOS.
- Literal full-text search, chapter navigation, reader font size, verse notes, highlights and bookmarks.
- Private study notebook, pinning, search, four original study guides and eight introductory Hebrew/Greek lexical cards.
- Guided 67-step Rosary, five devotional novena tracks, prayer library and private intentions.
- Optional Supabase account, profile/progress sync, explicit notebook-sync consent, account isolation, export and in-app account deletion.
- Native Keychain auth storage, native file export/share, localized app metadata, app icon and privacy manifest.

## Development

Node 22 or 24; locked dependencies:

```sh
npm ci
npm test
npm run appstore:preflight
npm run dev
```

The public Supabase endpoint/key defaults match the existing backend. No server key belongs in this client. Vercel project: `mappa-cattolico`, team `team_cWp3em2Aauu7ujuL6bDfkjqe`.

## iOS

```sh
npm run cap:ios
npm run ios:open
```

The generated Xcode project is at `ios/App/App.xcodeproj`. `com.fideora.app` is configured locally; registration/signing in the Apple Developer account is not yet verified. The simulator workflow builds and launches with signing disabled. This does not produce an App Store uploadable archive.

## Verification and release

Read [V1 release report](docs/V1-RELEASE.md), [App Store package](docs/APP_STORE_V1.md), and [review gate](docs/APP_STORE_REVIEW_GATE.md). `npm run appstore:preflight` checks the source/native structure. `npm run appstore:release` independently fails until actual Apple release evidence is recorded. Do not substitute one result for the other.

## Content and licensing

Scripture corpus: [midvash/bible-data](https://github.com/midvash/bible-data), Diodati 1649 and Almeida 1819, declared public domain by the source metadata. These historical 66-book editions do not include the seven Catholic deuterocanonical books and are not official liturgical editions. The app discloses this in Sources. Editorial guides, reflections and devotional tracks are original Fideora content. Lexical cards reference Strong identifiers and do not claim to be a complete interlinear or concordance.
