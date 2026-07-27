# Releasing

The package is published as `@devicepark/public-sdk` on the public npm registry.

## Release Requirements

- Use a supported Node.js version (`18` or newer).
- Update `version` in `package.json` and `package-lock.json`.
- Never commit npm tokens or generated `.npmrc` files.
- Publish only from an approved branch or release tag.
- Use npm Trusted Publishing when the CI provider supports it. Otherwise, provide a scoped automation token through the CI secret store.

## Pipeline Commands

```bash
npm ci
npm run check
npm test
npm pack --dry-run
npm publish
```

`publishConfig` keeps the package public and targets `https://registry.npmjs.org/`.

## Post-Release Verification

```bash
npm view @devicepark/public-sdk version
npm install @devicepark/public-sdk
```

Confirm that a clean consumer project can import `DeviceParkApiClient` before announcing the release.
