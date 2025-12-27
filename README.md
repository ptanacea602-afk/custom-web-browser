# ADHD Browser — Minimal Electron Browser

Quick, minimal, customizable browser designed for ADHD-friendly workflows.

Setup

1. Create a new folder and paste the files from this project into it.
2. In the folder, run:

```bash
npm install
npm start
```

Notes
- On macOS you may be prompted about opening an app downloaded from the internet; this is a local development app.
- Bookmarks and settings (colors, font, layout) are persisted in `localStorage` per user.
- To package the app for distribution, use tools like `electron-builder` or `electron-forge`.

Import / Export Bookmarks

- Use the `Export` button in the `Bookmarks` pane to download your bookmarks as a JSON file.
- Use the `Import` button to load a JSON file. You will be prompted to replace or merge with existing bookmarks.


Files
- package.json — app manifest and start script
- main.js — Electron main process
- index.html — UI
- renderer.js — UI behavior, bookmarks, settings
- styles.css — visual styles

If you want, I can add keyboard shortcuts, sync (e.g., via a JSON file), or export/import for bookmarks next.
