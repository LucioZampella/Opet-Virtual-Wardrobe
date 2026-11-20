# Opet Virtual Wardrobe

Aplicación para organizar prendas, crear outfits y compartirlos dentro de una comunidad.

## Uso local con Docker

Docker permite iniciar el backend y la base de datos como un entorno aislado, sin instalar PostgreSQL en la computadora. El archivo `.env.local` contiene la configuración de desarrollo y `.env.example` sirve como referencia para crear uno nuevo.

Con Docker Desktop en ejecución, se inicia el entorno con:

```powershell
docker compose --env-file .env.local up --build
```

El frontend se utiliza aparte en modo desarrollo. De esta forma conserva la recarga rápida mientras el backend y la base de datos se ejecutan de forma consistente en contenedores.

## Despliegue

El backend está desplegado como un Web Service en Render. Render construye la imagen a partir del `Dockerfile` de este repositorio y recibe la configuración sensible desde sus variables de entorno, sin incluir secretos dentro del código ni de la imagen.

La configuración de producción puede cargarse desde `.env.render` mediante la opción **Add from .env** del panel de Render. Ese archivo es local y no se versiona.

[Abrir el servicio en Render](https://opet-virtual-wardrobe.onrender.com)
