### ¿Qué incluye este README?

1. **Instalación**: Los pasos para clonar el repositorio, instalar dependencias y configurar el entorno.
2. **Configuración de base de datos**: Instrucciones sobre cómo configurar PostgreSQL y las tablas necesarias.
3. **Uso**: Cómo iniciar el servidor y qué funciones tiene la aplicación tanto para empleados como para administradores.
4. **Endpoints**: Una lista de los endpoints principales para la API.
5. **Tecnologías Usadas**: Resumen de las tecnologías utilizadas en el proyecto.

# Sistema de Gestión de Asistencia de Empleados

Este proyecto es una aplicación web para la gestión de asistencia de empleados, donde los empleados pueden registrar su llegada y los administradores pueden ver los registros, filtrar por empleado o fechas, y gestionar empleados (agregar, editar, y eliminar).

## Características

- Registro de llegadas de empleados.
- Filtros por empleado y rango de fechas.
- Panel de administración para gestionar empleados.
- Autenticación de usuarios (administrador y empleados).
- Seguridad mediante JWT (JSON Web Tokens).

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git


2. Entra a la carpeta del backend:

cd backend

3. Instala las dependencias necesarias:

npm install

4. Crea un archivo .env en la raíz del backend con las siguientes variables de entorno:

DB_USER=tu_usuario_de_base_de_datos
DB_HOST=localhost
DB_DATABASE=nombre_de_tu_base_de_datos
DB_PASSWORD=tu_contraseña_de_base_de_datos
JWT_SECRET=una_clave_secreta_para_jwt

5. Inicializa tu base de datos PostgreSQL. Asegúrate de tener creada la base de datos con las tablas adecuadas.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


## Uso

Iniciar el Servidor
Ejecuta el servidor de desarrollo:
bash

Copiar código

npm start
La aplicación estará disponible en http://localhost:3000.

## Funcionalidades
## Para Empleados:

Registro de llegada: Los empleados pueden iniciar sesión y registrar su llegada en la aplicación.

## Para Administradores:

Ver todos los registros de asistencia.
Filtrar registros por empleado o por rango de fechas.
Agregar, editar y eliminar empleados.
Endpoints Principales

- POST /api/auth/login: Autentica a un usuario.
- POST /api/auth/register: Registra un nuevo empleado o administrador.
- POST /api/auth/add-update-employee: Agregar o actualizar empleados.
- DELETE /api/auth/delete-employee/:id: Eliminar un empleado.
- GET /api/attendance/all: Obtener todos los registros de asistencia (con filtros opcionales).

## Tecnologías Usadas

Backend: Node.js, Express
Base de datos: PostgreSQL
Autenticación: JSON Web Tokens (JWT)
Frontend: HTML, CSS, JavaScript







