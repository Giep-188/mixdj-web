# MixDj Web — versión de pruebas 0.1.1

Plataforma web progresiva (PWA) estática para probar el módulo de locutora virtual DJ. Interfaz adaptable a móvil y escritorio.

## Funciones disponibles
- Importación y reproducción de archivos de audio locales seleccionados por el usuario.
- Controles de reproducir, pausar, anterior, siguiente, progreso y volumen.
- Locutora mediante Web Speech API del navegador.
- Personalidades cálida, enérgica, elegante y relajada.
- Ajustes de velocidad, tono, voz disponible e intervalo mínimo.
- Prueba de voz, presentación de canción, comentario de transición y mensaje personalizado.
- Preferencias persistidas localmente en el navegador.
- PWA con caché básica para volver a abrir la interfaz sin conexión después de la primera carga.
- Flujo GitHub Actions incluido para publicación en GitHub Pages.

## Ejecutar localmente
```bash
python3 -m http.server 8080
```
Abrir `http://localhost:8080`.

## Publicar en GitHub Pages
Seguir `DEPLOYMENT.md`. El workflow `.github/workflows/pages.yml` publica automáticamente los archivos al hacer push a `main`. La URL solo existe después de crear el repositorio, habilitar GitHub Actions en Pages y completar la primera ejecución.

## Límites de esta versión
- Los archivos de música permanecen en el dispositivo y no se suben a un servidor.
- No incluye catálogo comercial, cuentas, sincronización entre dispositivos, recomendaciones de servidor ni streaming de terceros.
- La disponibilidad y calidad de voces depende del navegador y del sistema operativo. Chrome/Android suele ofrecer voces distintas de las de un equipo de escritorio.
- Esta interfaz prueba el comportamiento de voz en web; no sustituye la integración Android nativa con `TextToSpeech`.

## Privacidad
Los ajustes se guardan en `localStorage`. Los archivos se procesan mediante URLs locales del navegador y no se transmiten a MixDj.
