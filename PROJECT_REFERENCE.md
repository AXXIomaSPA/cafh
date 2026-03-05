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
- **`User`**: `id`, `name`, `email`, `role` (ADMIN, MEMBER), `interests`, `status` ('Active' | 'Pending' | 'Blocked').
- **`Contact` (CRM)**: `id`, `email`, `status` ('Subscribed' | 'Pending' | ...), `tags`, `listIds`.
- **`UserWizardProfile`**: Almacena el resultado del "Viaje de Autoconocimiento".
  - `userId`, `profileTypeId`, `profileTypeName`, `derivedTags`, `wizardAnswers` (incluye `registered_email`).

## 2. Flujos Críticos

### Registro y Onboarding ("El Viaje")
1. **Punto de Entrada**: `WizardModal` en `PublicViews.tsx`.
2. **Proceso**: Preguntas → Cálculo de Perfil → Registro/Login → Splash Screen → Dashboard.
3. **Persistencia**: `cafh_user_wizard_profiles_v1`.

### 3. Flujo de Unificación CRM y Usuarios
- **Registro vía Wizard**: Crea usuario en sesión, lo añade a `cafh_users_v1` y crea/actualiza contacto en CRM.
- **Relación**: Los perfiles del viaje se guardan vinculados al `userId`. Se ha implementado un **Match Resiliente** por ID o Email en `UserViews.tsx` para asegurar que el perfil se recupere incluso si hay inconsistencias en los IDs de sesión.
- **Validación**: Las cuentas nuevas (`MEMBER`) nacen con `status: 'Pending'` tanto en la sesión como en el CRM, requiriendo validación administrativa.
- **Lógica de Perfilado (`isProfiled`)**: Un usuario se considera perfilado si tiene un `UserWizardProfile` **o** si ya posee intereses definidos en su cuenta (caso de usuarios migrados como "miembro").
- **Contenidos Dinámicos**: La biblioteca solo muestra recomendaciones si `isProfiled` es verdadero. De lo contrario, muestra: *"No hay contenidos hasta que realices tu viaje"*.
- **`ZoomWidget`**: Acceso directo a reuniones activas de Zoom, integrado en el Dashboard.

### Panel de Administración (`AdminViews.tsx` / `JourneyAndSettings.tsx` / `CalendarModule.tsx`)
- **`JourneyView`**: Configuración del Wizard.
- **`CalendarModule`**: Gestión integral de eventos.

## 4. Diseño y UX
- **Colores**: `cafh-indigo` (#1e2f6b), `cafh-cyan` (#6fcfeb), `cafh-peach` (#f7a281).
- **Z-Index**: Modales globales en `z-[60]`. Header en `z-30`.

---
*Ultima actualización: 2026-03-05 (Refactorización Onboarding y Perfiles)*
