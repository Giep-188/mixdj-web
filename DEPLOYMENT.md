# Publicación de MixDj Web en GitHub Pages

Este proyecto está preparado para publicarse con GitHub Actions.

## Requisitos
- Una cuenta de GitHub.
- Un repositorio público (GitHub Pages está disponible gratuitamente para repositorios públicos en GitHub Free).
- Permisos de administrador sobre el repositorio.

## Pasos
1. Crear un repositorio llamado `mixdj-web` (o autorizar la creación desde la integración de GitHub conectada).
2. Subir **todo el contenido de esta carpeta** a la raíz de la rama `main`, incluyendo `.github/workflows/pages.yml` y `.nojekyll`.
3. En el repositorio, abrir `Settings` → `Pages` y seleccionar `GitHub Actions` como fuente de publicación.
4. Abrir la pestaña `Actions` y esperar a que termine correctamente el flujo `Publicar MixDj Web en GitHub Pages`.
5. La URL pública aparecerá en `Settings` → `Pages` y en el resumen de la ejecución del flujo. Para un repositorio llamado `mixdj-web`, normalmente será `https://USUARIO.github.io/mixdj-web/`.

La dirección anterior es una plantilla, **no una URL activa** hasta que el repositorio exista y la publicación termine correctamente.

## Privacidad y límites
GitHub Pages publica el contenido en Internet. No subir claves, contraseñas, datos personales ni archivos privados. Esta versión no incorpora backend, cuentas ni sincronización multiusuario; las preferencias permanecen en el navegador y la música local no se carga al servidor.

## Pruebas
Abrir la URL publicada con HTTPS. En Android, usar Chrome y elegir `Añadir a pantalla de inicio`. La síntesis de voz depende de las voces disponibles en el dispositivo y navegador.
