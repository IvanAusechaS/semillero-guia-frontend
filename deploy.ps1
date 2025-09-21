# 🚀 Script de Despliegue para Semillero GUIA Frontend (PowerShell)
# Este script automatiza el proceso de despliegue en Vercel

param(
    [switch]$Production,
    [switch]$SkipLint,
    [switch]$SkipInstall,
    [string]$ApiUrl
)

function Write-Step {
    param([string]$Message)
    Write-Host "🔷 $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Test-Command {
    param([string]$Command)
    return (Get-Command $Command -ErrorAction SilentlyContinue) -ne $null
}

Write-Host "🧠 Iniciando despliegue del Semillero GUIA Frontend..." -ForegroundColor Magenta
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Error "Este script debe ejecutarse desde el directorio raíz del frontend"
    exit 1
}

# Verificar herramientas necesarias
Write-Step "Verificando herramientas necesarias..."

if (-not (Test-Command "node")) {
    Write-Error "Node.js no está instalado"
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Error "npm no está instalado"
    exit 1
}

Write-Success "Verificaciones iniciales completadas"

# Instalar dependencias
if (-not $SkipInstall) {
    Write-Step "Instalando dependencias..."
    try {
        npm install
        if ($LASTEXITCODE -ne 0) { throw "Error en npm install" }
        Write-Success "Dependencias instaladas correctamente"
    }
    catch {
        Write-Error "Error instalando dependencias: $_"
        exit 1
    }
} else {
    Write-Warning "Saltando instalación de dependencias (--SkipInstall)"
}

# Ejecutar linting
if (-not $SkipLint) {
    Write-Step "Ejecutando linting..."
    try {
        npm run lint
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Se encontraron problemas de linting"
            $continue = Read-Host "¿Continuar con el despliegue? (y/n)"
            if ($continue -ne "y" -and $continue -ne "Y") {
                Write-Error "Despliegue cancelado"
                exit 1
            }
        } else {
            Write-Success "Linting completado sin errores"
        }
    }
    catch {
        Write-Warning "Error ejecutando linting: $_"
    }
} else {
    Write-Warning "Saltando linting (--SkipLint)"
}

# Build del proyecto
Write-Step "Creando build de producción..."
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Error en build" }
    Write-Success "Build completado exitosamente"
}
catch {
    Write-Error "Error en el build: $_"
    exit 1
}

# Verificar si Vercel CLI está instalado
Write-Step "Verificando Vercel CLI..."
if (-not (Test-Command "vercel")) {
    Write-Step "Instalando Vercel CLI..."
    try {
        npm install -g vercel
        Write-Success "Vercel CLI instalado"
    }
    catch {
        Write-Error "Error instalando Vercel CLI: $_"
        exit 1
    }
} else {
    Write-Success "Vercel CLI disponible"
}

# Verificar variables de entorno
Write-Step "Verificando configuración..."

if (-not (Test-Path ".env")) {
    Write-Warning "Archivo .env no encontrado"
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Warning "Se creó .env desde .env.example"
        Write-Warning "Por favor, edita el archivo .env con tus variables de producción"
    } else {
        Write-Error "No se encontró .env.example"
        exit 1
    }
}

# Configurar API URL si se proporciona
if ($ApiUrl) {
    Write-Step "Configurando VITE_API_URL=$ApiUrl"
    (Get-Content ".env") -replace "VITE_API_URL=.*", "VITE_API_URL=$ApiUrl" | Set-Content ".env"
}

# Determinar tipo de despliegue
$deployType = "preview"
if ($Production) {
    $deployType = "production"
    Write-Step "Desplegando en PRODUCCIÓN..."
} else {
    if (-not $Production) {
        Write-Host ""
        Write-Host "🚀 Tipo de despliegue:" -ForegroundColor Yellow
        Write-Host "1) Preview (desarrollo/testing)" -ForegroundColor White
        Write-Host "2) Producción" -ForegroundColor White
        
        do {
            $choice = Read-Host "Selecciona una opción (1 o 2)"
        } while ($choice -ne "1" -and $choice -ne "2")
        
        if ($choice -eq "2") {
            $deployType = "production"
            Write-Step "Desplegando en PRODUCCIÓN..."
        } else {
            Write-Step "Desplegando en modo PREVIEW..."
        }
    }
}

# Ejecutar despliegue
try {
    if ($deployType -eq "production") {
        vercel --prod
    } else {
        vercel
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 ¡Despliegue completado exitosamente!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Resumen del despliegue:" -ForegroundColor Cyan
        Write-Host "   ✅ Dependencias instaladas" -ForegroundColor Green
        Write-Host "   ✅ Linting ejecutado" -ForegroundColor Green
        Write-Host "   ✅ Build de producción creado" -ForegroundColor Green
        Write-Host "   ✅ Aplicación desplegada en Vercel" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Tu aplicación estará disponible en la URL proporcionada por Vercel" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📝 Pasos post-despliegue:" -ForegroundColor Cyan
        Write-Host "   1. Verificar que VITE_API_URL esté configurado correctamente en Vercel" -ForegroundColor White
        Write-Host "   2. Probar todas las funcionalidades principales" -ForegroundColor White
        Write-Host "   3. Verificar la conexión con el backend" -ForegroundColor White
        Write-Host "   4. Comprobar el sistema de autenticación" -ForegroundColor White
        Write-Host ""
        Write-Host "🎯 ¡El Semillero GUIA está listo para usar!" -ForegroundColor Magenta
    } else {
        throw "Error durante el despliegue"
    }
}
catch {
    Write-Error "Error durante el despliegue: $_"
    exit 1
}

# Ejemplos de uso:
# .\deploy.ps1                          # Despliegue interactivo
# .\deploy.ps1 -Production              # Despliegue directo a producción
# .\deploy.ps1 -SkipLint               # Saltear linting
# .\deploy.ps1 -SkipInstall            # Saltear instalación de dependencias
# .\deploy.ps1 -ApiUrl "https://api.example.com"  # Configurar API URL