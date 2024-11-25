# TypeScript Next.js example

This is a really simple project that shows the usage of Next.js with TypeScript.

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-typescript)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-typescript&project-name=with-typescript&repository-name=with-typescript)

## How to use it?

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-typescript with-typescript-app
# or
yarn create next-app --example with-typescript with-typescript-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).

## Notes

This example shows how to integrate the TypeScript type system into Next.js. Since TypeScript is supported out of the box with Next.js, all we have to do is to install TypeScript.

```
npm install --save-dev typescript
```

To enable TypeScript's features, we install the type declarations for React and Node.

```
npm install --save-dev @types/react @types/react-dom @types/node
```

When we run `next dev` the next time, Next.js will start looking for any `.ts` or `.tsx` files in our project and builds it. It even automatically creates a `tsconfig.json` file for our project with the recommended settings.

Next.js has built-in TypeScript declarations, so we'll get autocompletion for Next.js' modules straight away.

A `type-check` script is also added to `package.json`, which runs TypeScript's `tsc` CLI in `noEmit` mode to run type-checking separately. You can then include this, for example, in your `test` scripts.

## ERC-1155 Messaging (AnuraMessagingApp)

This project also explores using the ERC-1155 multi-token standard as a transport
for lightweight on-chain messaging. Each message is represented as a token whose
metadata encodes the payload, sender, and recipient.

### Getting started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in your RPC URL and contract
   address.
3. Run `npm run dev` to start the local development server, then open
   [http://localhost:3000](http://localhost:3000) in your browser.

### Environment variables

The following variables are read from `.env.local`:

- `NEXT_PUBLIC_RPC_URL` — JSON-RPC endpoint used by the client to read on-chain
  state. Prefer a low-latency provider (or a local node) since inbox views fan
  out several read calls per render. Any standard EVM-compatible RPC will work.
- `NEXT_PUBLIC_CONTRACT_ADDRESS` — deployed address of the `AnuraMessagingApp`
  ERC-1155 contract. Must be a checksummed, 0x-prefixed 20-byte address;
  malformed values cause client initialization to throw at startup.
- `NEXT_PUBLIC_CHAIN_ID` *(optional)* — expected chain id; if set, the UI will
  prompt the user to switch networks when their wallet is connected elsewhere.

### Scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — create a production build
- `npm run start` — run the production build locally
- `npm run type-check` — run TypeScript in `noEmit` mode
- `npm test` — run the Jest test suite
- `npm run test:watch` — run Jest in watch mode during development

### Testing

Unit tests live alongside their source files under `__tests__/` directories and
are executed with Jest. Run the full suite with `npm test`, or use
`npm run test:watch` to re-run tests as files change.

### Accessibility

Interactive elements (compose form, inbox list, network-switch prompt) are
keyboard navigable and expose ARIA labels for screen readers. When contributing
UI changes, please verify focus order and color contrast against WCAG 2.1 AA,
and test the flow end-to-end with a screen reader (VoiceOver or NVDA) using
keyboard-only input.

### Performance notes

Inbox rendering can become read-heavy as the number of tokens per address
grows, so the client is structured to keep RPC traffic predictable:

- **Batch reads.** Prefer `balanceOfBatch` and multicall-style aggregation over
  per-token `balanceOf` calls. A single batched request for N tokens is almost
  always cheaper than N round-trips, even against a local node.
- **Cache message metadata.** Token URIs and decoded payloads are immutable
  once minted; cache them by token id in memory (and optionally in
  `localStorage`) so re-renders and route changes do not re-fetch them.
- **Paginate the inbox.** Render messages in pages of 25–50 and fetch the next
  page on demand. Avoid unbounded `Promise.all` fan-out over the full history.
- **Debounce wallet-driven refreshes.** Account, chain, and block subscriptions
  can fire in bursts; coalesce them with a short debounce (≈150 ms) before
  triggering a refetch.
- **Memoize derived views.** Wrap expensive list transforms (sorting, grouping
  by thread, address checksumming) in `useMemo` keyed on the raw message
  array so they only recompute when inputs actually change.

When profiling, the React DevTools Profiler and the browser's network tab
(filtered to the RPC endpoint) together give a good picture of where time is
spent between render work and on-chain reads.
