#!/bin/bash

# 🚀 Script de Despliegue para Semillero GUIA Frontend
# Este script automatiza el proceso de despliegue en Vercel

echo "🧠 Iniciando despliegue del Semillero GUIA Frontend..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde el directorio raíz del frontend"
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado"
    exit 1
fi

echo "✅ Verificaciones iniciales completadas"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas correctamente"

# Ejecutar linting
echo "🔍 Ejecutando linting..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️ Advertencia: Se encontraron problemas de linting"
    read -p "¿Continuar con el despliegue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Despliegue cancelado"
        exit 1
    fi
fi

# Build del proyecto
echo "🏗️ Creando build de producción..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error en el build"
    exit 1
fi

echo "✅ Build completado exitosamente"

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Verificar variables de entorno
echo "🔧 Verificando configuración..."

if [ ! -f ".env" ]; then
    echo "⚠️ Archivo .env no encontrado"
    echo "📝 Creando archivo .env desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✏️ Por favor, edita el archivo .env con tus variables de producción"
        echo "🔗 VITE_API_URL debe apuntar a tu backend en producción"
    else
        echo "❌ No se encontró .env.example"
        exit 1
    fi
fi

# Preguntar sobre el tipo de despliegue
echo "🚀 Selecciona el tipo de despliegue:"
echo "1) Preview (desarrollo/testing)"
echo "2) Producción"
read -p "Ingresa tu opción (1 o 2): " -n 1 -r
echo

case $REPLY in
    1)
        echo "🔄 Desplegando en modo preview..."
        vercel
        ;;
    2)
        echo "🚀 Desplegando en producción..."
        vercel --prod
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 ¡Despliegue completado exitosamente!"
    echo ""
    echo "📋 Resumen del despliegue:"
    echo "   ✅ Dependencias instaladas"
    echo "   ✅ Linting ejecutado"
    echo "   ✅ Build de producción creado"
    echo "   ✅ Aplicación desplegada en Vercel"
    echo ""
    echo "🔗 Tu aplicación estará disponible en la URL proporcionada por Vercel"
    echo ""
    echo "📝 Pasos post-despliegue:"
    echo "   1. Verificar que VITE_API_URL esté configurado correctamente en Vercel"
    echo "   2. Probar todas las funcionalidades principales"
    echo "   3. Verificar la conexión con el backend"
    echo "   4. Comprobar el sistema de autenticación"
    echo ""
    echo "🎯 ¡El Semillero GUIA está listo para usar!"
else
    echo "❌ Error durante el despliegue"
    exit 1
fi