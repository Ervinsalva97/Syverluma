# System Design Specification - Syverluma Matriz UI

Documentación oficial del sistema de diseño frontend de **Syverluma**, generada mediante `stitch-design`.

---

## 1. Paleta de Colores (Color Palette)

### Fondos Oscuros (Dark Backgrounds)
- **Fondo Base Aplicación**: `bg-slate-950` (`#020617`) - Capa principal del viewport.
- **Contenedores y Cabeceras**: `bg-slate-900/90`, `bg-slate-900/80` (`#0f172a`) - Fondos de tarjetas, paneles y navegación flotante con desenfoque de cristal.
- **Superficies Secundarias y Controles**: `bg-slate-800`, `bg-gray-800` (`#1e293b`) - Inputs, botones neutros y modales.

### Tipografía y Jerarquía Visual
- **Títulos y Valores Destacados**: `text-white` (`#ffffff`) - Encabezados $H1/H2$, números de métricas y marcas.
- **Texto Principal**: `text-slate-100`, `text-slate-200` (`#f1f5f9`) - Contenido del cuerpo y opciones de menús.
- **Texto Secundario y Descripciones**: `text-slate-400`, `text-slate-500` (`#94a3b8`) - Etiquetas de métricas, subtítulos e instrucciones.

### Acentos de Marca y Estado (Cyan, Turquesa, Azul y Esmeralda)
- **Gradiente de Marca Syverluma**: `from-blue-600 to-emerald-400` y `from-blue-400 via-teal-300 to-emerald-400` - Logotipos, insignias de la matriz y títulos principales.
- **Acento Primario (Azul/Cyan)**: `text-blue-400`, `bg-blue-950`, `border-blue-800/50` - Enlaces activos, foco y selecciones.
- **Indicadores de Estado Activo (Esmeralda/Turquesa)**: `text-emerald-400`, `bg-emerald-950/60`, `border-emerald-800/50` - Badges de sesión activa y tendencias de crecimiento positivo.
- **Acciones Destructivas / Alertas**: `bg-red-600/80`, `text-red-400` - Botón de cierre de sesión y estados de error.

---

## 2. Layout, Espaciado, Bordes y Sombras

### Bordes Redondeados (Border Radius)
- **Tarjetas Principales y Paneles**: `rounded-2xl` (`1rem / 16px`) - Usado en tarjetas de métricas y contenedores de dashboard.
- **Botones e Inputs**: `rounded-xl` (`0.75rem / 12px`) - Usado en controles interactivos y cuadros de diálogo.
- **Insignias e Indicadores**: `rounded-full` / `rounded-md` - Badges de categoría y puntos pulsantes de estado.

### Cristal y Bordes (Glassmorphism & Borders)
- **Delimitadores de Contraste**: `border border-slate-800` y `border-slate-700` - Definición clara sobre superficies oscuras.
- **Efecto Traslúcido**: `backdrop-blur-md` - Usado en cabeceras pegajosas y tarjetas de métricas.

### Sombras y Resplandores (Shadows & Glows)
- **Elevación de Tarjetas**: `shadow-xl` y `shadow-2xl`.
- **Resplandor Neón**: `shadow-lg shadow-blue-500/20` - Aplicado a íconos de marca para efecto Cyberpunk.

---

## 3. Estructura Estándar de Tarjetas de Métricas

Patrón de componente reutilizable para la visualización de datos en el dashboard:

```tsx
<div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
  {/* 1. Etiqueta de la Métrica */}
  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
    Ventas Totales
  </span>

  {/* 2. Valor Numérico Principal */}
  <p className="text-3xl font-extrabold text-white">
    S/ 24,850.00
  </p>

  {/* 3. Indicador de Tendencia / Subtexto */}
  <span className="inline-block text-xs text-emerald-400 font-medium">
    +12% este mes
  </span>
</div>
```