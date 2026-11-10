"use strict";

function obtenerSesion() { return leerJSON(CONFIGURACION.claves.sesion, null); }
function verificarSesion(rolRequerido) {
  const sesion = obtenerSesion();
  if (!sesion) { window.location.href = "login.html?aviso=sesion"; return null; }
  const cuentaActiva = obtenerUsuarios().find(usuario => usuario.id === sesion.id && usuario.rol === sesion.rol && usuario.activo !== false);
  if (!cuentaActiva) {
    localStorage.removeItem(CONFIGURACION.claves.sesion);
    window.location.href = "login.html?aviso=cuenta";
    return null;
  }
  if (rolRequerido && sesion.rol !== rolRequerido) {
    window.location.href = sesion.rol === "admin" ? "admin.html" : "mis-solicitudes.html";
    return null;
  }
  return sesion;
}
function iniciarSesion(evento) {
  evento.preventDefault();
  const correo = document.querySelector("#correo").value.trim().toLowerCase();
  const password = document.querySelector("#password").value;
  const cuenta = usuarios.find(persona => persona.correo.toLowerCase() === correo);
  const error = document.querySelector("#error-login");
  if (!cuenta || cuenta.password !== password) { error.textContent = "El correo o la contraseña no son correctos."; error.hidden = false; return; }
  if (cuenta.activo === false) { error.textContent = "Esta cuenta está deshabilitada. Contacta al administrador."; error.hidden = false; return; }
  const usuario = cuenta;
  const sesion = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
  if (!escribirJSON(CONFIGURACION.claves.sesion, sesion)) { error.textContent = "No se pudo iniciar sesión porque el navegador bloqueó el almacenamiento local."; error.hidden = false; return; }
  window.location.href = usuario.rol === "admin" ? "admin.html" : "mis-solicitudes.html";
}
function registrarUsuario(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  if (!formulario.reportValidity()) return;
  const nombre = formulario.querySelector("#registro-nombre").value.trim();
  const correo = formulario.querySelector("#registro-correo").value.trim().toLowerCase();
  const password = formulario.querySelector("#registro-password").value;
  const confirmar = formulario.querySelector("#registro-confirmar").value;
  const tipoDocumento = formulario.querySelector("#registro-tipo-documento").value;
  const cedula = formulario.querySelector("#registro-cedula").value.trim();
  const telefono = formulario.querySelector("#registro-telefono").value.trim();
  const error = document.querySelector("#error-registro");
  if (usuarios.some(persona => persona.correo.toLowerCase() === correo)) {
    error.textContent = "Ya existe una cuenta con ese correo."; error.hidden = false; return;
  }
  if (password.length < 8) {
    error.textContent = "La contraseña debe tener al menos 8 caracteres."; error.hidden = false; return;
  }
  if (password !== confirmar) {
    error.textContent = "Las contraseñas no coinciden."; error.hidden = false; return;
  }
  if (!validarIdentificacion(tipoDocumento, cedula)) { error.textContent = "El documento no coincide con el tipo seleccionado."; error.hidden = false; return; }
  if (!/^\d{10}$/.test(telefono)) { error.textContent = "El teléfono celular debe tener exactamente 10 dígitos."; error.hidden = false; return; }
  const nuevoUsuario = { id: Date.now(), nombre, correo, password, rol: "usuario", tipoDocumento, cedula, telefono, activo: true };
  usuarios.push(nuevoUsuario);
  if (!guardarUsuarios()) {
    usuarios.pop(); error.textContent = "No se pudo guardar la cuenta. Revisa que el almacenamiento del navegador esté habilitado."; error.hidden = false; return;
  }
  // La sesión guarda solo datos básicos; el rol de registro está fijado a usuario.
  if (!escribirJSON(CONFIGURACION.claves.sesion, { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, correo: nuevoUsuario.correo, rol: "usuario" })) {
    mostrarFormularioRegistro(false);
    const errorAcceso = document.querySelector("#error-login");
    errorAcceso.textContent = "La cuenta quedó guardada, pero el navegador no permitió iniciar sesión automáticamente. Ingresa con tus datos."; errorAcceso.hidden = false;
    document.querySelector("#correo").value = nuevoUsuario.correo; return;
  }
  window.location.href = "mantenimiento.html";
}
function mostrarFormularioRegistro(mostrar) {
  const panelAcceso = document.querySelector("#panel-acceso");
  const panelRegistro = document.querySelector("#panel-registro");
  if (!panelAcceso || !panelRegistro) return;
  panelAcceso.hidden = mostrar;
  panelRegistro.hidden = !mostrar;
}
function cerrarSesion() {
  localStorage.removeItem(CONFIGURACION.claves.sesion);
  window.location.href = "index.html";
}
function actualizarNavegacion() {
  const sesion = obtenerSesion();
  document.querySelectorAll("[data-sesion]").forEach(elemento => elemento.hidden = !sesion);
  document.querySelectorAll("[data-sin-sesion]").forEach(elemento => elemento.hidden = Boolean(sesion));
  const nombre = document.querySelector("[data-nombre-usuario]");
  if (nombre && sesion) nombre.textContent = sesion.nombre;
  document.querySelectorAll("[data-cerrar-sesion]").forEach(boton => boton.addEventListener("click", cerrarSesion));
}
document.addEventListener("DOMContentLoaded", () => {
  actualizarNavegacion();
  const formulario = document.querySelector("#form-login");
  if (formulario) formulario.addEventListener("submit", iniciarSesion);
  const formularioRegistro = document.querySelector("#form-registro");
  if (formularioRegistro) {
    formularioRegistro.addEventListener("submit", registrarUsuario);
    prepararValidacionDocumento(formularioRegistro.querySelector("#registro-tipo-documento"), formularioRegistro.querySelector("#registro-cedula"));
    prepararCampoNumerico(formularioRegistro.querySelector("#registro-telefono"), 10);
  }
  document.querySelectorAll("[data-mostrar-registro]").forEach(enlace => enlace.addEventListener("click", evento => { evento.preventDefault(); mostrarFormularioRegistro(true); }));
  document.querySelectorAll("[data-mostrar-login]").forEach(enlace => enlace.addEventListener("click", evento => { evento.preventDefault(); mostrarFormularioRegistro(false); }));
  document.querySelectorAll("[data-toggle-password]").forEach(boton => boton.addEventListener("click", () => {
    const campo = document.getElementById(boton.dataset.togglePassword);
    if (!campo) return;
    const visible = campo.type === "password";
    campo.type = visible ? "text" : "password";
    boton.textContent = visible ? "◉" : "◎";
    boton.setAttribute("aria-label", visible ? "Ocultar contraseña" : "Mostrar contraseña");
    boton.setAttribute("aria-pressed", String(visible));
  }));
  const params = new URLSearchParams(window.location.search);
  if (params.has("aviso")) { const error = document.querySelector("#error-login"); if (error) { error.textContent = params.get("aviso") === "cuenta" ? "Esta cuenta fue eliminada por el administrador. Contacta al taller si necesitas acceso." : "Inicia sesión para continuar."; error.hidden = false; } }
});
