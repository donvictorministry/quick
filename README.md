# Quick-Snippets

A single-page, installable Progressive Web App (PWA) for saving, editing, searching, exporting, importing, and syncing text snippets — entirely inside the browser.

No backend, no accounts, no tracking.

Built with plain HTML5, CSS3, and Vanilla JavaScript. Zero dependencies. Zero build step.

## Features

- **Save Text Snippets:** Rapid local capture of code, sermon notes, reference scriptures, and texts.
- **Edit & Delete:** Seamless full-screen modification and deletion.
- **Real-Time Live Search:** Instant keyword filtering across all stored records.
- **One-Tap Clipboard Copy:** Fast copying with immediate feedback toast.
- **Data Portability:** Export your entire library to JSON or import backups with smart deduplication.
- **Manual Paste-to-Sync:** Direct paste area to merge snippet arrays between devices.
- **Dual Sidebars:** Left Informational Drawer with 7 full-page edge-to-edge modals; Right Chrome Utilities Drawer with Settings, Font Scale (19px–23px), and Bluetooth.
- **Strict Android Typography:** Non-negotiable typography floor of 19px across all screens.
- **Offline Capable:** Full Service Worker caching.

## Storage Contract

Everything is stored strictly in `localStorage` under two explicit keys:
- `snippets` — `JSON.stringify(string[])`
- `theme` — `"light"` or `"dark"`

No analytics. No tracking. No data ever leaves your device.