# RaahimFlix iOS PWA — starter

Personal-use movie discovery and source launcher for iPhone Safari. Static frontend, local settings, no MySQL. Cloudflare Pages Functions provides a narrow Cinemeta-compatible metadata proxy.

## Included in this milestone

- Responsive dark streaming-style UI
- Search/filter and demo fallback catalog
- Local watchlist and recently viewed list
- Stremio add-on manifest registration and stream endpoint query (where browser CORS is permitted)
- Direct HTTPS source list
- Best-effort VLC iOS URL-scheme handoff with manual fallback guidance
- Cloudflare Pages Function restricted to Cinemeta-compatible catalog/meta routes
- Installable PWA shell and offline caching of app assets

## Important limitations

1. This is a starter, not yet a fully production-hardened client.
2. Add-on endpoints must allow CORS for direct browser requests. This starter deliberately does not proxy arbitrary user-supplied add-on URLs.
3. CloudStream plugins generally run in CloudStream's own runtime and cannot be executed directly in Safari. Add a later adapter only for a documented API or a plugin/source service you control.
4. VLC handoff depends on iOS and VLC accepting the URL scheme and on the stream being compatible. If it does not launch, use VLC's network-stream/open URL feature manually.
5. Use only media links you own or are authorized to access. The app does not host media.

## Deploy on Cloudflare Pages

### Option A — GitHub (recommended)

1. Extract this folder.
2. Create a new repository at https://github.com/new and upload/commit the contents of this folder. `index.html` must be at the project root; `functions/` must also be at the root.
3. In Cloudflare Dashboard, open **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
4. Select the repository.
5. Set the build command to `exit 0`.
6. Set the build output directory to `.` (the repository root).
7. Deploy. Open the assigned `*.pages.dev` URL.

### Option B — Direct Upload

For a project that uses a `functions/` directory, use a Git-connected Pages project to ensure Pages Functions are deployed. A static-only direct upload can omit Functions depending on the upload workflow.

## Test locally

Install Node.js, then run:

```bash
npx wrangler pages dev .
```

Open the local URL Wrangler prints. Test `/api/metadata?resource=catalog&type=movie&id=top`.

## Add to iPhone Home Screen

1. Open the deployed HTTPS URL in Safari on your iPhone.
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Launch RaahimFlix from the new icon.

## Configure sources

- Open **Sources** in the app.
- Add a Stremio-compatible `manifest.json` URL over HTTPS. It must allow browser CORS for manifest and stream requests.
- Save a direct HTTPS MP4/M3U8 link you are authorized to use.
- Open a title → **Find sources** → **Open in VLC**.

## VLC handoff

The starter attempts `vlc-x-callback://x-callback-url/stream?url=<encoded-https-url>`. iOS/player versions can differ; this is best-effort rather than a guarantee. If VLC does not open, copy the HTTPS URL and use VLC's network stream option.

## Architecture notes

- `/api/metadata` accepts only `catalog` or `meta`, `movie` or `series`, and a constrained ID. It cannot fetch arbitrary URLs.
- Add-on fetching currently runs in the browser, so the add-on server's CORS policy matters.
- Local watchlist, recent titles, add-ons, and direct sources live in this browser's localStorage. They do not sync across devices.
