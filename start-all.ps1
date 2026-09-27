Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting SIH26239 AI Scholarship Portal (All Services)   " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start AI Microservice (FastAPI - Port 8000)
Write-Host "`n[1/3] Starting AI Microservice (FastAPI: http://localhost:8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai-service; .\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# 2. Start Core Backend (Spring Boot - Port 8080)
Write-Host "[2/3] Starting Core Backend (Spring Boot: http://localhost:8080)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd core-backend; `$env:JAVA_HOME = 'C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot'; `$env:Path = `"`$env:JAVA_HOME\bin;`" + `$env:Path; .\mvnw.cmd spring-boot:run"

# 3. Start Frontend (Next.js - Port 3000)
Write-Host "[3/3] Starting Frontend (Next.js: http://localhost:3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nAll 3 services are launching in separate windows." -ForegroundColor Cyan
Write-Host "Portal Web App:   http://localhost:3000" -ForegroundColor White
Write-Host "Spring Boot API:  http://localhost:8080/api" -ForegroundColor White
Write-Host "FastAPI Swagger:  http://localhost:8000/docs" -ForegroundColor White
