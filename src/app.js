import { globalDanceList } from "./globalDanceList.js";
import { venueDanceMap } from "./venues/Stockyard/venueDanceMap.js";
import { venueConfig } from "./venues/Stockyard/venueConfig.js";

/* ============================================
   MERGE GLOBAL + VENUE DANCE DATA
============================================ */
let localDanceDatabase = [];

venueDanceMap.forEach(mapEntry => {
    const baseDance = globalDanceList.find(d => d.id === mapEntry.id);
    if (baseDance) {
        localDanceDatabase.push({
            ...baseDance,
            playlist: mapEntry.playlist,
            daytaught: mapEntry.daytaught
        });
    }
});

console.log("Merged dance count:", localDanceDatabase.length);
console.log(localDanceDatabase);

/* ============================================
   APP STATE
============================================ */
let selectedActivePlaylistGroup = null;
let activeSearchQueryString = "";
let activeDayFilter = "ALL";
let activeDayView = null;
let activeDifficultyView = null;
let activeDifficultyFilter = "";

/* ============================================
   DAY FILTER
============================================ */
function setDayFilter(day) {
    activeDayFilter = day;
    activeDayView = (day === "ALL") ? null : day;
    selectedActivePlaylistGroup = null;
    renderApplicationInterface();
}

/* ============================================
   DIFFICULTY FILTER
============================================ */
function setDifficultyFilter(level) {
    if (!level) {
        activeDifficultyView = null;
        activeDifficultyFilter = "";
        navigateToPlaylistHubMenu();
        return;
    }

    activeDifficultyView = level;
    activeDifficultyFilter = level;

    selectedActivePlaylistGroup = null;
    activeDayView = null;

    activeSearchQueryString = "";
    document.getElementById('danceSearchInput').value = "";

    renderApplicationInterface();
}

/* ============================================
   VENUE BRANDING
============================================ */
function initializeVenueBranding() {
    const headerTitleEl = document.getElementById('applicationHeaderTitle');
    if (headerTitleEl) {
        headerTitleEl.innerText = venueConfig.headerTitle || venueConfig.name || "LineDance Player";
    }

    const searchInput = document.getElementById('danceSearchInput');
    if (searchInput) {
        searchInput.placeholder = venueConfig.searchPlaceholder || "Search dances...";
    }

    const emailBanner = document.getElementById('venueEmailBanner');
    if (emailBanner) {
        const venueName = venueConfig.name || "LineDance Player";
        const email = venueConfig.email || "";
        emailBanner.innerText = email ? `✉ ${venueName} Feedback & Music Requests: ${email}` : "";
    }

    if (venueConfig.theme) {
        const root = document.documentElement;
        root.style.setProperty('--brand-green', venueConfig.theme.brandGreen || '#2ecc71');
        root.style.setProperty('--dark-gray', venueConfig.theme.darkGray || '#1e1e1e');
        root.style.setProperty('--card-bg', venueConfig.theme.cardBg || '#2b2b2b');
        root.style.setProperty('--btn-blue', venueConfig.theme.buttonBlue || '#34495e');
    }

    if (venueConfig.assets.backgroundImageUrl) {
        document.documentElement.style.setProperty('--venue-bg-image', `url(${venueConfig.assets.backgroundImageUrl})`);
    } else {
        document.documentElement.style.setProperty('--venue-bg-image', 'none');
    }

    const bannerEl = document.getElementById('venueBanner');
    if (bannerEl) {
        if (venueConfig.assets.bannerUrl) {
            bannerEl.src = venueConfig.assets.bannerUrl;
            bannerEl.style.display = 'block';
        } else {
            bannerEl.style.display = 'none';
        }
    }

    const instructorEl = document.getElementById('venueInstructorPhoto');
    if (instructorEl) {
        if (venueConfig.assets.instructorPhotoUrl) {
            instructorEl.src = venueConfig.assets.instructorPhotoUrl;
            instructorEl.style.display = 'block';
        } else {
            instructorEl.style.display = 'none';
        }
    }

    const watermarkEl = document.getElementById('venueWatermark');
    if (watermarkEl) {
        if (venueConfig.assets.watermarkUrl) {
            watermarkEl.src = venueConfig.assets.watermarkUrl;
            watermarkEl.style.display = 'block';
        } else {
            watermarkEl.style.display = 'none';
        }
    }

    const footerEl = document.getElementById('venueFooter');
    if (footerEl) {
        footerEl.innerText = venueConfig.footerText || "";
    }

    const touchIconEl = document.getElementById('venueTouchIcon');
    if (touchIconEl) {
        touchIconEl.href = venueConfig.assets.touchIconUrl || "";
    }

    const splashEl = document.getElementById('venueSplash');
    const splashImgEl = document.getElementById('venueSplashImage');
    const splashTextEl = document.getElementById('venueSplashText');
    if (splashEl && splashImgEl && splashTextEl) {
        if (venueConfig.assets.splashImageUrl) {
            splashImgEl.src = venueConfig.assets.splashImageUrl;
            splashTextEl.innerText = venueConfig.headerTitle || venueConfig.name || "LineDance Player";
            splashEl.style.display = 'flex';
            setTimeout(() => splashEl.style.display = 'none', 1500);
        } else {
            splashEl.style.display = 'none';
        }
    }
}

/* ============================================
   NAVIGATION
============================================ */
function navigateToPlaylistHubMenu() {
    selectedActivePlaylistGroup = null;

    activeDayView = null;
    activeDayFilter = "ALL";   // ⭐ FIXED

    activeDifficultyView = null;
    activeDifficultyFilter = "";

    const searchInput = document.getElementById('danceSearchInput');
    if (searchInput) searchInput.value = "";

    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'block';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'block';

    document.getElementById('navbarReturnTrigger').style.display = 'none';
    document.getElementById('applicationHeaderTitle').innerText = "Playlists";

    renderApplicationInterface();
}

function openSpecificPlaylistView(groupName) {
    selectedActivePlaylistGroup = groupName;

    activeSearchQueryString = "";
    document.getElementById('danceSearchInput').value = "";

    activeDayView = null;
    activeDifficultyView = null;
    activeDifficultyFilter = "";

    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'none';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'none';

    document.getElementById('navbarReturnTrigger').style.display = 'block';
    document.getElementById('applicationHeaderTitle').innerText = groupName;

    renderApplicationInterface();
}
/*
function openSpecificDanceFromSearch(danceId) {
    // Clear search state
    activeSearchQueryString = "";
    selectedActivePlaylistGroup = null;
    activeDayView = null;
    activeDifficultyView = null;

    // Find the dance
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    // Navigate to the playlist that contains this dance
    selectedActivePlaylistGroup = dance.playlist;

    renderApplicationInterface();

    // Scroll to the dance card
    setTimeout(() => {
        const el = document.getElementById(`dance-card-${danceId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
}
*/
function openDanceFromSearchToPlaylist(danceId) {
    // Exit search mode completely
    activeSearchQueryString = "";
    const searchBox = document.getElementById('danceSearchInput');
    if (searchBox) searchBox.value = "";

    // Find the dance
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    // Navigate to the playlist that contains this dance
    selectedActivePlaylistGroup = dance.playlist;

    // Clear other modes
    activeDayView = null;
    activeDifficultyView = null;

    // Render playlist screen
    renderApplicationInterface();

    // Scroll to the dance card
    setTimeout(() => {
        const el = document.getElementById(`dance-card-${danceId}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
}



/* ============================================
   SEARCH (CORRECTED)
============================================ */
 function handleLiveSearchInput() {
    const searchBox = document.getElementById('danceSearchInput');
    activeSearchQueryString = searchBox.value.toLowerCase().trim();

    // ⭐ If search is empty → fully restore hub screen
    if (activeSearchQueryString.length === 0) {
        renderApplicationInterface();   // ⭐ THIS FIXES THE CARD STYLING
        return;
    }

    // ⭐ Otherwise → show search results
    updateSearchResults();
}



 function updateSearchResults() {
    const viewport = document.getElementById('masterApplicationViewport');
    if (!viewport) return;

    const matches = localDanceDatabase.filter(d =>
        (d.name || "").toLowerCase().includes(activeSearchQueryString) ||
        (d.choreographer || "").toLowerCase().includes(activeSearchQueryString)
    );

    const resultsContainer = document.querySelector('.search-results-container');
    if (!resultsContainer) return;

    // ⭐ Hide playlist cards when search is active
    const playlistContainer = document.querySelector('.playlist-container');
    playlistContainer.style.display = 'none';

    // ⭐ Show search results container
    resultsContainer.style.display = 'flex';

    // ⭐ Render search results
    renderSimpleSearchCards(matches, resultsContainer);
}

 



/* ============================================
   MAIN RENDERER (CLEANED + CORRECTED)
============================================ */
function renderApplicationInterface() {
    const viewport = document.getElementById('masterApplicationViewport');
    if (!viewport) return;

    viewport.innerHTML = '';

    /* --------------------------------------------
       1. PLAYLIST VIEW (if user is inside a playlist)
       -------------------------------------------- */
    if (selectedActivePlaylistGroup !== null) {

        const filteredTracks = localDanceDatabase.filter(
            track => track.playlist === selectedActivePlaylistGroup
        );

        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('applicationHeaderTitle').innerText = selectedActivePlaylistGroup;

        renderDanceCardsList(filteredTracks, viewport);
        updateHubVisibility();
        return;
    }

    /* --------------------------------------------
       2. DAY VIEW
       -------------------------------------------- */
    if (activeDayView !== null) {

        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('applicationHeaderTitle').innerText = activeDayView + " Dances";

        const dayTracks = localDanceDatabase.filter(track =>
            activeDayFilter === "ALL" ? true : track.daytaught === activeDayFilter
        );

        if (!dayTracks.length) {
            viewport.innerHTML = '<p style="text-align:center;color:#aaa;margin-top:20px;">No dances taught on this day.</p>';
            return;
        }

        renderDanceCardsList(dayTracks, viewport);
        updateHubVisibility();
        return;
    }

    /* --------------------------------------------
       3. DIFFICULTY VIEW
       -------------------------------------------- */
    if (activeDifficultyView !== null) {

        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('applicationHeaderTitle').innerText =
            activeDifficultyView + " Dances";

        const level = activeDifficultyFilter.toLowerCase();

        const difficultyTracks = localDanceDatabase.filter(track =>
            (track.level || "").toLowerCase().includes(level)
        );

        if (!difficultyTracks.length) {
            viewport.innerHTML = '<p style="text-align:center;color:#aaa;margin-top:20px;">No dances found for this difficulty level.</p>';
            return;
        }

        renderDanceCardsList(difficultyTracks, viewport);
        updateHubVisibility();
        return;
    }

    /* --------------------------------------------
       4. HUB SCREEN (default)
       -------------------------------------------- */
    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'block';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'block';

    const searchRow = document.querySelector('.hub-search-row');
    if (searchRow) searchRow.style.display = 'flex';

    const navRow = document.querySelector('.hub-nav-row');
    if (navRow) navRow.style.display = 'flex';

    document.getElementById('navbarReturnTrigger').style.display = 'none';
    document.getElementById('applicationHeaderTitle').innerText = "Playlists";

    let groupNames;
    if (venueConfig.playlistGroups?.length > 0) {
        groupNames = [...venueConfig.playlistGroups];
    } else {
        groupNames = [...new Set(localDanceDatabase.map(track => track.playlist || "General"))].sort();
    }

    const playlistCardsHTML = groupNames.map(name => {
        const count = localDanceDatabase.filter(t => t.playlist === name).length;
        return `
            <div class="hub-playlist-card" onclick="openSpecificPlaylistView('${name}')">
                <div class="hub-playlist-name">${name}</div>
                <div class="hub-playlist-count">${count} dances</div>
            </div>
        `;
    }).join('');

    viewport.innerHTML = `
        <div class="hub-screen">

            <div class="hub-filter-row">
                <select id="daySelect" onchange="setDayFilter(this.value)">
                    <option value="ALL">All Days</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Other">Other</option>
                </select>

                <select id="difficultySelect" onchange="setDifficultyFilter(this.value)">
                    <option value="">Difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Improver">Improver</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                </select>
            </div>

            <div class="hub-search-row">
                <input type="text" id="danceSearchInput"
                       placeholder="Search dances..."
                       oninput="handleLiveSearchInput()">
                <button class="sync-btn" onclick="forceCacheBusterReload()">Sync</button>
            </div>

            <div class="hub-nav-row">
                <div class="hub-nav-card" onclick="openUserPlaylists()">My Playlists</div>
                <div class="hub-nav-card" onclick="createNewUserPlaylist()">Create Playlist</div>
                <div class="hub-nav-card" onclick="openEventsView()">Events</div>
            </div>

            <div class="playlist-container">
                ${playlistCardsHTML}
            </div>
            <div class="search-results-container"></div>

        </div>
    `;

  /* --------------------------------------------
   5. SEARCH MODE (runs AFTER hub is built)
-------------------------------------------- */
if (activeSearchQueryString && activeSearchQueryString.length > 0) {

    document.getElementById('applicationHeaderTitle').innerText = "Search Results";

    const matches = localDanceDatabase.filter(d =>
        (d.name || "").toLowerCase().includes(activeSearchQueryString) ||
        (d.choreographer || "").toLowerCase().includes(activeSearchQueryString)
    );

    // Create a container BELOW the hub layout
    const resultsContainer = document.createElement('div');
    resultsContainer.className = "search-results-container";

    renderSimpleSearchCards(matches, resultsContainer);

    // Append search results BELOW the hub screen
    viewport.querySelector('.hub-screen').appendChild(resultsContainer);

    // Keep hub visible
    updateHubVisibility();
}
  
}

/* ============================================
   DANCE CARD RENDERING
============================================ */
function renderDanceCardsList(tracksList, containerElement) {
    tracksList.forEach(track => {

        if (activeDayFilter !== "ALL" && track.daytaught !== activeDayFilter) {
            return;
        }

        const card = document.createElement('div');
        card.className = 'dance-entry-card';

        const btnSteps = track.steps
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.steps}', '${track.name} - Steps')">Steps</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        const btnTeach = track.teach
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.teach}', '${track.name} - Teach')">Teach</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        const btnDemo = track.demo
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.demo}', '${track.name} - Demo')">Demo</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        const btnMusic = track.music
            ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${track.music}', '${track.name} - Play')">Music</button>`
            : `<button class="action-touch-btn disabled">None</button>`;

        card.innerHTML = `
            <div class="title-line">${track.name} • By: ${track.choreographer}</div>
            <div class="meta-line">Song: ${track.song} - ${track.artist} (${track.playlist})</div>
            <div class="button-bar-grid">
                ${btnSteps}
                ${btnTeach}
                ${btnDemo}
                ${btnMusic}
            </div>
        `;
        containerElement.appendChild(card);
    });
}

/* ============================================
   OVERLAY LOGIC
============================================ */
function launchMediaOverlay(targetUrl, displayTitle) {
    if (!targetUrl) return;

    targetUrl = targetUrl.replace('http://', 'https://');

    const container = document.getElementById('playerOverlayFrame');
    if (!container) return;

    container.style.display = 'none';
    container.innerHTML = '';

    if (displayTitle.includes("Steps")) {
        container.innerHTML = `
            <div class="overlay-control-header">
                <span class="overlay-title" id="overlayPanelTitle">${displayTitle}</span>
                <button class="done-close-btn" onclick="shutOverlayViewer()">Done</button>
            </div>
            <object data="${targetUrl}" class="overlay-viewport-iframe" type="text/html"></object>
        `;
    } else {
        container.innerHTML = `
            <div class="overlay-control-header">
                <span class="overlay-title" id="overlayPanelTitle">${displayTitle}</span>
                <button class="done-close-btn" onclick="shutOverlayViewer()">Done</button>
            </div>
            <iframe id="appIframeViewport"
                    class="overlay-viewport-iframe"
                    src="${targetUrl}"
                    allow="autoplay; encrypted-media; fullscreen"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox">
            </iframe>
        `;
    }
    container.style.display = 'block';
}

function shutOverlayViewer() {
    const container = document.getElementById('playerOverlayFrame');
    if (container) {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

/* ============================================
   HUB VISIBILITY
============================================ */
function updateHubVisibility() {
    const isHub =
        selectedActivePlaylistGroup === null &&
        activeDayView === null &&
        activeDifficultyView === null;

    const filterRow = document.querySelector('.hub-filter-row');
    const searchRow = document.querySelector('.hub-search-row');
    const navRow = document.querySelector('.hub-nav-row');

    if (filterRow) filterRow.style.display = isHub ? 'flex' : 'none';
    if (searchRow) searchRow.style.display = isHub ? 'flex' : 'none';
    if (navRow) navRow.style.display = isHub ? 'grid' : 'none';
}



/* ============================================
   USER PLAYLISTS (PLACEHOLDER)
============================================ */
function openUserPlaylists() {
    alert("User Playlists (coming soon)");
}

function createNewUserPlaylist() {
    alert("Create Playlist (coming soon)");
}

function openEventsView() {
    alert("Events (coming soon)");
}

/* ============================================
   CACHE BUSTER RELOAD
============================================ */
function forceCacheBusterReload() {
    const uniqueTimestamp = new Date().getTime();
    window.location.href =
        window.location.origin + window.location.pathname + '?v=' + uniqueTimestamp;
}
/* ============================================
   SIMPLE SEARCH CARD RENDERER
============================================ */
function renderSimpleSearchCards(matches, containerElement) {
    containerElement.innerHTML = "";

    if (!matches.length) {
        containerElement.innerHTML = `
            <p style="text-align:center;color:#aaa;margin-top:20px;">
                No matching dances found.
            </p>
        `;
        return;
    }

    matches.forEach(track => {
        const card = document.createElement('div');
        card.className = 'dance-entry-card simple-search-card';
        card.onclick = () => openDanceFromSearchToPlaylist(track.id);

        card.innerHTML = `
            <div class="title-line">${track.name} • By: ${track.choreographer}</div>
            <div class="meta-line">Song: ${track.song} - ${track.artist}</div>
            <div class="meta-line">(Playlist: ${track.playlist})</div>
        `;

        containerElement.appendChild(card);
    });
}


/* ============================================
   APP BOOTSTRAP
============================================ */
window.onload = function () {
    initializeVenueBranding();
    renderApplicationInterface();
};

/* ============================================
   GLOBAL EXPORTS
============================================ */
window.launchMediaOverlay = launchMediaOverlay;
window.shutOverlayViewer = shutOverlayViewer;
window.navigateToPlaylistHubMenu = navigateToPlaylistHubMenu;
window.openSpecificPlaylistView = openSpecificPlaylistView;
window.handleLiveSearchInput = handleLiveSearchInput;
window.setDayFilter = setDayFilter;
window.setDifficultyFilter = setDifficultyFilter;
window.forceCacheBusterReload = forceCacheBusterReload;

window.renderSimpleSearchCards = renderSimpleSearchCards;
window.openDanceFromSearchToPlaylist = openDanceFromSearchToPlaylist;

