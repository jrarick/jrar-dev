## 2026-01-15 - Stored XSS in Bookmark Sync
**Vulnerability:** The bookmark sync API (`/api/bookmarks/sync`) accepted arbitrary URLs, including `javascript:` protocol, which allowed Stored XSS when bookmarks were rendered in the frontend.
**Learning:** React Router/Remix actions validate type structure but not semantic security of fields like URLs. `Effect` schema validation (if used) or manual validation is critical for user inputs that render as links.
**Prevention:** Always validate URL protocols for user-submitted links. Added `isValidBookmarkUrl` to strict-allow only `http` and `https` protocols.
