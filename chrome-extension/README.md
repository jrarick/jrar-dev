# JRAR Bookmark Sync Chrome Extension

Chrome extension to sync bookmarks to jrar.dev in real-time.

## Setup

### 1. Add Icons

Create PNG icons in the `icons/` directory:
- `icon16.png` (16x16)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

### 2. Generate API Key

Run this in the project root to generate an API key:

```bash
# Generate a key and hash
node -e "
const key = crypto.randomUUID() + '-' + crypto.randomUUID();
crypto.subtle.digest('SHA-256', new TextEncoder().encode(key))
  .then(buf => {
    const hash = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    console.log('API Key (save this):', key);
    console.log('Key Hash (for DB):', hash);
  });
"
```

Then insert the hash into the database:

```bash
npx wrangler d1 execute jrar-dev-db --remote --command="INSERT INTO api_keys (id, key_hash, name) VALUES ('$(uuidgen)', '<KEY_HASH>', 'Chrome Extension')"
```

### 3. Load Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this `chrome-extension` directory

### 4. Configure Extension

1. Click the extension icon in Chrome toolbar
2. Enter your API key
3. Click "Save Settings"
4. Click "Test Connection" to verify
5. Click "Sync All Bookmarks" for initial sync

## Features

- **Real-time sync**: Automatically syncs when bookmarks are added, removed, moved, or changed
- **Full sync**: Manually sync all bookmarks at once
- **Folder hierarchy**: Preserves your bookmark folder structure

## Development

For local development, change the API Base URL to:
```
http://localhost:5173/api/bookmarks
```
