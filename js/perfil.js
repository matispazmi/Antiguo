"use strict";

function cargarPerfil() {
  const sesion = verificarSesion();
  if (!sesion) return null;
  const usuario = usuarios.find(persona => persona.id === sesion.id);
  if (!usuario) { cerrarSesion(); return null; }
  document.querySelector("#perfil-nombre").value = usuario.nombre;
  document.querySelector("#perfil-nombre-resumen").textContent = usuario.nombre;
  document.querySelector("#perfil-correo").value = usuario.correo;
  document.querySelector("#perfil-rol").value = usuario.rol === "admin" ? "Administrador" : "Usuario";
  document.querySelector("#perfil-rol-resumen").textContent = usuario.rol === "admin" ? "Administrador AutoPan" : "Cliente AutoPan";
  document.querySelector("#perfil-tipo-documento").value = usuario.tipoDocumento || "cedula";
  document.querySelector("#perfil-documento").value = usuario.cedula || "";
  document.querySelector("#perfil-telefono").value = usuario.telefono || "";
  prepararValidacionDocumento(document.querySelector("#perfil-tipo-documento"), document.querySelector("#perfil-documento"));
  prepararCampoNumerico(document.querySelector("#perfil-telefono"), 10);
  return usuario;
}
function actualizarPerfil(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  if (!formulario.reportValidity()) return;
  const sesion = obtenerSesion();
  const usuario = usuarios.find(persona => persona.id === sesion?.id);
  if (!usuario) { window.location.href = "login.html?aviso=cuenta"; return; }
  const datos = new FormData(formulario);
  const tipoDocumento = String(datos.get("tipoDocumento"));
  const documento = String(datos.get("cedula")).trim().toUpperCase();
  const telefono = String(datos.get("telefono")).trim();
  const password = String(datos.get("password") || "");
  const confirmarPassword = String(datos.get("confirmarPassword") || "");
  if (!validarIdentificacion(tipoDocumento, documento)) { mostrarNotificacion("El documento no coincide con el tipo seleccionado.", "error"); return; }
  if (!/^\d{10}$/.test(telefono)) { mostrarNotificacion("El teléfono celular debe tener exactamente 10 dígitos.", "error"); return; }
  if (password && password.length < 8) { mostrarNotificacion("La nueva contraseña debe tener al menos 8 caracteres.", "error"); return; }
  if (password !== confirmarPassword) { mostrarNotificacion("Las contraseñas nuevas no coinciden.", "error"); return; }

  const usuarioAnterior = { ...usuario };
  usuario.nombre = String(datos.get("nombre")).trim();
  usuario.tipoDocumento = tipoDocumento;
  usuario.cedula = documento;
  usuario.telefono = telefono;
  if (password) usuario.password = password;
  if (!guardarUsuarios()) { Object.assign(usuario, usuarioAnterior); mostrarNotificacion("No se pudo guardar tu perfil en el navegador.", "error"); return; }

  const mantenimientosAnteriores = mantenimientos;
  mantenimientos = mantenimientos.map(item => item.usuarioId === usuario.id ? { ...item, propietario: usuario.nombre, tipoDocumento, cedula: documento, telefono } : item);
  if (!guardarMantenimientos()) {
    Object.assign(usuario, usuarioAnterior); guardarUsuarios(); mantenimientos = mantenimientosAnteriores;
    mostrarNotificacion("No se pudieron actualizar las solicitudes asociadas a tu perfil.", "error"); return;
  }
  const sesionActualizada = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
  if (!escribirJSON(CONFIGURACION.claves.sesion, sesionActualizada)) { mostrarNotificacion("Perfil guardado, pero no se pudo actualizar la sesión local.", "error"); return; }
  guardarHistorial("perfil_actualizado", { id: usuario.id });
  formulario.elements.password.value = ""; formulario.elements.confirmarPassword.value = "";
  document.querySelector("#perfil-nombre-resumen").textContent = usuario.nombre;
  mostrarNotificacion("Tu perfil se actualizó correctamente.");
}
document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("#form-perfil")) return;
  cargarPerfil();
  document.querySelector("#form-perfil").addEventListener("submit", actualizarPerfil);
});
