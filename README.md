# Search selection on

Search the selected text on a site from the right-click context menu.

## Development

### Requirements

- Node.js — version pinned in [`.node-version`](./.node-version) (recommended: install via [mise](https://mise.jdx.dev/) or another asdf-compatible tool)
- npm (bundled with Node)

### Setup

```sh
npm install
```

### Scripts

| Command                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `npm start`            | Watch mode (esbuild) for the service worker, with inline source maps. |
| `npm run build`        | Type check, then bundle and minify the entry points to `package/`.    |
| `npm run type-check`   | TypeScript type check only.                                           |
| `npm run lint-check`   | ESLint (flat config, type-aware rules).                               |
| `npm run lint-fix`     | ESLint with `--fix`.                                                  |
| `npm run format-fix`   | Apply Prettier formatting.                                            |
| `npm run format-check` | Verify formatting without writing.                                    |

### Loading the unpacked extension

1. Run `npm run build` (or `npm start` for dev watch).
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `package/` directory.

### Project layout

```
src/            TypeScript sources
  constants.ts  Shared IDs and keys
  worker.ts     Service worker; registers the context menu
package/        Extension root loaded by Chrome (manifest, locales, build output)
```
