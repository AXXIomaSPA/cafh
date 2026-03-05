# Guía Técnica de la Plataforma CAFH (Mapeo de Proyecto)

Este documento sirve como referencia rápida de la arquitectura, funciones clave y estructuras de datos del proyecto para agilizar el desarrollo y evitar análisis redundantes.

## 1. Capa de Datos y Almacenamiento (`storage.ts`)

La persistencia se maneja actualmente vía `localStorage` mediante el objeto global `db`.

### Módulos Principales:
- **`db.auth`**: Gestión de sesiones y roles.
  - `login(email, password)`: Retorna objeto `User` si es exitoso.
  - `register(name, email)`: Crea usuario y contacto CRM correspondiente.
  - `getCurrentUser()`: Recupera la sesión activa.
- **`db.crm`**: Base de datos de contactos.
  - `getAll()` / `getById(id)`: Recuperación de contactos.
  - `add(contact)` / `update(contact)`: Persistencia.
  - `addList(list)` / `updateList(list)`: Gestión de segmentos/listas.
- **`db.cms`**: Gestión de contenidos dinámicos.
  - `getPages()` / `getPageBySlug(slug)`: Rutas dinámicas.
  - `getHomeConfig()`: Configuración de la Landing Page.
- **`db.calendar` / `db.events`**: Gestión de actividades y calendario.

### Estructuras de Datos Clave (`types.ts`):
- **`User`**: `id`, `name`, `email`, `role` (ADMIN, MEMBER), `interests`.
- **`Contact` (CRM)**: `id`, `email`, `status`, `tags`, `listIds`.
- **`UserWizardProfile`**: Almacena el resultado del "Viaje de Autoconocimiento".
  - `userId`, `profileTypeId`, `derivedTags`, `completedAt`.

## 2. Flujos Críticos

### Registro y Onboarding ("El Viaje")
1. **Punto de Entrada**: `WizardModal` en `PublicViews.tsx`.
2. **Proceso**: Preguntas → Cálculo de Perfil → Registro/Login → Splash Screen → Dashboard.
3. **Persistencia**: `cafh_user_wizard_profiles_v1`.

### Unificación CRM - Usuarios
- Sincronización automática vía email. Los tags del Wizard se inyectan en el CRM.

## 3. Componentes de Interfaz Principales

### Dashboard del Miembro (`UserViews.tsx`)
- **`MemberDashboard`**: Recomendaciones basadas en `UserWizardProfile.derivedTags`.
- **`ZoomWidget`**: Acceso directo a reuniones activas de Zoom.

### Panel de Administración (`AdminViews.tsx` / `JourneyAndSettings.tsx` / `CalendarModule.tsx`)
- **`JourneyView`**: Configuración del Wizard.
- **`CalendarModule`**: Gestión integral de eventos.

## 4. Diseño y UX
- **Colores**: `cafh-indigo` (#1e2f6b), `cafh-cyan` (#6fcfeb), `cafh-peach` (#f7a281).
- **Z-Index**: Modales globales en `z-[60]`. Header en `z-30`.

---
*Ultima actualización: 2026-03-05*
