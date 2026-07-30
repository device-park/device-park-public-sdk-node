# Releasing

This repository produces the official `device-park-public-sdk` package for the public npm registry. It is a new SDK package and is independent from the legacy `@devicepark/*` packages.

## Package Identity

| Field | Value |
|---|---|
| npm package | `device-park-public-sdk` |
| npm registry | `https://registry.npmjs.org/` |
| access | Public |
| Java artifact | `io.testinium.devicepark:device-park-public-sdk` |

The npm package name intentionally matches the Java SDK `artifactId`.

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

Unscoped npm packages are public. `publishConfig` explicitly targets `https://registry.npmjs.org/`.

## Post-Release Verification

```bash
npm view device-park-public-sdk version
npm install device-park-public-sdk
```

Confirm that a clean consumer project can import `DeviceParkApiClient` before announcing the release.
