# Quick Migration Script
$ReactPath = "C:\Users\1\Desktop\ממליצים\my-project"
$NextPath = "C:\Users\1\Desktop\ממליצים\buy-wise-nextjs"

Write-Host "Starting Quick Migration..." -ForegroundColor Cyan

# Copy components folder
$sourceComponents = "$ReactPath\src\components"
$targetComponents = "$NextPath\components"

if (Test-Path $sourceComponents) {
    Write-Host "Copying components..." -ForegroundColor Yellow
    Copy-Item -Path $sourceComponents -Destination $targetComponents -Recurse -Force
    Write-Host "✅ Components copied" -ForegroundColor Green
}

# Copy contexts
$sourceContexts = "$ReactPath\src\contexts"
$targetContexts = "$NextPath\contexts"

if (Test-Path $sourceContexts) {
    Write-Host "Copying contexts..." -ForegroundColor Yellow
    Copy-Item -Path $sourceContexts -Destination $targetContexts -Recurse -Force
    
    # Add 'use client' to all contexts
    Get-ChildItem "$targetContexts\*.jsx" | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -notmatch "^'use client'") {
            $content = "'use client';`n`n$content"
            Set-Content -Path $_.FullName -Value $content
        }
    }
    Write-Host "✅ Contexts copied and updated" -ForegroundColor Green
}

# Copy hooks
$sourceHooks = "$ReactPath\src\hooks"
$targetHooks = "$NextPath\hooks"

if (Test-Path $sourceHooks) {
    Write-Host "Copying hooks..." -ForegroundColor Yellow
    Copy-Item -Path $sourceHooks -Destination $targetHooks -Recurse -Force
    Write-Host "✅ Hooks copied" -ForegroundColor Green
}

# Copy utils
$sourceUtils = "$ReactPath\src\utils"
$targetUtils = "$NextPath\utils"

if (Test-Path $sourceUtils) {
    Write-Host "Copying utils..." -ForegroundColor Yellow
    Copy-Item -Path $sourceUtils -Destination $targetUtils -Recurse -Force
    Write-Host "✅ Utils copied" -ForegroundColor Green
}

Write-Host "`n✅ Quick migration complete!" -ForegroundColor Green
Write-Host "Now run: npm install && npm run dev" -ForegroundColor Cyan
