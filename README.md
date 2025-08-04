# ESAN Horarios

Aplicación web interactiva para la gestión y creación de horarios académicos de la Universidad ESAN, desarrollada con Next.js y HeroUI.

## Características

### Gestión de Cursos
- **Cursos predefinidos** para Ingeniería de Software e Ingeniería de Sistemas
- **10 ciclos académicos** completamente configurados
- **Sistema de créditos** automático para cada curso
- **Especialidades diferenciadas** con badges visuales distintivos

### Personalización Visual
- **7 paletas de colores** temáticas diferentes
- **Interfaz drag & drop** intuitiva para organizar horarios
- **Detección automática de conflictos** de horarios
- **Cálculo de créditos totales** en tiempo real

### Procesamiento de Archivos
- **Importación de archivos Excel** con horarios disponibles
- **Mapeo automático** de nombres de cursos
- **Validación de formatos** y manejo de errores

### Funciones de Compartir
- **Exportación a imagen** del horario creado
- **Función de compartir** integrada
- **Múltiples métodos de exportación** con fallbacks

## Inicio Rápido

### Prerrequisitos
- Node.js 18.17 o superior
- npm, yarn, pnpm o bun

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/PaoloESAN/esanhorarios.git
cd esanhorarios
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Tecnologías Utilizadas

- **[Next.js 15](https://nextjs.org/)** - Framework de React con App Router
- **[React 19](https://react.dev/)** - Biblioteca de interfaz de usuario
- **[HeroUI](https://heroui.com/)** - Biblioteca de componentes UI moderna
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework de CSS utility-first
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animaciones
- **[XLSX](https://sheetjs.com/)** - Procesamiento de archivos Excel
- **[dom-to-image](https://github.com/tsayen/dom-to-image)** - Exportación de DOM a imagen

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.js              # Componente principal de la aplicación
│   ├── layout.js            # Layout base de Next.js
│   └── globals.css          # Estilos globales
└── components/
    ├── diaMatricula.jsx     # Componente día de matrícula
    ├── ModalAgregarCurso.jsx # Modal para agregar cursos
    ├── paletasColores.js    # Paletas de colores disponibles
    ├── datosCursos.js       # Datos de cursos por ciclo
    ├── datosCreditos.js     # Sistema de créditos
    ├── procesadorExcel.js   # Procesamiento de archivos Excel
    ├── utilidadesHorario.js # Utilidades para horarios
    ├── utilidadesCompartir.js # Funciones para compartir
    └── modales.jsx          # Componentes de modales
```

## Cómo Usar

1. **Importa el archivo Excel** con horarios disponibles
2. **Selecciona tu ciclo académico** desde el menú desplegable
3. **Arrastra o selecciona tus cursos** desde la lista hacia los slots de horario
4. **Personaliza colores** seleccionando diferentes paletas
5. **Comparte tu horario** exportándolo como imagen

## Comandos Disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo con Turbopack
npm run build    # Construye la aplicación para producción
npm run start    # Inicia el servidor de producción
npm run lint     # Ejecuta el linter de ESLint
```

## Paletas de Colores

La aplicación incluye 7 paletas temáticas:
- **Default**: Colores vibrantes y modernos
- **Pastel**: Tonos suaves y relajantes
- **Vibrante**: Tonos vibrantes y llamativos
- **Monocromatico**: Tema gris elegante
- **Neón**: Colores brillantes y llamativos
- **Otoño**: Colores cálidos y otoñales
- **Océano**: Azules y verdes marinos

## Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Autor

**Paolo** - [PaoloESAN](https://github.com/PaoloESAN)

---
