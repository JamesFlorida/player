        import { globalDanceList } from "./globalDanceList.js";
        import { venueDanceMap } from "./venues/Stockyard/venueDanceMap.js";
        import { venueConfig } from "./venues/Stockyard/venueConfig.js";

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
           LOCAL DANCE DATABASE
           - Placeholder: you will populate this from your data.
           - Each track should have:
             - id: unique number (for future playlists)
             - playlist: (name of playlist)
             - level: (beginner, intermediate...)
             - daytaught: (Tuesday, Wednesday,Weekend..)
             - dancename: dance name (vs song name, frequently the same)
             - choreographer
             - song title
             - song artist
             - steps: URL to CopperKnob step sheet (optional)
             - teach: YouTube teach URL (optional)
             - demo: YouTube demo URL (optional)
             - music: YouTube music URL (optional)
           ============================================ */
       
            // Example:
            // {
            //   id: 1,
            //   playlist: "Stock-015",
            //   level: "Beginner",
            //   dayTaught: "Tuesday"
            //   name: "Dance With You",
            //   choreographer: "Lisa Johns-Grose",
            //   song: "Dance With You",
            //   artist: "Thomas Rhett",
            //   steps: "https://www.copperknob.co.uk/stepsheets/example",
            //   teach: "https://www.youtube.com/embed/EXAMPLE_TEACH",
            //   demo: "https://www.youtube.com/embed/EXAMPLE_DEMO",
            //   music: "https://www.youtube.com/embed/EXAMPLE_MUSIC"
            // }


        /* ============================================
           APP STATE
           ============================================ */
        let selectedActivePlaylistGroup = null;
        let activeSearchQueryString = "";
        let activeDayFilter = "ALL";
        let activeDayView = null;
        let activeDifficultyView = null;
        let activeDifficultyFilter = "";

        function setDayFilter(day) {
            activeDayFilter = day;

            // Enter or exit Day View Mode
            activeDayView = (day === "ALL") ? null : day;

            // Reset playlist selection when switching days
            selectedActivePlaylistGroup = null;

            renderApplicationInterface();
        }

        function setDifficultyFilter(level) {
            if (!level) {
                // Reset difficulty mode
                activeDifficultyView = null;
                activeDifficultyFilter = "";
                navigateToPlaylistHubMenu();
                return;
            }

            activeDifficultyView = level;
            activeDifficultyFilter = level;

            // Exit playlist view and day view
            selectedActivePlaylistGroup = null;
            activeDayView = null;

            // Reset search
            activeSearchQueryString = "";
            document.getElementById('danceSearchInput').value = "";

            renderApplicationInterface();
        }




        /* ============================================
           VENUE INITIALIZATION
           - Applies venueConfig to:
             - header title
             - search placeholder
             - email banner
             - theme colors
             - visual assets (banner, icon, background, etc.)
             - splash screen (optional)
           ============================================ */
        function initializeVenueBranding() {
            // Header title
            const headerTitleEl = document.getElementById('applicationHeaderTitle');
            if (headerTitleEl) {
                headerTitleEl.innerText = venueConfig.headerTitle || venueConfig.name || "LineDance Player";
            }

            // Search placeholder
            const searchInput = document.getElementById('danceSearchInput');
            if (searchInput) {
                searchInput.placeholder = venueConfig.searchPlaceholder || "Search dances...";
            }

            // Email banner text
            const emailBanner = document.getElementById('venueEmailBanner');
            if (emailBanner) {
                const venueName = venueConfig.name || "LineDance Player";
                const email = venueConfig.email || "";
                if (email) {
                    emailBanner.innerText = `✉ ${venueName} Feedback & Music Requests: ${email}`;
                } else {
                    emailBanner.innerText = "";
                }
            }

            // Theme colors
            if (venueConfig.theme) {
                const root = document.documentElement;
                root.style.setProperty('--brand-green', venueConfig.theme.brandGreen || '#2ecc71');
                root.style.setProperty('--dark-gray', venueConfig.theme.darkGray || '#1e1e1e');
                root.style.setProperty('--card-bg', venueConfig.theme.cardBg || '#2b2b2b');
                root.style.setProperty('--btn-blue', venueConfig.theme.buttonBlue || '#34495e');
            }

            // Background image
            if (venueConfig.assets.backgroundImageUrl) {
                document.documentElement.style.setProperty(
                    '--venue-bg-image',
                    `url(${venueConfig.assets.backgroundImageUrl})`
                );
            } else {
                document.documentElement.style.setProperty('--venue-bg-image', 'none');
            }

            // Banner image
            const bannerEl = document.getElementById('venueBanner');
            if (bannerEl) {
                if (venueConfig.assets.bannerUrl) {
                    bannerEl.src = venueConfig.assets.bannerUrl;
                    bannerEl.style.display = 'block';
                } else {
                    bannerEl.style.display = 'none';
                }
            }

            // Instructor photo
            const instructorEl = document.getElementById('venueInstructorPhoto');
            if (instructorEl) {
                if (venueConfig.assets.instructorPhotoUrl) {
                    instructorEl.src = venueConfig.assets.instructorPhotoUrl;
                    instructorEl.style.display = 'block';
                } else {
                    instructorEl.style.display = 'none';
                }
            }

            // Watermark logo
            const watermarkEl = document.getElementById('venueWatermark');
            if (watermarkEl) {
                if (venueConfig.assets.watermarkUrl) {
                    watermarkEl.src = venueConfig.assets.watermarkUrl;
                    watermarkEl.style.display = 'block';
                } else {
                    watermarkEl.style.display = 'none';
                }
            }

            // Footer text
            const footerEl = document.getElementById('venueFooter');
            if (footerEl) {
                footerEl.innerText = venueConfig.footerText || "";
            }

            // Touch icon (home screen icon)
            const touchIconEl = document.getElementById('venueTouchIcon');
            if (touchIconEl) {
                if (venueConfig.assets.touchIconUrl) {
                    touchIconEl.href = venueConfig.assets.touchIconUrl;
                } else {
                    touchIconEl.href = "";
                }
            }

            // Splash screen
            const splashEl = document.getElementById('venueSplash');
            const splashImgEl = document.getElementById('venueSplashImage');
            const splashTextEl = document.getElementById('venueSplashText');
            if (splashEl && splashImgEl && splashTextEl) {
                if (venueConfig.assets.splashImageUrl) {
                    splashImgEl.src = venueConfig.assets.splashImageUrl;
                    splashTextEl.innerText = venueConfig.headerTitle || venueConfig.name || "LineDance Player";
                    splashEl.style.display = 'flex';

                    // Hide splash after 1.5 seconds
                    setTimeout(() => {
                        splashEl.style.display = 'none';
                    }, 1500);
                } else {
                    splashEl.style.display = 'none';
                }
            }
        }

        /* ============================================
           NAVIGATION + SEARCH
           ============================================ */
        function navigateToPlaylistHubMenu() {
            // Exit playlist view
            selectedActivePlaylistGroup = null;

            // Exit day view
            activeDayView = null;

            // Exit difficulty view
            activeDifficultyView = null;
            activeDifficultyFilter = "";

            // Reset search
            activeSearchQueryString = "";
            document.getElementById('danceSearchInput').value = "";

            // Show day filter bar
            const filterBar = document.getElementById('dayFilterBar');
            if (filterBar) filterBar.style.display = 'block';

            // Show difficulty dropdown
            const diffBar = document.getElementById('difficultyFilterBar');
            if (diffBar) diffBar.style.display = 'block';

            // Hide back button
            document.getElementById('navbarReturnTrigger').style.display = 'none';

            // Reset header title
            document.getElementById('applicationHeaderTitle').innerText = "Playlists";

            renderApplicationInterface();
        }

        function openSpecificPlaylistView(groupName) {
            // Enter playlist mode
            selectedActivePlaylistGroup = groupName;

            // Reset search
            activeSearchQueryString = "";
            document.getElementById('danceSearchInput').value = "";

            // Exit Day View Mode
            activeDayView = null;

            // Exit Difficulty View Mode
            activeDifficultyView = null;
            activeDifficultyFilter = "";

            // Hide day filter bar
            const filterBar = document.getElementById('dayFilterBar');
            if (filterBar) filterBar.style.display = 'none';

            // Hide difficulty dropdown
            const diffBar = document.getElementById('difficultyFilterBar');
            if (diffBar) diffBar.style.display = 'none';

            // Show back button
            document.getElementById('navbarReturnTrigger').style.display = 'block';

            // Update header title
            document.getElementById('applicationHeaderTitle').innerText = groupName;

            renderApplicationInterface();
        }

        
        

        
        

        function handleLiveSearchInput() {
            const searchBox = document.getElementById('danceSearchInput');
            activeSearchQueryString = searchBox.value.toLowerCase().trim();
            if (activeSearchQueryString !== "") {
                selectedActivePlaylistGroup = null;
                document.getElementById('navbarReturnTrigger').style.display = 'block';
                document.getElementById('applicationHeaderTitle').innerText = 'Search Results';
            } else if (activeSearchQueryString === "" && selectedActivePlaylistGroup === null) {
                document.getElementById('navbarReturnTrigger').style.display = 'none';
                document.getElementById('applicationHeaderTitle').innerText =
                    venueConfig.headerTitle || venueConfig.name || 'LineDance Player';
            }
            renderApplicationInterface();
        }

        /* ============================================
           MAIN RENDER FUNCTION
           ============================================ */
       function renderApplicationInterface() {
            const viewport = document.getElementById('masterApplicationViewport');
            if (!viewport) return;
            viewport.innerHTML = '';

            // ============================
            // SEARCH MODE
            // ============================
            if (activeSearchQueryString !== "") {
                const matchedTracks = localDanceDatabase.filter(track => {
                    const danceName = (track.name || "").toLowerCase();
                    const choreographer = (track.choreographer || "").toLowerCase();
                    return danceName.includes(activeSearchQueryString) ||
                           choreographer.includes(activeSearchQueryString);
        });

        if (matchedTracks.length === 0) {
            viewport.innerHTML =
                '<p style="text-align:center;color:#aaa;margin-top:20px;">No matching dances found on the roster.</p>';
            return;
        }

        renderDanceCardsList(matchedTracks, viewport);
        return;   // ⭐ IMPORTANT — prevents falling through to other modes
    }
       // ============================
        // DAY VIEW MODE
        // ============================
        if (activeDayView !== null) {

            // Hide day filter bar
            const filterBar = document.getElementById('dayFilterBar');
            if (filterBar) filterBar.style.display = 'none';

            // Show back button
            document.getElementById('navbarReturnTrigger').style.display = 'block';

            // Update header title
            document.getElementById('applicationHeaderTitle').innerText = activeDayView + " Dances";

            const dayTracks = localDanceDatabase.filter(track =>
                activeDayFilter === "ALL" ? true : track.daytaught === activeDayFilter
    );

    if (dayTracks.length === 0) {
        viewport.innerHTML =
            '<p style="text-align:center;color:#aaa;margin-top:20px;">No dances taught on this day.</p>';
        return;
    }

    renderDanceCardsList(dayTracks, viewport);
    updateHubVisibility();           
    return;   // ⭐ Prevents playlist hub from showing
}

        // ============================
        // DIFFICULTY VIEW MODE
        // ============================
        if (activeDifficultyView !== null) {

            // Hide day filter bar
            const filterBar = document.getElementById('dayFilterBar');
            if (filterBar) filterBar.style.display = 'none';

            // Hide difficulty dropdown
            const diffBar = document.getElementById('difficultyFilterBar');
            if (diffBar) diffBar.style.display = 'none';

            // Show back button
            document.getElementById('navbarReturnTrigger').style.display = 'block';

            // Update header title
            document.getElementById('applicationHeaderTitle').innerText =
                activeDifficultyView + " Dances";

            // Normalize difficulty matching
            const level = activeDifficultyFilter.toLowerCase();

            const difficultyTracks = localDanceDatabase.filter(track => {
                const diff = (track.level || "").toLowerCase();
                return diff.includes(level);
            });

            if (difficultyTracks.length === 0) {
                viewport.innerHTML =
            '<p style="text-align:center;color:#aaa;margin-top:20px;">No dances found for this difficulty level.</p>';
                return;
            }

    renderDanceCardsList(difficultyTracks, viewport);
    updateHubVisibility();
    return;   // ⭐ Prevents playlist hub from showing
}

   
        // ============================
        // PLAYLIST HUB
        // ============================
              // ============================
        // PLAYLIST HUB (NEW LAYOUT)
        // ============================
        if (selectedActivePlaylistGroup === null &&
            activeDayView === null &&
            activeDifficultyView === null) {

            // Show filter bars
            const filterBar = document.getElementById('dayFilterBar');
            if (filterBar) filterBar.style.display = 'block';

            const diffBar = document.getElementById('difficultyFilterBar');
            if (diffBar) diffBar.style.display = 'block';

            // Hide back button
            document.getElementById('navbarReturnTrigger').style.display = 'none';

            // Update header title
            document.getElementById('applicationHeaderTitle').innerText = "Playlists";

        // Build playlist list
            let groupNames;
            if (venueConfig.playlistGroups && venueConfig.playlistGroups.length > 0) {
                groupNames = [...venueConfig.playlistGroups];
            } else {
                groupNames = [...new Set(localDanceDatabase.map(track => track.playlist || "General"))].sort();
            }

    // Build playlist cards HTML
            const playlistCardsHTML = groupNames.map(name => {
                const count = localDanceDatabase.filter(t => t.playlist === name).length;
                return `
                    <div class="hub-playlist-card" onclick="openSpecificPlaylistView('${name}')">
                        <div class="hub-playlist-name">${name}</div>
                        <div class="hub-playlist-count">${count} dances</div>
                    </div>
                `;
            }).join('');

            // Insert full hub screen layout
            viewport.innerHTML = `
                <div class="hub-screen">

            <!-- Filters -->
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

            <!-- Search + Sync -->
            <div class="hub-search-row">
                <input type="text" id="danceSearchInput"
                       placeholder="Search playlists..."
                       oninput="handleLiveSearchInput()">
                <button class="sync-btn" onclick="forceCacheBusterReload()">Sync</button>
            </div>

            <!-- Navigation -->
            <div class="hub-nav-row">
                <div class="hub-nav-card" onclick="openUserPlaylists()">My Playlists</div>
                <div class="hub-nav-card" onclick="createNewUserPlaylist()">Create Playlist</div>
                <div class="hub-nav-card" onclick="openEventsView()">Events</div>
            </div>

            <!-- Scrollable Playlist List -->
            <div class="playlist-container">
                ${playlistCardsHTML}
            </div>

        </div>
    `;

    return;
}
 
// ============================
// SPECIFIC PLAYLIST VIEW
// ============================
if (selectedActivePlaylistGroup !== null) {
    const filteredTracks = localDanceDatabase.filter(
        track => track.playlist === selectedActivePlaylistGroup
    );

    renderDanceCardsList(filteredTracks, viewport);
    updateHubVisibility();
}
}   // closes renderApplicationInterface()

      



    


        /* ============================================
           DANCE CARD RENDERING
           ============================================ */
        function renderDanceCardsList(tracksList, containerElement) {
            tracksList.forEach(track => {

        if (activeDayFilter !== "ALL" && track.daytaught !== activeDayFilter) {
            return; // skip this track
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
           OVERLAY LOGIC (STEPS + YOUTUBE)
           - Steps: CopperKnob / step sheet via <object>
           - Teach/Demo/Music: YouTube via <iframe>
           - HTTPS enforcement for YouTube
           - Sandbox permissions preserved
           ============================================ */
        function launchMediaOverlay(targetUrl, displayTitle) {
            if (!targetUrl) return;

            // Force HTTPS for YouTube and other embeds
            targetUrl = targetUrl.replace('http://', 'https://');

            const container = document.getElementById('playerOverlayFrame');
            if (!container) return;

            container.style.display = 'none';
            container.innerHTML = '';

            if (displayTitle.includes("Steps")) {
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
            const container = document.getElementById('playerOverlayFrame');
            if (container) {
                container.style.display = 'none';
                container.innerHTML = '';
            }
        }
        function updateHubVisibility() {
            const isHub =
                selectedActivePlaylistGroup === null &&
                activeDayView === null &&
                activeDifficultyView === null &&
                activeSearchQueryString === "";

            const filterRow = document.querySelector('.hub-filter-row');
            const searchRow = document.querySelector('.hub-search-row');
            const navRow = document.querySelector('.hub-nav-row');

            if (filterRow) filterRow.style.display = isHub ? 'flex' : 'none';
            if (searchRow) searchRow.style.display = isHub ? 'flex' : 'none';
            if (navRow) navRow.style.display = isHub ? 'grid' : 'none';
        }

        

        
        function openUserPlaylists() {
            // Placeholder for Phase 2 scaffolding
            alert("User Playlists (coming soon)");
        }

        function createNewUserPlaylist() {
            // Placeholder for Phase 2 scaffolding
            alert("Create Playlist (coming soon)");
        }

        function openEventsView() {
            // Placeholder for Phase 3
            alert("Events (coming soon)");
        }


        /* ============================================
           CACHE BUSTER RELOAD
           - Forces a fresh load of the file.
           ============================================ */
        function forceCacheBusterReload() {
            const uniqueTimestamp = new Date().getTime();
            window.location.href =
                window.location.origin + window.location.pathname + '?v=' + uniqueTimestamp;
        }

        /* ============================================
           APP BOOTSTRAP
           ============================================ */
        window.onload = function () {
            initializeVenueBranding();
            renderApplicationInterface();
        };
        // Expose functions globally for inline HTML onclick handlers
        window.launchMediaOverlay = launchMediaOverlay;
        window.shutOverlayViewer = shutOverlayViewer;
        window.navigateToPlaylistHubMenu = navigateToPlaylistHubMenu;
        window.openSpecificPlaylistView = openSpecificPlaylistView;
        window.handleLiveSearchInput = handleLiveSearchInput;
        window.setDayFilter = setDayFilter;
        window.setDifficultyFilter = setDifficultyFilter;
        window.forceCacheBusterReload = forceCacheBusterReload;

