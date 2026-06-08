# Servidor de Aplicación - Backend (Node.js + Express)

## Descripción General
Este módulo corresponde al servidor de aplicación del sistema de Chat Corporativo desarrollado para el Taller 01. Su responsabilidad principal es administrar la lógica del negocio, la comunicación con la base de datos y la mensajería en tiempo real entre usuarios conectados al sistema.

El backend fue construido con Node.js y Express, incorporando además Socket.io para soportar la comunicación en tiempo real. De esta forma, el sistema puede manejar procesos de registro, inicio de sesión, creación de salas, almacenamiento del historial de mensajes y difusión instantánea de mensajes dentro de cada sala.

## Arquitectura
Para este módulo se utilizó una Arquitectura por Capas, con el objetivo de mejorar la mantenibilidad del código y desacoplar responsabilidades dentro del proyecto.

Las capas implementadas son las siguientes:

- `routes`: define los endpoints HTTP del sistema, por ejemplo registro, login, salas y mensajes.
- `controllers`: contiene la lógica de negocio y el procesamiento de los datos recibidos desde las rutas.
- `models`: concentra el acceso a PostgreSQL y las consultas SQL de forma separada.
- `middlewares`: incorpora funciones auxiliares de seguridad, como el cifrado de contraseñas con `bcrypt`.

Esta organización permite que, si en una futura iteración del proyecto se reemplaza PostgreSQL por otro motor como MySQL, la mayor parte del cambio quede concentrada en la carpeta `models`.

## Persistencia de Datos
La persistencia se implementó con PostgreSQL. El sistema utiliza un esquema relacional de al menos 6 tablas para cubrir los requerimientos del taller:

- `Usuario`
- `Rol`
- `Sala`
- `Mensaje`
- `Usuario_Sala`
- `Log_Actividad`

La base de datos permite almacenar usuarios registrados, tipos de usuario, salas públicas y privadas, mensajes enviados, relación entre usuarios y salas, además de eventos relevantes del sistema para seguimiento básico de actividad.

## Seguridad
En esta primera versión se aplicaron medidas simples de seguridad orientadas al contexto académico del taller:

- cifrado de contraseñas con `bcrypt`
- validaciones básicas en registro y login
- separación de la lógica de autenticación en controladores y middlewares

Además, el backend quedó preparado para una posible extensión con tokens de sesión o autenticación basada en JWT en futuras mejoras del sistema.

## Comunicación en Tiempo Real
El servidor utiliza `Socket.io` para habilitar la transmisión de mensajes en tiempo real. Cuando un usuario entra a una sala, el cliente se conecta al canal correspondiente y puede recibir inmediatamente los mensajes nuevos sin necesidad de recargar la página.

Esta funcionalidad permite cumplir con uno de los requerimientos principales del sistema: la comunicación corporativa instantánea entre usuarios.

## Tecnologías Utilizadas
- Node.js
- Express
- PostgreSQL
- `pg`
- Socket.io
- bcryptjs
- dotenv
- cors

## Instalación
Desde la carpeta `backend`, instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en esta misma carpeta con una configuración similar a la siguiente:

```env
PORT=4000
PGHOST=localhost
PGPORT=5432
PGDATABASE=chat_corporativo
PGUSER=postgres
PGPASSWORD=tu_password
```

## Ejecución Local
Para ejecutar el backend en el PC de laboratorio o en un equipo local:

```bash
npm start
```

O en modo desarrollo:

```bash
npm run dev
```

El servidor quedará disponible en:

```text
http://localhost:4000
```

## Observación Técnica
Este módulo funciona como núcleo del modelo Cliente-Servidor del sistema. Tanto el cliente web como la aplicación móvil dependen de este backend para autenticación, gestión de salas, acceso al historial y comunicación en tiempo real.
