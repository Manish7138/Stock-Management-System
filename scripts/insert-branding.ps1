<#
Insert branding PNG into the project's public folder.

Preconditions checked by this script:
- Workspace root is the current working directory when running the script.
- The source PNG path exists (modify $src below if needed).

Behavior:
- Backs up existing icon/branding files into `public/backup/` before overwriting.
- Copies the provided PNG into `public/placeholder-logo.png`.
- Attempts to use ImageMagick (`magick`) to create resized icons; falls back to copying if `magick` is unavailable.
- Leaves backups in place; does not delete or modify non-public files.

Usage (from repository root in PowerShell):
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
  .\scripts\insert-branding.ps1

Edit the $src variable below if you want to use a different source.
#>

$src = "C:\Users\coolm\Desktop\Screenshot (134).png"
$public = Join-Path $PWD "public"
$backup = Join-Path $public "backup"

try {
    # 1) Ensure public folder exists
    if (-not (Test-Path $public)) {
        Write-Host "Creating public folder at $public"
        New-Item -ItemType Directory -Force -Path $public | Out-Null
    }

    # 2) Confirm source exists
    if (-not (Test-Path $src)) {
        Write-Error "Source file not found: $src. Aborting."
        exit 1
    }

    # 3) Create backup folder
    if (-not (Test-Path $backup)) {
        New-Item -ItemType Directory -Force -Path $backup | Out-Null
    }

    # 4) Backup existing branding/icon files (if present)
    $filesToBackup = @("icon.svg","icon-light-32x32.png","icon-dark-32x32.png","apple-icon.png","placeholder-logo.png","placeholder-logo.svg","icon.svg","icon-light-32x32.png")
    foreach ($f in $filesToBackup) {
        $p = Join-Path $public $f
        if (Test-Path $p) {
            Write-Host "Backing up $f -> backup/$f"
            Move-Item -Force $p (Join-Path $backup $f)
        }
    }

    # 5) Copy the provided PNG into public as the placeholder logo
    $destPlaceholder = Join-Path $public "placeholder-logo.png"
    Write-Host "Copying $src -> $destPlaceholder"
    Copy-Item -Force $src $destPlaceholder

    # 6) Create icon files using ImageMagick if available
    if (Get-Command magick -ErrorAction SilentlyContinue) {
        Write-Host "ImageMagick found — creating resized icons"
        magick $destPlaceholder -resize 32x32 (Join-Path $public "icon-light-32x32.png")
        magick $destPlaceholder -resize 32x32 (Join-Path $public "icon-dark-32x32.png")
        magick $destPlaceholder -resize 180x180 (Join-Path $public "apple-icon.png")
        # optional small favicon
        magick $destPlaceholder -resize 48x48 (Join-Path $public "favicon-48.png")
    }
    else {
        Write-Host "ImageMagick not found — copying placeholder to icon filenames (no resizing)"
        Copy-Item -Force $destPlaceholder (Join-Path $public "icon-light-32x32.png")
        Copy-Item -Force $destPlaceholder (Join-Path $public "icon-dark-32x32.png")
        Copy-Item -Force $destPlaceholder (Join-Path $public "apple-icon.png")
        Copy-Item -Force $destPlaceholder (Join-Path $public "icon.svg")
    }

    # 7) Final checks
    $exists = Test-Path $destPlaceholder
    if ($exists) {
        Write-Host "Success: placeholder-logo.png exists in public"
        Get-Item $destPlaceholder | Format-List Name,Length,LastWriteTime
    }
    else {
        Write-Error "placeholder-logo.png not found after copy."
        exit 1
    }

    Write-Host "Public folder contents:"
    Get-ChildItem -Path $public | Select-Object Name,Length | Format-Table -AutoSize

    Write-Host "\nBackup files are preserved in: $backup"

    Write-Host "\nNext steps (optional):"
    Write-Host "  git add public/placeholder-logo.png public/icon-light-32x32.png public/icon-dark-32x32.png public/apple-icon.png public/icon.svg"
    Write-Host "  git commit -m 'Add branding images (placeholder-logo and icons); backups in public/backup'"

} catch {
    Write-Error "An error occurred: $_"
    exit 1
}
