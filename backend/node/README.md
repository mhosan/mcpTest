# Implementación de la API OpenRouter

Esta es una implementación en Node.js para interactuar con la API de OpenRouter, que proporciona acceso a varios modelos de lenguaje de IA.

## Configuración

1. Crea un archivo `.env` en este directorio con tu clave API de OpenRouter:
```
AUTHORIZATION_BEARER=tu_clave_api_aquí
```

2. Instala las dependencias:
```bash
npm install node-fetch dotenv
```

## Modelos Disponibles

La implementación actualmente soporta varios modelos que pueden ser descomentados en el código:

- microsoft/phi-4-reasoning-plus:free (actualmente activo)
- qwen/qwen3-0.6b-04-28:free
- deepseek/deepseek-chat-v3-0324:free
- deepseek/deepseek-chat:free
- google/gemini-2.0-flash-exp:free
- google/learnlm-1.5-pro-experimental:free
- mistralai/mistral-7b-instruct:free

## Uso

Ejecuta el script con:
```bash
node openrouter-request.js
```

## Configuración

La llamada a la API puede configurarse con diferentes ajustes de proveedor:
- rendimiento (throughput): prioriza mayor rendimiento
- latencia (latency): prioriza menor latencia
- costo (cost): prioriza precios más bajos

## Encabezados

La implementación incluye los encabezados requeridos:
- Authorization: Tu token bearer de la API
- HTTP-Referer: La URL de tu aplicación
- X-Title: El nombre de tu aplicación
- Content-Type: application/json