## Hotel Bahia-Azul

Este proyecto corresponde al frontend de una Landing Page para un hotel en Venezuela, desarrollada con React y Material UI, utilizando React Router para la navegación y Axios para consumir la API del backend.

Tecnologías utilizadas:

React – Biblioteca para la creación de interfaces de usuario.

Vite – Herramienta de construcción y desarrollo para React.

TailwindCSS o Material UI – Frameworks de diseño para implementar un estilo moderno y responsivo.

React Router – Para la configuración de las rutas de la aplicación.

Axios – Para consumir las APIs proporcionadas por el backend.

Framer Motion – Para agregar animaciones suaves entre transiciones de páginas.

Figma – Para el diseño de la interfaz (versión web y móvil).

## Rutas Principales:

/ → Landing Page: La página de inicio con información destacada sobre el hotel.

/servicios → Servicios: Detalle de los servicios que ofrece el hotel.

/habitaciones → Habitaciones: Listado de habitaciones disponibles.

/blog → Blog: Artículos sobre turismo en el estado elegido.

/contacto o /reservas → Formulario de contacto/Reservas: Formulario para hacer una reserva en el hotel.

## Características del Proyecto:

Diseño y Responsividad:

Diseño realizado en Figma para versiones web y móvil.

Implementación de Material UI para asegurar una interfaz moderna, flexible y responsive.

100% responsive utilizando Flexbox, Grid y media queries.

Navegación:

Implementación de rutas utilizando React Router.

Transiciones suaves entre páginas con Framer Motion.

Contenido Dinámico:

Secciones informativas sobre el hotel, como:

Servicios.

Precios y promociones.

Blog con artículos turísticos.

Integración con Backend:

Consumo de las APIs proporcionadas por el backend utilizando Axios.

Habitaciones: Mostrar lista de habitaciones disponibles.

Blog: Mostrar artículos del blog.

Reservas: Crear una nueva reserva.

## Instrucciones para Ejecutar el Proyecto:

1. Para ejecutar tanto el frontend como el backend, hay que seguir los siguientes pasos:

git clone https://github.com/PaoC025/Hotel-Bahia-Azul.git

2. Instalación de dependencias:

En el frontend:

npm install

En el backend:

cd backend
npm install

3. Configuración de variables de entorno:

Crear un archivo .env en la carpeta backend con las siguientes variables (en caso de que no esté):

PORT=4000
EMAIL_USER=ernestojrm59@gmail.com
EMAIL_PASS=ctfp grjd lhou hatd

MONGO_URI=mongodb+srv://ernestojrm08_db_user:e29694608@hotelbahiaazul.wg3hcnv.mongodb.net/?retryWrites=true&w=majority&appName=HotelbahiaAzul

4. Ejecutar los servidores:

Para el frontend: salir a la carpeta raíz y ejecutar:

npm run dev

Para el backend: entrar a la carpeta backend/ y ejecutar:

npm run dev