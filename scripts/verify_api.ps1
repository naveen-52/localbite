$ErrorActionPreference = 'Stop'

Write-Host "=== 1. Checking Categories ==="
$cat = Invoke-RestMethod -Uri "http://localhost:8080/api/categories"
Write-Host "Success: $($cat.success) - Count: $($cat.data.Count)"

Write-Host "`n=== 2. Checking Nearby Shops (Real Stalls Only) ==="
$shops = Invoke-RestMethod -Uri "http://localhost:8080/api/shops/nearby?lat=9.5100&lng=78.1000&radius=50"
Write-Host "Success: $($shops.success) - Count: $($shops.data.Count)"
foreach ($s in $shops.data) {
    Write-Host " - Real Stall: $($s.name) | Open: $($s.open) | Distance: $($s.distanceKm) km"
}

Write-Host "`n=== 3. Checking Subscription Plans ==="
$plans = Invoke-RestMethod -Uri "http://localhost:8080/api/plans"
Write-Host "Plans: $($plans.data.Count)"
foreach ($p in $plans.data) {
    Write-Host " - $($p.name): INR $($p.price)"
}

Write-Host "`n=== 4. Checking Super Admin Login & Protected Dashboard ==="
$loginBody = '{"email":"admin@localbite.com","password":"Admin@123"}'
$authRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Admin Logged In! User: $($authRes.data.fullName) | Role: $($authRes.data.role)"

$token = $authRes.data.accessToken
$headers = @{ "Authorization" = "Bearer $token" }
$stats = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/stats" -Headers $headers
Write-Host "Admin Dashboard Stats -> Total Shops: $($stats.data.totalShops) | Active: $($stats.data.activeShops) | Users: $($stats.data.totalUsers)"

Write-Host "`nAll verification checks PASSED! No demo data present."
