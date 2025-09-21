@echo off
REM 🚀 Script de Despliegue para Semillero GUIA Frontend (Windows)
REM Este script automatiza el proceso de despliegue en Vercel

echo 🧠 Iniciando despliegue del Semillero GUIA Frontend...

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: Este script debe ejecutarse desde el directorio raíz del frontend
    pause
    exit /b 1
)

REM Verificar que Node.js esté instalado
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado
    pause
    exit /b 1
)

REM Verificar que npm esté instalado
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ Error: npm no está instalado
    pause
    exit /b 1
)

echo ✅ Verificaciones iniciales completadas

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

if errorlevel 1 (
    echo ❌ Error instalando dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente

REM Ejecutar linting
echo 🔍 Ejecutando linting...
call npm run lint

if errorlevel 1 (
    echo ⚠️ Advertencia: Se encontraron problemas de linting
    set /p continue="¿Continuar con el despliegue? (y/n): "
    if /i not "%continue%"=="y" (
        echo ❌ Despliegue cancelado
        pause
        exit /b 1
    )
)

REM Build del proyecto
echo 🏗️ Creando build de producción...
call npm run build

if errorlevel 1 (
    echo ❌ Error en el build
    pause
    exit /b 1
)

echo ✅ Build completado exitosamente

REM Verificar si Vercel CLI está instalado
where vercel >nul 2>nul
if errorlevel 1 (
    echo 📦 Vercel CLI no está instalado. Instalando...
    call npm install -g vercel
)

REM Verificar variables de entorno
echo 🔧 Verificando configuración...

if not exist ".env" (
    echo ⚠️ Archivo .env no encontrado
    echo 📝 Creando archivo .env desde .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo ✏️ Por favor, edita el archivo .env con tus variables de producción
        echo 🔗 VITE_API_URL debe apuntar a tu backend en producción
    ) else (
        echo ❌ No se encontró .env.example
        pause
        exit /b 1
    )
)

REM Preguntar sobre el tipo de despliegue
echo 🚀 Selecciona el tipo de despliegue:
echo 1) Preview (desarrollo/testing)
echo 2) Producción
set /p choice="Ingresa tu opción (1 o 2): "

if "%choice%"=="1" (
    echo 🔄 Desplegando en modo preview...
    call vercel
) else if "%choice%"=="2" (
    echo 🚀 Desplegando en producción...
    call vercel --prod
) else (
    echo ❌ Opción inválida
    pause
    exit /b 1
)

if not errorlevel 1 (
    echo.
    echo 🎉 ¡Despliegue completado exitosamente!
    echo.
    echo 📋 Resumen del despliegue:
    echo    ✅ Dependencias instaladas
    echo    ✅ Linting ejecutado
    echo    ✅ Build de producción creado
    echo    ✅ Aplicación desplegada en Vercel
    echo.
    echo 🔗 Tu aplicación estará disponible en la URL proporcionada por Vercel
    echo.
    echo 📝 Pasos post-despliegue:
    echo    1. Verificar que VITE_API_URL esté configurado correctamente en Vercel
    echo    2. Probar todas las funcionalidades principales
    echo    3. Verificar la conexión con el backend
    echo    4. Comprobar el sistema de autenticación
    echo.
    echo 🎯 ¡El Semillero GUIA está listo para usar!
) else (
    echo ❌ Error durante el despliegue
)

pause