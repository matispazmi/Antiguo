"use strict";

function buscarMantenimiento(texto, estado) {
  const consulta = texto.trim().toLowerCase();
  return obtenerMantenimientos().filter(item => {
    const coincideTexto = !consulta || item.propietario.toLowerCase().includes(consulta) || item.vehiculo.placa.toLowerCase().includes(consulta);
    const coincideEstado = estado === "Desactivada" ? item.activa === false : !estado || estado === "Todos" || (item.activa !== false && item.estado === estado);
    return coincideTexto && coincideEstado;
  });
}
function actualizarIndicadores(lista) {
  const activas = lista.filter(item => item.activa !== false);
  document.querySelector("#total-registros").textContent = lista.length;
  document.querySelector("#total-pendientes").textContent = activas.filter(item => item.estado === "Pendiente").length;
  document.querySelector("#total-proceso").textContent = activas.filter(item => item.estado === "En proceso").length;
  document.querySelector("#total-finalizados").textContent = activas.filter(item => item.estado === "Finalizado").length;
}
function renderizarTabla() {
  const busqueda = document.querySelector("#busqueda")?.value || "";
  const estado = document.querySelector("#filtro-estado")?.value || "Todos";
  const todas = obtenerMantenimientos();
  const lista = buscarMantenimiento(busqueda, estado);
  actualizarIndicadores(todas);
  const cuerpo = document.querySelector("#tabla-mantenimientos");
  cuerpo.innerHTML = lista.length ? lista.map(item => {
    const activa = item.activa !== false;
    const estadoTexto = activa ? item.estado : "Desactivada";
    return `<tr class="${activa ? "" : "fila-desactivada"}"><td><span class="id-tag">${escaparHTML(item.id)}</span></td><td><strong>👤 ${escaparHTML(item.propietario)}</strong><small>${escaparHTML(item.correo)}</small></td><td>🔖 ${escaparHTML(item.vehiculo.placa)}</td><td>🚘 ${escaparHTML(item.vehiculo.marca)} ${escaparHTML(item.vehiculo.modelo)}</td><td>🛠 ${escaparHTML(item.tipoMantenimiento)}</td><td>📅 ${escaparHTML(item.fecha)}</td><td>◷ ${escaparHTML(item.horaRevision || "—")}</td><td><span class="estado ${activa ? `estado-${item.estado.toLowerCase().replaceAll(" ", "-")}` : "estado-inactiva"}">${estadoTexto}</span></td><td><div class="acciones"><button class="icono-boton" data-accion="ver" data-id="${escaparHTML(item.id)}" aria-label="Ver solicitud" title="Ver solicitud">👁</button><button class="icono-boton" data-accion="editar" data-id="${escaparHTML(item.id)}" aria-label="Editar solicitud" title="Editar solicitud">✎</button><button class="icono-boton ${activa ? "peligro" : "activar"}" data-accion="toggle" data-id="${escaparHTML(item.id)}" aria-label="${activa ? "Desactivar" : "Activar"} solicitud" title="${activa ? "Desactivar solicitud" : "Activar solicitud"}">${activa ? "⏻" : "⏽"}</button><button class="icono-boton peligro" data-accion="eliminar" data-id="${escaparHTML(item.id)}" aria-label="Eliminar solicitud" title="Eliminar permanentemente">×</button></div></td></tr>`;
  }).join("") : '<tr><td class="tabla-vacia" colspan="9">No hay solicitudes que coincidan con la búsqueda.</td></tr>';
}
function renderizarUsuarios() {
  const cuerpo = document.querySelector("#tabla-usuarios");
  const lista = obtenerUsuarios();
  const sesion = obtenerSesion();
  const administradores = lista.filter(usuario => usuario.rol === "admin" && usuario.activo !== false).length;
  cuerpo.innerHTML = lista.length ? lista.map(usuario => {
    const tipo = { cedula: "Cédula", pasaporte: "Pasaporte", ruc: "RUC" }[usuario.tipoDocumento] || "Documento";
    const documento = usuario.cedula ? `${tipo}: ${usuario.cedula}` : "Pendiente de registrar";
    const activa = usuario.activo !== false;
    const esAdminActual = usuario.rol === "admin" && String(usuario.id) === String(sesion?.id);
    const noPuedeGestionarAdmin = esAdminActual || (usuario.rol === "admin" && activa && administradores <= 1);
    return `<tr class="${activa ? "" : "fila-desactivada"}"><td><strong>👤 ${escaparHTML(usuario.nombre)}</strong><small>ID ${escaparHTML(usuario.id)}</small></td><td>🪪 ${escaparHTML(documento)}</td><td>✉ ${escaparHTML(usuario.correo)}</td><td>☎ ${escaparHTML(usuario.telefono || "Pendiente de registrar")}</td><td><span class="rol-tag">${usuario.rol === "admin" ? "🛡 Administrador" : "🚗 Usuario"}</span></td><td><span class="estado ${activa ? "estado-finalizado" : "estado-inactiva"}">${activa ? "Activa" : "Deshabilitada"}</span></td><td><div class="acciones"><button class="icono-boton" data-accion-usuario="editar" data-id="${escaparHTML(usuario.id)}" aria-label="Editar cuenta de ${escaparHTML(usuario.nombre)}" title="Editar cuenta">✎</button><button class="icono-boton ${activa ? "peligro" : "activar"}" data-accion-usuario="toggle" data-id="${escaparHTML(usuario.id)}" aria-label="${activa ? "Deshabilitar" : "Habilitar"} cuenta" title="${activa ? "Deshabilitar" : "Habilitar"} cuenta" ${noPuedeGestionarAdmin ? "disabled" : ""}>${activa ? "⏻" : "⏽"}</button><button class="icono-boton peligro" data-accion-usuario="eliminar" data-id="${escaparHTML(usuario.id)}" aria-label="Eliminar cuenta de ${escaparHTML(usuario.nombre)}" title="Eliminar cuenta" ${noPuedeGestionarAdmin ? "disabled" : ""}>×</button></div></td></tr>`;
  }).join("") : '<tr><td class="tabla-vacia" colspan="7">Todavía no hay usuarios registrados.</td></tr>';
}
function abrirEdicionUsuario(id) {
  const usuario = usuarios.find(registro => String(registro.id) === String(id));
  if (!usuario) return;
  const admin = obtenerSesion();
  const tipoActual = usuario.tipoDocumento || "cedula";
  document.querySelector("#usuario-dialogo-icono").textContent = "✎";
  document.querySelector("#usuario-dialogo-contexto").textContent = "EDICIÓN DE CUENTA";
  document.querySelector("#usuario-dialogo-titulo").textContent = `Editar ${usuario.nombre}`;
  document.querySelector("#usuario-dialogo-operador").textContent = `Modificado por ${admin?.nombre || "Administrador"}`;
  const contenido = document.querySelector("#contenido-dialogo-usuario");
  contenido.innerHTML = `<form id="form-edicion-usuario" class="form-grid"><label>👤 Nombre completo<input name="nombre" required maxlength="90" value="${escaparHTML(usuario.nombre)}"></label><label>✉ Correo electrónico<input name="correo" type="email" required value="${escaparHTML(usuario.correo)}"></label><label>🪪 Tipo de documento<select name="tipoDocumento"><option value="cedula" ${tipoActual === "cedula" ? "selected" : ""}>Cédula</option><option value="pasaporte" ${tipoActual === "pasaporte" ? "selected" : ""}>Pasaporte</option><option value="ruc" ${tipoActual === "ruc" ? "selected" : ""}>RUC</option></select></label><label>🔢 Número de documento<input name="cedula" required value="${escaparHTML(usuario.cedula || "")}"></label><label>☎ Teléfono celular (10 dígitos)<input name="telefono" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required value="${escaparHTML(usuario.telefono || "")}"></label><label>🛡 Rol asignado<input value="${usuario.rol === "admin" ? "Administrador" : "Usuario"}" readonly></label><p class="ayuda-rol ancho-completo">El rol se conserva tal como está. Desde este formulario no se pueden crear administradores.</p></form>`;
  const formulario = contenido.querySelector("#form-edicion-usuario");
  prepararValidacionDocumento(formulario.elements.tipoDocumento, formulario.elements.cedula);
  prepararCampoNumerico(formulario.elements.telefono, 10);
  document.querySelector("#guardar-usuario").onclick = () => guardarEdicionUsuario(usuario.id);
  document.querySelector("#dialogo-usuario").showModal();
}
function guardarEdicionUsuario(id) {
  const formulario = document.querySelector("#form-edicion-usuario");
  if (!formulario.reportValidity()) return;
  const datos = new FormData(formulario);
  const usuario = usuarios.find(registro => String(registro.id) === String(id));
  if (!usuario) return;
  const correo = String(datos.get("correo")).trim().toLowerCase();
  if (usuarios.some(otro => String(otro.id) !== String(id) && otro.correo.toLowerCase() === correo)) { mostrarNotificacion("Ya existe otra cuenta con ese correo.", "error"); return; }
  const tipoDocumento = String(datos.get("tipoDocumento"));
  const cedula = String(datos.get("cedula")).trim().toUpperCase();
  const telefono = String(datos.get("telefono")).trim();
  if (!validarIdentificacion(tipoDocumento, cedula)) { mostrarNotificacion("El documento no coincide con el tipo seleccionado.", "error"); return; }
  if (!/^\d{10}$/.test(telefono)) { mostrarNotificacion("El teléfono celular debe tener exactamente 10 dígitos.", "error"); return; }
  const anterior = { ...usuario };
  const mantenimientosAnteriores = mantenimientos;
  Object.assign(usuario, { nombre: String(datos.get("nombre")).trim(), correo, tipoDocumento, cedula, telefono });
  mantenimientos = mantenimientos.map(item => item.usuarioId === usuario.id ? { ...item, propietario: usuario.nombre, correo: usuario.correo, tipoDocumento, cedula, telefono } : item);
  if (!guardarUsuarios()) { Object.assign(usuario, anterior); mantenimientos = mantenimientosAnteriores; mostrarNotificacion("No se pudieron guardar los cambios de la cuenta.", "error"); return; }
  if (!guardarMantenimientos()) { Object.assign(usuario, anterior); guardarUsuarios(); mantenimientos = mantenimientosAnteriores; mostrarNotificacion("No se pudieron actualizar las solicitudes de esta cuenta.", "error"); return; }
  if (String(obtenerSesion()?.id) === String(usuario.id)) escribirJSON(CONFIGURACION.claves.sesion, { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol });
  guardarHistorial("cuenta_editada", { id: usuario.id });
  document.querySelector("#dialogo-usuario").close(); renderizarUsuarios(); mostrarNotificacion("Los datos de la cuenta fueron actualizados.");
}
async function cambiarEstadoUsuario(id) {
  const usuario = usuarios.find(registro => String(registro.id) === String(id));
  if (!usuario) return;
  const sesion = obtenerSesion();
  if (usuario.rol === "admin" && String(usuario.id) === String(sesion?.id)) { mostrarNotificacion("No puedes deshabilitar la cuenta administradora de esta sesión.", "error"); return; }
  const activaAnterior = usuario.activo !== false;
  if (activaAnterior && usuario.rol === "admin" && usuarios.filter(persona => persona.rol === "admin" && persona.activo !== false).length <= 1) { mostrarNotificacion("Debe quedar al menos una cuenta administradora habilitada.", "error"); return; }
  if (activaAnterior && !await confirmarAccion(`La cuenta de ${usuario.nombre} ya no podrá iniciar sesión hasta que la habilites.`, "¿Deshabilitar esta cuenta?", "Deshabilitar")) return;
  usuario.activo = !activaAnterior;
  if (!guardarUsuarios()) { usuario.activo = activaAnterior; mostrarNotificacion("No se pudo guardar el estado de la cuenta.", "error"); return; }
  guardarHistorial(usuario.activo ? "cuenta_habilitada" : "cuenta_deshabilitada", { id: usuario.id });
  renderizarUsuarios(); mostrarNotificacion(usuario.activo ? "Cuenta habilitada." : "Cuenta deshabilitada.");
}
async function eliminarCuentaUsuario(id) {
  const usuario = usuarios.find(registro => String(registro.id) === String(id));
  if (!usuario) return;
  const sesion = obtenerSesion();
  const adminCount = usuarios.filter(persona => persona.rol === "admin" && persona.activo !== false).length;
  if (usuario.rol === "admin" && String(usuario.id) === String(sesion?.id)) { mostrarNotificacion("No puedes eliminar la cuenta con la que tienes iniciada esta sesión.", "error"); return; }
  if (usuario.rol === "admin" && usuario.activo !== false && adminCount <= 1) { mostrarNotificacion("Debe quedar al menos una cuenta administradora habilitada.", "error"); return; }
  if (!await confirmarAccion(`Las solicitudes históricas de ${usuario.nombre} se conservarán para el administrador.`, `¿Eliminar la cuenta de ${usuario.nombre}?`, "Eliminar cuenta")) return;
  const listaAnterior = usuarios;
  usuarios = usuarios.filter(persona => String(persona.id) !== String(id));
  if (!guardarUsuarios()) { usuarios = listaAnterior; mostrarNotificacion("No se pudo eliminar la cuenta del almacenamiento local.", "error"); return; }
  guardarHistorial("cuenta_eliminada", { id: usuario.id }); renderizarUsuarios(); mostrarNotificacion("Cuenta eliminada. Las solicitudes anteriores se conservaron.");
}
function procesarAccionUsuario(evento) {
  const boton = evento.target.closest("button[data-accion-usuario]");
  if (!boton || boton.disabled) return;
  if (boton.dataset.accionUsuario === "editar") abrirEdicionUsuario(boton.dataset.id);
  if (boton.dataset.accionUsuario === "toggle") cambiarEstadoUsuario(boton.dataset.id);
  if (boton.dataset.accionUsuario === "eliminar") eliminarCuentaUsuario(boton.dataset.id);
}
function abrirDetalle(mantenimiento, modo) {
  const dialogo = document.querySelector("#dialogo-mantenimiento");
  const admin = obtenerSesion();
  const lectura = modo === "ver";
  document.querySelector("#dialogo-icono").textContent = lectura ? "👁" : "✎";
  document.querySelector("#dialogo-contexto").textContent = lectura ? "VISTA DE SOLICITUD" : "EDICIÓN DE SOLICITUD";
  document.querySelector("#dialogo-titulo").textContent = `${lectura ? "Solicitud" : "Editar solicitud"} ${mantenimiento.id}`;
  document.querySelector("#dialogo-operador").textContent = `Atendido por ${admin?.nombre || "Administrador"}`;
  const area = document.querySelector("#contenido-dialogo");
  if (lectura) {
    const tipo = { cedula: "Cédula", pasaporte: "Pasaporte", ruc: "RUC" }[mantenimiento.tipoDocumento] || "Documento";
    area.innerHTML = `<div class="detalle-grid"><div><span>👤 Propietario</span><strong>${escaparHTML(mantenimiento.propietario)}</strong></div><div><span>🪪 ${tipo}</span><strong>${escaparHTML(mantenimiento.cedula)}</strong></div><div><span>✉ Correo</span><strong>${escaparHTML(mantenimiento.correo)}</strong></div><div><span>☎ Teléfono</span><strong>${escaparHTML(mantenimiento.telefono)}</strong></div><div><span>🚘 Vehículo</span><strong>${escaparHTML(mantenimiento.vehiculo.marca)} ${escaparHTML(mantenimiento.vehiculo.modelo)} (${mantenimiento.vehiculo.anio})</strong></div><div><span>🔖 Placa y kilometraje</span><strong>${escaparHTML(mantenimiento.vehiculo.placa)} · ${Number(mantenimiento.vehiculo.kilometraje).toLocaleString("es-EC")} km</strong></div><div><span>🛠 Servicio</span><strong>${escaparHTML(mantenimiento.tipoMantenimiento)}</strong></div><div><span>📅 Fecha y hora de revisión</span><strong>${escaparHTML(mantenimiento.fecha)} · ${escaparHTML(mantenimiento.horaRevision || "Sin hora asignada")} · ${escaparHTML(mantenimiento.jornada || "Sin preferencia")}</strong></div><div><span>● Estado</span><strong>${mantenimiento.activa === false ? "Desactivada" : escaparHTML(mantenimiento.estado)}</strong></div><div class="detalle-ancho"><span>📝 Descripción</span><strong>${escaparHTML(mantenimiento.descripcion)}</strong></div><div class="detalle-ancho"><span>💬 Observaciones</span><strong>${escaparHTML(mantenimiento.observaciones || "Sin observaciones")}</strong></div></div>`;
    document.querySelector("#guardar-edicion").hidden = true;
  } else {
    const tipoActual = mantenimiento.tipoDocumento || "cedula";
    area.innerHTML = `<form id="form-edicion" class="form-grid"><label>👤 Propietario<input name="propietario" required value="${escaparHTML(mantenimiento.propietario)}"></label><label>Tipo de documento<select name="tipoDocumento"><option value="cedula" ${tipoActual === "cedula" ? "selected" : ""}>Cédula</option><option value="pasaporte" ${tipoActual === "pasaporte" ? "selected" : ""}>Pasaporte</option><option value="ruc" ${tipoActual === "ruc" ? "selected" : ""}>RUC</option></select></label><label>🪪 Número de documento<input name="cedula" required value="${escaparHTML(mantenimiento.cedula)}"></label><label>✉ Correo<input name="correo" type="email" required value="${escaparHTML(mantenimiento.correo)}"></label><label>☎ Teléfono celular (10 dígitos)<input name="telefono" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" required value="${escaparHTML(mantenimiento.telefono)}"></label><label>🚘 Marca<input name="marca" required value="${escaparHTML(mantenimiento.vehiculo.marca)}"></label><label>🚘 Modelo<input name="modelo" required value="${escaparHTML(mantenimiento.vehiculo.modelo)}"></label><label>📆 Año<input name="anio" type="number" min="1950" max="${new Date().getFullYear() + 1}" required value="${mantenimiento.vehiculo.anio}"></label><label>🔖 Placa<input name="placa" required pattern="[A-Za-z0-9-]{5,10}" value="${escaparHTML(mantenimiento.vehiculo.placa)}"></label><label>🛞 Kilometraje<input name="kilometraje" type="number" min="0" required value="${mantenimiento.vehiculo.kilometraje}"></label><label>🛠 Tipo de servicio<select name="tipoMantenimiento">${TIPOS_MANTENIMIENTO.map(tipo => `<option ${tipo === mantenimiento.tipoMantenimiento ? "selected" : ""}>${escaparHTML(tipo)}</option>`).join("")}</select></label><label>📅 Fecha<input name="fecha" type="date" required value="${escaparHTML(mantenimiento.fecha)}"></label><label>◷ Hora de revisión<input name="horaRevision" type="time" required value="${escaparHTML(mantenimiento.horaRevision || "09:00")}"></label><label>Jornada<select name="jornada"><option ${mantenimiento.jornada === "Mañana" ? "selected" : ""}>Mañana</option><option ${mantenimiento.jornada === "Tarde" ? "selected" : ""}>Tarde</option></select></label><label class="checkbox-confirmacion"><input name="confirmacion" type="checkbox" ${mantenimiento.confirmacion ? "checked" : ""}> Datos confirmados</label><label>● Estado<select name="estado">${ESTADOS.map(valor => `<option ${valor === mantenimiento.estado ? "selected" : ""}>${valor}</option>`).join("")}</select></label><label class="ancho-completo">📝 Descripción<textarea name="descripcion" required rows="3">${escaparHTML(mantenimiento.descripcion)}</textarea></label><label class="ancho-completo">💬 Observaciones<textarea name="observaciones" rows="2">${escaparHTML(mantenimiento.observaciones)}</textarea></label></form>`;
    const formulario = area.querySelector("#form-edicion");
    prepararValidacionDocumento(formulario.elements.tipoDocumento, formulario.elements.cedula);
    prepararCampoNumerico(formulario.elements.telefono, 10);
    document.querySelector("#guardar-edicion").hidden = false;
    document.querySelector("#guardar-edicion").onclick = () => editarMantenimiento(mantenimiento.id);
  }
  if (!dialogo.open) dialogo.showModal();
}
function editarMantenimiento(id) {
  const formulario = document.querySelector("#form-edicion");
  if (!formulario.reportValidity()) return;
  const datos = new FormData(formulario);
  const anterior = mantenimientos.find(item => item.id === id);
  if (!validarIdentificacion(String(datos.get("tipoDocumento")), String(datos.get("cedula")))) { mostrarNotificacion("El documento no coincide con el tipo seleccionado.", "error"); return; }
  if (!/^\d{10}$/.test(String(datos.get("telefono")))) { mostrarNotificacion("El teléfono celular debe tener exactamente 10 dígitos.", "error"); return; }
  const copiaAnterior = { ...anterior };
  Object.assign(anterior, { propietario: String(datos.get("propietario")).trim(), tipoDocumento: String(datos.get("tipoDocumento")), cedula: String(datos.get("cedula")).trim().toUpperCase(), correo: String(datos.get("correo")).trim(), telefono: String(datos.get("telefono")).trim(), tipoMantenimiento: String(datos.get("tipoMantenimiento")), fecha: String(datos.get("fecha")), horaRevision: String(datos.get("horaRevision")), jornada: String(datos.get("jornada")), confirmacion: datos.has("confirmacion"), estado: String(datos.get("estado")), descripcion: String(datos.get("descripcion")).trim(), observaciones: String(datos.get("observaciones")).trim(), vehiculo: { marca: String(datos.get("marca")).trim(), modelo: String(datos.get("modelo")).trim(), anio: Number(datos.get("anio")), placa: String(datos.get("placa")).trim().toUpperCase(), kilometraje: Number(datos.get("kilometraje")) } });
  if (!guardarMantenimientos()) { Object.assign(anterior, copiaAnterior); mostrarNotificacion("No se pudieron guardar los cambios en el navegador.", "error"); return; }
  guardarHistorial("editado", anterior);
  const propietarioCuenta = usuarios.find(usuario => usuario.id === anterior.usuarioId);
  if (propietarioCuenta) { propietarioCuenta.tipoDocumento = anterior.tipoDocumento; propietarioCuenta.cedula = anterior.cedula; propietarioCuenta.telefono = anterior.telefono; guardarUsuarios(); }
  document.querySelector("#dialogo-mantenimiento").close(); renderizarTabla(); renderizarUsuarios(); mostrarNotificacion("La solicitud fue actualizada.");
}
async function cambiarEstadoActivo(id) {
  const item = mantenimientos.find(registro => registro.id === id);
  if (!item) return;
  const estabaActiva = item.activa !== false;
  if (estabaActiva && !await confirmarAccion("El registro seguirá disponible para el administrador y se podrá reactivar después.", `¿Desactivar la solicitud ${item.id}?`, "Desactivar")) return;
  item.activa = !estabaActiva;
  if (!guardarMantenimientos()) { item.activa = estabaActiva; mostrarNotificacion("No se pudo guardar el cambio de estado.", "error"); return; }
  guardarHistorial(item.activa ? "activado" : "desactivado", item); renderizarTabla();
  mostrarNotificacion(item.activa ? "Solicitud activada." : "Solicitud desactivada.");
}
async function eliminarMantenimiento(id) {
  const item = mantenimientos.find(registro => registro.id === id);
  if (!item || !await confirmarAccion(`Se eliminará permanentemente la solicitud de ${item.propietario}.`, `¿Eliminar ${item.id}?`, "Eliminar solicitud")) return;
  const listaAnterior = mantenimientos;
  mantenimientos = mantenimientos.filter(registro => registro.id !== item.id);
  if (!guardarMantenimientos()) { mantenimientos = listaAnterior; mostrarNotificacion("No se pudo eliminar la solicitud del almacenamiento.", "error"); return; }
  guardarHistorial("eliminado", item); renderizarTabla(); mostrarNotificacion("La solicitud fue eliminada.");
}
function procesarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]"); if (!boton) return;
  const item = mantenimientos.find(registro => registro.id === boton.dataset.id); if (!item) return;
  if (boton.dataset.accion === "ver") abrirDetalle(item, "ver");
  if (boton.dataset.accion === "editar") abrirDetalle(item, "editar");
  if (boton.dataset.accion === "toggle") cambiarEstadoActivo(item.id);
  if (boton.dataset.accion === "eliminar") eliminarMantenimiento(item.id);
}
document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("#tabla-mantenimientos")) return;
  if (!verificarSesion("admin")) return;
  document.querySelector("#busqueda").addEventListener("input", renderizarTabla);
  document.querySelector("#filtro-estado").addEventListener("change", renderizarTabla);
  document.querySelector("#tabla-mantenimientos").addEventListener("click", procesarAccion);
  document.querySelector("#tabla-usuarios").addEventListener("click", procesarAccionUsuario);
  document.querySelector("#cerrar-dialogo").addEventListener("click", () => document.querySelector("#dialogo-mantenimiento").close());
  document.querySelector("#cerrar-dialogo-usuario").addEventListener("click", () => document.querySelector("#dialogo-usuario").close());
  renderizarTabla(); renderizarUsuarios();
});
