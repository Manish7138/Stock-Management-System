# insert-branding.ps1

This folder contains `insert-branding.ps1`, a PowerShell script that safely inserts a branding PNG into the project's `public/` folder.

How to run
1. Open PowerShell and change to the repository root (where this `scripts` folder lives):

```powershell
cd C:\Users\coolm\Downloads\second
```

2. (Optional) Allow the script to run in the current PowerShell session:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

3. Run the script:

```powershell
.\scripts\insert-branding.ps1
```

Notes
- The script uses the default source path `C:\Users\coolm\Desktop\Screenshot (134).png`. Edit the script to change `$src` if needed.
- The script will back up existing icon files to `public/backup/` before overwriting them.
- If ImageMagick (`magick`) is installed, the script will create resized icons. Otherwise it copies the image as-is.
- The script does not modify any non-public files.

If you want me to run the script for you, upload the PNG file here so I can place it into `public/` and verify. Otherwise run the script locally and reply with the output.
