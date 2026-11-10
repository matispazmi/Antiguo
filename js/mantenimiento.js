"use strict";

function validarFormulario(formulario) {
  const datos = new FormData(formulario);
  const correo = String(datos.get("correo") || "").trim();
  const placa = String(datos.get("placa") || "").trim().toUpperCase();
  const tipoDocumento = String(datos.get("tipoDocumento") || "cedula");
  const documento = String(datos.get("cedula") || "").trim();
  const telefono = String(datos.get("telefono") || "").trim();
  const fecha = String(datos.get("fecha") || "");
  if (!formulario.reportValidity()) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) { mostrarNotificacion("Escribe un correo electrónico válido.", "error"); return false; }
  if (!validarIdentificacion(tipoDocumento, documento)) { mostrarNotificacion("El documento no coincide con el tipo seleccionado.", "error"); return false; }
  if (!/^\d{10}$/.test(telefono)) { mostrarNotificacion("El teléfono celular debe tener exactamente 10 dígitos.", "error"); return false; }
  if (!/^[A-Z0-9-]{5,10}$/.test(placa)) { mostrarNotificacion("La placa debe tener entre 5 y 10 letras, números o guiones.", "error"); return false; }
  if (Number(datos.get("anio")) < 1950 || Number(datos.get("anio")) > new Date().getFullYear() + 1) { mostrarNotificacion("Revisa el año de fabricación.", "error"); return false; }
  if (fecha < fechaLocalISO()) { mostrarNotificacion("La fecha solicitada no puede ser anterior a hoy.", "error"); return false; }
  return true;
}
function agregarMantenimiento(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const sesion = verificarSesion();
  if (!sesion || !validarFormulario(formulario)) return;
  const datos = new FormData(formulario);
  const usuarioId = sesion.rol === "admin" ? Number(datos.get("usuarioId")) : sesion.id;
  const usuario = usuarios.find(persona => persona.id === usuarioId && persona.activo !== false && persona.rol === "usuario");
  if (!usuario) { mostrarNotificacion("Selecciona una cuenta de cliente activa para esta solicitud.", "error"); return; }
  const mantenimiento = {
    id: generarId(), usuarioId,
    propietario: usuario.nombre,
    tipoDocumento: String(datos.get("tipoDocumento")), cedula: String(datos.get("cedula")).trim(), correo: usuario.correo,
    telefono: String(datos.get("telefono")).trim(),
    vehiculo: { marca: String(datos.get("marca")).trim(), modelo: String(datos.get("modelo")).trim(), anio: Number(datos.get("anio")), placa: String(datos.get("placa")).trim().toUpperCase(), kilometraje: Number(datos.get("kilometraje")) },
    tipoMantenimiento: String(datos.get("tipoMantenimiento")), fecha: String(datos.get("fecha")), horaRevision: String(datos.get("horaRevision")), jornada: String(datos.get("jornada")), confirmacion: datos.has("confirmacion"), descripcion: String(datos.get("descripcion")).trim(),
    observaciones: String(datos.get("observaciones") || "").trim(), estado: "Pendiente", activa: true, creado: new Date().toISOString()
  };
  const usuarioAnterior = { ...usuario };
  usuario.tipoDocumento = mantenimiento.tipoDocumento; usuario.cedula = mantenimiento.cedula; usuario.telefono = mantenimiento.telefono;
  if (!guardarUsuarios()) { Object.assign(usuario, usuarioAnterior); mostrarNotificacion("No se pudieron guardar los datos del cliente. Revisa el almacenamiento local.", "error"); return; }
  mantenimientos.push(mantenimiento);
  if (!guardarMantenimientos()) { mantenimientos.pop(); Object.assign(usuario, usuarioAnterior); guardarUsuarios(); mostrarNotificacion("No se pudo guardar la solicitud. Revisa el almacenamiento local e inténtalo de nuevo.", "error"); return; }
  guardarHistorial("creado", mantenimiento);
  formulario.reset(); rellenarDatosUsuario(); mostrarNotificacion(`Solicitud ${mantenimiento.id} registrada correctamente.`);
  const placa = formulario.querySelector('[name="placa"]'); if (placa) placa.value = "";
}
function rellenarDatosUsuario() {
  const sesion = obtenerSesion(); if (!sesion) return;
  const selectAdmin = document.querySelector("#usuario-solicitud");
  if (selectAdmin) selectAdmin.required = sesion.rol === "admin";
  let perfil = usuarios.find(persona => persona.id === sesion.id);
  if (sesion.rol === "admin" && selectAdmin) {
    const selector = document.querySelector("#selector-usuario-admin"); selector.hidden = false;
    const clientes = usuarios.filter(persona => persona.rol === "usuario" && persona.activo !== false);
    selectAdmin.innerHTML = '<option value="">Selecciona una cuenta de cliente</option>' + clientes.map(persona => `<option value="${escaparHTML(persona.id)}">${escaparHTML(persona.nombre)} · ${escaparHTML(persona.correo)}</option>`).join("");
    if (selectAdmin.dataset.configurado !== "true") {
      selectAdmin.addEventListener("change", () => { const seleccionado = usuarios.find(persona => String(persona.id) === selectAdmin.value); rellenarDatosPropietario(seleccionado); });
      selectAdmin.dataset.configurado = "true";
    }
    if (clientes.length) { selectAdmin.value = String(clientes[0].id); perfil = clientes[0]; }
  }
  rellenarDatosPropietario(perfil);
}
function rellenarDatosPropietario(perfil) {
  if (!perfil) return;
  const nombre = document.querySelector('[name="propietario"]'); const correo = document.querySelector('[name="correo"]');
  const tipoDocumento = document.querySelector('[name="tipoDocumento"]'); const cedula = document.querySelector('[name="cedula"]'); const telefono = document.querySelector('[name="telefono"]');
  if (nombre) { nombre.value = perfil.nombre; nombre.readOnly = true; }
  if (correo) { correo.value = perfil.correo; correo.readOnly = true; }
  if (tipoDocumento) { tipoDocumento.value = perfil.tipoDocumento || "cedula"; tipoDocumento.dispatchEvent(new Event("change")); }
  if (cedula) cedula.value = perfil.cedula || "";
  if (telefono) telefono.value = perfil.telefono || "";
}
function listarMantenimientos() {
  const sesion = verificarSesion(); if (!sesion) return;
  const cuerpo = document.querySelector("#mis-solicitudes"); if (!cuerpo) return;
  const propios = obtenerMantenimientos().filter(item => item.usuarioId === sesion.id);
  cuerpo.innerHTML = propios.length ? propios.map(item => {
    const estado = item.activa === false ? "Desactivada" : escaparHTML(item.estado);
    const claseEstado = item.activa === false ? "estado-inactiva" : `estado-${item.estado.toLowerCase().replaceAll(" ", "-")}`;
    return `<article class="solicitud-card"><div class="solicitud-top"><span class="id-tag">${escaparHTML(item.id)}</span><span class="estado ${claseEstado}">${estado}</span></div><h3>${escaparHTML(item.tipoMantenimiento)}</h3><p>${escaparHTML(item.vehiculo.marca)} ${escaparHTML(item.vehiculo.modelo)} · ${escaparHTML(item.vehiculo.placa)}</p><div class="solicitud-meta"><span>📅 ${escaparHTML(item.fecha)} · ◷ ${escaparHTML(item.horaRevision || "—")}</span><span>🛠 ${Number(item.vehiculo.kilometraje).toLocaleString("es-EC")} km</span></div><p class="muted">${escaparHTML(item.descripcion)}</p></article>`;
  }).join("") : '<div class="vacio"><span>🔧</span><h3>Aún no tienes solicitudes</h3><p>Registra tu primer mantenimiento y aquí podrás seguir su estado.</p><a class="boton boton-primario" href="mantenimiento.html">Solicitar mantenimiento</a></div>';
}
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("#form-mantenimiento");
  if (formulario) { if (!verificarSesion()) return; formulario.addEventListener("submit", agregarMantenimiento); prepararValidacionDocumento(formulario.querySelector('[name="tipoDocumento"]'), formulario.querySelector('[name="cedula"]')); prepararCampoNumerico(formulario.querySelector('[name="telefono"]'), 10); const fecha = formulario.querySelector('[name="fecha"]'); if (fecha) fecha.min = fechaLocalISO(); const anio = formulario.querySelector('[name="anio"]'); if (anio) anio.max = String(new Date().getFullYear() + 1); rellenarDatosUsuario(); }
  listarMantenimientos();
});
