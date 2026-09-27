# player
.
# Stockyard Line Dance App — Weekly Release Instructions

This app uses two version mechanisms:

1. manifest.json → forces iOS PWAs to load fresh code
2. version.json → allows the app’s internal update-check system to detect new builds

Both must be updated each release.

---

## 1. Update dances and venue data
Edit any of the following as needed:

- src/venues/Stockyard/danceData-stockyard.js
- src/venues/Stockyard/venueEvents.js
- src/venues/Stockyard/venueDanceMap.js
- src/venues/Stockyard/venueConfig.js

Commit changes.

---

## 2. Update version.json
File: `src/venues/Stockyard/version.json`

Example:
{
  "version": "9.26.26"
}

Use date-based versions.  
If multiple releases occur on the same day, append letters:

- 9.26.26
- 9.26.26A
- 9.26.26B
- 9.26.27

Commit changes.

---

## 3. Update manifest.json (critical for iOS)
File: `src/venues/Stockyard/manifest.json`

Bump ONLY the start_url version:

"start_url": "./index.html?v=9.26.26"

Use the same version string used in version.json.

Commit changes.

---

## 4. Merge Dev → Main
Push Dev branch changes, then merge into Main.

---

## 5. Publish
GitHub Pages will automatically deploy Main.

---

## 6. Users DO NOT need to delete/re-add the home screen icon
Because manifest.json exists, iOS will detect the new start_url and load fresh code automatically.

Playlists and user data remain safe.

---

## Summary
- version.json → internal update detection
- manifest.json → forces iOS PWA refresh
- Both must be bumped each release
