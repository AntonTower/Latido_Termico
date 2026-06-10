# 🐾 LATIDO Web Admin - Ecosistema RescueNet

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/Conecta_con-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

**LATIDO** es el panel de control web (Single Page Application) del ecosistema **RescueNet**. Su objetivo es brindar una interfaz administrativa rápida, segura y reactiva para gestionar los reportes de rescate animal. Este frontend funciona exclusivamente consumiendo la API centralizada en Node.js, manteniendo una única fuente de verdad para los datos.

---

## 🛠️ Herramientas Ocupadas (Stack Tecnológico)

* **Framework Principal:** Angular (Modo Standalone, sin módulos pesados).
* **Lenguaje:** TypeScript (Para un tipado estricto y código seguro).
* **Enrutamiento:** Angular Router (Configurado para Lazy Loading).
* **Peticiones HTTP:** `HttpClient` nativo de Angular + `RxJS`.
* **Gestor de Paquetes:** NPM (Node Package Manager).

---

## ✨ Funciones Principales

1. **Autenticación Segura:** Inicio de sesión protegido por JWT, inyectado automáticamente en cada petición mediante interceptores.
2. **Control de Acceso Basado en Roles (RBAC):** Guardianes de rutas (`Guards`) que restringen vistas según el tipo de usuario (Administrador vs. Operador).
3. **Gestión de Reportes:** Visualización y filtrado de reportes de rescate animal.
4. **Geolocalización:** Integración con mapas para ubicar espacialmente los incidentes (consumiendo datos de PostGIS del backend).
5. **Panel de Administración:** Control total sobre los usuarios registrados en la plataforma.

---

## 🏗️ Estructura del Repositorio

La arquitectura del proyecto es plana y orientada a dominios visuales, lo que facilita encontrar y escalar la lógica rápidamente. Todo el código fuente vive dentro de `frontend/src/app/`.

| Directorio / Archivo | Propósito Principal |
| :--- | :--- |
| 🔐 **`auth/`** | Centraliza la seguridad. Contiene la vista de login, el `auth.service.ts` (para pedir el JWT al backend) y los `guards` que protegen las URL. |
| 🛡️ **`interceptors/`** | Scripts invisibles. Aquí vive `jwt.interceptor.ts`, que atrapa todas las peticiones salientes y les pega el token de autorización. |
| 🖼️ **`layouts/`** | Los "marcos" de la aplicación. Esqueletos visuales como el `admin-layout` (que tiene menú lateral) o el `auth-layout` (pantalla en blanco). |
| 🚀 **`pages/`** | Las pantallas reales agrupadas por roles: `admin/` (usuarios), `operator/` (mapa, reportes) y `public/` (inicio). |
| ⚙️ **`services/`** | La conexión a Node.js. Archivos como `reportes.service.ts` o `usuarios.service.ts` que hacen los `GET`, `POST`, `PUT` y `DELETE`. |
| 📄 **`app.routes.ts`** | El mapa central de la aplicación. Define qué componente cargar cuando el usuario escribe una URL específica. |
| 📄 **`app.config.ts`** | El motor de inyección de dependencias global. |

---

## 💻 Requisitos Previos (Herramientas necesarias)

Para poder ejecutar este proyecto en tu computadora, necesitas tener instalados estos dos programas:

1. **Git:** Para clonar el repositorio y controlar las versiones.
   * 📥 [Descargar Git](https://git-scm.com/downloads) (Instala con las opciones por defecto).
2. **Node.js (LTS):** Es el entorno que ejecuta Angular localmente y contiene NPM.
   * 📥 [Descargar Node.js](https://nodejs.org/) (Asegúrate de descargar la versión **LTS**).

---

## 🚀 Descarga y Ejecución Local

Sigue estos pasos en tu terminal (PowerShell, CMD o Git Bash) para levantar el proyecto por primera vez.

**1. Clonar el repositorio:**
```bash
git clone [https://github.com/TU_USUARIO/Latido_Termico.git](https://github.com/TU_USUARIO/Latido_Termico.git)