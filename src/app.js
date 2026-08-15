// New App.js

/* ============================================
   IMPORTS
============================================ */
import { globalDanceList } from "./globalDanceList.js";
import { venueDanceMap } from "./venues/Stockyard/venueDanceMap.js";
import { venueConfig } from "./venues/Stockyard/venueConfig.js";

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
let selectedActivePlaylistGroup = null;   // Which playlist is open
let activeSearchQueryString = "";         // Hub search
let activeDayFilter = "ALL";              // Hub day filter
let activeDayView = null;                 // Hub day view
let activeDifficultyView = null;          // Hub difficulty view
let activeDifficultyFilter = "";          // Hub difficulty filter
let lastNavigationMode = null;            // "hub", "playlist", "workspace"

/* ============================================
   WORKSPACE STATE
============================================ */
let workspaceMode = null;                 // "create", "edit", "delete"
let workspacePlaylistName = "";           // Name of playlist being edited/created
let workspaceSelectedDances = [];         // Dance names inside playlist
let workspaceSearchQuery = "";            // Workspace search text
let workspaceSearchResults = [];          // Workspace search results
let workspaceEditingOriginalName = "";    // For safe renaming
let userPlaylists = {};                   // User-created playlists
let allDances = localDanceDatabase;       // Shared dataset

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
/* ============================================
   NAVIGATION HELPERS
============================================ */
function navigateToPlaylistHubMenu() {
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
    selectedActivePlaylistGroup = name;
    activeDayView = null;
    activeDifficultyView = null;
    lastNavigationMode = "playlist";
    renderApplicationInterface();
}

/* ============================================
   OPEN DANCE FROM PLAYLIST
============================================ */
function openDanceFromPlaylist(danceId) {
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    window.selectedSingleDance = dance;
    lastNavigationMode = "playlist";
    renderSingleDanceScreen(dance);
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
    const viewport = document.getElementById('masterApplicationViewport');
    if (!viewport) return;

    viewport.innerHTML = '';

    /* --------------------------------------------
       WORKSPACE SCREEN
       -------------------------------------------- */
    if (lastNavigationMode === "workspace") {
        renderWorkspaceScreen();
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
        return;
    }
    /* --------------------------------------------
       DAY VIEW
       -------------------------------------------- */
    if (activeDayView !== null) {
        document.getElementById('navbarReturnTrigger').style.display = 'block';
        document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;

        document.getElementById('applicationHeaderTitle').innerText =
            activeDayView + " Dances";

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
        return;
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
        return;
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

    document.getElementById('applicationHeaderTitle').innerText = "Playlists";

    let groupNames;
    if (venueConfig.playlistGroups?.length > 0) {
        groupNames = [...venueConfig.playlistGroups];
    } else {
        groupNames = [...new Set(localDanceDatabase.map(track =>
            track.playlist || "General"
        ))].sort();
    }

    const playlistCardsHTML = groupNames.map(name => {
        const count = localDanceDatabase.filter(t => t.playlist === name).length;
        return `
            <div class="hub-playlist-card"
                 onclick="openSpecificPlaylistView('${name}')">
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

            <div class="hub-nav-row">
                <div class="hub-nav-card" onclick="openWorkspace()">
                    Manage User Playlists
                </div>
                <div class="hub-nav-card" onclick="openEventsView()">
                    Events
                </div>
            </div>

            <div class="playlist-container">
                ${playlistCardsHTML}
            </div>

            <div class="search-results-container"></div>

        </div>
    `;
}

/* ============================================
   DANCE CARD RENDERER
============================================ */
function renderDanceCardsList(tracks, containerElement) {
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
        card.onclick = () => openDanceFromPlaylist(track.id);

        card.innerHTML = `
            <div class="title-line">${track.name} • By: ${track.choreographer}</div>
            <div class="meta-line">Song: ${track.song} - ${track.artist}</div>
            <div class="meta-line">(Playlist: ${track.playlist})</div>
        `;

        containerElement.appendChild(card);
    });
}

/* ============================================
   WORKSPACE PLAYLIST SELECTION (EDIT MODE)
============================================ */
function renderWorkspacePlaylistSelection() {
    const container = document.getElementById('workspacePlaylistSelection');
    if (!container) return;

    if (!userPlaylists || Object.keys(userPlaylists).length === 0) {
        container.innerHTML = `<div class="workspace-note">No user playlists available.</div>`;
        return;
    }

    let html = `<div class="workspace-note">Select a playlist to edit:</div>`;

    Object.keys(userPlaylists).forEach(name => {
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

    document.getElementById('applicationHeaderTitle').innerText =
        workspaceMode === "edit"
            ? `Edit Playlist: ${workspacePlaylistName}`
            : `Create Playlist`;

    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'none';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'none';

    const hubSearchRow = document.querySelector('.hub-search-row');
    if (hubSearchRow) hubSearchRow.style.display = 'none';

    const hubNavRow = document.querySelector('.hub-nav-row');
    if (hubNavRow) hubNavRow.style.display = 'none';

    document.getElementById('navbarReturnTrigger').style.display = 'block';
    document.getElementById('navbarReturnTrigger').onclick = navigateBackFromWorkspace;

    document.getElementById('masterApplicationViewport').innerHTML = `
      <div class="workspace-screen">

        <!-- MODE SELECTION PANEL -->
        <div id="workspaceModePanel" class="workspace-mode-panel">
            <button onclick="startCreateMode()">Create New Playlist</button>
            <button onclick="startEditMode()">Edit Existing Playlist</button>
            <button onclick="startDeleteMode()">Delete Playlist</button>
        </div>

        <!-- WORKSPACE CONTENT -->
        <div id="workspaceContent" style="display:none;">

            <div id="workspaceColumns" class="workspace-columns">

                <!-- LEFT COLUMN -->
                <div id="workspaceLeftColumn" class="workspace-column-left"></div>

                <!-- RIGHT COLUMN -->
                <div id="workspaceRightColumn" class="workspace-column-right"></div>

            </div>

        </div>

      </div>
    `;

    /* ============================================
       MODE SWITCHING
    ============================================ */
    window.startCreateMode = function () {
        workspaceMode = "create";
        workspacePlaylistName = "";
        workspaceSelectedDances = [];
        workspaceEditingOriginalName = "";

        document.getElementById("workspaceContent").style.display = "block";
        renderCreateModeLayout();
    };

    window.startEditMode = function () {
        workspaceMode = "edit";
        document.getElementById("workspaceContent").style.display = "block";
        renderEditModeLayout();
    };

    window.startDeleteMode = function () {
        workspaceMode = "delete";
        document.getElementById("workspaceContent").style.display = "block";
        renderDeleteModeLayout();
    };
}

/* ============================================
   CREATE MODE LAYOUT
============================================ */
function renderCreateModeLayout() {
    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    left.innerHTML = `
        <div class="workspace-section-title">Playlist Name</div>
        <input id="workspaceNameInput"
               class="workspace-name-input"
               type="text"
               placeholder="Enter playlist name..."
               value="${workspacePlaylistName}"
               oninput="handleWorkspaceNameInput(this.value)" />

        <div class="workspace-section-title">Selected Dances</div>
        <div id="workspaceSelectedList" class="workspace-selected-list"></div>

        <button class="workspace-save-btn" onclick="saveWorkspacePlaylist()">
            Save Playlist
        </button>
    `;

    right.innerHTML = `
        <div class="workspace-section-title">Search Dances</div>
        <input id="workspaceSearchInput"
               class="workspace-search-input"
               type="text"
               placeholder="Search..."
               oninput="handleWorkspaceSearchInput(this.value)" />

        <div id="workspaceSearchResults" class="workspace-search-results"></div>
    `;

    renderWorkspaceSelectedList();
    renderWorkspaceSearchResults();
}

/* ============================================
   EDIT MODE LAYOUT
============================================ */
function renderEditModeLayout() {
    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    left.innerHTML = `
        <div class="workspace-section-title">Select Playlist</div>
        <div id="workspacePlaylistSelection" class="workspace-playlist-selection"></div>
    `;

    right.innerHTML = `
        <div class="workspace-note">
            Choose a playlist from the left to edit.
        </div>
    `;

    renderWorkspacePlaylistSelection();
}

/* ============================================
   DELETE MODE LAYOUT
============================================ */
function renderDeleteModeLayout() {
    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    left.innerHTML = `
        <div class="workspace-section-title">Delete Playlist</div>
        <div id="workspaceDeleteList" class="workspace-delete-list"></div>
    `;

    right.innerHTML = `
        <div class="workspace-note">
            Select a playlist on the left to delete.
        </div>
    `;

    renderWorkspaceDeleteList();
}

/* ============================================
   DELETE LIST RENDERER
============================================ */
function renderWorkspaceDeleteList() {
    const container = document.getElementById('workspaceDeleteList');
    if (!container) return;

    if (!userPlaylists || Object.keys(userPlaylists).length === 0) {
        container.innerHTML = `<div class="workspace-note">No playlists to delete.</div>`;
        return;
    }

    let html = "";

    Object.keys(userPlaylists).forEach(name => {
        html += `
            <div class="workspace-delete-item">
                <span>${name}</span>
                <button onclick="deleteWorkspacePlaylist('${name}')">Delete</button>
            </div>
        `;
    });

    container.innerHTML = html;
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

    workspaceSearchResults = allDances.filter(track =>
        track.name.toLowerCase().includes(workspaceSearchQuery)
    );

    renderWorkspaceSearchResults();
}

/* ============================================
   WORKSPACE — SEARCH RESULTS RENDERER
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
        const card = document.createElement('div');
        card.className = 'workspace-search-card';

        card.innerHTML = `
            <div class="workspace-search-title">${track.name}</div>
            <div class="workspace-search-meta">${track.choreographer}</div>
            <button class="workspace-add-btn"
                    onclick="addDanceToWorkspace('${track.name}')">
                + Add
            </button>
        `;

        container.appendChild(card);
    });
}

/* ============================================
   WORKSPACE — SELECTED LIST RENDERER
============================================ */
function renderWorkspaceSelectedList() {
    const container = document.getElementById('workspaceSelectedList');
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
            <button class="workspace-remove-btn"
                    onclick="removeDanceFromWorkspace('${name}')">
                Remove
            </button>
        `;

        container.appendChild(row);
    });
}

/* ============================================
   WORKSPACE — ADD DANCE
============================================ */
function addDanceToWorkspace(name) {
    if (!workspaceSelectedDances.includes(name)) {
        workspaceSelectedDances.push(name);
        renderWorkspaceSelectedList();
    }
}

/* ============================================
   WORKSPACE — REMOVE DANCE
============================================ */
function removeDanceFromWorkspace(name) {
    const index = workspaceSelectedDances.indexOf(name);
    if (index !== -1) {
        workspaceSelectedDances.splice(index, 1);
        renderWorkspaceSelectedList();
    }
}

/* ============================================
   WORKSPACE — SAVE PLAYLIST
============================================ */
function saveWorkspacePlaylist() {
    if (!workspacePlaylistName) {
        alert("Please enter a playlist name.");
        return;
    }

    if (workspaceSelectedDances.length === 0) {
        alert("Please add at least one dance.");
        return;
    }

    userPlaylists[workspacePlaylistName] = [...workspaceSelectedDances];

    alert(`Playlist "${workspacePlaylistName}" saved!`);
    navigateBackFromWorkspace();
}

/* ============================================
   WORKSPACE — SELECT PLAYLIST FOR EDITING
============================================ */
function selectPlaylistForEditing(name) {
    workspacePlaylistName = name;
    workspaceEditingOriginalName = name;
    workspaceSelectedDances = [...userPlaylists[name]];

    const left = document.getElementById('workspaceLeftColumn');
    const right = document.getElementById('workspaceRightColumn');

    left.innerHTML = `
        <div class="workspace-section-title">Playlist Name</div>
        <input id="workspaceNameInput"
               class="workspace-name-input"
               type="text"
               value="${workspacePlaylistName}"
               oninput="handleWorkspaceNameInput(this.value)" />

        <div class="workspace-section-title">Selected Dances</div>
        <div id="workspaceSelectedList" class="workspace-selected-list"></div>

        <button class="workspace-save-btn" onclick="saveEditedWorkspacePlaylist()">
            Save Changes
        </button>
    `;

    right.innerHTML = `
        <div class="workspace-section-title">Search Dances</div>
        <input id="workspaceSearchInput"
               class="workspace-search-input"
               type="text"
               placeholder="Search..."
               oninput="handleWorkspaceSearchInput(this.value)" />

        <div id="workspaceSearchResults" class="workspace-search-results"></div>
    `;

    renderWorkspaceSelectedList();
    renderWorkspaceSearchResults();
}

/* ============================================
   WORKSPACE — SAVE EDITED PLAYLIST
============================================ */
function saveEditedWorkspacePlaylist() {
    if (!workspacePlaylistName) {
        alert("Please enter a playlist name.");
        return;
    }

    if (workspaceSelectedDances.length === 0) {
        alert("Please add at least one dance.");
        return;
    }

    if (workspaceEditingOriginalName !== workspacePlaylistName) {
        delete userPlaylists[workspaceEditingOriginalName];
    }

    userPlaylists[workspacePlaylistName] = [...workspaceSelectedDances];

    alert(`Playlist "${workspacePlaylistName}" updated!`);
    navigateBackFromWorkspace();
}

/* ============================================
   WORKSPACE — DELETE PLAYLIST
============================================ */
function deleteWorkspacePlaylist(name) {
    const confirmDelete = confirm(`Delete playlist "${name}"?`);
    if (!confirmDelete) return;

    delete userPlaylists[name];

    alert(`Playlist "${name}" deleted.`);
    renderWorkspaceDeleteList();
}

/* ============================================
   WORKSPACE — NAVIGATION BACK
============================================ */
function navigateBackFromWorkspace() {
    workspaceMode = null;
    workspacePlaylistName = "";
    workspaceSelectedDances = [];
    workspaceSearchQuery = "";
    workspaceSearchResults = [];
    workspaceEditingOriginalName = "";

    lastNavigationMode = "hub";
    renderApplicationInterface();
}

/* ============================================
   OPEN WORKSPACE
============================================ */
function openWorkspace() {
    lastNavigationMode = "workspace";
    renderWorkspaceScreen();
}

/* ============================================
   EVENTS VIEW (placeholder)
============================================ */
function openEventsView() {
    const viewport = document.getElementById('masterApplicationViewport');
    viewport.innerHTML = `
        <div class="events-view">
            <h2>Events</h2>
            <p>Event listings will appear here.</p>
        </div>
    `;
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
