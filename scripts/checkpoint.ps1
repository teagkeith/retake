
$ErrorActionPreference = "Stop"

Write-Host "Verifying Rotate..." -ForegroundColor Cyan

npm run verify

if ($LASTEXITCODE -ne 0) {
    Write-Host "Verification failed. Nothing was pushed." -ForegroundColor Red
    exit 1
}

$branch = git branch --show-current

if ($LASTEXITCODE -ne 0 -or !$branch -or $branch -eq "main") {
    Write-Host "Checkpoint must run on a feature branch." -ForegroundColor Red
    exit 1
}

git add -A

git diff --cached --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "No changes to commit." -ForegroundColor Yellow
} else {
    git commit -m "chore: development checkpoint"

    if ($LASTEXITCODE -ne 0) {
        exit 1
    }
}

git push -u origin $branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed." -ForegroundColor Red
    exit 1
}

Write-Host "Checkpoint pushed successfully!" -ForegroundColor Green
