param(
    [string]$PromptPath = "..\masterprompt.md",
    [string]$OutputDirectory = "research\google_maps_results"
)

$ErrorActionPreference = "Stop"
$promptLines = Get-Content -LiteralPath $PromptPath
$start = [Array]::IndexOf($promptLines, "Islamabad / Rawalpindi")
$end = [Array]::IndexOf($promptLines, "8. Performance Requirements")
$projectNames = @($promptLines[($start + 1)..($end - 1)] |
    Where-Object { $_.Trim() -ne "" -and $_ -ne "Taxila / Wah / Fateh Jang Corridor" } |
    Select-Object -Unique)

if (-not (Test-Path -LiteralPath $OutputDirectory)) {
    New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
}

$queryOverrides = @{
    "DHA Islamabad" = "DHA Phase 2 Islamabad Pakistan"
    "DHA Downtown Islamabad" = "DHA Downtown Rawalpindi Islamabad Pakistan"
    "Top City Rawalpindi" = "TopCity-1 Islamabad Airport Pakistan"
    "Faisal Hills Rawalpindi" = "Faisal Hills GT Road Taxila Pakistan"
    "University Town" = "University Town Islamabad M-1 Pakistan"
    "PGECHS" = "Pakistan Government Employees Cooperative Housing Society Islamabad"
    "DEHS Chakra" = "Defence Employees Housing Society Chakri Road Rawalpindi"
    "AGOCHS-1" = "AGOCHS Phase 1 Islamabad"
    "ICHS Town" = "Islamabad Cooperative Housing Society Fateh Jang Road"
    "Salad Housing Society" = "Sallad Housing Society Islamabad"
    "FGEHA Projects" = "Federal Government Employees Housing Authority Islamabad"
    "J7 Emporium / J7 City" = "J7 Emporium Mumtaz City Islamabad"
    "The Garden Islamabad" = "The Garden by Pakland Islamabad"
    "16 Sina Tower" = "Ibn Sina Tower Islamabad"
    "DoubleTree Hilton Project" = "DoubleTree by Hilton Islamabad Centaurus"
    "Wah Cantt Housing Schemes" = "Wah Cantonment Pakistan"
    "University Town Taxila" = "University Town Taxila housing Pakistan"
    "HIT Taxila Housing Area" = "HIT Taxila residential area Pakistan"
    "Khanpur Dam View Projects" = "Khanpur Dam Pakistan"
    "POF Housing Schemes" = "POF Housing Society Wah Pakistan"
    "MPCHS" = "Multi Professional Cooperative Housing Society Islamabad"
    "CBR Town" = "CBR Town Islamabad Pakistan"
    "Lahore Smart City Extension" = "Lahore Smart City extension Islamabad corridor Pakistan"
}

for ($i = 0; $i -lt $projectNames.Count; $i++) {
    $name = $projectNames[$i]
    $slug = ($name.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
    $itemPath = Join-Path $OutputDirectory ("{0:D3}_{1}.txt" -f ($i + 1), $slug)
    if (Test-Path -LiteralPath $itemPath) {
        Write-Host ("[{0}/{1}] cached: {2}" -f ($i + 1), $projectNames.Count, $name)
        continue
    }

    $query = if ($queryOverrides.ContainsKey($name)) {
        $queryOverrides[$name]
    }
    elseif ($i -ge 63) {
        "$name Taxila Wah Islamabad Rawalpindi Pakistan"
    }
    else {
        "$name Islamabad Rawalpindi Pakistan"
    }

    Write-Host ("[{0}/{1}] {2}" -f ($i + 1), $projectNames.Count, $name)
    try {
        $url = "https://www.google.com/maps/search/?api=1&hl=en&gl=pk&query=$([Uri]::EscapeDataString($query))"
        $html = (& curl.exe --silent --show-error --max-time 20 --location --user-agent "Mozilla/5.0" $url) -join "`n"
        if ($LASTEXITCODE -ne 0) { throw "Google Maps page request exited with code $LASTEXITCODE" }
        $match = [regex]::Match($html, 'href="([^"]*search\?tbm=map[^"]+)"')
        if (-not $match.Success) { throw "Google Maps search endpoint was not present" }
        $endpoint = [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value)
        $response = (& curl.exe --silent --show-error --max-time 20 --user-agent "Mozilla/5.0" ("https://www.google.com" + $endpoint)) -join "`n"
        if ($LASTEXITCODE -ne 0) { throw "Google Maps search request exited with code $LASTEXITCODE" }
        $response | Set-Content -LiteralPath $itemPath -Encoding UTF8
    }
    catch {
        "ERROR: $($_.Exception.Message)" | Set-Content -LiteralPath $itemPath -Encoding UTF8
        Write-Warning $_.Exception.Message
    }
    if ($i -lt ($projectNames.Count - 1)) { Start-Sleep -Milliseconds 650 }
}

Write-Host "Saved $((Get-ChildItem -LiteralPath $OutputDirectory -Filter *.txt).Count) Google Maps search responses."
