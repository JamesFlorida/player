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
let selectedActivePlaylistGroup = null;   // Which playlist is currently open (Dancelist Screen)
let activeSearchQueryString = "";         // Hub search (will be removed later)
let activeDayFilter = "ALL";              // Hub filter
let activeDayView = null;                 // Hub day view
let activeDifficultyView = null;          // Hub difficulty view
let activeDifficultyFilter = "";          // Hub difficulty filter

let lastNavigationMode = null;            // "hub", "playlist", "workspace"

/* ============================================
   WORKSPACE STATE
============================================ */
let workspaceMode = null;                 // "create" or "edit"
let workspacePlaylistName = "";           // Name of the playlist being edited/created
let workspaceSelectedDances = [];         // Array of dance IDs inside the playlist
let workspaceSearchQuery = "";            // Search bar text inside Workspace
let workspaceSearchResults = [];          // Search results inside Workspace
let workspaceEditingOriginalName = "";    // For renaming playlists safely
let userPlaylists = {};
let allDances = localDanceDatabase;

function startCreatingNewPlaylist() {
    // Create a blank playlist object
    selectedActivePlaylistGroup = {
        name: "",
        dances: []
    };

    // Switch navigation mode
    lastNavigationMode = "workspace";

    // Re-render Workspace in "edit mode"
    renderWorkspaceScreen();
}

window.startCreatingNewPlaylist = startCreatingNewPlaylist;


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
    // Do NOT clear search state in Phase 2
    // activeSearchQueryString stays exactly as-is

    // Restore search bar text
    const searchInput = document.getElementById('danceSearchInput');
    if (searchInput) searchInput.value = activeSearchQueryString;

    // Set playlist group
    selectedActivePlaylistGroup = groupName;

    // Clear day/difficulty modes
    activeDayView = null;
    activeDayFilter = "ALL";
    activeDifficultyView = null;
    activeDifficultyFilter = "";

    // Hide filters in playlist view
    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'none';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'none';

    // Show return trigger
   document.getElementById('navbarReturnTrigger').style.display = 'block';
   document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;


    // Restore playlist header
    document.getElementById('applicationHeaderTitle').innerText = groupName;

    // Render playlist screen
    renderApplicationInterface();
}


function openSearchResultsWorkspace(matches) {
   

    // Render the workspace search results screen
    renderWorkspaceSearchResults(matches);
}

function returnToSearchResults() {
    // Clear single dance mode
    selectedActivePlaylistGroup = null;

    // Restore search bar text
    const searchBox = document.getElementById('danceSearchInput');
    if (searchBox) searchBox.value = activeSearchQueryString;

    // If search query exists → re-render workspace search results
    if (activeSearchQueryString && activeSearchQueryString.length > 0) {
        const matches = localDanceDatabase.filter(track =>
            track.name.toLowerCase().includes(activeSearchQueryString.toLowerCase())
        );

        // Restore header title
        document.getElementById('applicationHeaderTitle').innerText = "Search Results";

        renderWorkspaceSearchResults(matches);
    } else {
        // If no query exists, return to hub
        returnToHub();
    }
}

function openDanceFromPlaylist(danceId) {
    lastNavigationMode = "playlist";

    // Preserve search state (Phase 2)
    const searchBox = document.getElementById('danceSearchInput');
    if (searchBox) searchBox.value = activeSearchQueryString;

    // Find the dance
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    // ⭐ Stay in playlist mode
    selectedActivePlaylistGroup = dance.playlist;

    // ⭐ DO NOT re-render the screen here
    // renderApplicationInterface();   <-- REMOVE THIS LINE
}

function navigateBackFromWorkspace() {
    lastNavigationMode = "hub";
    renderApplicationInterface();
}

function openDanceFromSearchToSingleDance(danceId) {
    lastNavigationMode = "search";
    // Do NOT clear search state in Phase 2
    // activeSearchQueryString stays exactly as-is

    // Restore search bar text
    const searchBox = document.getElementById('danceSearchInput');
    if (searchBox) searchBox.value = activeSearchQueryString;

    // Find the dance
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    

    // Clear playlist mode (but preserve search context)
    selectedActivePlaylistGroup = null;

    // Restore header title to dance name
    document.getElementById('applicationHeaderTitle').innerText = dance.name;

    // Render the workspace screen
    renderApplicationInterface();
}


function returnToHub() {
    // Clear workspace state
   
    selectedActivePlaylistGroup = null;

    // Clear search state
    activeSearchQueryString = "";
    const searchBox = document.getElementById('danceSearchInput');
    if (searchBox) searchBox.value = "";

    // Restore hub header
    document.getElementById('applicationHeaderTitle').innerText =
        venueConfig.headerTitle || venueConfig.name || "LineDance Player";

    // Render hub screen
    renderApplicationInterface();
}

function openDanceFromSearchToPlaylist(danceId) {
    // Do NOT clear search state in Phase 2
    // activeSearchQueryString stays exactly as-is

    // Restore search bar text
    const searchBox = document.getElementById('danceSearchInput');
    if (searchBox) searchBox.value = activeSearchQueryString;

    // Find the dance
    const dance = localDanceDatabase.find(d => d.id === danceId);
    if (!dance) return;

    // Set playlist group
    selectedActivePlaylistGroup = dance.playlist;

   

    // Restore playlist header
    document.getElementById('applicationHeaderTitle').innerText = dance.playlist;

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
  
    selectedActivePlaylistGroup = null;

    // Restore hub header
    document.getElementById('applicationHeaderTitle').innerText =
        venueConfig.headerTitle || venueConfig.name || "LineDance Player";

    // Restore hub screen
    renderApplicationInterface();
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

    // ⭐ NEW: render results in the Workspace Search Results Screen
    openSearchResultsWorkspace(matches);
}

function startEditingExistingPlaylist() {

    // If no playlist is selected, do nothing for now
    // (Step 8 will add a proper selection UI)
    if (!selectedActivePlaylistGroup) {
        alert("No playlist selected to edit.");
        return;
    }

    // Switch Workspace into edit mode
    workspaceMode = "edit";
    workspacePlaylistName = selectedActivePlaylistGroup.name;

    // Re-render Workspace with the playlist loaded
    renderWorkspaceScreen();
}

function selectPlaylistForEditing(name) {
    selectedActivePlaylistGroup = userPlaylists[name];
    workspaceMode = "edit";
    workspacePlaylistName = name;

    renderWorkspaceScreen();
}


function saveWorkspacePlaylist() {

    // Validate name
    if (!workspacePlaylistName || workspacePlaylistName.trim() === "") {
        alert("Please enter a playlist name.");
        return;
    }

    // Validate selected dances
    if (!selectedActivePlaylistGroup || !selectedActivePlaylistGroup.dances || selectedActivePlaylistGroup.dances.length === 0) {
        alert("Please add at least one dance to the playlist.");
        return;
    }

    // Save or overwrite playlist
    userPlaylists[workspacePlaylistName] = {
        name: workspacePlaylistName,
        dances: [...selectedActivePlaylistGroup.dances]
    };

    alert(`Playlist "${workspacePlaylistName}" saved.`);

    // Return to Hub or stay in Workspace?
    // For now, stay in Workspace and refresh the selection list
    renderWorkspaceScreen();
}

function deleteWorkspacePlaylist() {

    // Must be editing a playlist
    if (!selectedActivePlaylistGroup || !workspacePlaylistName) {
        alert("No playlist selected to delete.");
        return;
    }

    // Prevent deleting Stock playlists
    if (workspacePlaylistName.startsWith("Stock-")) {
        alert("Stock playlists cannot be deleted.");
        return;
    }

    // Confirm deletion
    const confirmDelete = confirm(`Delete playlist "${workspacePlaylistName}"?`);
    if (!confirmDelete) return;

    // Delete from userPlaylists
    delete userPlaylists[workspacePlaylistName];

    // Reset workspace state
    selectedActivePlaylistGroup = { name: "", dances: [] };
    workspacePlaylistName = "";
    workspaceMode = "create";

    alert("Playlist deleted.");

    // Refresh Workspace
    renderWorkspaceScreen();
}

function handleWorkspaceSearchInput() {
    const query = document.getElementById('workspaceSearchInput').value.trim().toLowerCase();

    // If empty, clear results
    if (!query) {
        document.getElementById('workspaceSearchResults').innerHTML = "";
        return;
    }

    // Search dances (same dataset used by Hub search)
    const matches = allDances.filter(d =>
        d.name.toLowerCase().includes(query)
    );

    // Render results
    renderWorkspaceSearchResults(matches);
}

function addDanceToWorkspace(danceName) {

    if (!selectedActivePlaylistGroup) {
        selectedActivePlaylistGroup = { name: "", dances: [] };
    }

    // Prevent duplicates
    if (!selectedActivePlaylistGroup.dances.includes(danceName)) {
        selectedActivePlaylistGroup.dances.push(danceName);
    }

    renderWorkspaceSelectedList();
}

function removeDanceFromWorkspace(danceName) {
    if (!selectedActivePlaylistGroup) return;

    selectedActivePlaylistGroup.dances =
        selectedActivePlaylistGroup.dances.filter(d => d !== danceName);

    renderWorkspaceSelectedList();
}


function handleWorkspaceNameInput() {
    const input = document.getElementById("workspacePlaylistNameInput");
    workspacePlaylistName = input.value;
    selectedActivePlaylistGroup.name = workspacePlaylistName;
}







/* ============================================
   MAIN RENDERER (CLEANED + CORRECTED)
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
       1. PLAYLIST VIEW (if user is inside a playlist)
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
        document.getElementById('navbarReturnTrigger').onclick = navigateToPlaylistHubMenu;

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

    const navRow = document.querySelector('.hub-nav-row');
    if (navRow) navRow.style.display = 'flex';

    document.getElementById('navbarReturnTrigger').style.display = 'none';
    document.getElementById('navbarReturnTrigger').onclick = null;

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

            <div class="hub-nav-row">
             <div class="hub-nav-card" onclick="openWorkspace()">Manage User Playlists</div>
             <div class="hub-nav-card" onclick="openEventsView()">Events</div>
            </div>

            <div class="playlist-container">
                ${playlistCardsHTML}
            </div>
            <div class="search-results-container"></div>

        </div>
    `;
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
        card.id = `dance-card-${track.id}`;
        card.onclick = () => openDanceFromPlaylist(track.id);
         
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

function renderWorkspacePlaylistSelection() {

    const container = document.getElementById('workspacePlaylistSelection');
    if (!container) return;

    // If no user playlists exist yet
    if (!userPlaylists || Object.keys(userPlaylists).length === 0) {
        container.innerHTML = `<div class="workspace-note">No user playlists available.</div>`;
        return;
    }

    // Build a simple list of user playlists
    let html = `<div class="workspace-note">Select a playlist to edit:</div>`;

    Object.keys(userPlaylists).forEach(name => {
        html += `
            <div class="workspace-playlist-item" onclick="selectPlaylistForEditing('${name}')">
                ${name}
            </div>
        `;
    });

    container.innerHTML = html;
}
function renderWorkspaceScreen() {

    // Header Title
    document.getElementById('applicationHeaderTitle').innerText =
        workspaceMode === "edit"
            ? `Edit Playlist: ${workspacePlaylistName}`
            : `Create Playlist`;

    // Hide Hub filters and search
    const filterBar = document.getElementById('dayFilterBar');
    if (filterBar) filterBar.style.display = 'none';

    const diffBar = document.getElementById('difficultyFilterBar');
    if (diffBar) diffBar.style.display = 'none';

    const hubSearchRow = document.querySelector('.hub-search-row');
    if (hubSearchRow) hubSearchRow.style.display = 'none';

    const hubNavRow = document.querySelector('.hub-nav-row');
    if (hubNavRow) hubNavRow.style.display = 'none';

    // Show back button
    document.getElementById('navbarReturnTrigger').style.display = 'block';
    document.getElementById('navbarReturnTrigger').onclick = navigateBackFromWorkspace;

    // ⭐ INSERT HTML FIRST — VERY IMPORTANT
    document.getElementById('masterApplicationViewport').innerHTML = `
      <div class="workspace-screen">

        <!-- ⭐ MODE SELECTION PANEL (always shown first) -->
        <div id="workspaceModePanel" class="workspace-mode-panel">
            <button onclick="startCreateMode()">Create New Playlist</button>
            <button onclick="startEditMode()">Edit Existing Playlist</button>
            <button onclick="startDeleteMode()">Delete Playlist</button>
        </div>

        <!-- ⭐ WORKSPACE CONTENT (hidden until a mode is chosen) -->
        <div id="workspaceContent" style="display:none;">

            <!-- ⭐ TWO-COLUMN LAYOUT -->
            <div id="workspaceColumns" class="workspace-columns">

                <!-- LEFT COLUMN: Search + Add -->
                <div id="workspaceLeftColumn" class="workspace-column-left"></div>

                <!-- RIGHT COLUMN: Playlist Name + Selected Dances -->
                <div id="workspaceRightColumn" class="workspace-column-right"></div>

            </div>

        </div>

      </div>
    `;  // ⭐ HTML STRING ENDS HERE — DO NOT PUT JS BELOW THIS LINE INSIDE THE STRING


    // ⭐ MODE FUNCTIONS — nested inside renderWorkspaceScreen,
    // but OUTSIDE the HTML string (correct placement)

    window.startCreateMode = function () {
        workspaceMode = "create";
        workspacePlaylistName = "";
        selectedActivePlaylistGroup = { name: "", dances: [] };

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

} // ⭐ END OF renderWorkspaceScreen()

function renderCreateModeLayout() {

    // LEFT COLUMN: Search + Add
    document.getElementById("workspaceLeftColumn").innerHTML = `
        <div class="workspace-search-row">
            <input type="text" id="workspaceSearchInput"
                   placeholder="Search dances..."
                   oninput="handleWorkspaceSearchInput()">
        </div>

        <div id="workspaceSearchResults" class="workspace-search-results"></div>
    `;

    // RIGHT COLUMN: Playlist name + selected dances
    document.getElementById("workspaceRightColumn").innerHTML = `
        <div class="workspace-name-row">
            <input type="text" id="workspacePlaylistNameInput"
                   placeholder="Playlist name..."
                   value="${workspacePlaylistName}"
                   oninput="handleWorkspaceNameInput()">
        </div>

        <div id="workspaceSelectedList" class="workspace-selected-list"></div>

        <div class="workspace-action-row">
            <button onclick="saveWorkspacePlaylist()">Save Playlist</button>
        </div>
    `;

    // Render initial empty lists
    renderWorkspaceSearchResults();
    renderWorkspaceSelectedList();
}

function renderWorkspaceSelectedList() {
    const container = document.getElementById("workspaceSelectedList");
    container.innerHTML = "";

    selectedActivePlaylistGroup.dances.forEach(danceName => {
        const row = document.createElement("div");
        row.className = "workspace-selected-row";
        row.innerHTML = `
            <span>${danceName}</span>
            <button onclick="removeDanceFromWorkspace('${danceName}')">–</button>
        `;
        container.appendChild(row);
    });
}



function renderWorkspaceSearchResults() {
    const query = document.getElementById("workspaceSearchInput").value.toLowerCase();
    const results = allDances.filter(d => d.name.toLowerCase().includes(query));

    const container = document.getElementById("workspaceSearchResults");
    container.innerHTML = "";

    results.forEach(dance => {
        const row = document.createElement("div");
        row.className = "workspace-search-result-row";
        row.innerHTML = `
            <span>${dance.name}</span>
            <button onclick="addDanceToWorkspace('${dance.name}')">+</button>
        `;
        container.appendChild(row);
    });
}
    

function renderSingleDanceScreen(dance) {
    const viewport = document.getElementById('masterApplicationViewport');
    document.getElementById('applicationHeaderTitle').innerText = dance.name;
    if (!viewport) return;

    let navHTML = "";

    if (lastNavigationMode === "playlist") {
        navHTML = `
            <div class="nav-line" onclick="openSpecificPlaylistView(selectedSingleDance.playlist)">
                ← Playlist
            </div>
            <div class="nav-line" onclick="returnToHub()">
                ← Hub
            </div>
        `;
    } else {
        navHTML = `
            <div class="nav-line" onclick="returnToSearchResults()">
                ← Results
            </div>
            <div class="nav-line" onclick="returnToHub()">
                ← Hub
            </div>
        `;
    }

    viewport.innerHTML = `
        <div class="single-dance-screen">

            <div class="title-line">${dance.name} • By: ${dance.choreographer}</div>
            <div class="meta-line">Song: ${dance.song} - ${dance.artist}</div>
            <div class="meta-line">(Playlist: ${dance.playlist})</div>

            <div class="button-bar-grid">
                ${dance.steps
                    ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${dance.steps}', '${dance.name} - Steps')">Steps</button>`
                    : `<button class="action-touch-btn disabled">None</button>`}

                ${dance.teach
                    ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${dance.teach}', '${dance.name} - Teach')">Teach</button>`
                    : `<button class="action-touch-btn disabled">None</button>`}

                ${dance.demo
                    ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${dance.demo}', '${dance.name} - Demo')">Demo</button>`
                    : `<button class="action-touch-btn disabled">None</button>`}

                ${dance.music
                    ? `<button class="action-touch-btn" onclick="launchMediaOverlay('${dance.music}', '${dance.name} - Play')">Music</button>`
                    : `<button class="action-touch-btn disabled">None</button>`}
            </div>

            ${navHTML}

        </div>
    `;
}

function renderWorkspaceSearchResults(matches) {

    const container = document.getElementById('workspaceSearchResults');
    if (!container) return;

    if (!matches || matches.length === 0) {
        container.innerHTML = `<div class="workspace-note">No dances found.</div>`;
        return;
    }

    let html = "";
    matches.forEach(dance => {
        html += `
            <div class="workspace-search-item"
                 onclick="addDanceToWorkspace('${dance.name}')">
                ${dance.name}
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderWorkspaceSelectedList() {

    const container = document.getElementById('workspaceSelectedList');
    if (!container) return;

    const dances = selectedActivePlaylistGroup?.dances || [];

    if (dances.length === 0) {
        container.innerHTML = `<div class="workspace-note">No dances selected.</div>`;
        return;
    }

    let html = "";
    dances.forEach(dance => {
        html += `
            <div class="workspace-selected-item">
                ${dance}
                <span class="workspace-remove"
                      onclick="removeDanceFromWorkspace('${dance}')">✖</span>
            </div>
        `;
    });

    container.innerHTML = html;
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

    // Re-render correct screen based on current state
    renderApplicationInterface();
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

function openEventsView() {
    alert("Events (coming soon)");
}

function openWorkspace() {
    // Initialize Workspace for creating a new playlist
    workspaceMode = "create";
    workspacePlaylistName = "";
    workspaceSelectedDances = [];
    workspaceSearchQuery = "";
    workspaceSearchResults = [];
    workspaceEditingOriginalName = "";

    lastNavigationMode = "workspace";
    renderApplicationInterface();
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
        card.onclick = () => openDanceFromSearchToSingleDance(track.id);

        card.innerHTML = `
            <div class="title-line">${track.name} • By: ${track.choreographer}</div>
            <div class="meta-line">Song: ${track.song} - ${track.artist}</div>
            <div class="meta-line">(Playlist: ${track.playlist})</div>
        `;

        containerElement.appendChild(card);
    });
}

/* --duplicate function
function renderWorkspaceSearchResults(matches) {
    const viewport = document.getElementById('masterApplicationViewport');
   document.getElementById('applicationHeaderTitle').innerText = "Search Results";
    if (!viewport) return;

    viewport.innerHTML = `
        <div class="workspace-search-results-screen">
            <div class="nav-line" onclick="returnToHub()">
                ← Playlists
            </div>

            <div id="workspaceSearchResultsContainer"></div>
        </div>
    `;

    const resultsContainer = document.getElementById('workspaceSearchResultsContainer');
    renderSimpleSearchCards(matches, resultsContainer);
}
*/

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
window.openDanceFromPlaylist = openDanceFromPlaylist;
window.openWorkspace = openWorkspace;
window.navigateBackFromWorkspace = navigateBackFromWorkspace
window.startCreatingNewPlaylist = startCreatingNewPlaylist;
window.selectPlaylistForEditing = selectPlaylistForEditing;
window.startEditingExistingPlaylist = startEditingExistingPlaylist;
window.handleWorkspaceNameInput = handleWorkspaceNameInput;
window.saveWorkspacePlaylist = saveWorkspacePlaylist;
window.deleteWorkspacePlaylist = deleteWorkspacePlaylist;
window.handleWorkspaceSearchInput = handleWorkspaceSearchInput;
window.addDanceToWorkspace = addDanceToWorkspace;
window.removeDanceFromWorkspace = removeDanceFromWorkspace;
