console.log("TOP OF APP.JS LOADED");
/* ============================================
   IMPORTS      
============================================ */
import { danceData } from './venues/Stockyard/danceData-stockyard.js';
import { globalDanceList } from "./globalDanceList.js";
import { venueDanceMap } from "./venues/Stockyard/venueDanceMap.js";
import { venueConfig } from "./venues/Stockyard/venueConfig.js";
import { venueEvents } from "./venues/Stockyard/venueEvents.js";



/* ============================================
   MERGE GLOBAL + VENUE DANCE DATA  
============================================ */
let localDanceDatabase = [];

venueDanceMap.forEach(entry => {
    const base = globalDanceList.find(d => d.id === entry.id);
    if (base) {
        localDanceDatabase.push({
            ...base,
            playlist: entry.playlist,
            daytaught: entry.daytaught
        });
    }
});

/* ============================================
   CORE APP STATE
============================================ */
let overlayActive = false; //REMOVE
let selectedActivePlaylistGroup = null;   // Which playlist is open
let activeSearchQueryString = "";         // Hub search
let activeDayFilter = "ALL";              // Hub day filter
let activeDayView = null;                 // Hub day view
let activeDifficultyView = null;          // Hub difficulty view
let activeDifficultyFilter = "";          // Hub difficulty filter
let lastNavigationMode = null;            // "hub", "playlist", "workspace"
let activeUserPlaylistView = null;


/* ============================================
   WORKSPACE STATE
============================================ */
let workspaceMode = null;                 // "create", "edit", "delete"
let workspacePhase = 1;  // 1 = name playlist, 2 = build playlist
let workspacePlaylistName = "";           // Name of playlist being edited/created
let workspaceSelectedDances = [];         // Dance names inside playlist
let workspaceSearchQuery = "";            // Workspace search text
let workspaceSearchResults = [];          // Workspace search results
let workspaceEditingOriginalName = "";    // For safe renaming
let userPlaylistsData = {};                   // User-created playlists
let allDances = danceData;       // Shared dataset

/* ============================================
   VENUE BRANDING
============================================ */
function initializeVenueBranding() {
    const headerTitleEl = document.getElementById('applicationHeaderTitle');
    if (headerTitleEl) {
        headerTitleEl.innerText =
            venueConfig.headerTitle ||
            venueConfig.name ||
            "LineDance Player";
    }

    const searchInput = document.getElementById('danceSearchInput');
    if (searchInput) {
        searchInput.placeholder =
            venueConfig.searchPlaceholder ||
            "Search dances...";
    }

    const emailBanner = document.getElementById('venueEmailBanner');
    if (emailBanner) {
        const venueName = venueConfig.name || "LineDance Player";
        const email = venueConfig.email || "";
        emailBanner.innerText =
            email ? `✉ ${venueName} Feedback & Music Requests: ${email}` : "";
    }

    if (venueConfig.theme) {
        const root = document.documentElement;
        root.style.setProperty('--brand-green', venueConfig.theme.brandGreen || '#2ecc71');
        root.style.setProperty('--dark-gray', venueConfig.theme.darkGray || '#1e1e1e');
        root.style.setProperty('--card-bg', venueConfig.theme.cardBg || '#2b2b2b');
        root.style.setProperty('--btn-blue', venueConfig.theme.buttonBlue || '#34495e');
    }

    if (venueConfig.assets.backgroundImageUrl) {
        document.documentElement.style.setProperty(
            '--venue-bg-image',
            `url(${venueConfig.assets.backgroundImageUrl})`
        );
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
            splashTextEl.innerText =
                venueConfig.headerTitle ||
                venueConfig.name ||
                "LineDance Player";

            splashEl.style.display = 'flex';
            setTimeout(() => splashEl.style.display = 'none', 1500);
        } else {
            splashEl.style.display = 'none';
        }
    }
}
function setHubHeaderTitle(title) {
    const titleEl = document.getElementById('applicationHeaderTitle');
    if (titleEl) {
        titleEl.innerText = title;
        titleEl.style.display = 'inline';
    }
}

function activateWorkspaceHeader(modeTitle) {
    // Hide the big venue header (bull banner)
    const venueHeader = document.querySelector('.venue-header');
    if (venueHeader) venueHeader.style.display = 'none';

    // Show the shared header-bar
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) headerBar.style.display = 'flex';

    // Show and wire the back button for workspace exit
    const backBtn = document.getElementById('navbarReturnTrigger');
    if (backBtn) {
        backBtn.style.display = 'block';
        backBtn.onclick = navigateBackFromWorkspace;
    }

    // Set workspace title
    const titleEl = document.getElementById('applicationHeaderTitle');
    if (titleEl) {
        titleEl.style.display = 'inline';
        titleEl.innerText = modeTitle;
    }

    // Show the small workspace logo
    const smallLogo = document.getElementById("workspaceSmallLogo");
    if (smallLogo) smallLogo.style.display = "block";
}

function restoreHubHeader() {
    // Show the big venue header (bull banner)
    const venueHeader = document.querySelector('.venue-header');
    if (venueHeader) {
        venueHeader.style.display = 'flex';
        venueHeader.style.justifyContent = 'center';
        venueHeader.style.alignItems = 'center';
    }

    // Show the shared header-bar
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) headerBar.style.display = 'flex';

    // Hide the small workspace logo
    const smallLogo = document.getElementById("workspaceSmallLogo");
    if (smallLogo) smallLogo.style.display = "none";

    // Hide the back button
    const backBtn = document.getElementById('navbarReturnTrigger');
    if (backBtn) {
        backBtn.style.display = 'none';
        backBtn.onclick = null;
    }

    // Restore hub title
    const titleEl = document.getElementById('applicationHeaderTitle');
    if (titleEl) {
        titleEl.style.display = 'inline';
        titleEl.innerText = venueConfig.headerTitle || venueConfig.name || "";
    }
}


/* ============================================
   NAVIGATION HELPERS
============================================ */
function navigateToPlaylistHubMenu() {
    /*  applicationHeaderTitle.style.display = "none";  */
    selectedActivePlaylistGroup = null;
    activeDayView = null;
    activeDifficultyView = null;
    lastNavigationMode = "hub";
    renderApplicationInterface();
}

function returnToHub() {
    selectedActivePlaylistGroup = null;
    activeDayView = null;
    activeDifficultyView = null;
    lastNavigationMode = "hub";
    renderApplicationInterface();
}

function returnToSearchResults() {
    lastNavigationMode = "search";
    renderApplicationInterface();
}

/* ============================================
   HUB SEARCH INPUT
============================================ */
function handleLiveSearchInput() {
    const query = document.getElementById('danceSearchInput').value.trim().toLowerCase();
    activeSearchQueryString = query;

    const resultsContainer = document.querySelector('.search-results-container');
    if (!resultsContainer) return;

    if (!query) {
        resultsContainer.innerHTML = "";
        return;
    }

    const matches = localDanceDatabase.filter(track =>
        track.name.toLowerCase().includes(query)
    );

    renderSimpleSearchCards(matches, resultsContainer);
}

/* ============================================
   DAY FILTER
============================================ */
function setDayFilter(day) {
    activeDayFilter = day;
    activeDayView = day === "ALL" ? null : day;
    lastNavigationMode = "day";
    renderApplicationInterface();
}

/* ============================================
   DIFFICULTY FILTER
============================================ */
function setDifficultyFilter(level) {
    activeDifficultyFilter = level;
    activeDifficultyView = level || null;
    lastNavigationMode = "difficulty";
    renderApplicationInterface();
}

/* ============================================
   OPEN PLAYLIST VIEW
============================================ */
function openSpecificPlaylistView(name) {
   console.log(">>> PLAYLIST CARD CLICKED:", name);
    selectedActivePlaylistGroup = name;
    activeDayView = null;
    activeDifficultyView = null;
    lastNavigationMode = "playlist";
    renderApplicationInterface();
}

function openUserPlaylistView(name) {
    console.log(">>> USER PLAYLIST CARD CLICKED:", name);

    // Clear venue playlist mode
    selectedActivePlaylistGroup = null;

    // Activate user playlist mode
    activeUserPlaylistView = name;

    activeDayView = null;
    activeDifficultyView = null;
    lastNavigationMode = "user-playlist";

    renderApplicationInterface();
}


/* ============================================
   OPEN DANCE FROM PLAYLIST
============================================ */
function openDanceFromPlaylist(danceId) {
    // Dance cards should not navigate anywhere in the new architecture.
    // All actions happen through the 4 buttons on the card.
    return;
}
/* ============================================
   OPEN DANCE FROM SEARCH
============================================ */
function openDanceFromSearchToSingleDance(danceId) {
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    window.selectedSingleDance = dance;
    lastNavigationMode = "search";
    renderSingleDanceScreen(dance);
}

/* ============================================
   MAIN RENDERER
============================================ */
function renderApplicationInterface() {
    if (overlayActive) {
        console.log(">>> renderApplicationInterface BLOCKED (overlay active)");
        return;
    }

    console.log(">>> renderApplicationInterface RUNNING");

    const viewport = document.getElementById('masterApplicationViewport');
    if (!viewport) return;

    viewport.innerHTML = '';

    /* --------------------------------------------
       WORKSPACE SCREEN
       -------------------------------------------- */
    if (lastNavigationMode === "workspace") {
        renderWorkspaceScreen();
        attachWorkspaceListeners();
        setTimeout(attachWorkspaceListeners, 0);
        return;
    }

    /* --------------------------------------------
       PLAYLIST VIEW
       -------------------------------------------- */
    if (selectedActivePlaylistGroup !== null) {

        const filteredTracks = localDanceDatabase.filter(
            track => track.playlist === selectedActivePlaylistGroup
        );

        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;
        document.getElementById('applicationHeaderTitle').innerText = selectedActivePlaylistGroup;

        renderDanceCardsList(filteredTracks, viewport);
        updateHubVisibility();
        return;   // ⭐ prevents hub screen from overwriting playlist
    }

    /* --------------------------------------------
       DAY VIEW
       -------------------------------------------- */
    if (activeDayView !== null) {

        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;
        document.getElementById('applicationHeaderTitle').innerText = activeDayView + " Dances";

        const dayTracks = localDanceDatabase.filter(track =>
            activeDayFilter === "ALL" ? true : track.daytaught === activeDayFilter
        );

        if (!dayTracks.length) {
            viewport.innerHTML = `
                <p style="text-align:center;color:#aaa;margin-top:20px;">
                    No dances taught on this day.
                </p>`;
            return;
        }

        renderDanceCardsList(dayTracks, viewport);
        updateHubVisibility();
        return;   // ⭐ prevents hub screen from overwriting day view
    }

    /* --------------------------------------------
       DIFFICULTY VIEW
       -------------------------------------------- */
    if (activeDifficultyView !== null) {

        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;
        document.getElementById('applicationHeaderTitle').innerText =
            activeDifficultyView + " Dances";

        const level = activeDifficultyFilter.toLowerCase();

        const difficultyTracks = localDanceDatabase.filter(track =>
            (track.level || "").toLowerCase().includes(level)
        );

        if (!difficultyTracks.length) {
            viewport.innerHTML = `
                <p style="text-align:center;color:#aaa;margin-top:20px;">
                    No dances found for this difficulty level.
                </p>`;
            return;
        }

        renderDanceCardsList(difficultyTracks, viewport);
        updateHubVisibility();
        return;   // ⭐ prevents hub screen from overwriting difficulty view
    }

    /* --------------------------------------------
       HUB SCREEN (default)
       -------------------------------------------- */
    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'block';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'block';

    const navRow = document.querySelector('.hub-nav-row');
    if (navRow) navRow.style.display = 'flex';

    document.getElementById('navbarReturnTrigger').style.display = 'none';
    document.getElementById('navbarReturnTrigger').onclick = null;
    if (lastNavigationMode === "hub") {
    restoreHubHeader();
    document.getElementById('applicationHeaderTitle').innerText =
        venueConfig.headerTitle || venueConfig.name || "";
   }

    
   /* --------------------------------------------
   USER PLAYLIST VIEW
   -------------------------------------------- */
if (lastNavigationMode === "user-playlist" && activeUserPlaylistView !== null) {

   const tracks = (userPlaylistsData[activeUserPlaylistView] || [])
    .map(title => allDances.find(t =>
        t.name.trim().toLowerCase() === title.trim().toLowerCase()
    ))
    .filter(t => t);


   console.log("DEBUG — activeUserPlaylistView:", activeUserPlaylistView);
   console.log("DEBUG — raw playlist titles:", userPlaylistsData[activeUserPlaylistView]);
   console.log("DEBUG — database titles:", localDanceDatabase.map(t => t.title));

    document.getElementById('navbarReturnTrigger').style.display = 'block';
    document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;
    document.getElementById('applicationHeaderTitle').innerText = activeUserPlaylistView;

    if (!tracks.length) {
        viewport.innerHTML = `
            <p style="text-align:center;color:#aaa;margin-top:20px;">
                No dances found in this playlist.
            </p>`;
        return;
    }

    renderDanceCardsList(tracks, viewport);
    updateHubVisibility();
    return;
}


    /* --------------------------------------------
       VENUE PLAYLISTS
       -------------------------------------------- */
    let groupNames;
    if (venueConfig.playlistGroups?.length > 0) {
        groupNames = [...venueConfig.playlistGroups];
    } else {
        groupNames = [...new Set(localDanceDatabase.map(track =>
            track.playlist || "General"
        ))].sort();
    }

    const venuePlaylistCardsHTML = groupNames.map(name => {
        const count = localDanceDatabase.filter(t => t.playlist === name).length;
        return `
            <div class="hub-playlist-card"
                 onclick="openSpecificPlaylistView('${name}')">
                <div class="hub-playlist-name">${name}</div>
                <div class="hub-playlist-count">${count} dances</div>
            </div>
        `;
    }).join('');

    /* --------------------------------------------
       USER PLAYLISTS
       -------------------------------------------- */
    const userPlaylistNames = Object.keys(userPlaylistsData || {});
    const userPlaylistCardsHTML =
        userPlaylistNames.length > 0
            ? userPlaylistNames.map(name => {
                const count = userPlaylistsData[name].length;
                return `
                    <div class="hub-playlist-card user-playlist-card"
                         onclick="openUserPlaylistView('${name}')">
                        <div class="hub-playlist-name">${name}</div>
                        <div class="hub-playlist-count">${count} dances</div>
                    </div>
                `;
            }).join('')
            : "";

    /* --------------------------------------------
       RENDER HUB SCREEN
       -------------------------------------------- */
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
            <div class="hub-feedback-email">${venueConfig.email}</div>
            <div class="hub-nav-row">
                <div class="hub-nav-card" onclick="openWorkspace()">
                    Manage User Playlists
                </div>
                <div class="hub-nav-card" onclick="openEventsView()">
                    Events
                </div>
            </div>

            <div class="playlist-container">

                ${userPlaylistCardsHTML
                    ? `<div class="hub-section-title">Your Playlists</div>${userPlaylistCardsHTML}`
                    : ""}

                <div class="hub-section-title">Venue Playlists</div>
                ${venuePlaylistCardsHTML}

            </div>

            <div class="search-results-container"></div>
        </div>
    `;
}

console.log("JUST BEFORE EVENTS FUNCTIONS LOADED");
function openEventsView() {
    console.log("fIRST LINE IN Open Events View");

    setHubHeaderTitle("Events");   // ✔ correct function

    const viewport = document.getElementById("masterApplicationViewport");
    viewport.innerHTML = "";

    renderEventsScreen();
}



function renderEventsScreen() {
    const viewport = document.getElementById("masterApplicationViewport");

    viewport.innerHTML = `
        <div class="events-screen">

            <div class="events-left-column">
                <h2 class="workspace-section-title">Upcoming Events</h2>
                <div id="eventsList" class="events-list"></div>
            </div>

            <div class="events-right-column">
                <button class="workspace-cancel-btn" onclick="returnToHub()">
                    Back
                </button>
            </div>

        </div>
    `;

    renderEventsList();
}

function renderEventsList() {
    const container = document.getElementById("eventsList");
    container.innerHTML = "";

    venueEvents.forEach(evt => {
        const card = document.createElement("div");
        card.className = "event-card";

        card.innerHTML = `
            <img src="${evt.image}" class="event-image" />

            <div class="event-info">
                <div class="event-title">${evt.title}</div>
                <div class="event-date">${evt.date}</div>
                <div class="event-price">${evt.price}</div>

                <a href="${evt.link}" target="_blank" class="event-link">
                    Tickets & Info
                </a>
            </div>
        `;

        container.appendChild(card);
    });
}


/* ============================================
   DANCE CARD RENDERER
============================================ */
function renderDanceCardsList(tracks, containerElement) {
    console.log(">>> renderDanceCardsList running with", tracks.length, "tracks");

    containerElement.innerHTML = "";

    if (!tracks.length) {
        containerElement.innerHTML = `
            <p style="text-align:center;color:#aaa;margin-top:20px;">
                No dances found.
            </p>`;
        return;
    }

    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'dance-entry-card';

        // Prevent card click from firing when buttons are clicked
        card.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        card.innerHTML = `
            <div class="title-line">${track.name} • By: ${track.choreographer}</div>
            <div class="meta-line">Song: ${track.song} - ${track.artist}</div>

            <div class="dance-button-row">
                <button class="playlist-btn steps-btn">Steps</button>
                <button class="playlist-btn teach-btn">Teach</button>
                <button class="playlist-btn demo-btn">Demo</button>
                <button class="playlist-btn music-btn">Music</button>
            </div>
        `;

        console.log(">>> HTML GENERATED:", card.innerHTML);

        // Attach event listeners with stopPropagation to prevent card navigation
        card.querySelector('.steps-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            launchMediaOverlay(track.steps, `${track.name} - Steps`);
        });

        card.querySelector('.teach-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            launchMediaOverlay(track.teach, `${track.name} - Teach`);
        });

        card.querySelector('.demo-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            launchMediaOverlay(track.demo, `${track.name} - Demo`);
        });

        card.querySelector('.music-btn').addEventListener('click', (event) => {
            event.stopPropagation();
            launchMediaOverlay(track.music, `${track.name} - Music`);
        });

        containerElement.appendChild(card);
    });
}



/* ============================================
   WORKSPACE PLAYLIST SELECTION (EDIT MODE)
============================================ */
function renderWorkspacePlaylistSelection() {
    console.log("Render Workspace Playlist Selection");
    console.log("DOM CHECK: workspacePlaylistSelection exists?", !!document.getElementById('workspacePlaylistSelection'));

    const container = document.getElementById('workspacePlaylistSelection');
    if (!container) {
        console.log("WS: playlistSelection container NOT FOUND");
        return;
    }

    console.log("WS: renderWorkspacePlaylistSelection — userPlaylistsData:", userPlaylistsData);

    if (!userPlaylistsData || Object.keys(userPlaylistsData).length === 0) {
        container.innerHTML = `<div class="workspace-note">No user playlists available.</div>`;
        return;
    }

    let html = `<div class="workspace-note">Select a playlist to edit:</div>`;

    Object.keys(userPlaylistsData).forEach(name => {
        html += `
            <div class="workspace-playlist-item"
                 onclick="selectPlaylistForEditing('${name}')">
                ${name}
            </div>
        `;
    });

    container.innerHTML = html;
}

/* ============================================
   WORKSPACE SCREEN (MAIN ENTRY)
============================================ */
function renderWorkspaceScreen() {
    activateWorkspaceHeader("Manage User Playlists");
    console.log("RENDER WORKSPACE SCREEN");
    console.log("CHECK: renderWorkspaceScreen — workspaceMode =", workspaceMode);
    document.body.classList.add("workspace-mode");

    // Hide hub UI elements
    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) {
        filterBar.style.display = 'none';
        filterBar.classList.add("hub-hidden");
    }

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) {
        diffBar.style.display = 'none';
        diffBar.classList.add("hub-hidden");
    }

    const hubSearchRow = document.querySelector('.hub-search-row');
    if (hubSearchRow) {
        hubSearchRow.style.display = 'none';
        hubSearchRow.classList.add("hub-hidden");
    }

    const hubNavRow = document.querySelector('.hub-nav-row');
    if (hubNavRow) {
        hubNavRow.style.display = 'none';
        hubNavRow.classList.add("hub-hidden");
    }

    // Show small workspace logo
    const smallLogo = document.getElementById("workspaceSmallLogo");
    if (smallLogo) smallLogo.style.display = "block";

    // Hide venue header
    const venueHeader = document.querySelector('.venue-header');
    if (venueHeader) {
        venueHeader.style.display = 'none';
    }

    // Show workspace header
    const wsHeader = document.querySelector('.workspace-header');
    if (wsHeader) {
        wsHeader.style.display = 'flex';
    }

    // Show back button
    const backBtn = document.getElementById('navbarReturnTrigger');
    if (backBtn) {
        backBtn.style.display = 'block';
        backBtn.onclick = navigateBackFromWorkspace;
    }

    // Inject workspace DOM
    document.getElementById('masterApplicationViewport').innerHTML = `
      <div class="workspace-screen">

        <!-- MODE SELECTION PANEL -->
        <div id="workspaceModePanel" class="workspace-mode-panel">

            <button id="modeCreateBtn" class="workspace-mode-btn">Create Playlist</button>
            <div class="workspace-mode-desc">Start a new playlist and give it a name.</div>

            <button id="modeDeleteBtn" class="workspace-mode-btn">Delete Playlist</button>
            <div class="workspace-mode-desc">Remove one of your personal playlists.</div>

            <button id="modeEditBtn" class="workspace-mode-btn">Edit Playlist</button>
            <div class="workspace-mode-desc">Add or remove dances from a playlist you created.</div>

        </div>

        <!-- WORKSPACE CONTENT -->
        <div id="workspaceContent" style="display:none;">
            <div id="workspaceMessage" class="workspace-message"></div>

            <div id="workspaceColumns" class="workspace-columns">

                <!-- LEFT COLUMN -->
                <div id="workspaceLeftColumn" class="workspace-column-left"></div>

                <!-- RIGHT COLUMN -->
                <div id="workspaceRightColumn" class="workspace-column-right"></div>

            </div>
        </div>

      </div>
    `;

    /* ⭐ IMPORTANT FIX ⭐
       Only show workspaceContent when actually in Create/Edit/Delete mode.
       This prevents the ghost scroll bar on the Manage User Playlists screen.
    */
    if (workspaceMode === "create" || workspaceMode === "edit" || workspaceMode === "delete") {
        document.getElementById('workspaceContent').style.display = 'block';
    } else {
        document.getElementById('workspaceContent').style.display = 'none';
    }

    attachWorkspaceListeners();
}

function renderCreateModeLayout() {
    console.log("RENDER CREATE MODE LAYOUT — Phase:", workspacePhase);

    const left = document.getElementById("workspaceLeftColumn");
    const right = document.getElementById("workspaceRightColumn");
    const columns = document.querySelector(".workspace-columns");

    // Always clear columns before rendering
    left.innerHTML = "";
    right.innerHTML = "";

    /* ============================================================
       PHASE 1 — NAME PLAYLIST
       ============================================================ */
    if (workspacePhase === 1) {
        console.log("Phase:", workspacePhase);

        // ⭐ Enable Phase‑1 full‑width mode
        document.body.classList.add("workspace-phase1");

        // ⭐ Collapse two-column layout
        if (columns) {
            columns.style.display = "block";   // no flexbox
        }

        // ⭐ Expand left column
        left.style.width = "100%";

        // ⭐ Hide right column entirely
        right.style.display = "none";

        left.innerHTML = `
            <h2 class="workspace-section-title">Create Playlist</h2>

            <input 
                id="workspaceNameInput"
                type="text"
                placeholder="Enter playlist name..."
                class="workspace-name-box"
            />

            <button class="workspace-create-btn"
                    onclick="beginWorkspacePhase2()">
                Create Playlist
            </button>
        `;

        // Attach name input handler
        const nameInput = document.getElementById("workspaceNameInput");
        if (nameInput) {
            nameInput.addEventListener("input", (e) => {
                workspacePlaylistName = e.target.value.trim();
            });
        }

        return; // ⭐ STOP — Phase 1 complete
    }

    /* ============================================================
       PHASE 2 — BUILD / EDIT PLAYLIST
       ============================================================ */
    if (workspacePhase === 2) {
        console.log("Phase:", workspacePhase);

        // ⭐ Disable Phase‑1 full‑width mode
        document.body.classList.remove("workspace-phase1");

        // ⭐ Restore two-column layout
        if (columns) {
            columns.style.display = "flex";
        }

        // Restore right column visibility
        right.style.display = "";

        // ⭐ LEFT COLUMN — Selected dances (playlist name now NON-editable)
        left.innerHTML = `
            <h2 class="workspace-section-title">
                Playlist: ${workspacePlaylistName}
            </h2>

            <div id="workspaceSelectedDances" class="workspace-selected-list"></div>
        `;

        // ⭐ RIGHT COLUMN — Search
        right.innerHTML = `
            <h2 class="workspace-section-title">Search Dances</h2>

            <input 
                id="workspaceSearchInput"
                type="text"
                placeholder="Search dances..."
                oninput="handleWorkspaceSearchInput(this.value)"
                class="workspace-search-box"
            />

            <div id="workspaceSearchResults" class="workspace-search-results"></div>
        `;

        const content = document.getElementById("workspaceContent");
        if (content) {
            content.style.marginTop = "0";
            content.style.paddingTop = "0";
        }

        // ⭐ Remove any existing footer before creating a new one
        const oldFooter = document.getElementById("workspaceFooter");
        if (oldFooter) oldFooter.remove();

        // ⭐ FIXED BOTTOM SAVE/CANCEL BAND
        let footer = document.getElementById("workspaceFooter");
        if (!footer) {
            const screen = document.querySelector(".workspace-screen");
            footer = document.createElement("div");
            footer.id = "workspaceFooter";
            footer.className = "workspace-footer-fixed";
            screen.appendChild(footer);
        }

        footer.innerHTML = `
            <button class="workspace-save-btn" onclick="saveWorkspacePlaylist()">Save</button>
            <button class="workspace-cancel-btn" onclick="cancelWorkspace()">Cancel</button>
        `;

        // ⭐ INITIAL RENDER OF LISTS
        workspaceSearchResults = allDances.filter(track =>
            !workspaceSelectedDances.includes(track.name)
        );

        workspaceSearchResults = [];
        renderWorkspaceSelectedDances();
        renderWorkspaceSearchResults();

        return; // ⭐ STOP — Phase 2 complete
    }
}

function startEditMode() {
    console.log("Start Edit Mode");
    activateWorkspaceHeader("Edit Playlist");

    // Hide mode-selection panel (missing before)
    const modePanel = document.getElementById('workspaceModePanel');
    if (modePanel) modePanel.style.display = 'none';

    // Remove footer if present (Create Mode only)
    const footer = document.getElementById("workspaceFooter");
    if (footer) footer.remove();

    // Set workspace mode + phase
    workspaceMode = "edit";
    workspacePhase = 1;

    // Body classes
    document.body.classList.add("workspace-mode-edit");
    document.body.classList.remove("workspace-mode-delete");
    document.body.classList.remove("workspace-mode-create");

    updateWorkspaceModeButtons("edit");

    // If no playlists exist
    if (!userPlaylistsData || Object.keys(userPlaylistsData).length === 0) {
        showWorkspaceMessage("No playlists available to edit.", "warning");
        workspaceMode = "neutral";
        document.body.classList.remove("workspace-mode-edit");
        updateWorkspaceModeButtons("neutral");
        return;
    }

    // Clear columns
    document.getElementById("workspaceLeftColumn").innerHTML = "";
    document.getElementById("workspaceRightColumn").innerHTML = "";

    // Update header
    document.getElementById('applicationHeaderTitle').innerText = "Edit Playlist";

    // Show workspace content
    document.getElementById("workspaceContent").style.display = "block";

    // Render edit layout
    renderEditModeLayout();
}

function startCreateMode() {
    console.log("Start Create Mode — workspaceMode:", workspaceMode);
    workspaceSelectedDances = [];   // ⭐ Reset selected dances for new playlist
    workspaceSearchResults = [];    // optional but recommended
    workspacePlaylistName = "";     // optional but recommended

    activateWorkspaceHeader("Create Playlist");

    // Hide the mode selection buttons (Create / Edit / Delete)
    const modePanel = document.getElementById('workspaceModePanel');
    if (modePanel) modePanel.style.display = 'none';

    // Hide playlist selection dropdown if present
    const sel = document.getElementById('workspacePlaylistSelection');
    if (sel) sel.style.display = 'none';

    console.log("WIPE: startCreateMode — clearing left/right columns");
    document.getElementById("workspaceLeftColumn").innerHTML = "";
    document.getElementById("workspaceRightColumn").innerHTML = "";

    // Set mode + phase
    workspaceMode = "create";
    workspacePhase = 1;   // Always begin in Phase 1 (Name Playlist)

    // Update header title
    document.getElementById('applicationHeaderTitle').innerText = "Create Playlist";

    // Update workspace header buttons (if any)
    updateWorkspaceModeButtons("create");

    // Show workspace content
    document.getElementById("workspaceContent").style.display = "block";

    // Render Phase 1 or Phase 2 depending on state
    renderCreateModeLayout();
}


function startDeleteMode() {
    console.log("Start Delete Mode — workspaceMode:", workspaceMode);
    activateWorkspaceHeader("Delete Playlist");

    // Hide mode-selection panel
    const modePanel = document.getElementById('workspaceModePanel');
    if (modePanel) modePanel.style.display = 'none';

    // Hide selector
    const sel = document.getElementById('workspacePlaylistSelection');
    if (sel) sel.style.display = 'none';

    // Clear columns
    const left = document.getElementById("workspaceLeftColumn");
    const right = document.getElementById("workspaceRightColumn");
    left.innerHTML = "";
    right.innerHTML = "";

    // Set mode + phase
    workspaceMode = "delete";
    workspacePhase = 1;

    // Update header
    document.getElementById('applicationHeaderTitle').innerText = "Delete Playlist";

    // Remove footer (from Create Mode)
    const footer = document.getElementById("workspaceFooter");
    if (footer) footer.remove();

    // Update workspace buttons
    updateWorkspaceModeButtons("delete");

    // Show workspace content
    document.getElementById("workspaceContent").style.display = "block";

    // Render delete layout
    renderDeleteModeLayout();
}

function beginWorkspacePhase2() {
    // Normalize name
    const normalizedName = (workspacePlaylistName || "").trim();

    // Empty name check
    if (!normalizedName) {
        alert("Please enter a playlist name before continuing.");
        return;
    }

    // ⭐ Prevent overwriting an existing playlist (PHASE 1 CHECK)
    if (userPlaylistsData.hasOwnProperty(normalizedName)) {
        alert(
            `A playlist named "${normalizedName}" already exists.\n\n` +
            `Please choose a different name.`
        );
        return; // STOP — do not enter Phase 2
    }

    // Safe to continue
    workspacePlaylistName = normalizedName;
    workspacePhase = 2;
    renderCreateModeLayout();
}



function attachWorkspaceListeners() {
    const createBtn = document.getElementById("modeCreateBtn");
    if (createBtn) createBtn.addEventListener("click", startCreateMode);

    const deleteBtn = document.getElementById("modeDeleteBtn");
    if (deleteBtn) deleteBtn.addEventListener("click", startDeleteMode);

    const editBtn = document.getElementById("modeEditBtn");
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            workspaceMode = "edit";
            renderWorkspaceScreen();
            startEditMode();
        });
    }
}

function renderEditModeLayout() {
    console.log("Render Edit Mode Layout");

    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    // Clear columns
    left.innerHTML = "";
    right.innerHTML = "";

    /* ============================================================
       EDIT MODE — SELECT PLAYLIST
       ============================================================ */
    left.innerHTML = `
        <div class="workspace-section-title">Select Playlist</div>
        <div id="workspacePlaylistSelection" class="workspace-playlist-selection"></div>
    `;

    // Right column intentionally empty
    right.innerHTML = ``;

    renderWorkspacePlaylistSelection();

    // ⭐ Remove any existing footer before creating a new one
    const oldFooter = document.getElementById("workspaceFooter");
    if (oldFooter) oldFooter.remove();

    // ⭐ Create the fixed bottom footer
    let footer = document.getElementById("workspaceFooter");
    if (!footer) {
        const screen = document.querySelector(".workspace-screen");
        footer = document.createElement("div");
        footer.id = "workspaceFooter";
        footer.className = "workspace-footer-fixed";
        screen.appendChild(footer);
    }

    footer.innerHTML = `
        <button class="workspace-save-btn workspace-footer-btn" onclick="saveEditedPlaylist()">Save Changes</button>
        <button class="workspace-cancel-btn workspace-footer-btn" onclick="cancelWorkspace()">Cancel</button>
    `;

    // ⭐ Hide Save button until a playlist is selected
    const saveBtn = footer.querySelector(".workspace-save-btn");
    if (saveBtn) saveBtn.style.display = "none";
}

/* ============================================
   DELETE MODE LAYOUT
============================================ */
function renderDeleteModeLayout() {
    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    // If no playlists exist — show proper empty screen
    if (!userPlaylistsData || Object.keys(userPlaylistsData).length === 0) {
        left.innerHTML = `
            <div class="workspace-section-title">Delete Playlist</div>
            <div class="workspace-empty-message">No playlists available to delete.</div>
        `;

        right.innerHTML = `
            <button class="workspace-cancel-btn" onclick="cancelWorkspace()">
                Cancel
            </button>
        `;

        return;
    }

    // Normal delete mode
    left.innerHTML = `
        <div class="workspace-section-title">Delete Playlist</div>
        <div id="workspaceDeleteList" class="workspace-delete-list"></div>
    `;

    right.innerHTML = `
        <button class="workspace-cancel-btn" onclick="cancelWorkspace()">
            Cancel
        </button>
    `;

    renderWorkspaceDeleteList();
}

function updateWorkspaceModeButtons(activeMode) {
    const createBtn = document.getElementById("modeCreateBtn");
    const editBtn = document.getElementById("modeEditBtn");
    const deleteBtn = document.getElementById("modeDeleteBtn");

    [createBtn, editBtn, deleteBtn].forEach(btn => {
        btn.classList.remove("active");
        btn.classList.remove("disabled");
    });

    if (activeMode === "create") {
        createBtn.classList.add("active");
    }

    if (activeMode === "edit") {
        editBtn.classList.add("active");
    }

    if (activeMode === "delete") {
        deleteBtn.classList.add("active");
    }
}



function renderWorkspaceDeleteList() {
    const container = document.getElementById('workspaceDeleteList');
    if (!container) return;

    if (!userPlaylistsData || Object.keys(userPlaylistsData).length === 0) {
        container.innerHTML = `<div class="workspace-note">No playlists to delete.</div>`;
        return;
    }

    let html = "";

    Object.keys(userPlaylistsData).forEach(name => {
        html += `
            <div class="workspace-delete-item">
                <span>${name}</span>
                <button id="deleteBtn_${name}"
                        class="workspace-delete-btn"
                        onclick="deleteWorkspacePlaylist('${name}')">
                    Delete
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}



/* ============================================
   DELETE LIST RENDERER
============================================ */
function deleteWorkspacePlaylist(name) {

    // Render a confirmation UI in the RIGHT column
    const right = document.getElementById("workspaceRightColumn");

    right.innerHTML = `
        <h2 class="workspace-section-title">Confirm Delete</h2>

        <div class="workspace-delete-confirm-box">
            Are you sure you want to delete "<strong>${name}</strong>"?
        </div>

        <div class="workspace-actions">
            <button class="workspace-save-btn" onclick="confirmDeletePlaylist('${name}')">
                Confirm Delete
            </button>
            
           <button class="workspace-cancel-btn" onclick="cancelWorkspace()">
                Cancel
            </button>
 
        </div>
    `;
}

function confirmDeletePlaylist(name) {
    delete userPlaylistsData[name];
    showWorkspaceMessage(`Playlist "${name}" deleted.`, "error");
    renderWorkspaceScreen();
}


/* ============================================
   WORKSPACE — HANDLE NAME INPUT
============================================ */
function handleWorkspaceNameInput(value) {
    workspacePlaylistName = value.trim();
}

/* ============================================
   WORKSPACE — SEARCH INPUT
============================================ */
function handleWorkspaceSearchInput(value) {
    workspaceSearchQuery = value.trim().toLowerCase();

    if (!workspaceSearchQuery) {
        workspaceSearchResults = [];
        renderWorkspaceSearchResults();
        return;
    }

    // ⭐ Only search fields visible in the workspace UI
    workspaceSearchResults = allDances.filter(track => {
        const name = (track.name || "").toLowerCase();
        const choreo = (track.choreographer || "").toLowerCase();

        return (
            name.includes(workspaceSearchQuery) ||
            choreo.includes(workspaceSearchQuery)
        );
    });

    renderWorkspaceSearchResults();
}


function showWorkspaceMessage(text, type = "success") {
    const msg = document.getElementById("workspaceMessage");
    if (!msg) return;

    msg.textContent = text;
    msg.className = "workspace-message " + type;

    msg.style.opacity = 1;

    setTimeout(() => {
        msg.style.opacity = 0;
    }, 2000);
}
/* ============================================
   WORKSPACE — SEARCH RESULTS RENDERER (UPDATED)
============================================ */
function renderWorkspaceSearchResults() {
    const container = document.getElementById('workspaceSearchResults');
    if (!container) return;

    container.innerHTML = "";

    if (!workspaceSearchResults.length) {
        container.innerHTML = `
            <div class="workspace-note">No matching dances found.</div>
        `;
        return;
    }

    workspaceSearchResults.forEach(track => {
        const row = document.createElement('div');

        const isAlreadySelected = workspaceSelectedDances.includes(track.name);

        // ⭐ Row class (dim entire row if already selected)
        row.className = isAlreadySelected
            ? 'workspace-dance-row disabled'
            : 'workspace-dance-row';

        // ⭐ Button logic — remove button entirely if already selected
        const addButtonHTML = isAlreadySelected
            ? ''   // no button at all
            : `<button class="workspace-add-btn">+</button>`;

        row.innerHTML = `
            <span class="workspace-dance-title">
                ${track.name} • ${track.choreographer}
            </span>
            ${addButtonHTML}
        `;
       
        // ⭐ Entire-row tap behavior
        if (!isAlreadySelected) {
          row.onclick = () => {
           addDanceToWorkspace(track.name);

           // ⭐ Instant visual feedback BEFORE re-render
           row.classList.add("disabled");

           const btn = row.querySelector(".workspace-add-btn");
           if (btn) btn.remove();

           row.style.transition = "opacity 120ms ease";
           row.style.opacity = "0.55";
          };
      } else {
         row.onclick = () => {}; // disabled
      }

        container.appendChild(row);
    });
}


/* ============================================
   WORKSPACE — SELECTED LIST RENDERER (UPDATED)
============================================ */
function renderWorkspaceSelectedDances() {
    const container = document.getElementById('workspaceSelectedDances');
    if (!container) return;

    container.innerHTML = "";

    if (!workspaceSelectedDances.length) {
        container.innerHTML = `
            <div class="workspace-note">No dances selected.</div>
        `;
        return;
    }

    workspaceSelectedDances.forEach(name => {
        const row = document.createElement('div');
        row.className = 'workspace-selected-row';

        row.innerHTML = `
            <span>${name}</span>
            <button class="workspace-remove-btn">Remove</button>
        `;

        // Entire-row tap behavior
        row.onclick = () => {
            removeDanceFromWorkspace(name);
        };

        container.appendChild(row);
    });
}

/* ============================================
   WORKSPACE — ADD DANCE
============================================ */
function addDanceToWorkspace(name) {
    if (!workspaceSelectedDances.includes(name)) {
        workspaceSelectedDances.push(name);
        renderWorkspaceSelectedDances();
    }
}

/* ============================================
   WORKSPACE — REMOVE DANCE
============================================ */
function removeDanceFromWorkspace(name) {
    const index = workspaceSelectedDances.indexOf(name);
    if (index !== -1) {
        workspaceSelectedDances.splice(index, 1);
        renderWorkspaceSelectedDances();
    }
}

/* ============================================
   WORKSPACE — SAVE PLAYLIST
============================================ */
function saveWorkspacePlaylist() {
    console.log("Save Workspace Playlist");
    console.log("SAVE — workspacePlaylistName:", workspacePlaylistName);
    console.log("DEBUG — workspaceSelectedDances:", workspaceSelectedDances);
    console.log("DEBUG — userPlaylistsData BEFORE SAVE:", userPlaylistsData);

    if (!workspacePlaylistName) {
        showWorkspaceMessage("Please enter a playlist name.", "error");
        return;
    }

    if (workspaceSelectedDances.length === 0) {
        showWorkspaceMessage("Please add at least one dance.", "warning");
        return;
    }

    // SAVE
    userPlaylistsData[workspacePlaylistName] = [...workspaceSelectedDances];
    showWorkspaceMessage(`Playlist "${workspacePlaylistName}" saved!`, "success");

    // ⭐ Switch to EDIT mode so the selector appears
    workspaceMode = "edit";
    renderWorkspaceScreen();
}

/* ============================================
   WORKSPACE — SELECT PLAYLIST FOR EDITING
============================================ */
function selectPlaylistForEditing(name) {
    workspacePlaylistName = name;
    workspaceEditingOriginalName = name;
    workspaceSelectedDances = [...userPlaylistsData[name]];

    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    // ⭐ LEFT COLUMN — CLEAN, NON-EDITABLE PLAYLIST NAME
    left.innerHTML = `
        <h2 class="workspace-section-title">Playlist: ${workspacePlaylistName}</h2>

        <div id="workspaceSelectedDances" class="workspace-selected-list"></div>
    `;

    // ⭐ RIGHT COLUMN — Search
    right.innerHTML = `
        <div class="workspace-section-title">Search Dances</div>

        <input id="workspaceSearchInput"
               class="workspace-search-input"
               type="text"
               placeholder="Search..."
               oninput="handleWorkspaceSearchInput(this.value)" />

        <div id="workspaceSearchResults" class="workspace-search-results"></div>
    `;

    // ⭐ Remove the selection-screen footer
    const oldFooter = document.getElementById("workspaceFooter");
    if (oldFooter) oldFooter.remove();

    // ⭐ Create the correct footer for actual edit mode
    const screen = document.querySelector(".workspace-screen");
    const footer = document.createElement("div");
    footer.id = "workspaceFooter";
    footer.className = "workspace-footer-fixed";
    footer.innerHTML = `
        <button class="workspace-save-btn workspace-footer-btn" onclick="saveWorkspacePlaylist()">Save Changes</button>
        <button class="workspace-cancel-btn workspace-footer-btn" onclick="cancelWorkspace()">Cancel</button>
    `;
    screen.appendChild(footer);

    // ⭐ Render selected dances
    renderWorkspaceSelectedDances();

    // ⭐ Clear old search results from previous screens
    workspaceSearchResults = [];
    renderWorkspaceSearchResults();
}

/* ============================================
   WORKSPACE — NAVIGATION BACK
============================================ */
function navigateBackFromWorkspace() {
    console.log("WIPE: navigateBackFromWorkspace — clearing workspaceSelectedDances and workspace state");
    console.log("NAVIGATE — lastNavigationMode:", lastNavigationMode);
    console.log("NAVIGATE — workspaceMode:", workspaceMode);
    console.log("NAVIGATE — selectedActivePlaylistGroup:", selectedActivePlaylistGroup);
    restoreHubHeader();

    // ⭐ EMPTY PLAYLIST WARNING (Phase 2 only)
    if (workspaceMode === "create" &&
        workspacePhase === 2 &&
        workspaceSelectedDances.length === 0) {

        const confirmLeave = confirm(
            "This playlist has no dances.\nEmpty playlists cannot be saved.\nLeave without saving?"
        );

        if (!confirmLeave) return;
    }

    // Reset workspace state
    workspaceSelectedDances = [];
    workspaceSearchQuery = "";
    workspaceSearchResults = [];
    workspaceEditingOriginalName = "";
    workspacePlaylistName = "";
    workspaceMode = "neutral";

    // ⭐ Hide workspace header container
    const wsHeader = document.querySelector('.workspace-header');
    if (wsHeader) wsHeader.style.display = 'none';

    // ⭐ Hide workspace title (this was the missing piece)
    const wsTitle = document.getElementById('applicationHeaderTitle');
    if (wsTitle) wsTitle.style.display = 'none';

    // ⭐ Hide small workspace-only logo
    const smallLogo = document.getElementById("workspaceSmallLogo");
    if (smallLogo) smallLogo.style.display = "none";

    // ⭐ Restore venue header (big bull)
    const venueHeader = document.querySelector('.venue-header');
    if (venueHeader) venueHeader.style.display = 'block';

    // ⭐ Restore header-bar (remove leftover workspace inline styles)
    const headerBar = document.querySelector('.header-bar');
    if (headerBar) {
       headerBar.style.display = "none";
   }


    // ⭐ Remove workspace-mode class
    document.body.classList.remove("workspace-mode");

    lastNavigationMode = "hub";
    renderApplicationInterface();
}


/* ============================================
   OPEN WORKSPACE
============================================ */
function openWorkspace() {
    console.log("ENTER: openWorkspace — workspaceMode BEFORE =", workspaceMode);
    lastNavigationMode = "workspace";
    renderWorkspaceScreen();
    attachWorkspaceListeners();
    console.log("ENTER: openWorkspace — workspaceMode AFTER =", workspaceMode);
}



/* ============================================
   CANCEL WORKSPACE 
============================================ */
function cancelWorkspace() {
    workspaceMode = null;
    workspacePhase = null;
    workspacePlaylistName = "";
    renderWorkspaceScreen();
}

/* ============================================
   SINGLE DANCE SCREEN
============================================ */
function renderSingleDanceScreen(dance) {
    const viewport = document.getElementById('masterApplicationViewport');
    if (!viewport) return;

    document.getElementById('navbarReturnTrigger').style.display = 'block';
    document.getElementById('navbarReturnTrigger').onclick = returnToSearchResults;

    document.getElementById('applicationHeaderTitle').innerText = dance.name;

    viewport.innerHTML = `
        <div class="single-dance-screen">
            <h2>${dance.name}</h2>
            <p><strong>Choreographer:</strong> ${dance.choreographer}</p>
            <p><strong>Song:</strong> ${dance.song} - ${dance.artist}</p>
            <p><strong>Playlist:</strong> ${dance.playlist}</p>
            <p><strong>Level:</strong> ${dance.level || "N/A"}</p>
            <p><strong>Day Taught:</strong> ${dance.daytaught || "N/A"}</p>
        </div>
    `;
}

/* ============================================
   SIMPLE SEARCH CARDS (Hub Search)
============================================ */
function renderSimpleSearchCards(matches, container) {
    container.innerHTML = "";

    if (!matches.length) {
        container.innerHTML = `
            <p style="text-align:center;color:#aaa;margin-top:20px;">
                No results found.
            </p>`;
        return;
    }

    matches.forEach(track => {
        const card = document.createElement('div');
        card.className = 'search-result-card';
        card.onclick = () => openDanceFromSearchToSingleDance(track.id);

        card.innerHTML = `
            <div class="search-result-title">${track.name}</div>
            <div class="search-result-meta">${track.choreographer}</div>
        `;

        container.appendChild(card);
    });
}

/* ============================================
   HUB VISIBILITY UPDATER
============================================ */
function updateHubVisibility() {
    const filterBar = document.getElementById('dayFilterBar');
    const diffBar = document.getElementById('difficultyFilterBar');
    const navRow = document.querySelector('.hub-nav-row');

    if (filterBar) filterBar.style.display = 'none';
    if (diffBar) diffBar.style.display = 'none';
    if (navRow) navRow.style.display = 'none';
}

/* ============================================
   INITIALIZE APP
============================================ */
window.onload = function () {
    initializeVenueBranding();
    renderApplicationInterface();
};

function openSteps(danceId) {
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance || !dance.stepsUrl) return;
    launchMediaOverlay(dance.stepsUrl, "Steps");
}

function openTeach(danceId) {
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance || !dance.teachUrl) return;
    launchMediaOverlay(dance.teachUrl, "Teach");
}

function openDemo(danceId) {
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance || !dance.demoUrl) return;
    launchMediaOverlay(dance.demoUrl, "Demo");
}

function openMusic(danceId) {
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance || !dance.musicUrl) return;
    launchMediaOverlay(dance.musicUrl, "Music");
}


function launchMediaOverlay(targetUrl, displayTitle) {
   overlayActive = true; //REMOVE 

   console.log("launchMediaOverlay URL:", targetUrl);

    if (!targetUrl) return;

    // Force HTTPS for YouTube and other embeds
    targetUrl = targetUrl.replace('http://', 'https://');

    const container = document.getElementById('playerOverlayFrame');

    if (!container) return;

    container.style.display = 'none';
    container.innerHTML = '';

    if (displayTitle.includes("steps") || displayTitle.includes("Steps")) {
        // STEPS: use <object> for CopperKnob / step sheets
        container.innerHTML = `
            <div class="overlay-control-header">
                <span class="overlay-title" id="overlayPanelTitle">${displayTitle}</span>
                <button class="done-close-btn" onclick="shutOverlayViewer()">Done</button>
            </div>
            <object data="${targetUrl}" class="overlay-viewport-iframe" type="text/html"></object>
        `;
    } else {
        // YOUTUBE: use <iframe> with proper sandbox + allow
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
   overlayActive = false;  //REMOVE

    const container = document.getElementById('playerOverlayFrame');
    if (container) {
        container.innerHTML = '';
        container.style.display = 'none';
    }

    // Re-render correct screen based on current state
    renderApplicationInterface();
}


/* ============================================
   GLOBAL EXPORTS (Required for HTML onclick)
============================================ */
window.navigateToPlaylistHubMenu = navigateToPlaylistHubMenu;
window.openSpecificPlaylistView = openSpecificPlaylistView;
window.handleLiveSearchInput = handleLiveSearchInput;
window.setDayFilter = setDayFilter;
window.setDifficultyFilter = setDifficultyFilter;
window.renderSimpleSearchCards = renderSimpleSearchCards;
window.openDanceFromSearchToSingleDance = openDanceFromSearchToSingleDance;
window.openDanceFromPlaylist = openDanceFromPlaylist;
window.openWorkspace = openWorkspace;
window.navigateBackFromWorkspace = navigateBackFromWorkspace;
window.selectPlaylistForEditing = selectPlaylistForEditing;
window.handleWorkspaceNameInput = handleWorkspaceNameInput;
window.saveWorkspacePlaylist = saveWorkspacePlaylist;
window.deleteWorkspacePlaylist = deleteWorkspacePlaylist;
window.handleWorkspaceSearchInput = handleWorkspaceSearchInput;
window.addDanceToWorkspace = addDanceToWorkspace;
window.removeDanceFromWorkspace = removeDanceFromWorkspace;
window.openSteps = openSteps;
window.openTeach = openTeach;
window.openDemo = openDemo;
window.openMusic = openMusic;
window.launchMediaOverlay = launchMediaOverlay;
window.shutOverlayViewer = shutOverlayViewer;
window.startCreateMode = startCreateMode;
window.startEditMode = startEditMode;
window.startDeleteMode = startDeleteMode;
window.openUserPlaylistView = openUserPlaylistView;
window.confirmDeletePlaylist = confirmDeletePlaylist;
window.renderWorkspaceDeleteList = renderWorkspaceDeleteList;
window.beginWorkspacePhase2 = beginWorkspacePhase2;
window.renderDeleteModeLayout = renderDeleteModeLayout;
window.cancelWorkspace = cancelWorkspace;
window.openEventsView = openEventsView;
window.returnToHub = returnToHub;
