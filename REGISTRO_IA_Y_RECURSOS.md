# Registro de fuentes y uso responsable de IA

Adjunta este registro a la actividad **AD01 — Fundamentos de Desarrollo Web** junto con **AutoPan — Sistema de Gestión de Mantenimiento Vehicular**.

**Estudiante:** ______________________________________________

## Declaración de uso

- ☐ No utilicé herramientas de IA generativa.
- ☒ Utilicé IA generativa como apoyo. El estudiante conserva la responsabilidad de revisar, probar, comprender y sustentar el proyecto.

## Resumen del apoyo

**Herramienta/modelo:** OpenAI Codex, asistente de programación basado en GPT-6.  
**Fechas:** 9 y 10 de noviembre de 2026.  
**Objetivo:** apoyar el desarrollo académico de AutoPan, principalmente en presentación visual y estilos con CSS/Bootstrap, y también en la implementación y ajuste de JavaScript para las funciones solicitadas.

El estudiante definió los requisitos y pidió cambios durante el desarrollo. La asistencia incluyó maquetación y estilos, además de código JavaScript para registro e inicio de sesión, validaciones, perfiles, arrays de usuarios y mantenimientos, persistencia con `localStorage`, solicitudes y CRUD administrativo. Por eso, el alcance de JavaScript se registra junto con el apoyo visual y no como una intervención exclusivamente de estilos.

### Fragmento literal representativo del prompt inicial

> Actúa como un desarrollador web especializado en HTML5, CSS3 y JavaScript puro.
>
> Necesito que desarrolles un sistema web completo llamado **AutoCare — Sistema de Gestión de Mantenimiento Vehicular**, con una interfaz moderna, atractiva, responsiva y profesional.

### Prompt sintetizado para describir el tipo de apoyo

Este texto es una **síntesis redactada para esta bitácora**, no una transcripción literal de una consulta histórica:

> Estoy desarrollando AutoPan para AD01. Ayúdame como apoyo académico, principalmente con la presentación visual y los estilos usando CSS y Bootstrap local. También explícame y ayúdame con el JavaScript necesario para formularios, validaciones, arrays, `localStorage`, autenticación y CRUD. Respeta las restricciones del proyecto, sugiere documentación oficial verificable cuando corresponda y declara cualquier incertidumbre. Yo revisaré, probaré y explicaré el código antes de presentarlo.

**Síntesis de las respuestas:** se propusieron e implementaron cambios en la interfaz y en el comportamiento del sistema según los requisitos que el estudiante fue definiendo.

**Qué se aprovechó:** estilos responsivos y componentes locales de Bootstrap; explicaciones y ajustes de JavaScript para formularios, validaciones, almacenamiento y permisos.

**Qué se descartó:** el uso de backend, bases de datos, frameworks, APIs externas y paquetes que requirieran instalación, porque no corresponden a las restricciones de la actividad. Las páginas informales de la sección siguiente no se usan como citas finales.

## Fuentes orientativas sugeridas por IA

Material introductorio consultado durante la preparación de este registro. Se diferencia de la bibliografía oficial y no se usa como respaldo final cuando hay documentación primaria.

1. W3Schools, [Window localStorage Property](https://www.w3schools.com/jsref/prop_win_localstorage.asp) — introducción a `localStorage`.
2. W3Schools, [JavaScript Arrays](https://www.w3schools.com/js/js_arrays.asp) — introducción a arrays y sus métodos.
3. freeCodeCamp, Benjamin Semah, [How to Use LocalStorage in JavaScript](https://www.freecodecamp.org/news/use-local-storage-in-modern-applications/) — tutorial de `localStorage`, `JSON.stringify()` y `JSON.parse()`.

## Bibliografía y referencias verificadas

Las páginas de esta sección se abrieron durante la actualización del registro. Antes de entregar el trabajo, el estudiante debe volver a abrir los enlaces y confirmar que respaldan las afirmaciones citadas en su informe.

1. **Bootstrap Team.** “Get started with Bootstrap,” documentación oficial, versión 5.3. Consultada el 10 de noviembre de 2026. https://getbootstrap.com/docs/5.3/getting-started/introduction/  
   **Uso en el proyecto:** referencia de hojas de estilo, JavaScript y utilidades de interfaz. Se incluyó localmente Bootstrap 5.3.8 en `vendor/bootstrap/`.

2. **Proyecto SweetAlert2.** “SweetAlert2 — beautiful, accessible JavaScript popup boxes,” documentación oficial. Consultada el 10 de noviembre de 2026. https://sweetalert2.github.io/  
   **Uso en el proyecto:** referencia para avisos y confirmaciones antes de acciones administrativas. Se incluyó localmente SweetAlert2 11.26.25 en `vendor/sweetalert2/`.

3. **Mozilla MDN Web Docs.** “Web Storage API.” Consultada el 10 de noviembre de 2026. https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API  
   **Uso en el proyecto:** referencia de `localStorage` y `Storage` para guardar y recuperar información por navegador y origen.

4. **Mozilla MDN Web Docs.** “Arrays — Learn web development.” Consultada el 10 de noviembre de 2026. https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays  
   **Uso en el proyecto:** referencia para agregar, consultar y quitar elementos en arrays de objetos.

## Recursos incluidos en el proyecto

Bootstrap y SweetAlert2 se guardan localmente en `vendor/` con sus archivos de licencia. La aplicación no requiere instalar paquetes ni conectarse a Internet para cargar esas bibliotecas. La ilustración del taller también es local (`img/taller-autoPan.svg`); el proyecto no llama APIs externas.

Para futuras consultas técnicas o de investigación con IA, solicitar fuentes oficiales verificables, autor u organización, título, fecha y URL; pedir que se declare cualquier incertidumbre; y abrir las referencias antes de citarlas. El estudiante debe completar su nombre y confirmar que puede explicar y demostrar el funcionamiento del código.
