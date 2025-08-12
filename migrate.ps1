# migrate.ps1 - PowerShell script for Next.js migration

Write-Host "🚀 Starting Next.js Migration..." -ForegroundColor Green

# Function to add 'use client' to files
function Add-UseClient {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    
    # Check if file needs 'use client'
    $needsClient = $false
    $clientIndicators = @(
        'useState',
        'useEffect', 
        'useContext',
        'onClick',
        'onChange',
        'window.',
        'document.',
        'localStorage'
    )
    
    foreach ($indicator in $clientIndicators) {
        if ($content -match $indicator) {
            $needsClient = $true
            break
        }
    }
    
    if ($needsClient -and $content -notmatch "'use client'") {
        $newContent = "'use client';`n`n" + $content
        Set-Content $FilePath $newContent
        Write-Host "  ✅ Added 'use client' to: $FilePath" -ForegroundColor Yellow
    }
}

# Function to update React Router imports
function Update-Imports {
    param($FilePath)
    
    $content = Get-Content $FilePath -Raw
    $updated = $false
    
    # React Router replacements
    if ($content -match "from 'react-router-dom'") {
        $content = $content -replace "import { useNavigate } from 'react-router-dom'", "import { useRouter } from 'next/navigation'"
        $content = $content -replace "import { Link } from 'react-router-dom'", "import Link from 'next/link'"
        $content = $content -replace "import { useParams } from 'react-router-dom'", "// useParams - get from page props"
        $content = $content -replace "import { useLocation } from 'react-router-dom'", "import { usePathname } from 'next/navigation'"
        $content = $content -replace "const navigate = useNavigate\(\)", "const router = useRouter()"
        $content = $content -replace "navigate\(", "router.push("
        $updated = $true
    }
    
    # Axios baseURL
    if ($content -match "axios.defaults.baseURL") {
        $content = $content -replace "axios.defaults.baseURL = '[^']*'", "axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL"
        $updated = $true
    }
    
    if ($updated) {
        Set-Content $FilePath $content
        Write-Host "  ✅ Updated imports in: $FilePath" -ForegroundColor Cyan
    }
}

# Process all JSX files in components
Write-Host "`n📁 Processing Components..." -ForegroundColor Blue
$components = Get-ChildItem -Path "./components" -Filter "*.jsx" -Recurse

foreach ($file in $components) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Gray
    Add-UseClient $file.FullName
    Update-Imports $file.FullName
}

# Process all JSX files in contexts
Write-Host "`n📁 Processing Contexts..." -ForegroundColor Blue
$contexts = Get-ChildItem -Path "./contexts" -Filter "*.jsx" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $contexts) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Gray
    Add-UseClient $file.FullName
    Update-Imports $file.FullName
}

# Process all JS files in hooks
Write-Host "`n📁 Processing Hooks..." -ForegroundColor Blue
$hooks = Get-ChildItem -Path "./hooks" -Filter "*.js" -Recurse -ErrorAction SilentlyContinue

foreach ($file in $hooks) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Gray
    Add-UseClient $file.FullName
}

# Files that need manual adjustment
Write-Host "`n⚠️  Files that need manual adjustment:" -ForegroundColor Yellow
Write-Host "  - components/layout/Layout.jsx → Move to app/layout.js" -ForegroundColor Red
Write-Host "  - components/common/PrivateRoute.jsx → Convert to middleware" -ForegroundColor Red
Write-Host "  - contexts/AuthContext.jsx → Adapt auth flow" -ForegroundColor Red
Write-Host "  - Any file with <img> tags → Convert to Next/Image" -ForegroundColor Red

Write-Host "`n✨ Migration script completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run 'npm run dev' to test" -ForegroundColor White
Write-Host "2. Fix any import errors" -ForegroundColor White
Write-Host "3. Test each page functionality" -ForegroundColor White