# AutoPan — Gestión de mantenimiento vehicular

Aplicación académica construida con HTML, CSS y JavaScript puro. No requiere servidor, frameworks, base de datos ni dependencias. Los datos de demostración y las solicitudes se almacenan en el `localStorage` del navegador actual.

## Cómo ejecutar

1. Clona o descarga este repositorio y abre la carpeta en Visual Studio Code.
2. Abre `index.html` directamente en un navegador.
3. Para probar los roles, inicia sesión con una cuenta de muestra:

   | Rol | Correo | Contraseña |
   | --- | --- | --- |
   | Administrador | `admin@autoPan.com` | `admin123` |
   | Usuario | `usuario@autoPan.com` | `usuario123` |

No hay que instalar paquetes. Para reiniciar los datos de muestra, borra las claves `autoPan_usuarios`, `autoPan_mantenimientos`, `autoPan_sesion` y `autoPan_historial` desde el almacenamiento local del navegador.

## Funciones

- **Inicio (`index.html`)**: presenta los servicios, beneficios y datos ficticios del taller.
- **Acceso y registro (`login.html`)**: inicia sesión o registra cuentas que reciben siempre el rol `usuario`. Los administradores no se registran desde el formulario público.
- **Solicitudes (`mantenimiento.html`)**: registra propietario, documento, vehículo, servicio, fecha y hora de revisión. Valida cédula de 10 dígitos, RUC de 13, pasaporte alfanumérico y teléfono celular de 10 dígitos.
- **Mis solicitudes (`mis-solicitudes.html`)**: muestra las solicitudes asociadas a la cuenta activa y su estado.
- **Administración (`admin.html`)**: permite buscar, filtrar, consultar, editar, desactivar, reactivar y eliminar solicitudes. El directorio permite editar y eliminar cuentas; las solicitudes históricas se conservan al eliminar una cuenta.

## Archivos

```text
index.html, login.html, mantenimiento.html, mis-solicitudes.html, admin.html
css/estilos.css
js/datos.js, js/autenticacion.js, js/mantenimiento.js, js/admin.js
img/taller-autoPan.svg
```

Los usuarios, mantenimientos e historial son arrays de objetos definidos y gestionados en `js/datos.js`. Las páginas guardan y recuperan estos arrays con `JSON.stringify()` y `JSON.parse()` usando `localStorage`. El almacenamiento es propio de cada navegador y equipo; no se sube a GitHub ni se comparte entre usuarios.

> **Aviso académico:** la autenticación y los roles son una simulación. Las contraseñas están en el código y el almacenamiento del navegador se puede modificar. No uses información real ni este proyecto como sistema seguro.
