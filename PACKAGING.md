# Packaging the ADHD Browser for macOS

This project uses `electron-builder` to create macOS distributables (`.dmg` and `.zip`). The project already includes a `build` section in `package.json` and `npm` scripts to build.

Quick steps (from the project folder):

```bash
npm install
npm run dist
```

- `npm run dist` will run `electron-builder --mac` and create artifacts in the `dist/` folder.
- `npm run pack` will create an unpacked `.app` inside `dist/` (useful for local testing).

Notes and next steps:
- Code signing and notarization require an Apple Developer account. See `electron-builder` docs to configure `CSC_LINK` and entitlements.
- To add an app icon, place `icon.icns` in the project root and add the path to the `build.mac.icon` field in `package.json`.
- If you want, I can add a CI workflow (GitHub Actions) to produce mac builds automatically.

Icon creation (local)

1. Provide a source icon as `assets/icon.png` (1024x1024) or `assets/icon.svg` (this project includes a placeholder `assets/icon.svg`).
2. On macOS you can run the included script to create `build/icon.icns`:

```bash
chmod +x scripts/make-icon.sh
./scripts/make-icon.sh
```

That produces `build/icon.icns` which `electron-builder` will use.

CI builds (GitHub Actions)

This repository includes a GitHub Actions workflow at `.github/workflows/build-macos.yml` that runs on `macos-latest`, installs dependencies, optionally generates an icon, runs `npm run dist`, and uploads the produced `.dmg` and `.zip` artifacts.

If you'd like, I can wire up code signing keys to the workflow (requires secrets for `APPLE_ID`, `APPLE_PASSWORD`, and `CSC_LINK`).
