$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$baseDir = (Get-Location).Path
$outDir = Join-Path $baseDir "docs\frontend\screenshots"
if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

$viewports = @(
  @{ w = 320; h = 568; name = "mobile-320x568" },
  @{ w = 360; h = 800; name = "mobile-360x800" },
  @{ w = 390; h = 844; name = "mobile-390x844" },
  @{ w = 430; h = 932; name = "mobile-430x932" },
  @{ w = 768; h = 1024; name = "tablet-768x1024" },
  @{ w = 1024; h = 768; name = "tablet-landscape-1024x768" },
  @{ w = 1280; h = 800; name = "desktop-1280x800" },
  @{ w = 1440; h = 900; name = "desktop-1440x900" },
  @{ w = 1920; h = 1080; name = "desktop-1920x1080" },
  @{ w = 2560; h = 1440; name = "desktop-2560x1440" }
)

foreach ($vp in $viewports) {
  $outHome = Join-Path $outDir "home-$($vp.name).png"
  $winSize = "$($vp.w),$($vp.h)"
  Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--hide-scrollbars", "--window-size=$winSize", "--screenshot=$outHome", "http://localhost:3000" -Wait
  Write-Host "Captured $outHome"
}

# Capture Design System Showcase at desktop, tablet, and mobile
$showcaseDesktop = Join-Path $outDir "showcase-desktop-1920x1080.png"
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--hide-scrollbars", "--window-size=1920,1080", "--screenshot=$showcaseDesktop", "http://localhost:3000/design-system" -Wait
Write-Host "Captured $showcaseDesktop"

$showcaseTablet = Join-Path $outDir "showcase-tablet-768x1024.png"
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--hide-scrollbars", "--window-size=768,1024", "--screenshot=$showcaseTablet", "http://localhost:3000/design-system" -Wait
Write-Host "Captured $showcaseTablet"

$showcaseMobile = Join-Path $outDir "showcase-mobile-390x844.png"
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--hide-scrollbars", "--window-size=390,844", "--screenshot=$showcaseMobile", "http://localhost:3000/design-system" -Wait
Write-Host "Captured $showcaseMobile"

# Capture Calendar at desktop and mobile
$calDesktop = Join-Path $outDir "calendar-desktop-1920x1080.png"
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--hide-scrollbars", "--window-size=1920,1080", "--screenshot=$calDesktop", "http://localhost:3000/calendar" -Wait
Write-Host "Captured $calDesktop"

$calMobile = Join-Path $outDir "calendar-mobile-390x844.png"
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--hide-scrollbars", "--window-size=390,844", "--screenshot=$calMobile", "http://localhost:3000/calendar" -Wait
Write-Host "Captured $calMobile"
