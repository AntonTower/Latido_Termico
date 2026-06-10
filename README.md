# 🐾 LATIDO Web Admin - Ecosistema RescueNet

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/API_Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

**LATIDO** es el panel web administrativo para el ecosistema **RescueNet**. Operando como una Single Page Application (SPA) construida en Angular, este cliente web se comunica exclusivamente con la API centralizada en Node.js. Esto garantiza una única fuente de verdad tanto para la aplicación móvil como para la gestión web.

---

## 🏗️ Arquitectura de Carpetas

El proyecto utiliza una estructura plana, modular y orientada a roles. Todo el código fuente reside en `frontend/src/app/`.

| Módulo | Propósito y Contenido | Reglas de Uso |
| :--- | :--- | :--- |
| 🔐 **`auth/`** | **Seguridad y Accesos.** Contiene la vista de `login`, el servicio de conexión y los `guards` (guardianes) que protegen las rutas según el rol. | Único lugar donde se gestiona el JWT y la sesión del usuario. |
| 🛡️ **`interceptors/`** | **Manipulación de Peticiones.** Contiene `jwt.interceptor.ts`. | Se encarga de inyectar automáticamente el Token en la cabecera de todas las peticiones hacia el backend. |
| 🖼️ **`layouts/`** | **Contenedores Estructurales.** Esqueletos visuales: `admin-layout` (con menús de control), `operator-layout`, `public-layout` y `auth-layout` (lienzo limpio). | Solo renderizan el marco visual y el `<router-outlet>`. No contienen lógica pesada. |
| 🚀 **`pages/`** | **Vistas y Pantallas.** Agrupadas por rol de usuario (`admin`, `operator`, `public`). | Son el contenido dinámico. Solo deben llamar a los archivos de `services/` para obtener datos. |
| ⚙️ **`services/`** | **Llamadas a la API.** Archivos dedicados a la comunicación con Node.js (ej. `reportes.service.ts`, `usuarios.service.ts`). | Centralizan todos los métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`). |

---

## 🚀 Guía de Inicio Rápido (Onboarding)

Sigue estos pasos para configurar el proyecto en tu máquina local. Gracias a la contenerización, no necesitas instalar dependencias de Angular globalmente.

### 1. Prerrequisitos
* Tener instalado [Docker Desktop](https://www.docker.com/products/docker-desktop/).
* Tener instalado [Git](https://git-scm.com/downloads).
* Visual Studio Code.

### 2. Descarga y Configuración Local
Clona el repositorio en tu computadora y entra a la carpeta del proyecto:
```bash
git clone [https://github.com/TU_USUARIO/Latido_Termico.git](https://github.com/TU_USUARIO/Latido_Termico.git)
cd Latido_Termico