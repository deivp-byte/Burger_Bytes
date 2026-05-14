
# 🍔 Burger Bytes

**Burger Bytes** es una aplicación web interactiva para una hamburguesería con una fuerte estética retro y arcade. Diseñada para ofrecer una experiencia fluida tanto en escritorio como en móvil, la web cuenta con un menú dinámico, un carrito de compras funcional y un gran *easter egg*: una terminal de contacto estilo "Pip-Boy" que desbloquea un minijuego clásico de *Snake* con ranking global.

## 🛠️ Herramientas Utilizadas

Este proyecto ha sido desarrollado utilizando un stack completo nativo, sin frameworks pesados, para maximizar el rendimiento y el control:

* **Frontend:** HTML5, CSS3 (Animaciones, Responsive Design) y Vanilla JavaScript (DOM manipulation, Fetch API).
* **Backend:** PHP.
* **Base de Datos:** MySQL (Alojada en Aiven).
* **Diseño:** Interfaz orientada a móvil (Mobile-First) con elementos retro de 8-bits y animaciones CSS (Screen shake, glows, cascadas).

## ⚙️ Instalación

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

1.  **Clona el repositorio** o descarga los archivos en tu ordenador.
2.  **Entorno Servidor:** Asegúrate de tener instalado un servidor local que soporte PHP (como XAMPP, WAMP o MAMP).
3.  **Ubicación:** Mueve la carpeta del proyecto dentro del directorio público de tu servidor (por ejemplo, la carpeta `htdocs` en XAMPP).
4.  **Base de Datos:**
    * Ejecuta el script SQL incluido (o crea manualmente la tabla `puntuaciones_snake`) en tu gestor de base de datos MySQL.
    * Abre el archivo `conexion.php` (situado en la raíz del proyecto) y actualiza las credenciales (`$host`, `$dbname`, `$user`, `$password`) con los datos de tu servidor.

## 🚀 Uso

1.  Inicia tu servidor local (Apache/MySQL).
2.  Abre tu navegador web y dirígete a `http://localhost/nombre_de_tu_carpeta/index.php`.
3.  **Navegación:** Explora la carta interactiva, añade hamburguesas al carrito y observa las animaciones fluidas.
4.  **El Secreto:** Dirígete a la sección del formulario de contacto (el Pip-Boy). Envía un comando válido para desbloquear el botón de acceso al minijuego **Snake Byte**, ¡juega y guarda tus iniciales en el *Top Bytes*!
