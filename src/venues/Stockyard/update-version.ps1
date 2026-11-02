# ============================================
# DanceApp Version Updater
#
# Enter the new version once.
# Updates exactly seven version locations.
#
# Does NOT commit, push, merge, or deploy.
# ============================================

$ErrorActionPreference = "Stop"

$root = $PSScriptRoot

$appFile = Join-Path $root "..\..\app.js"
$versionFile = Join-Path $root "version.json"
$indexFile = Join-Path $root "index.html"

function Stop-WithMessage {
    param($Message)

    Write-Host ""
    Write-Host "STOPPED: $Message" -ForegroundColor Red
    Write-Host "No Git actions were performed."
    Write-Host ""
    exit 1
}

function Confirm-OneTarget {
    param(
        $Path,
        $Pattern,
        $Name
    )

    $results = @(Select-String -Path $Path -Pattern $Pattern)

    if ($results.Count -ne 1) {
        Stop-WithMessage "$Name expected 1 location but found $($results.Count)."
    }

    Write-Host "  PASS  $Name" -ForegroundColor Green
}

function Write-Utf8WithoutBom {
    param(
        $Path,
        $Text
    )

    $encoding = New-Object System.Text.UTF8Encoding($false)
    $writer = New-Object System.IO.StreamWriter($Path, $false, $encoding)

    try {
        $writer.Write($Text)
    }
    finally {
        $writer.Dispose()
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host " DanceApp Version Updater"
Write-Host "========================================"
Write-Host ""

# --------------------------------------------
# Confirm the required files exist
# --------------------------------------------

if (-not (Test-Path -LiteralPath $appFile)) {
    Stop-WithMessage "app.js was not found."
}

if (-not (Test-Path -LiteralPath $versionFile)) {
    Stop-WithMessage "version.json was not found."
}

if (-not (Test-Path -LiteralPath $indexFile)) {
    Stop-WithMessage "index.html was not found."
}

# --------------------------------------------
# Confirm exactly seven expected targets
# --------------------------------------------

Write-Host "Pre-flight inspection:"
Write-Host ""

Confirm-OneTarget `
    $versionFile `
    '"version"\s*:\s*"[^"]+"' `
    "version.json"

Confirm-OneTarget `
    $appFile `
    'const RUNNING_APP_VERSION\s*=\s*"[^"]+";' `
    "RUNNING_APP_VERSION"

Confirm-OneTarget `
    $indexFile `
    'app\.js\?v=[^"]+' `
    "app.js cache-buster"

Confirm-OneTarget `
    $indexFile `
    'styles\.css\?v=[^"]+' `
    "styles.css cache-buster"

Confirm-OneTarget `
    $appFile `
    'danceData-stockyard\.js\?v=[^'']+' `
    "danceData cache-buster"

Confirm-OneTarget `
    $appFile `
    'venueDanceMap\.js\?v=[^"]+' `
    "venueDanceMap cache-buster"

Confirm-OneTarget `
    $appFile `
    'db\.js\?v=[^'']+' `
    "db.js cache-buster"

Write-Host ""
Write-Host "Pre-flight inspection PASSED: 7 of 7."
Write-Host ""

# --------------------------------------------
# Ask for one version
# --------------------------------------------

$newVersion = Read-Host "Enter the NEW version (example: 11.02.26A)"

if ([string]::IsNullOrWhiteSpace($newVersion)) {
    Stop-WithMessage "The version cannot be blank."
}

if ($newVersion -notmatch '^\d{2}\.\d{2}\.\d{2}[A-Z]?$') {
    Stop-WithMessage "Use MM.DD.YY with an optional final letter, such as 11.02.26A."
}

# --------------------------------------------
# Read the files
# --------------------------------------------

$appText = Get-Content -LiteralPath $appFile -Raw -Encoding UTF8
$versionText = Get-Content -LiteralPath $versionFile -Raw -Encoding UTF8
$indexText = Get-Content -LiteralPath $indexFile -Raw -Encoding UTF8

# --------------------------------------------
# Prepare the replacements in memory
# Nothing has been written yet.
# --------------------------------------------

$newVersionText = $versionText -replace `
    '"version"\s*:\s*"[^"]+"', `
    ('"version":"' + $newVersion + '"')

$newAppText = $appText -replace `
    'const RUNNING_APP_VERSION\s*=\s*"[^"]+";', `
    ('const RUNNING_APP_VERSION = "' + $newVersion + '";')

$newIndexText = $indexText -replace `
    'app\.js\?v=[^"]+', `
    ('app.js?v=' + $newVersion)

$newIndexText = $newIndexText -replace `
    'styles\.css\?v=[^"]+', `
    ('styles.css?v=' + $newVersion)

$newAppText = $newAppText -replace `
    'danceData-stockyard\.js\?v=[^'']+', `
    ('danceData-stockyard.js?v=' + $newVersion)

$newAppText = $newAppText -replace `
    'venueDanceMap\.js\?v=[^"]+', `
    ('venueDanceMap.js?v=' + $newVersion)

$newAppText = $newAppText -replace `
    'db\.js\?v=[^'']+', `
    ('db.js?v=' + $newVersion)

# --------------------------------------------
# Display the proposed result
# --------------------------------------------

Write-Host ""
Write-Host "========================================"
Write-Host " PROPOSED VERSION UPDATE"
Write-Host "========================================"
Write-Host ""

Write-Host "1. version.json"
Write-Host "   $newVersion"

Write-Host "2. RUNNING_APP_VERSION"
Write-Host "   $newVersion"

Write-Host "3. app.js cache-buster"
Write-Host "   $newVersion"

Write-Host "4. styles.css cache-buster"
Write-Host "   $newVersion"

Write-Host "5. danceData cache-buster"
Write-Host "   $newVersion"

Write-Host "6. venueDanceMap cache-buster"
Write-Host "   $newVersion"

Write-Host "7. db.js cache-buster"
Write-Host "   $newVersion"

Write-Host ""
Write-Host "Files that will change:"
Write-Host "  app.js"
Write-Host "  index.html"
Write-Host "  version.json"
Write-Host ""

$confirmation = Read-Host "Type UPDATE to continue"

if ($confirmation -cne "UPDATE") {
    Write-Host ""
    Write-Host "CANCELED: No DanceApp files were changed." -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

# --------------------------------------------
# Write the files as UTF-8 without BOM
# --------------------------------------------

Write-Utf8WithoutBom $versionFile $newVersionText
Write-Utf8WithoutBom $appFile $newAppText
Write-Utf8WithoutBom $indexFile $newIndexText

# --------------------------------------------
# Verify the written files
# --------------------------------------------

Write-Host ""
Write-Host "Final verification:"
Write-Host ""

$finalChecks = @(
    @(Select-String -Path $versionFile -Pattern ('"version":"' + $newVersion + '"') -SimpleMatch).Count -eq 1
    @(Select-String -Path $appFile -Pattern ('const RUNNING_APP_VERSION = "' + $newVersion + '";') -SimpleMatch).Count -eq 1
    @(Select-String -Path $indexFile -Pattern ('app.js?v=' + $newVersion) -SimpleMatch).Count -eq 1
    @(Select-String -Path $indexFile -Pattern ('styles.css?v=' + $newVersion) -SimpleMatch).Count -eq 1
    @(Select-String -Path $appFile -Pattern ('danceData-stockyard.js?v=' + $newVersion) -SimpleMatch).Count -eq 1
    @(Select-String -Path $appFile -Pattern ('venueDanceMap.js?v=' + $newVersion) -SimpleMatch).Count -eq 1
    @(Select-String -Path $appFile -Pattern ('db.js?v=' + $newVersion) -SimpleMatch).Count -eq 1
)

$passed = @($finalChecks | Where-Object { $_ -eq $true }).Count

if ($passed -ne 7) {
    Write-Host "VERSION UPDATE FAILED: $passed of 7" -ForegroundColor Red
    Write-Host "DO NOT COMMIT OR DEPLOY." -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "========================================"
Write-Host " VERSION UPDATE PASSED: 7 OF 7" -ForegroundColor Green
Write-Host " New version: $newVersion"
Write-Host "========================================"
Write-Host ""
Write-Host "No Git actions were performed."
Write-Host "Review All Changes in GitHub Desktop before committing."
Write-Host ""