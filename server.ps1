[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$port = 8000
$root = (Get-Item -LiteralPath ".").FullName
$leaderboardFile = [System.IO.Path]::Combine($root, "leaderboard.json")

# Ensure leaderboard.json exists with default structure if missing
if (-not [System.IO.File]::Exists($leaderboardFile)) {
    $initialData = @{
        pc = @{
            scoreAttack = @()
            boss = @{ "1" = @() }
        }
        mobile = @{
            scoreAttack = @()
            boss = @{ "1" = @() }
        }
    }
    $initialJson = $initialData | ConvertTo-Json -Depth 5
    [System.IO.File]::WriteAllText($leaderboardFile, $initialJson, [System.Text.Encoding]::UTF8)
}

Write-Host "Starting HTTP server on port $port..."
Write-Host "Serving from directory: $root"

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)

try {
    $listener.Start()
    Write-Host "HTTP Server is live on port $port (all interfaces: 0.0.0.0)"
} catch {
    Write-Error ("Failed to start listener on port {0}: {1}" -f $port, $_)
    exit 1
}

function Send-Response($stream, $statusCode, $statusText, $contentType, $contentBytes) {
    $header = "HTTP/1.1 $statusCode $statusText`r`nContent-Type: $contentType`r`nContent-Length: $($contentBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nAccess-Control-Allow-Methods: GET, POST, OPTIONS`r`nAccess-Control-Allow-Headers: Content-Type`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    if ($contentBytes.Length -gt 0) {
        $stream.Write($contentBytes, 0, $contentBytes.Length)
    }
    $stream.Flush()
}

while ($true) {
    $client = $null
    try {
        $client = $listener.AcceptTcpClient()
        # Set receive/send timeouts so mobile connections don't hang forever
        $client.ReceiveTimeout = 5000
        $client.SendTimeout    = 5000
        $stream = $client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::UTF8)

        $requestLine = $null
        try { $requestLine = $reader.ReadLine() } catch { }

        if (-not [string]::IsNullOrWhiteSpace($requestLine)) {
            $parts = $requestLine.Split(' ')
            if ($parts.Length -ge 2) {
                $httpMethod = $parts[0].ToUpper()
                $rawUrl = $parts[1].Split('?')[0]

                # Read HTTP headers
                $contentLength = 0
                $expectContinue = $false
                while ($true) {
                    $headerLine = $null
                    try { $headerLine = $reader.ReadLine() } catch { break }
                    if ([string]::IsNullOrEmpty($headerLine)) { break }
                    $lowerHeader = $headerLine.ToLower()
                    if ($lowerHeader.StartsWith("content-length:")) {
                        $contentLength = [int]($headerLine.Substring(15).Trim())
                    }
                    # Detect Expect: 100-continue (sent by mobile browsers before POST body)
                    if ($lowerHeader.StartsWith("expect:") -and $lowerHeader.Contains("100-continue")) {
                        $expectContinue = $true
                    }
                }

                # CORS preflight
                if ($httpMethod -eq "OPTIONS") {
                    Send-Response $stream 200 "OK" "text/plain" @()
                    continue
                }

                # Leaderboard API Endpoints
                if ($rawUrl -eq "/api/leaderboard") {

                    if ($httpMethod -eq "GET") {
                        # Return current leaderboard data
                        $jsonContent = if ([System.IO.File]::Exists($leaderboardFile)) {
                            [System.IO.File]::ReadAllText($leaderboardFile, [System.Text.Encoding]::UTF8)
                        } else {
                            '{"pc":{"scoreAttack":[],"boss":{"1":[]}},"mobile":{"scoreAttack":[],"boss":{"1":[]}}}'
                        }
                        $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonContent)
                        Send-Response $stream 200 "OK" "application/json; charset=utf-8" $bytes
                        continue
                    }
                    elseif ($httpMethod -eq "POST") {

                        # --- Respond to Expect: 100-continue BEFORE reading body ---
                        # Mobile browsers (Chrome/Safari) send this and wait for "100 Continue"
                        # before sending the POST body. Without it they close the connection.
                        if ($expectContinue) {
                            $continueBytes = [System.Text.Encoding]::ASCII.GetBytes("HTTP/1.1 100 Continue`r`n`r`n")
                            $stream.Write($continueBytes, 0, $continueBytes.Length)
                            $stream.Flush()
                        }

                        $body = ""
                        if ($contentLength -gt 0) {
                            $bodyChars = New-Object char[] $contentLength
                            $totalRead = 0
                            while ($totalRead -lt $contentLength) {
                                $read = 0
                                try { $read = $reader.Read($bodyChars, $totalRead, $contentLength - $totalRead) } catch { break }
                                if ($read -le 0) { break }
                                $totalRead += $read
                            }
                            $body = New-Object string ($bodyChars, 0, $totalRead)
                        }
                        $entry = $null
                        try { $entry = $body | ConvertFrom-Json } catch { $entry = $null }

                        if ($null -eq $entry) {
                            $errJson = '{"error":"Invalid payload"}'
                            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                            Send-Response $stream 400 "Bad Request" "application/json; charset=utf-8" $respBytes
                            continue
                        }

                        try {
                            Write-Host ("Received score submission: {0} ({1}) device={2}" -f $entry.name, $entry.mode, $entry.device)
                            
                            $currentJson = if ([System.IO.File]::Exists($leaderboardFile)) {
                                [System.IO.File]::ReadAllText($leaderboardFile, [System.Text.Encoding]::UTF8)
                            } else {
                                '{"pc":{"scoreAttack":[],"boss":{"1":[]}},"mobile":{"scoreAttack":[],"boss":{"1":[]}}}'
                            }
                            $lb = $currentJson | ConvertFrom-Json

                            # Ensure pc / mobile structure exists
                            if (-not $lb.pc) {
                                $legacyScore = if ($lb.scoreAttack) { @($lb.scoreAttack) } else { @() }
                                $legacyBoss = if ($lb.boss) { $lb.boss } else { [pscustomobject]@{"1" = @()} }
                                $lb = [pscustomobject]@{
                                    pc = [pscustomobject]@{ scoreAttack = @($legacyScore); boss = $legacyBoss }
                                    mobile = [pscustomobject]@{ scoreAttack = @(); boss = [pscustomobject]@{"1" = @()} }
                                }
                            }
                            if (-not $lb.mobile) {
                                $lb | Add-Member -NotePropertyName "mobile" -NotePropertyValue ([pscustomobject]@{ scoreAttack = @(); boss = [pscustomobject]@{"1" = @()} }) -Force
                            }

                            # Determine target device partition ('pc' or 'mobile')
                            $devKey = if ($entry.device -and $entry.device.ToLower() -eq "mobile") { "mobile" } else { "pc" }
                            $targetDeviceLb = $lb.$devKey
                            if (-not $targetDeviceLb.scoreAttack) {
                                $targetDeviceLb | Add-Member -NotePropertyName "scoreAttack" -NotePropertyValue @() -Force
                            }
                            if (-not $targetDeviceLb.boss) {
                                $targetDeviceLb | Add-Member -NotePropertyName "boss" -NotePropertyValue (New-Object PSObject) -Force
                            }
                            if (-not $targetDeviceLb.eventBoss) {
                                $targetDeviceLb | Add-Member -NotePropertyName "eventBoss" -NotePropertyValue @() -Force
                            }

                            $name = if ([string]::IsNullOrWhiteSpace($entry.name)) { "Player" } else { $entry.name.Trim() }
                            if ($name.Length -gt 15) { $name = $name.Substring(0, 15) }
                            $dateStr = (Get-Date).ToString("yyyy/MM/dd HH:mm")

                            if ($entry.mode -eq "SCORE_ATTACK") {
                                $newRecord = @{
                                    name = $name
                                    score = [int]$entry.score
                                    date = $dateStr
                                }
                                $list = [System.Collections.ArrayList]@($targetDeviceLb.scoreAttack)
                                $list.Add($newRecord) | Out-Null
                                $sorted = $list | Sort-Object -Property @{Expression = { [int]$_.score }; Descending = $true } | Select-Object -First 10
                                $targetDeviceLb.scoreAttack = @($sorted)
                            }
                            elseif ($entry.mode -eq "BOSS") {
                                $lvlKey = if ($entry.level) { [string]$entry.level } else { "1" }
                                $newRecord = @{
                                    name = $name
                                    time = [double]$entry.time
                                    date = $dateStr
                                }
                                $existingBossObj = $targetDeviceLb.boss
                                $lvlList = @()
                                if ($existingBossObj.PSObject.Properties[$lvlKey]) {
                                    $lvlList = @($existingBossObj.PSObject.Properties[$lvlKey].Value)
                                }
                                $bList = [System.Collections.ArrayList]@($lvlList)
                                $bList.Add($newRecord) | Out-Null
                                $bSorted = $bList | Sort-Object -Property @{Expression = { [double]$_.time }; Descending = $false } | Select-Object -First 10
                                
                                if ($existingBossObj.PSObject.Properties[$lvlKey]) {
                                    $existingBossObj.PSObject.Properties[$lvlKey].Value = @($bSorted)
                                } else {
                                    $existingBossObj | Add-Member -NotePropertyName $lvlKey -NotePropertyValue @($bSorted) -Force
                                }
                            }
                            elseif ($entry.mode -eq "EVENT_BOSS") {
                                $dmgVal = if ($entry.damage) { [double]$entry.damage } elseif ($entry.score) { [double]$entry.score } else { 0.0 }
                                $newRecord = @{
                                    name = $name
                                    damage = [math]::Round($dmgVal, 1)
                                    date = $dateStr
                                }
                                $list = [System.Collections.ArrayList]@($targetDeviceLb.eventBoss)
                                $list.Add($newRecord) | Out-Null
                                $sorted = $list | Sort-Object -Property @{Expression = { [double]$_.damage }; Descending = $true } | Select-Object -First 10
                                $targetDeviceLb.eventBoss = @($sorted)
                            }

                            $savedJson = $lb | ConvertTo-Json -Depth 6
                            [System.IO.File]::WriteAllText($leaderboardFile, $savedJson, [System.Text.Encoding]::UTF8)
                            Write-Host ("Saved to leaderboard.json OK")

                            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($savedJson)
                            Send-Response $stream 200 "OK" "application/json; charset=utf-8" $respBytes
                        } catch {
                            Write-Host ("Error processing leaderboard POST: {0}" -f $_)
                            $errJson = '{"error":"Invalid request format"}'
                            $respBytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                            Send-Response $stream 400 "Bad Request" "application/json; charset=utf-8" $respBytes
                        }
                        continue
                    }
                }

                # Static File Delivery
                if ($rawUrl -eq '/' -or [string]::IsNullOrWhiteSpace($rawUrl)) {
                    $rawUrl = '/index.html'
                }

                $subPath = [System.Uri]::UnescapeDataString($rawUrl.TrimStart('/'))
                $filePath = [System.IO.Path]::Combine($root, $subPath)

                if ([System.IO.File]::Exists($filePath)) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = "application/octet-stream"
                    switch ($ext) {
                        ".html" { $mime = "text/html; charset=utf-8" }
                        ".htm"  { $mime = "text/html; charset=utf-8" }
                        ".js"   { $mime = "application/javascript; charset=utf-8" }
                        ".css"  { $mime = "text/css; charset=utf-8" }
                        ".json" { $mime = "application/json; charset=utf-8" }
                        ".png"  { $mime = "image/png" }
                        ".jpg"  { $mime = "image/jpeg" }
                        ".svg"  { $mime = "image/svg+xml" }
                        ".ico"  { $mime = "image/x-icon" }
                    }

                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nCache-Control: no-store, no-cache, must-revalidate`r`nPragma: no-cache`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    if ($bytes.Length -gt 0) { $stream.Write($bytes, 0, $bytes.Length) }
                    $stream.Flush()
                } else {
                    $msgBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                    Send-Response $stream 404 "Not Found" "text/plain" $msgBytes
                }
            }
        }
    } catch {
        # Ignore common network errors (empty probes, keep-alive timeouts, etc.)
    } finally {
        if ($client) { $client.Close() }
    }
}
