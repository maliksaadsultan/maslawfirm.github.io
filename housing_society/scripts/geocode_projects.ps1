param(
    [string]$PromptPath = "..\masterprompt.md",
    [string]$OutputPath = "research\nominatim_results.json",
    [int]$MaxItems = 0
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$promptLines = Get-Content -LiteralPath $PromptPath
$start = [Array]::IndexOf($promptLines, "Islamabad / Rawalpindi")
$end = [Array]::IndexOf($promptLines, "8. Performance Requirements")
if ($start -lt 0 -or $end -lt 0) {
    throw "Unable to locate the project list in masterprompt.md"
}

$projectNames = $promptLines[($start + 1)..($end - 1)] |
    Where-Object { $_.Trim() -ne "" -and $_ -ne "Taxila / Wah / Fateh Jang Corridor" } |
    Select-Object -Unique
if ($MaxItems -gt 0) {
    $projectNames = @($projectNames | Select-Object -First $MaxItems)
}

$queryOverrides = @{
    "DHA Islamabad" = "DHA Phase 2 Islamabad Pakistan"
    "Top City Rawalpindi" = "Top City-1 Islamabad Pakistan"
    "Faisal Hills Rawalpindi" = "Faisal Hills Taxila Pakistan"
    "University Town" = "University Town Islamabad Pakistan"
    "PGECHS" = "Pakistan Government Employees Cooperative Housing Society Islamabad"
    "DEHS Chakra" = "Defence Employees Housing Society Chakri Road Rawalpindi"
    "AGOCHS-1" = "AGOCHS Phase 1 Islamabad"
    "ICHS Town" = "Islamabad Cooperative Housing Society Islamabad"
    "Salad Housing Society" = "Sallad Housing Society Islamabad"
    "MPCHS" = "Multi Professional Cooperative Housing Society Islamabad"
    "CBR Town" = "CBR Town Islamabad Pakistan"
}

$headers = @{ "User-Agent" = "RWP-ISB-Property-Dashboard/1.0 local-research" }
$outputDirectory = [IO.Path]::ChangeExtension($OutputPath, $null)
if (-not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

for ($i = 0; $i -lt $projectNames.Count; $i++) {
    $name = $projectNames[$i]
    $slug = ($name.ToLowerInvariant() -replace '[^a-z0-9]+', '-').Trim('-')
    $itemPath = Join-Path $outputDirectory ("{0:D3}_{1}.json" -f ($i + 1), $slug)
    if (Test-Path -LiteralPath $itemPath) {
        Write-Host ("[{0}/{1}] cached: {2}" -f ($i + 1), $projectNames.Count, $name)
        continue
    }
    $query = if ($queryOverrides.ContainsKey($name)) { $queryOverrides[$name] } else { "$name, Pakistan" }
    $encoded = [Uri]::EscapeDataString($query)
    $uri = "https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=3&countrycodes=pk&q=$encoded"
    Write-Host ("[{0}/{1}] {2}" -f ($i + 1), $projectNames.Count, $name)

    try {
        $responseBody = & curl.exe --silent --show-error --max-time 12 --user-agent $headers["User-Agent"] $uri
        if ($LASTEXITCODE -ne 0) {
            throw "curl exited with code $LASTEXITCODE"
        }
        $null = $responseBody | ConvertFrom-Json
        $responseBody | Set-Content -LiteralPath $itemPath -Encoding UTF8
    }
    catch {
        '[]' | Set-Content -LiteralPath $itemPath -Encoding UTF8
        Write-Warning $_.Exception.Message
    }

    if ($i -lt ($projectNames.Count - 1)) {
        Start-Sleep -Milliseconds 1100
    }
}
Write-Host "Saved $((Get-ChildItem -LiteralPath $outputDirectory -Filter *.json).Count) raw responses to $outputDirectory"
