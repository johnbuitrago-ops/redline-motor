# REDLINE — Cómo publicarlo en internet (versión GRATIS)

App de noticias del mundo motor lista para publicar como sitio web.
Reúne titulares en tiempo real desde **Google Noticias** —   sin clave de API y **sin pagar nada**.

Usarás dos servicios gratuitos: **GitHub** (para guardar los archivos) y
**Vercel** (para publicar la web). No necesitas saber programar ni usar la terminal.

---

## Qué trae esta versión

- Diseño en **tonos pastel neutros**.
- Noticias de **Colombia, Latinoamérica y el mundo**.
- Categorías: Todo, **Economía** (macro y micro), **Aduanas** (importación/aranceles),
  Eléctricos, Lanzamientos, Competición, Tecnología, Reseñas y **Usados** (precios).
- **Apartado especial Grupo Caminos** con sus marcas: Subaru, GWM, Chevrolet,
  Citroën, Suzuki, Chery, Dongfeng, Hino, JAC y DFSK (botón "Todas" o marca por marca).
- **Sin motos**: las motocicletas quedan excluidas de las búsquedas.

```
redline-motor/
├── index.html      → la página que ve el visitante
├── api/news.js     → trae los titulares (corre en el servidor)
├── package.json
└── README.md       → este archivo
```

> ¿Por qué no basta abrir el `index.html` en el computador?
> Porque el navegador, por seguridad, no deja que una página pida noticias a otro
> sitio directamente. El archivo `api/news.js` las pide desde el servidor (gratis en
> Vercel) y se las entrega a la página. Por eso hay que publicarlo, no abrirlo como archivo local.

---

## Paso 1 — Sube los archivos a GitHub

1. Crea una cuenta gratis en https://github.com
2. Pulsa **New repository**, ponle un nombre (ej. `redline-motor`), déjalo **Public**
   y pulsa **Create repository**.
3. En el repo vacío, pulsa **uploading an existing file**.
4. Arrastra TODO el contenido de la carpeta `redline-motor` (incluida la carpeta `api`)
   y pulsa **Commit changes**.

## Paso 2 — Publícalo con Vercel

1. Entra a https://vercel.com y regístrate con tu cuenta de GitHub.
2. Pulsa **Add New… → Project**.
3. Elige el repositorio `redline-motor` y pulsa **Import**.
4. Deja todo como está y pulsa **Deploy**.

En ~1 minuto tendrás una dirección como `https://redline-motor.vercel.app`.
¡Esa es tu web pública y gratuita!

---

## Personalizar

- **Categorías y palabras de búsqueda:** edita la lista `CATS` dentro de `index.html`.
- **Marcas de Grupo Caminos:** edita la lista `BRANDS` dentro de `index.html`
  (puedes añadir, quitar o cambiar las palabras de búsqueda de cada marca).
- **Región/idioma:** en `api/news.js`, en la parte `hl=es-419&gl=CO`.
- **Motos:** la exclusión está en `api/news.js` (`-moto -motocicleta -motociclismo`).
- **Colores:** las variables de color están al inicio de `index.html` (bloque `:root`).

## Si algo falla
- "Se cortó la señal" → suele ser temporal; pulsa **Reintentar**.
- Tras subir cambios a GitHub, Vercel republica solo en segundos.

Los titulares vienen de Google Noticias (reúne medios de Colombia, la región y el mundo).
Cada nota se abre en la página del medio original.
