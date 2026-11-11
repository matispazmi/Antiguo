# Registro de fuentes y uso responsable de IA

Adjunta este registro a la actividad **AD01 — Fundamentos de Desarrollo Web** junto con el proyecto **AutoPan — Sistema de Gestión de Mantenimiento Vehicular**.

**Estudiante:** ______________________________________________

## Declaración de uso

- ☐ No utilicé herramientas de IA generativa.
- ☒ Utilicé IA generativa como apoyo. Registro las consultas relevantes y las fuentes revisadas en esta bitácora.

El uso de IA fue opcional. El estudiante debe revisar, modificar, probar y comprender el código antes de presentarlo, y poder explicar las decisiones técnicas. Esta bitácora no reemplaza esa revisión ni afirma que se hayan probado todos los casos de la rúbrica.

## Bitácora de consultas

Las consultas se agrupan por objetivo. Los fragmentos entre comillas conservan el texto literal de los mensajes relevantes; los mensajes extensos se transcriben completos cuando se muestran como prompt exacto.

### 1. Diseño del sistema y restricciones técnicas

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 9 de noviembre de 2026.  
**Propósito:** desarrollar la estructura inicial del sistema web académico, sus módulos, roles y almacenamiento local.

**Fragmento literal del prompt inicial:**

> # PROMPT: Sistema Web de Gestión de Mantenimiento Vehicular
>
> Actúa como un desarrollador web especializado en HTML5, CSS3 y JavaScript puro.
>
> Necesito que desarrolles un sistema web completo llamado **AutoCare — Sistema de Gestión de Mantenimiento Vehicular**, con una interfaz moderna, atractiva, responsiva y profesional.
>
> El proyecto debe funcionar abriendo `index.html` en el navegador.

**Síntesis de la respuesta:** se propuso y trabajó una aplicación multipágina para presentación, inicio de sesión, solicitudes de mantenimiento, consulta personal y administración.

**Qué se aprovechó:** la estructura de archivos HTML, CSS y JavaScript; los objetos de usuarios y mantenimientos; los roles de administrador y usuario; el CRUD; las validaciones y el uso de `localStorage`.

**Qué se descartó:** base de datos, backend, frameworks, dependencias de instalación y servicios externos, de acuerdo con las restricciones académicas.

### 2. Registro de cuentas de usuario

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 9 de noviembre de 2026.  
**Propósito:** permitir que un cliente cree su cuenta sin habilitar el registro público de administradores.

**Prompt exacto:**

> Al login puedes agregar para registrar usuarios, solo usuarios para mantenimiento de autos administradores no

**Síntesis de la respuesta:** se añadió un formulario de registro vinculado al acceso.

**Qué se aprovechó:** las cuentas creadas desde el formulario reciben siempre el rol `usuario`; el rol administrador no se ofrece en el registro público.

**Qué se descartó:** permitir que una persona se asigne a sí misma el rol de administrador.

### 3. Correcciones del formulario, validaciones y panel

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 9 de noviembre de 2026.  
**Propósito:** corregir el acceso a los datos guardados y completar campos y acciones solicitados para mantenimiento y administración.

**Prompt exacto:**

> en la capura se muestra que no se estan guardando los datos de nuevos usuarios, ni la solicituds que llenan, porfavor esa info debe estar al alzance
> pon una dropdranwlist que tenga como opciones numero de cedula, pasaporte, ruc si elije cedula o ruc solo puede escribir numeros, y sea solo de 10 digitos o 13 en el respectivo caso, en numeros de telefono valida que solo se pueda igresar numero de 13 digitos.
> falta un icono con un ojo para visualizar los campos de contraseña
> colocar un campo para la hora de revisión
> agrega en la tabla un icono para descativar esa solicitud de mantenimiento
> Y coloca en los modales un scroll azuito y una cabecera con la info de quien esta editando o viendo el admin esta cabecera de color azul, pon iconos en cada uno de ellos

**Síntesis de la respuesta:** se incorporaron identificación por tipo, controles para mostrar contraseña, hora de revisión, desactivación de solicitudes, y encabezados informativos en los modales.

**Qué se aprovechó:** los cambios de interfaz y las validaciones de cédula y RUC. Luego se ajustó la regla del teléfono según la aclaración posterior.

**Qué se descartó o corrigió:** la longitud inicial de 13 dígitos para el celular se reemplazó por la instrucción más reciente de exactamente 10 dígitos.

### 4. Ajuste del teléfono y administración de cuentas

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 9 de noviembre de 2026.  
**Propósito:** precisar la validación del teléfono celular y permitir que el administrador gestione cuentas.

**Prompt exacto:**

> En el campo de telefono celular solo quiero que valides diez digitos que sea ejmpelo: 0988618939
> El administrador igual puede eliminar o cambiar algo de las cuentas de usuario

**Síntesis de la respuesta:** se configuró la validación de diez dígitos para el celular y se añadieron acciones de edición, desactivación y eliminación al directorio de usuarios.

**Qué se aprovechó:** el número de ejemplo y la administración de cuentas desde el panel.

**Qué se descartó:** conservar el requisito anterior de trece dígitos para el teléfono.

### 5. Perfil, revisión de rúbrica y publicación del proyecto

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 9 de noviembre de 2026.  
**Propósito:** contrastar el proyecto con la rúbrica, crear perfil editable y completar el repositorio.

**Prompt exacto:**

> Verifica que todo lo que se pida en este documento este implementado en nuestro proyecto, agrega para que cada usuario pueda visualizar su perfil y pueda editar y actualizar sus datos, menos correo, ya tengo iniciado sesión en git haz lo que te pedí de subir al repositorio.

**Síntesis de la respuesta:** se añadió el perfil, se revisaron los módulos contra la consigna, y se documentaron bibliotecas y recursos del proyecto.

**Qué se aprovechó:** edición de nombre, documento, teléfono y contraseña; correo de solo lectura; documentación de uso y publicación del proyecto en el repositorio autorizado.

**Qué se descartó:** permitir que el usuario edite su correo de acceso desde el perfil.

### 6. Correcciones de datos, solicitudes y navegación

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 10 de noviembre de 2026.  
**Propósito:** corregir el uso de arrays, el rol inicial, la cancelación de solicitudes y la separación entre CRUD de usuarios y mantenimiento.

**Prompt exacto:**

> en el codigo facilitame la lectura con cada linea por una etiiqueta y con indentación
> porfavor cambia al principio siempre se inica como administrador, se esta guardando algo mal en el localstorege, que no diga el rol al usuario cuando ve su perfil, que el cliente pueda cancelar su solicitud de mantemimiento, no estas guardando las solicitudes de mantenimiento en los arrays, solo guarda en el localstorege y eso no lo quiero sino que se guarde la informacion en el array, te lo repito pq ya te dije que lo hicieras y de nuevo lo cambiaste,
> en el perfil de usuario en la barra de navegación sale administracion en vez de algo de acuerdo como mis solicitudes.
> en el formulario de hacer la solicitud de mantenimiento que traiga los datos que llenamos al registrarnos, no deberia pedir los campos nuevamente
> en admin para editar el manteniemito que no salgan campos de cedula y tipo de identificación, y que no pueda editar los datos del usuario en si, solo del mantenimiento, ya que los datos del usuario los puede modificar en el otro crud (tabla de usuarios)
> pon la tabla de crud de usuarios en otra pestaña en la barraa de navegación

**Síntesis de la respuesta:** se reorganizaron los archivos para facilitar su lectura; los arrays en memoria se usan como datos de trabajo y `localStorage` conserva una copia; los datos personales se cargan desde la cuenta; se incorporó cancelación de solicitudes pendientes y se separaron las pestañas de solicitudes y usuarios.

**Qué se aprovechó:** la separación de permisos y formularios: el usuario cancela solo sus solicitudes pendientes; el administrador edita los datos del mantenimiento; la información de la cuenta se administra en el CRUD de usuarios.

**Qué se descartó:** volver a pedir nombre, documento, correo y teléfono en cada solicitud; permitir al administrador cambiar datos personales desde el formulario de mantenimiento; mostrar administración en la navegación del cliente.

### 7. Actualización de esta bitácora

**Herramienta/modelo:** OpenAI Codex, asistente de programación (modelo GPT-6).  
**Fecha:** 10 de noviembre de 2026.  
**Propósito:** adaptar este archivo a la plantilla de registro y a la política institucional entregadas.

**Prompt exacto:**

> En registro de ia y recursos quiero que edites para que en base a las politicas e informacion de la plantilla que te voy a proporcionar

**Síntesis de la respuesta:** se reorganizó el registro con declaración, prompts literales, síntesis, decisiones aprovechadas/descartadas y dos grupos separados de fuentes.

**Qué se aprovechó:** los campos que pide la plantilla y las condiciones de autoría, comprensión, verificación bibliográfica y protección de datos descritas en la política.

**Qué se descartó:** se retiraron afirmaciones que no estaban respaldadas por la plantilla o por las fuentes abiertas durante esta revisión.

## Fuentes orientativas sugeridas por IA

Estas páginas se ofrecen como material introductorio. No se usan como respaldo bibliográfico final cuando existe una documentación primaria u oficial. Fueron abiertas para confirmar que corresponden a los temas indicados.

1. W3Schools, [Window localStorage Property](https://www.w3schools.com/jsref/prop_win_localstorage.asp) — explicación introductoria de `localStorage`.
2. W3Schools, [JavaScript Arrays](https://www.w3schools.com/js/js_arrays.asp) — introducción a arrays, índices y métodos.
3. freeCodeCamp, Benjamin Semah, [How to Use LocalStorage in JavaScript](https://www.freecodecamp.org/news/use-local-storage-in-modern-applications/) — tutorial de `localStorage`, `JSON.stringify()` y `JSON.parse()`.

## Bibliografía y referencias verificadas

Las páginas de esta sección se abrieron durante la actualización del registro. Antes de entregar el trabajo, el estudiante debe volver a abrir los enlaces y confirmar que respaldan las afirmaciones citadas en su informe.

1. **Bootstrap Team.** “Get started with Bootstrap,” documentación oficial, versión 5.3. Consultada el 10 de noviembre de 2026. https://getbootstrap.com/docs/5.3/getting-started/introduction/  
   **Uso en el proyecto:** referencia de las hojas de estilo, JavaScript y utilidades de interfaz de Bootstrap. Se incluyó localmente Bootstrap 5.3.8 en `vendor/bootstrap/`.

2. **Proyecto SweetAlert2.** “SweetAlert2 — beautiful, accessible JavaScript popup boxes,” documentación oficial. Consultada el 10 de noviembre de 2026. https://sweetalert2.github.io/  
   **Uso en el proyecto:** avisos y diálogos de confirmación para acciones administrativas. Se incluyó localmente SweetAlert2 11.26.25 en `vendor/sweetalert2/`.

3. **MDN Web Docs contributors.** “Web Storage API,” Mozilla. Consultada el 10 de noviembre de 2026. https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API  
   **Uso en el proyecto:** referencia para las interfaces `localStorage` y `Storage` utilizadas para guardar y recuperar datos por navegador y origen.

4. **MDN Web Docs contributors.** “Arrays — Learn web development,” Mozilla. Consultada el 10 de noviembre de 2026. https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Arrays  
   **Uso en el proyecto:** referencia para agregar y quitar elementos del array de mantenimientos y representar listas de objetos.

## Recursos incluidos en el proyecto

Bootstrap y SweetAlert2 están guardados en el repositorio con sus licencias en `vendor/`. El sistema no necesita instalación de paquetes ni conexión a Internet para usar esas bibliotecas. La ilustración del taller también es un archivo local (`img/taller-autoPan.svg`). No se llaman APIs externas.

Las referencias orientativas sugeridas no sustituyen las fuentes verificadas. No se inventaron autores, fechas, DOI ni enlaces. El estudiante debe completar su nombre, revisar el código y confirmar que puede explicarlo y demostrar su funcionamiento antes de la sustentación.

Para futuras consultas técnicas o de investigación con IA, pedir fuentes oficiales verificables, autor u organización, título, fecha y URL; solicitar que se declare cualquier incertidumbre; y abrir cada referencia antes de citarla.
