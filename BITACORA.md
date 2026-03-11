# Bitácora de Proyecto - CAFH Digital Transformation

## 2026-03-08: Integración Modular de Bloque "Sedes Cafh"

### Objetivo
Hacer que el bloque de "Sedes Cafh" (Locations) sea un componente modular disponible en el gestor de páginas internas del CMS, permitiendo su uso en cualquier parte del sitio (Home e Internas) con opciones de configuración flexibles.

### Implementaciones Realizadas

#### 1. CMS / Admin (`AdminViews.tsx`)
- **Registro del Bloque**: Se añadió el tipo `'Locations'` a la función `addSection` del `PageEditor`.
- **Configuración por Defecto**: Título "Sedes Globales", subtítulo "Encuentra tu Sede de Cafh", `displayMode: 'full'` y `autoPlay: false`.
- **Selector de Secciones**: Se agregó un nuevo botón con el icono `MapPin` en el selector de secciones dinámicas para que el usuario pueda añadir este bloque a cualquier página.
- **Controles de Edición**:
    - Selector de **Modo de Visualización**:
        - `full`: País, Lugar y Sedes.
        - `place-branches`: Lugar y Sedes.
        - `only-branches`: Solo Sedes.
    - Checkbox de **Reproducción Automática** (Autoplay) para el carrusel.
    - Banner informativo aclarando que los datos se sincronizan automáticamente con el **Gestor de Sedes** global.
- **UI de Listado**: Se actualizó el listado de secciones en el editor para mostrar el icono correcto y el nombre descriptivo ("Sedes Globales") para este tipo de bloque.
- **Acceso Directo a Página**: Se integró un botón de "Ver Página" en la barra de herramientas del editor de páginas internas. Este enlace es dinámico (`window.location.origin`), lo que garantiza su funcionamiento tras la migración a Cpanel/Node.js, permitiendo la revisión permanente del contenido en vivo.
- **Corrección de Enlaces (HashRouter)**: Se ajustaron todos los enlaces de previsualización en el Admin (Editor de Página, Listado de Páginas y Enlaces de Sistema) para ser compatibles con el `HashRouter` actual (`#/p/slug`). Esto soluciona el problema de los enlaces que no funcionaban desde el panel de administración.

#### 2. Public Frontend (`PublicViews.tsx`)
- **Renderizado Dinámico**: Se actualizó el `SectionRenderer` para manejar el caso `'Locations'`, llamando al componente `DynamicLocationsBlock`.
- **Componente `DynamicLocationsBlock`**:
    - Soporta los nuevos modos de visualización (`displayMode`).
    - Implementa la lógica de `autoPlay` basada en la configuración del bloque.
    - Sincroniza datos en tiempo real desde `db.locations`.

### Notas Técnicas
- **Mobile First**: El bloque mantiene su diseño responsivo y optimizado para móviles.
- **Integridad estructural**: Se respetó la arquitectura modular del CMS para asegurar que el bloque sea reutilizable sin romper secciones existentes.
- **Backup**: Se ha recordado la necesidad de realizar respaldos periódicos del motor JSON (`external_db.json`).

---
*Próximos pasos:*
- Pruebas de visualización en diferentes dispositivos.
- Verificación de la sincronización de contactos (email, whatsapp, website) en el modal de detalle.
