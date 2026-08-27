# AGENTS.md

This file provides guidance to AI Agents when working with code in this repository.

## Overview

Telegram bot ("Crypto Daddy", `@CryptoDaddyyBot`) that answers chat commands with
crypto/fiat exchange rates and GPU mining hashrate info. TypeScript + Telegraf + tsyringe DI, no database —
all data is scraped/fetched from public endpoints and cached in memory.

## Commands

```bash
npm run build        # tsc -> dist/ (excludes *.spec.ts)
npm run dev          # tsc-watch, restarts node dist/index.js on each successful compile
npm test             # jest (all specs, no network access needed — fetch is mocked)
npm run test:watch
npm run lint         # eslint src/**/*.ts
```

Run a single spec / single test:

```bash
npx jest src/services/rate-command/rate-command.service.spec.ts -t 'should answer on /rate'
```

## Running the bot

`npm run server:staging` / `npm run server:production` build then start. `provideConfig` reads
`process.env.ENVIRONMENT` (**not** `NODE_ENV`) and dotenv-loads `.env.<staging|production>` from the
current working directory — so the bot must be started from the repo root, and `.env.staging` /
`.env.production` (holding `BOT_TOKEN`) must exist locally; both are gitignored.

Deployment is Docker Compose on the server: `scripts/update.sh` (git restore + pull + `docker compose up --build -d`)
and `scripts/log.sh` for logs. The `*_old.sh` scripts and `scripts/telegram-bot-crypto-daddy.service` are the
superseded systemd setup.

## Architecture

`src/index.ts` imports `polyfills.ts` (which does `import 'reflect-metadata'` — required for tsyringe
decorators and also loaded by jest via `setupFiles`), then constructs `App`.

`src/app.ts` is the single wiring point. Its constructor registers everything in the global tsyringe
`container` — `ConfigToken`, `TFunctionToken` (i18next `t`, initialized with `lng: 'ru'` and
`returnObjects: true`), `FetchToken` (node-fetch), a `Telegraf` instance, `LoggerService` — then resolves each
service and pushes it into `this.services`. `start()` launches the bot and calls `start()` on every service;
`stop()` (wired to SIGINT/SIGTERM) reverses it.

Two base classes in `src/services/`:

- `BaseService` — abstract `name`, `start()`, `stop()`, plus `this.log()` which prefixes with `name`.
- `BaseCommandService` — adds `listenForCommand(variations, cb)`, which registers a `bot.hears` regex that
  matches `/<variation>` with an optional `@BotName` suffix and captures named groups `command` and `params`
  (read as `ctx.match?.groups?.params`, typed via `ContextWithMatch`). Every command has Russian aliases
  (e.g. `['rate', 'rates', 'курс']`).

Command services register their listeners **in the constructor**, so merely `container.resolve(...)`-ing a
service activates it. `start()`/`stop()` are only for timers and prefetching.

### Data-fetch + cache pattern

Services that hit remotes (`RateCommandService`, `BestchangeCommandService`, `HashrateCommandService`) hold a
cached **Promise** field, kick off a first fetch in `start()`, refresh it on a `setInterval` (2h for rates,
24h for GPUs), and serve command replies from the cache. On failure the cached promise is dropped so the next
call retries. `RateCommandService` additionally clones the previous result and fills only the sources that
succeeded, and throws `TOO_MANY_FAILURES` only when ≥2 sources fail with no prior result — so a single dead
source degrades to a stale value rather than an error.

Most remotes are HTML pages scraped with `matchAll` + named-group regexes, so parsers break when the site
changes; the alternative implementations kept around as unused `protected` methods (`getUsdRubPriceMoex`,
`getUsdRubPriceYandex`, `get2CryptocalcInfo`) are previous sources kept for quick switching. `KursExpertApiService`
and `BestchangeApiService` self-debounce by sleeping 10s and recursing if called within 10s of the last call.
Note `BestchangeCommandService` fetches via `KursExpertApiService`, not `BestchangeApiService` (which is
currently unregistered in `app.ts`).

### i18n

Every user-facing string lives in `src/i18n/ru.ts`, keyed by service class name: services call
``this.t(`${this.name}.someKey`, interpolationObject)`` and reply with `ctx.replyWithHTML(...)` (Telegram HTML
parse mode, so tags like `<b>` and `<a href>` are expected). `returnObjects: true` lets a key return an
array (`JokeCommandService.jokes`). The bot's persona is deliberately crude Russian "dad" slang — keep new
strings in that voice, in `ru.ts`, never inline.

## Adding a command

1. New dir `src/services/<name>-command/<name>-command.service.ts`, class extends `BaseCommandService`,
   decorated `@autoInjectable()`, with `protected name = '<Class>'`; inject `LoggerService`,
   `@inject(TFunctionToken) t`, `Telegraf`, and `@inject(FetchToken) fetch` if it needs HTTP.
2. Call `this.listenForCommand([...aliases], this.onX.bind(this))` in the constructor.
3. Add a `<Class>: {...}` block to `src/i18n/ru.ts` and mention the command in `HelpCommandService.helpMsg`.
4. Push `container.resolve(...)` into `this.services` in `src/app.ts`.

## Testing conventions

Specs live next to their service. Each `beforeEach` does `container.clearInstances()` and then registers
test doubles into the real container: a `TFunctionToken` stub that switch-cases the i18n keys the test asserts
on, `LoggerServiceMock`, `TelegrafMock`/`TelegrafContextMock` (hand-written, in `src/misc/telegraf-mocks.ts`)
registered as `Telegraf`, and a `FetchToken` function that matches on URL substring and returns
`new Response(fixture)` from a fixture file read with ``fs.readFileSync(`${__dirname}/spec-*.html|json|xml`)``.
Commands are exercised through `telegrafMock.triggerHears('/rate')` and asserted via
`jest.spyOn(ctxMock, 'replyWithHTML')`. When changing a scraper, refresh or add the matching `spec-*` fixture.

## Style

Prettier (`.prettierrc.js`): single quotes, no bracket spacing (`{foo}` not `{ foo }`), 120 cols, trailing
commas, `arrowParens: 'avoid'`. Enforced through eslint. A lone `//` comment on the first line of an argument
list or array is an intentional Prettier hack to force multi-line formatting — leave those in place.
