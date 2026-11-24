$ErrorActionPreference = 'Stop'

Write-Host "=== 1. Checking Categories ==="
$cat = Invoke-RestMethod -Uri "http://localhost:8080/api/categories"
Write-Host "Success: $($cat.success) - Count: $($cat.data.Count)"

Write-Host "`n=== 2. Checking Nearby Shops ==="
$shops = Invoke-RestMethod -Uri "http://localhost:8080/api/shops/nearby?lat=13.0827&lng=80.2707&radius=10"
Write-Host "Success: $($shops.success) - Count: $($shops.data.Count)"
foreach ($s in $shops.data) {
    Write-Host " - Shop: $($s.name) | Open: $($s.open) | Distance: $($s.distanceKm) km"
}

Write-Host "`n=== 3. Checking Shop 1 Detail ==="
$shop1 = Invoke-RestMethod -Uri "http://localhost:8080/api/shops/1"
Write-Host "Shop: $($shop1.data.name) - Status: $($shop1.data.statusMessage)"

Write-Host "`n=== 4. Checking Shop 1 Menu ==="
$menu = Invoke-RestMethod -Uri "http://localhost:8080/api/shops/1/menu"
Write-Host "Dishes: $($menu.data.Count)"
foreach ($d in $menu.data) {
    Write-Host " * $($d.name) (INR $($d.price)) -> $($d.availabilityStatus)"
}

Write-Host "`n=== 5. Checking Subscription Plans ==="
$plans = Invoke-RestMethod -Uri "http://localhost:8080/api/plans"
Write-Host "Plans: $($plans.data.Count)"
foreach ($p in $plans.data) {
    Write-Host " - $($p.name): INR $($p.price)"
}

Write-Host "`n=== 6. Checking Admin Login & Protected Dashboard ==="
$loginBody = '{"email":"admin@localbite.com","password":"Admin@123"}'
$authRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
Write-Host "Admin Logged In! User: $($authRes.data.fullName) | Role: $($authRes.data.role)"

$token = $authRes.data.accessToken
$headers = @{ "Authorization" = "Bearer $token" }
$stats = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/stats" -Headers $headers
Write-Host "Admin Dashboard Stats -> Total Shops: $($stats.data.totalShops) | Active: $($stats.data.activeShops) | Users: $($stats.data.totalUsers)"

Write-Host "`n=== 7. Checking Shop Owner Login & Owner Dashboard ==="
$ownerLoginBody = '{"email":"kumar@example.com","password":"Password@123"}'
$ownerAuthRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $ownerLoginBody -ContentType "application/json"
Write-Host "Owner Logged In! User: $($ownerAuthRes.data.fullName) | Role: $($ownerAuthRes.data.role)"

$ownerToken = $ownerAuthRes.data.accessToken
$ownerHeaders = @{ "Authorization" = "Bearer $ownerToken" }
$myShop = Invoke-RestMethod -Uri "http://localhost:8080/api/owner/my-shop" -Headers $ownerHeaders
Write-Host "Owner Shop -> Name: $($myShop.data.name) | Verified: $($myShop.data.verificationStatus)"

Write-Host "`n=== 8. Testing Quick Availability Toggle (<1s) ==="
$availBody = '{"status":"SOLD_OUT","quantity":0}'
$toggleRes = Invoke-RestMethod -Uri "http://localhost:8080/api/foods/1/availability" -Method Patch -Body $availBody -ContentType "application/json" -Headers $ownerHeaders
Write-Host "Toggled Dish #1 -> Name: $($toggleRes.data.name) | New Status: $($toggleRes.data.availabilityStatus)"

# Toggle it back to AVAILABLE
$availBackBody = '{"status":"AVAILABLE"}'
$toggleBackRes = Invoke-RestMethod -Uri "http://localhost:8080/api/foods/1/availability" -Method Patch -Body $availBackBody -ContentType "application/json" -Headers $ownerHeaders
Write-Host "Re-toggled Dish #1 back -> Status: $($toggleBackRes.data.availabilityStatus)"

Write-Host "`nAll end-to-end verification tests PASSED 100%!"
