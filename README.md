# ESM/CJS Interop

### Usage
Set the `BUILD_TYPE` env var before any `pnpm` command.

Examples:
```bash
# Single build (ESM by default)
BUILD_TYPE=single pnpm build

# Multi build pack (ESM & CJS)
BUILD_TYPE=multi pnpm pack
```
