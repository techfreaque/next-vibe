# next-vibe visual installer bootstrap (Windows PowerShell 5.1+ / 7+)
#
# Usage:
#   irm https://raw.githubusercontent.com/techfreaque/next-vibe/main/scripts/install/install.ps1 | iex
#
# Local invocation with options:
#   powershell -ExecutionPolicy Bypass -File scripts\install\install.ps1 -InstallDir "$HOME\next-vibe"

[CmdletBinding()]
param(
  [string]$InstallDir = $(if ($env:VIBE_INSTALL_DIR) { $env:VIBE_INSTALL_DIR } else { Join-Path $HOME "next-vibe" }),
  [string]$RepoUrl = $(if ($env:VIBE_REPO_URL) { $env:VIBE_REPO_URL } else { "https://github.com/techfreaque/next-vibe.git" }),
  [string]$Branch = $(if ($env:VIBE_REPO_BRANCH) { $env:VIBE_REPO_BRANCH } else { "" }),
  [int]$Port = $(if ($env:VIBE_PORT) { [int]$env:VIBE_PORT } else { 3000 }),
  [string]$Locale = $(if ($env:VIBE_LOCALE) { $env:VIBE_LOCALE } else { "en-US" }),
  [string]$StateFile = $(if ($env:VIBE_STATE_FILE) { $env:VIBE_STATE_FILE } else { Join-Path (Join-Path $env:LOCALAPPDATA "next-vibe") "installer-state.json" }),
  [switch]$NoBrowser = ($env:VIBE_NO_BROWSER -eq "1"),
  [switch]$Detach = ($env:VIBE_DETACH -eq "1")
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Helpers & state management
# ---------------------------------------------------------------------------

function Write-Step([string]$Index, [string]$Title) {
  Write-Host ""
  Write-Host "[$Index] $Title" -ForegroundColor Cyan
}

function Write-Ok([string]$Message) {
  Write-Host "  OK: $Message" -ForegroundColor Green
}

function Write-Info([string]$Message) {
  Write-Host "  $Message"
}

function Write-Warn([string]$Message) {
  Write-Host "  NOTE: $Message" -ForegroundColor Yellow
}

$script:Arch = if ([Environment]::Is64BitOperatingSystem) { "x86_64" } else { "x86" }
$script:StartedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$script:RepoReady = $false
$script:ActualPort = $Port
$script:AppUrl = ""
$script:CheckoutMode = ""
$script:LastError = ""

$script:Steps = [ordered]@{
  git          = "pending"
  bun          = "pending"
  clone        = "pending"
  dependencies = "pending"
  github       = "pending"
  server       = "pending"
}

$script:Versions = [ordered]@{
  git = ""
  bun = ""
}

function Write-StateAtomic([string]$TargetPath) {
  $parent = Split-Path -Path $TargetPath -Parent
  if ($parent -and -not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
  $payload = [ordered]@{
    version      = 1
    startedAt    = $script:StartedAt
    updatedAt    = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    os           = "windows"
    arch         = $script:Arch
    installDir   = $InstallDir
    repoUrl      = $RepoUrl
    checkoutMode = $script:CheckoutMode
    port         = $script:ActualPort
    url          = $script:AppUrl
    steps        = $script:Steps
    versions     = $script:Versions
    github       = [ordered]@{
      status  = $script:Steps.github
      repoUrl = ""
      skipped = $false
    }
    lastError    = $script:LastError
  }
  $json = $payload | ConvertTo-Json -Depth 5
  $tmpPath = "$TargetPath.tmp.$PID"
  [System.IO.File]::WriteAllText($tmpPath, $json, [System.Text.UTF8Encoding]::new($false))
  Move-Item -Path $tmpPath -Destination $TargetPath -Force
}

function Save-State {
  Write-StateAtomic -TargetPath $StateFile
  if ($script:RepoReady -and (Test-Path $InstallDir)) {
    $repoState = Join-Path (Join-Path $InstallDir ".tmp") "installer-state.json"
    Write-StateAtomic -TargetPath $repoState
  }
}

function Fail-WithRecovery([string]$Message, [string]$Hint) {
  $script:LastError = $Message
  Save-State
  Write-Host "  ERROR: $Message" -ForegroundColor Red
  if ($Hint) {
    Write-Host ""
    Write-Host "Next step:" -ForegroundColor Yellow
    Write-Host "  $Hint"
    Write-Host ""
    Write-Host "Then re-run this installer command to resume where it stopped."
  }
  exit 1
}

function Add-ToSessionPath([string]$Dir) {
  if (-not (Test-Path $Dir)) { return }
  $parts = ($env:Path -split ";") | Where-Object { $_ -ne "" }
  $exists = $false
  foreach ($p in $parts) {
    if ($p.TrimEnd("\") -ieq $Dir.TrimEnd("\")) { $exists = $true; break }
  }
  if (-not $exists) {
    $env:Path = "$Dir;$env:Path"
  }
}

function Add-ToUserPath([string]$Dir) {
  if (-not (Test-Path $Dir)) { return }
  $current = [Environment]::GetEnvironmentVariable("Path", "User")
  if ($null -eq $current) { $current = "" }
  $parts = ($current -split ";") | Where-Object { $_ -ne "" }
  foreach ($p in $parts) {
    if ($p.TrimEnd("\") -ieq $Dir.TrimEnd("\")) { return }
  }
  $next = if ($current) { "$current;$Dir" } else { $Dir }
  [Environment]::SetEnvironmentVariable("Path", $next, "User")
  Add-ToSessionPath $Dir
}

# Preload common user-space bin directories for this session
Add-ToSessionPath (Join-Path $HOME ".bun\bin")
Add-ToSessionPath (Join-Path $env:LOCALAPPDATA "next-vibe\mingit\cmd")
Add-ToSessionPath (Join-Path $env:LOCALAPPDATA "Programs\Git\cmd")

Write-Host ""
Write-Host "next-vibe installer (windows / $script:Arch)" -ForegroundColor White
Write-Host "Target folder: $InstallDir"
Save-State

# ---------------------------------------------------------------------------
# Step 1: Git (user-scope winget or portable MinGit, no admin needed)
# ---------------------------------------------------------------------------

Write-Step "1/6" "Checking git"
$script:Steps.git = "in_progress"
Save-State

function Test-WorkingGit {
  $cmd = Get-Command git -ErrorAction SilentlyContinue
  if (-not $cmd) { return $false }
  try {
    & git --version *> $null
    return ($LASTEXITCODE -eq 0)
  } catch {
    return $false
  }
}

function Install-PortableMinGit {
  $targetRoot = Join-Path $env:LOCALAPPDATA "next-vibe\mingit"
  $zipPath = Join-Path $env:LOCALAPPDATA "next-vibe\mingit.zip"
  New-Item -ItemType Directory -Path (Split-Path $zipPath -Parent) -Force | Out-Null

  Write-Info "Downloading portable MinGit into $targetRoot (no admin rights required)..."
  $release = Invoke-RestMethod -Uri "https://api.github.com/repos/git-for-windows/git/releases/latest" -Headers @{ "User-Agent" = "next-vibe-installer" }
  $asset = $release.assets | Where-Object { $_.name -match "^MinGit-.*-64-bit\.zip$" -and $_.name -notmatch "busybox" } | Select-Object -First 1
  if (-not $asset) {
    return $false
  }
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -UseBasicParsing
  if (-not (Test-Path $targetRoot)) {
    New-Item -ItemType Directory -Path $targetRoot -Force | Out-Null
  }
  Expand-Archive -Path $zipPath -DestinationPath $targetRoot -Force
  Add-ToUserPath (Join-Path $targetRoot "cmd")
  return (Test-WorkingGit)
}

if (-not (Test-WorkingGit)) {
  Write-Info "git not found. Trying user-space install..."
  if (Get-Command winget -ErrorAction SilentlyContinue) {
    try {
      & winget install --id Git.Git --scope user -e --source winget --accept-package-agreements --accept-source-agreements
      Add-ToSessionPath (Join-Path $env:LOCALAPPDATA "Programs\Git\cmd")
      Add-ToSessionPath "C:\Program Files\Git\cmd"
    } catch {
      Write-Warn "winget user install did not complete; trying portable MinGit."
    }
  }
  if (-not (Test-WorkingGit)) {
    try {
      [void](Install-PortableMinGit)
    } catch {
      Write-Warn "Portable MinGit download failed: $($_.Exception.Message)"
    }
  }
}

if (-not (Test-WorkingGit)) {
  $script:Steps.git = "error"
  Fail-WithRecovery "git is required to clone next-vibe." "Install Git from https://git-scm.com/download/win, open a new PowerShell window, and re-run."
}

$script:Versions.git = (& git --version 2>$null | Select-Object -First 1)
$script:Steps.git = "done"
Save-State
Write-Ok $script:Versions.git

# ---------------------------------------------------------------------------
# Step 2: Bun (user profile, zero admin rights)
# ---------------------------------------------------------------------------

Write-Step "2/6" "Checking Bun"
$script:Steps.bun = "in_progress"
Save-State

function Test-WorkingBun {
  $cmd = Get-Command bun -ErrorAction SilentlyContinue
  if (-not $cmd) { return $false }
  try {
    & bun --version *> $null
    return ($LASTEXITCODE -eq 0)
  } catch {
    return $false
  }
}

if (-not (Test-WorkingBun)) {
  Write-Info "Installing Bun into $HOME\.bun (user-space, no admin needed)..."
  try {
    $bunInstallScript = Invoke-RestMethod -Uri "https://bun.sh/install.ps1"
    Invoke-Expression $bunInstallScript
    Add-ToSessionPath (Join-Path $HOME ".bun\bin")
  } catch {
    $script:Steps.bun = "error"
    Fail-WithRecovery "Bun installation failed: $($_.Exception.Message)" "Install Bun from https://bun.sh and re-run this installer."
  }
}

if (-not (Test-WorkingBun)) {
  $script:Steps.bun = "error"
  Fail-WithRecovery "Bun could not be verified after installation." "Open a new PowerShell window or install Bun from https://bun.sh, then re-run."
}

$script:Versions.bun = (& bun --version 2>$null | Select-Object -First 1)
$script:Steps.bun = "done"
Save-State
Write-Ok "bun $($script:Versions.bun)"

# ---------------------------------------------------------------------------
# Step 3: Clone or detect existing checkout (never overwrite)
# ---------------------------------------------------------------------------

Write-Step "3/6" "Preparing next-vibe checkout"
$script:Steps.clone = "in_progress"
Save-State

function Test-NextVibeCheckout([string]$Dir) {
  if (Test-Path (Join-Path $Dir "src\vibe\platforms\cli\vibe-runtime.ts")) {
    return $true
  }
  $pkg = Join-Path $Dir "package.json"
  if ((Test-Path (Join-Path $Dir ".git")) -and (Test-Path $pkg)) {
    $raw = Get-Content -Path $pkg -Raw -ErrorAction SilentlyContinue
    if ($raw -match '"name"\s*:\s*"next-vibe"') {
      return $true
    }
  }
  return $false
}

if (Test-Path $InstallDir) {
  if (-not (Test-Path $InstallDir -PathType Container)) {
    $script:Steps.clone = "error"
    Fail-WithRecovery "Path '$InstallDir' exists as a file. Refusing to overwrite it." "Choose another folder with -InstallDir `"$HOME\next-vibe-app`"."
  }
  if (Test-NextVibeCheckout $InstallDir) {
    $script:CheckoutMode = "existing"
    Write-Ok "Found existing next-vibe checkout at $InstallDir (kept untouched)"
  } elseif ((Get-ChildItem -Path $InstallDir -Force | Measure-Object).Count -eq 0) {
    Write-Info "Cloning into empty folder $InstallDir..."
    if ($Branch) {
      & git clone --branch $Branch $RepoUrl $InstallDir
    } else {
      & git clone $RepoUrl $InstallDir
    }
    if ($LASTEXITCODE -ne 0) {
      $script:Steps.clone = "error"
      Fail-WithRecovery "git clone failed." "Check network access to $RepoUrl and re-run."
    }
    $script:CheckoutMode = "cloned"
    Write-Ok "Cloned into $InstallDir"
  } else {
    $script:Steps.clone = "error"
    Fail-WithRecovery "Directory '$InstallDir' already exists and is not a next-vibe checkout. Refusing to overwrite it." "Choose another folder with -InstallDir `"$HOME\next-vibe-app`"."
  }
} else {
  $parent = Split-Path -Path $InstallDir -Parent
  if ($parent -and -not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
  Write-Info "Cloning $RepoUrl into $InstallDir..."
  if ($Branch) {
    & git clone --branch $Branch $RepoUrl $InstallDir
  } else {
    & git clone $RepoUrl $InstallDir
  }
  if ($LASTEXITCODE -ne 0) {
    $script:Steps.clone = "error"
    Fail-WithRecovery "git clone failed." "Check network access to $RepoUrl and re-run."
  }
  $script:CheckoutMode = "cloned"
  Write-Ok "Cloned into $InstallDir"
}

$InstallDir = (Resolve-Path $InstallDir).Path
$StartPage = "setup"
if (Test-Path (Join-Path $InstallDir "src/_pages/install/page.tsx") -PathType Leaf) {
  $StartPage = "install"
}
$script:RepoReady = $true
$script:Steps.clone = "done"
Save-State

# ---------------------------------------------------------------------------
# Step 4: Install dependencies
# ---------------------------------------------------------------------------

Write-Step "4/6" "Installing dependencies with Bun"
$script:Steps.dependencies = "in_progress"
Save-State

Push-Location $InstallDir
try {
  & bun install
  if ($LASTEXITCODE -ne 0) {
    $script:Steps.dependencies = "error"
    Fail-WithRecovery "bun install failed in $InstallDir." "cd `"$InstallDir`"; bun install"
  }
} finally {
  Pop-Location
}

if (-not (Test-Path (Join-Path $InstallDir "node_modules"))) {
  $script:Steps.dependencies = "error"
  Fail-WithRecovery "node_modules is missing after bun install." "cd `"$InstallDir`"; bun install"
}

$script:Steps.dependencies = "done"
Save-State
Write-Ok "Dependencies and vibe CLI ready"

# ---------------------------------------------------------------------------
# Step 5: Pick available port & start local app server
# ---------------------------------------------------------------------------

Write-Step "5/6" "Starting local next-vibe server"
$script:Steps.server = "in_progress"
Save-State

function Test-PortFree([int]$CheckPort) {
  try {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $CheckPort)
    $listener.Start()
    $listener.Stop()
    return $true
  } catch {
    return $false
  }
}

function Test-ExistingServerForDir([int]$CheckPort, [string]$ExpectedDir) {
  $pidOwned = $false
  foreach ($pf in @(
    (Join-Path $ExpectedDir ".tmp\installer-dev.pid"),
    (Join-Path $ExpectedDir ".tmp\.atlas.pid")
  )) {
    if (Test-Path $pf) {
      $lines = Get-Content -Path $pf -ErrorAction SilentlyContinue
      if ($lines -and $lines.Count -ge 2) {
        $pId = 0
        [void][int]::TryParse($lines[0].Trim(), [ref]$pId)
        $portMatch = ($lines -contains "PORT:$CheckPort")
        if ($pId -gt 0 -and $portMatch -and (Get-Process -Id $pId -ErrorAction SilentlyContinue)) {
          $pidOwned = $true
          break
        }
      }
    }
  }
  if (-not $pidOwned) { return $false }
  try {
    $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$CheckPort/$Locale/$StartPage" -UseBasicParsing -TimeoutSec 3
    return ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400)
  } catch {
    return $false
  }
}

$reusedServer = $false
$serverProcess = $null
$tmpDir = Join-Path $InstallDir ".tmp"
if (-not (Test-Path $tmpDir)) {
  New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null
}
$devOutLog = Join-Path $tmpDir "installer-dev.log"
$devErrLog = Join-Path $tmpDir "installer-dev.err.log"

if (Test-ExistingServerForDir -CheckPort $Port -ExpectedDir $InstallDir) {
  $script:ActualPort = $Port
  $reusedServer = $true
  Write-Ok "Reusing already-running server on http://localhost:$($script:ActualPort)"
} else {
  $candidates = @($Port) + (3003..3099 | Where-Object { $_ -ne $Port })
  $picked = 0
  foreach ($p in $candidates) {
    if (Test-PortFree $p) {
      $picked = $p
      break
    }
  }
  if ($picked -eq 0) {
    $script:Steps.server = "error"
    Fail-WithRecovery "Could not find a free localhost port starting from $Port." "Free a port or pass -Port <number>."
  }
  $script:ActualPort = $picked
  if ($picked -ne $Port) {
    Write-Warn "Port $Port is busy. Using port $picked instead."
  }

  $script:AppUrl = "http://localhost:$($script:ActualPort)/$Locale/$StartPage"
  Save-State

  $runtimeEntry = Join-Path $InstallDir "src\vibe\platforms\cli\vibe-runtime.ts"
  if (-not (Test-Path $runtimeEntry)) {
    $script:Steps.server = "error"
    Fail-WithRecovery "CLI runtime not found at $runtimeEntry." "Verify the checkout in $InstallDir is complete."
  }

  $bunExe = (Get-Command bun).Source
  $env:VIBE_INSTALLER_STATE_FILE = Join-Path $tmpDir "installer-state.json"

  Write-Info "Launching local server on port $($script:ActualPort) (log: $devOutLog)..."
  $serverProcess = Start-Process -FilePath $bunExe `
    -ArgumentList @($runtimeEntry, "dev", "--port=$($script:ActualPort)") `
    -WorkingDirectory $InstallDir `
    -RedirectStandardOutput $devOutLog `
    -RedirectStandardError $devErrLog `
    -PassThru `
    -WindowStyle Hidden

  [System.IO.File]::WriteAllText((Join-Path $tmpDir "installer-dev.pid"), "$($serverProcess.Id)`nPORT:$($script:ActualPort)`n")

  $tcpReady = $false
  for ($i = 0; $i -lt 90; $i++) {
    if ($serverProcess.HasExited) {
      $script:Steps.server = "error"
      Fail-WithRecovery "Local server exited unexpectedly. Check $devOutLog and $devErrLog." "cd `"$InstallDir`"; bun `"$runtimeEntry`" dev --port=$($script:ActualPort)"
    }
    try {
      $client = [System.Net.Sockets.TcpClient]::new()
      $async = $client.BeginConnect("127.0.0.1", $script:ActualPort, $null, $null)
      if ($async.AsyncWaitHandle.WaitOne(500, $false) -and $client.Connected) {
        $client.EndConnect($async)
        $client.Close()
        $tcpReady = $true
        break
      }
      $client.Close()
    } catch {
      # Keep waiting for port listen
    }
    Start-Sleep -Seconds 1
  }

  $ready = $false
  for ($j = 0; $tcpReady -and $j -lt 10; $j++) {
    if ($serverProcess.HasExited) { break }
    try {
      $resp = Invoke-WebRequest -Uri "http://127.0.0.1:$($script:ActualPort)/$Locale/$StartPage" -UseBasicParsing -TimeoutSec 15
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400) {
        $ready = $true
        break
      }
    } catch {
      # Keep waiting while Vite/PGlite warms up
    }
    Start-Sleep -Seconds 2
  }

  if (-not $ready) {
    $script:Steps.server = "error"
    Fail-WithRecovery "Timed out waiting for http://localhost:$($script:ActualPort)/$Locale/$StartPage." "Check $devOutLog and re-run."
  }
}

$script:AppUrl = "http://localhost:$($script:ActualPort)/$Locale/$StartPage"
$script:Steps.server = "done"
$script:LastError = ""
Save-State
Write-Ok "Server ready at $($script:AppUrl)"

# ---------------------------------------------------------------------------
# Step 6: Open browser on local installer UI
# ---------------------------------------------------------------------------

Write-Step "6/6" "Opening next-vibe in your browser"
if (-not $NoBrowser) {
  try {
    Start-Process $script:AppUrl
  } catch {
    Write-Info "Could not open browser automatically. Open $($script:AppUrl) manually."
  }
} else {
  Write-Info "Browser auto-open disabled (-NoBrowser)."
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "next-vibe is running."
if ($StartPage -eq "install") { Write-Host "  Installer: $($script:AppUrl)" }
Write-Host "  Setup:     http://localhost:$($script:ActualPort)/$Locale/setup"
Write-Host "  Folder:    $InstallDir"
Write-Host "  State:     $(Join-Path $tmpDir 'installer-state.json')"
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

if ($Detach -or $reusedServer -or $null -eq $serverProcess) {
  Write-Info "Server continues running in the background."
  if ($null -ne $serverProcess) {
    Write-Info "PID: $($serverProcess.Id) (stop with: Stop-Process -Id $($serverProcess.Id))"
  }
  exit 0
}

Write-Info "Keep this window open while using next-vibe. Press Ctrl+C to stop."
Write-Info "Start again later with: cd `"$InstallDir`"; vibe dev"
try {
  Wait-Process -Id $serverProcess.Id
} finally {
  if (-not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
  }
}
