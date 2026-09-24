import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCuXyJ_HdMbortpE5w1ZTyR8DbVi5CXWtY",
    authDomain: "dogs-steps.firebaseapp.com",
    projectId: "dogs-steps",
    storageBucket: "dogs-steps.firebasestorage.app",
    messagingSenderId: "218797965541",
    appId: "1:218797965541:web:98998455ea54983ba4d40c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function comprimirFotoPerfil(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(event) {
        const img = new Image();
        img.src = event.target.result;
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 250;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL('image/jpeg', 0.6));
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const TU_NUMERO_WHATSAPP = "50373484771"; 
    const PASSWORD_ADMIN = "1234";

    let perritos = [];

    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPerfil = document.getElementById('vista-perfil');
    const vistaAdmin = document.getElementById('vista-admin');
    
    const directorioPerritos = document.getElementById('directorio-perritos');
    const contenedorDirectorioAdmin = document.getElementById('contenedor-directorio-admin');
    const selectPerritoReserva = document.getElementById('perro-select');
    const selectPerritoReporte = document.getElementById('reporte-perro-select');
    const selectAdminAlerta = document.getElementById('admin-perro-alerta');
    const inputAdminTelCliente = document.getElementById('admin-tel-cliente');
    const infoUltimaReserva = document.getElementById('info-ultima-reserva');
    const listaAdminPerros = document.getElementById('lista-admin-perros');
    const buscador = document.getElementById('buscador-perros');
    const tarjetaPerfilDetalle = document.getElementById('tarjeta-perfil-detalle');

    const selectServicio = document.getElementById('servicio');
    const selectNumPerros = document.getElementById('num-perros-servicio');
    const spanTotalCalculado = document.getElementById('span-total-calculado');
    const contenedorPaqueteDias = document.getElementById('contenedor-paquete-dias');
    const contenedorFechaUnica = document.getElementById('contenedor-fecha-unica');
    const inputFecha = document.getElementById('fecha');
    const inputPaqueteDias = document.getElementById('paquete-dias');
    const inputPaqueteHora = document.getElementById('paquete-hora');
    const opcionOferta = document.getElementById('opcion-oferta');
    const inputUrlMapa = document.getElementById('url-mapa');

    const inputPinCliente = document.getElementById('input-pin-cliente');
    const btnEntrarPin = document.getElementById('btn-entrar-pin');
    const btnWhatsappPago = document.getElementById('btn-whatsapp-pago');

    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => {
                b.style.color = '#776050';
                b.style.borderBottom = 'none';
            });
            tabContents.forEach(c => c.style.display = 'none');

            btn.style.color = '#4a3319';
            btn.style.borderBottom = '3px solid #8c6d53';
            const targetId = btn.dataset.target;
            document.getElementById(targetId).style.display = 'block';
        });
    });

    document.getElementById('titulo-app').addEventListener('click', mostrarInicio);
    document.getElementById('btn-volver-inicio').addEventListener('click', mostrarInicio);
    document.getElementById('btn-salir-admin').addEventListener('click', mostrarInicio);

    document.getElementById('btn-ir-admin').addEventListener('click', () => {
        const pass = prompt("Ingresa tu contraseña de paseador:");
        if (pass === PASSWORD_ADMIN) {
            contenedorDirectorioAdmin.style.display = 'block';
            mostrarAdmin();
        } else if (pass !== null) {
            alert("Contraseña incorrecta.");
        }
    });

    btnWhatsappPago.addEventListener('click', () => {
        const msg = `¡Hola Dog's Step's! 🐾 Acabo de realizar mi transferencia por Bancoagrícola. Aquí te adjunto el comprobante de pago 🧾👇`;
        window.open(`https://wa.me/${TU_NUMERO_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    });

    async function cargarPerritosDeNube() {
        try {
            const querySnapshot = await getDocs(collection(db, "perritos"));
            perritos = [];
            querySnapshot.forEach((docSnap) => {
                perritos.push({ id: docSnap.id, ...docSnap.data() });
            });
            actualizarDirectorio();
        } catch (error) {
            console.error("Error al cargar desde Firebase:", error);
        }
    }

    function mostrarInicio() {
        vistaInicio.style.display = 'block';
        vistaPerfil.style.display = 'none';
        vistaAdmin.style.display = 'none';
        contenedorDirectorioAdmin.style.display = 'none';
        cargarPerritosDeNube();
    }

    function mostrarAdmin() {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'none';
        vistaAdmin.style.display = 'block';
        cargarPerritosDeNube().then(() => actualizarPanelAdmin());
    }

    btnEntrarPin.addEventListener('click', () => {
        const pinIngresado = inputPinCliente.value.trim();
        if (!pinIngresado) {
            alert("Por favor, ingresa tu PIN secreto.");
            return;
        }

        const perritoEncontrado = perritos.find(p => p.pin === pinIngresado);
        if (perritoEncontrado) {
            inputPinCliente.value = '';
            abrirPerfilIndividual(perritoEncontrado);
        } else {
            alert("❌ PIN incorrecto o no encontrado. Verifica con Dog's Step's si tienes dudas.");
        }
    });

    function actualizarDirectorio(filtro = '') {
        directorioPerritos.innerHTML = '';
        selectPerritoReserva.innerHTML = '';

        const perritosFiltrados = perritos.filter(p => 
            (p.nombre && p.nombre.toLowerCase().includes(filtro.toLowerCase())) || 
            (p.familia && p.familia.toLowerCase().includes(filtro.toLowerCase())) ||
            (p.raza && p.raza.toLowerCase().includes(filtro.toLowerCase()))
        );

        if (perritosFiltrados.length === 0) {
            directorioPerritos.innerHTML = '<p style="color: #776050; text-align: center;">No hay registros.</p>';
            return;
        }

        perritosFiltrados.forEach((p) => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = `${p.nombre} (${p.familia})`;
            selectPerritoReserva.appendChild(option);

            let avatarHtml = p.fotoPerfil ? 
                `<img src="${p.fotoPerfil}" class="avatar-perfil-min">` : 
                `<div style="font-size: 1.8rem; background: #faf6f0; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 10px; border: 1px solid #4a3319;">🐕</div>`;

            const div = document.createElement('div');
            div.className = 'perfil-card-item';
            div.innerHTML = `
                <div style="display: flex; align-items: center;">
                    ${avatarHtml}
                    <div>
                        <strong>${p.nombre}</strong> <small style="color: #8c6d53;">[${p.familia}]</small><br>
                        <small style="color: #776050;">${p.raza} • ${p.edad}</small>
                    </div>
                </div>
                <span style="color: #4a3319; font-weight: bold; font-size: 0.9rem;">Ver →</span>
            `;

            div.addEventListener('click', () => {
                abrirPerfilIndividual(p);
            });

            directorioPerritos.appendChild(div);
        });

        verificarOfertaPrimerPaseo();
        calcularPrecioDinamico();
    }

    function verificarOfertaPrimerPaseo() {
        const nombreSeleccionado = selectPerritoReserva.value;
        const perritoActual = perritos.find(p => p.nombre === nombreSeleccionado);

        if (perritoActual) {
            const tieneCitasPrevias = perritoActual.citas && perritoActual.citas.length > 0;
            if (tieneCitasPrevias) {
                opcionOferta.style.display = 'none';
                if (selectServicio.value.includes("Oferta")) {
                    selectServicio.selectedIndex = 0;
                }
            } else {
                opcionOferta.style.display = 'block';
            }
        }
        calcularPrecioDinamico();
    }

    selectPerritoReserva.addEventListener('change', verificarOfertaPrimerPaseo);

    function calcularPrecioDinamico() {
        const servicioVal = selectServicio.value;
        const numP = parseInt(selectNumPerros.value || "1");

        let base = 6;
        if (servicioVal.includes("30 min")) base = 6;
        else if (servicioVal.includes("45 min")) base = 8;
        else if (servicioVal.includes("60 min")) base = 10;
        else if (servicioVal.includes("Paquete 5")) base = 38;
        else if (servicioVal.includes("Paquete 12")) base = 84;
        else if (servicioVal.includes("Paquete 20")) base = 130;
        else if (servicioVal.includes("Oferta")) base = 4;

        if (numP === 2) base += 3;
        else if (numP >= 3) base += 5;

        spanTotalCalculado.textContent = `$${base}.00`;
    }

    selectServicio.addEventListener('change', function() {
        calcularPrecioDinamico();
        const opcionSeleccionada = selectServicio.options[selectServicio.selectedIndex];
        const esPaquete = opcionSeleccionada.dataset.esPaquete === "true";

        if (esPaquete) {
            contenedorPaqueteDias.style.display = 'block';
            contenedorFechaUnica.style.display = 'none';
            inputFecha.removeAttribute('required');
            inputPaqueteDias.setAttribute('required', 'true');
            inputPaqueteHora.setAttribute('required', 'true');
        } else {
            contenedorPaqueteDias.style.display = 'none';
            contenedorFechaUnica.style.display = 'block';
            inputFecha.setAttribute('required', 'true');
            inputPaqueteDias.removeAttribute('required');
            inputPaqueteHora.removeAttribute('required');
        }
    });

    selectNumPerros.addEventListener('change', calcularPrecioDinamico);

    function abrirPerfilIndividual(p) {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'block';
        vistaAdmin.style.display = 'none';

        let avatarGrandeHtml = p.fotoPerfil ? 
            `<img src="${p.fotoPerfil}" class="avatar-perfil-grande">` : 
            `<div style="font-size: 3.5rem; background: #faf6f0; width: 90px; height: 90px; line-height: 90px; border-radius: 50%; margin: 0 auto 0.5rem auto; border: 3px solid #4a3319; text-align: center;">🐕</div>`;

        let resumenPaqueteHtml = '';
        if (p.paqueteActivo && p.paqueteActivo.totalPaseos) {
            const consumidos = p.paqueteActivo.paseosConsumidos || 0;
            const totales = p.paqueteActivo.totalPaseos;
            const restantes = Math.max(0, totales - consumidos);
            const porcentaje = (consumidos / totales) * 100;

            resumenPaqueteHtml = `
                <div style="background: #e8f5e9; border: 1px solid #a5d6a7; padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="margin: 0 0 0.3rem 0; color: #2e7d32; font-weight: bold;">📦 ${p.paqueteActivo.nombreServicio}</p>
                    <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #333;">Te quedan <strong>${restantes} de ${totales} paseos</strong> disponibles.</p>
                    <div style="background: #c8e6c9; border-radius: 4px; height: 8px; width: 100%; overflow: hidden;">
                        <div style="background: #2e7d32; height: 100%; width: ${porcentaje}%;"></div>
                    </div>
                </div>
            `;
        }

        let citasProximasHtml = '';
        let historialCitasHtml = '';
        let reportesHtml = '';
        const ahora = new Date();

        if (p.citas && p.citas.length > 0) {
            p.citas.forEach(cita => {
                const fechaCitaObj = new Date(cita.fechaOriginal || cita.fecha);
                const itemCita = `<div style="background: #faf6f0; padding: 0.6rem; border-radius: 6px; margin-bottom: 0.4rem; border-left: 4px solid #a67c52;">📅 <strong>${cita.servicio}</strong> (${cita.numPerros} perritos)<br>🕒 <strong>Detalle:</strong> ${cita.fecha}</div>`;
                
                if (cita.esPaquete || fechaCitaObj >= ahora) {
                    citasProximasHtml += itemCita;
                } else {
                    historialCitasHtml += itemCita;
                }
            });
        }

        if (!citasProximasHtml) {
            citasProximasHtml = `
                <div style="text-align: center; padding: 1.5rem; background: #faf6f0; border-radius: 8px; border: 1px dashed #d4c3b3;">
                    <p style="font-size: 2rem; margin: 0;">🐶💤</p>
                    <p style="font-weight: bold; color: #4a3319; margin: 0.5rem 0;">¡Aún no hay paseos programados para ${p.nombre}!</p>
                    <p style="font-size: 0.85rem; color: #776050; margin-bottom: 0.8rem;">¿Qué tal si le regalamos un paseo al aire libre hoy?</p>
                    <button type="button" id="btn-ir-agendar-perfil" style="background: #2e7d32; font-size: 0.85rem; width: auto; padding: 0.4rem 1rem;">📅 Agendar Paseo Ahora</button>
                </div>`;
        }

        if (!historialCitasHtml) historialCitasHtml = '<p style="color: #776050; font-size: 0.9rem;">No hay historial de citas anteriores.</p>';

        if (p.reportes && p.reportes.length > 0) {
            reportesHtml = p.reportes.map(r => {
                let mapaBtn = '';
                if (r.urlMapa) {
                    mapaBtn = `<br><a href="${r.urlMapa}" target="_blank" class="btn-secundario" style="display: inline-block; margin-top: 0.4rem; background: #2b6cb0; color: white; padding: 0.3rem 0.6rem; font-size: 0.8rem; text-decoration: none; border-radius: 4px;">🗺️ Ver Ruta en el Mapa</a>`;
                }
                return `
                    <div class="reporte-item" style="background: #fff; padding: 0.7rem; border-radius: 6px; margin-bottom: 0.5rem; border: 1px solid #d4c3b3;">
                        📝 ${r.texto}
                        ${mapaBtn}
                    </div>
                `;
            }).join('');
        } else {
            reportesHtml = '<p style="color: #776050; font-size: 0.9rem;">Aún no hay reportes registrados.</p>';
        }

        tarjetaPerfilDetalle.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                ${avatarGrandeHtml}
                <h2 style="margin: 0.5rem 0 0 0; color: #4a3319;">${p.nombre}</h2>
                <p style="margin: 0; color: #8c6d53; font-weight: bold;">${p.familia} • ${p.raza} (${p.edad})</p>
            </div>
            
            ${resumenPaqueteHtml}

            <div style="background: #faf6f0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin: 0.3rem 0;">👤 <strong>Dueño:</strong> ${p.nombreDueno || 'No especificado'}</p>
                <p style="margin: 0.3rem 0;">📱 <strong>WhatsApp:</strong> ${p.telefonoDueno || 'No especificado'}</p>
                <p style="margin: 0.3rem 0;">📍 <strong>Dirección:</strong> ${p.direccion}</p>
                <p style="margin: 0.3rem 0;">⚠️ <strong>Notas:</strong> ${p.notas}</p>
            </div>

            <h3 style="color: #4a3319; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; margin-top: 1.2rem;">✨ Citas Próximas / Paquetes Activos</h3>
            <div style="margin-top: 0.5rem; margin-bottom: 1rem;">${citasProximasHtml}</div>

            <h3 style="color: #4a3319; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; margin-top: 1.2rem;">📋 Historial de Citas Pasadas</h3>
            <div style="margin-top: 0.5rem; margin-bottom: 1rem;">${historialCitasHtml}</div>

            <h3 style="color: #4a3319; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; margin-top: 1.2rem;">📸 Bitácora de Reportes y Rutas</h3>
            <div style="margin-top: 0.5rem;">${reportesHtml}</div>
        `;

        const btnAgendarPerfil = document.getElementById('btn-ir-agendar-perfil');
        if (btnAgendarPerfil) {
            btnAgendarPerfil.addEventListener('click', () => {
                tabButtons.forEach(b => {
                    b.style.color = '#776050';
                    b.style.borderBottom = 'none';
                });
                tabContents.forEach(c => c.style.display = 'none');
                
                const btnAgendarTab = document.querySelector('[data-target="seccion-reserva"]');
                btnAgendarTab.style.color = '#4a3319';
                btnAgendarTab.style.borderBottom = '3px solid #8c6d53';
                document.getElementById('seccion-reserva').style.display = 'block';

                vistaInicio.style.display = 'block';
                vistaPerfil.style.display = 'none';
                selectPerritoReserva.value = p.nombre;
                verificarOfertaPrimerPaseo();
            });
        }
    }

    buscador.addEventListener('input', (e) => {
        actualizarDirectorio(e.target.value);
    });

    const formClientePerro = document.getElementById('form-cliente-perro');
    formClientePerro.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputFotoPerfil = document.getElementById('c-foto');
        const nombreIngresado = document.getElementById('c-nombre').value;
        const familiaIngresada = document.getElementById('c-familia').value;
        const pinIngresado = document.getElementById('c-pin').value.trim();
        
        const guardarEnNube = async (urlFotoPerfil) => {
            const nuevoPerro = {
                nombre: nombreIngresado,
                familia: familiaIngresada,
                nombreDueno: document.getElementById('c-dueno').value,
                telefonoDueno: document.getElementById('c-tel').value,
                pin: pinIngresado,
                raza: document.getElementById('c-raza').value,
                edad: document.getElementById('c-edad').value,
                direccion: document.getElementById('c-direccion').value,
                notas: document.getElementById('c-notas').value,
                fotoPerfil: urlFotoPerfil,
                citas: [],
                reportes: [{ texto: `¡Perfil de ${nombreIngresado} registrado con éxito en ${familiaIngresada}! 🎉`, urlMapa: null }],
                paqueteActivo: null,
                ultimaReserva: null
            };

            try {
                await addDoc(collection(db, "perritos"), nuevoPerro);
                formClientePerro.reset();
                alert(`¡Éxito! El perfil de "${nombreIngresado}" ha sido creado. Recuerda tu PIN secreto para entrar a tu perfil 🐾.`);
                cargarPerritosDeNube();
            } catch (error) {
                console.error("Error al guardar en Firebase:", error);
                alert("Hubo un error al guardar el registro.");
            }
        };

        if (inputFotoPerfil.files && inputFotoPerfil.files[0]) {
            comprimirFotoPerfil(inputFotoPerfil.files[0], (urlComprimida) => {
                guardarEnNube(urlComprimida);
            });
        } else {
            guardarEnNube(null);
        }
    });

    function actualizarPanelAdmin() {
        selectPerritoReporte.innerHTML = '';
        selectAdminAlerta.innerHTML = '';
        
        perritos.forEach(p => {
            const opt1 = document.createElement('option');
            opt1.value = p.nombre;
            opt1.textContent = p.nombre;
            selectPerritoReporte.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = p.nombre;
            opt2.textContent = `${p.nombre} (${p.familia}) [PIN: ${p.pin || 'N/A'}]`;
            opt2.dataset.tel = p.telefonoDueno || "";
            selectAdminAlerta.appendChild(opt2);
        });

        selectAdminAlerta.onchange = function() {
            const selectedOpt = selectAdminAlerta.options[selectAdminAlerta.selectedIndex];
            inputAdminTelCliente.value = selectedOpt.dataset.tel || "";
            
            const perritoActual = perritos.find(p => p.nombre === selectAdminAlerta.value);
            if (perritoActual && perritoActual.ultimaReserva) {
                const r = perritoActual.ultimaReserva;
                infoUltimaReserva.innerHTML = `📋 <strong>Servicio:</strong> ${r.servicio}<br>🐶 <strong>Perritos:</strong> ${r.numPerros}<br>📅 <strong>Detalle:</strong> ${r.fecha}`;
                infoUltimaReserva.dataset.servicio = r.servicio;
                infoUltimaReserva.dataset.numPerros = r.numPerros;
            } else {
                infoUltimaReserva.innerHTML = `⚠️ Este perrito aún no tiene una reserva registrada en el sistema.`;
                infoUltimaReserva.dataset.servicio = "";
                infoUltimaReserva.dataset.numPerros = "1";
            }
        };

        if(selectAdminAlerta.options.length > 0) {
            selectAdminAlerta.onchange();
        }

        listaAdminPerros.innerHTML = '';
        if (perritos.length === 0) {
            listaAdminPerros.innerHTML = '<p style="color: #742a2a; font-size: 0.9rem;">No hay registros.</p>';
            return;
        }

        perritos.forEach((p) => {
            const fila = document.createElement('div');
            fila.className = 'admin-perfil-fila';
            fila.innerHTML = `
                <div style="margin-bottom: 0.5rem;">
                    <strong>🐕 ${p.nombre}</strong> <small style="color: #666;">[${p.familia}] - PIN: <code>${p.pin || 'Sin PIN'}</code></small>
                </div>
                <div style="display: flex; gap: 0.4rem;">
                    <button class="btn-secundario btn-cancelar-cita" data-id="${p.id}" style="background: #b7791f; font-size: 0.8rem; padding: 0.3rem 0.6rem; margin:0;">Cancelar Citas / Paquete</button>
                    <button class="btn-peligro btn-eliminar-perro" data-id="${p.id}" style="font-size: 0.8rem; padding: 0.3rem 0.6rem; margin:0;">Eliminar Perfil</button>
                </div>
            `;

            fila.querySelector('.btn-cancelar-cita').addEventListener('click', async () => {
                if (confirm(`¿Deseas cancelar las citas pendientes o paquetes activos de ${p.nombre} para liberar el cupo?`)) {
                    try {
                        await updateDoc(doc(db, "perritos", p.id), {
                            citas: [],
                            paqueteActivo: null,
                            ultimaReserva: null
                        });
                        await cargarPerritosDeNube();
                        actualizarPanelAdmin();
                        alert(`¡Citas y paquete cancelados con éxito para ${p.nombre}!`);
                    } catch (error) {
                        console.error("Error al cancelar citas:", error);
                    }
                }
            });

            fila.querySelector('.btn-eliminar-perro').addEventListener('click', async () => {
                if (confirm(`¿Estás segura de eliminar permanentemente a ${p.nombre} de la nube?`)) {
                    try {
                        await deleteDoc(doc(db, "perritos", p.id));
                        await cargarPerritosDeNube();
                        actualizarPanelAdmin();
                        alert('Perfil eliminado con éxito.');
                    } catch (error) {
                        console.error("Error al eliminar:", error);
                    }
                }
            });

            listaAdminPerros.appendChild(fila);
        });
    }

    document.getElementById('btn-iniciar-paseo').onclick = function() {
        const nombrePerro = selectAdminAlerta.value;
        const telCliente = inputAdminTelCliente.value.trim();
        if(!telCliente) {
            alert("No hay número de contacto registrado.");
            return;
        }
        const mensaje = `¡Hola! 🐾 Te escribimos de Dog's Step's para avisarte que *acabamos de iniciar* el paseo de ${nombrePerro}. ¡Todo listo y con la mejor energía! 🐕✨\n\n(Aquí te adjunto la foto o video del inicio de paseo 📸👇)`;
        window.open(`https://wa.me/${telCliente}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    document.getElementById('btn-finalizar-paseo').onclick = function() {
        const nombrePerro = selectAdminAlerta.value;
        const telCliente = inputAdminTelCliente.value.trim();
        if(!telCliente) {
            alert("No hay número de contacto registrado.");
            return;
        }
        const mensaje = `¡Hola! 🐾 Te escribimos de Dog's Step's para avisarte que *hemos finalizado con éxito* el paseo de ${nombrePerro}. ¡Ya está de vuelta en casa y descansando feliz! ❤️🏡\n\n(Aquí te adjunto la foto del regreso 📸👇)`;
        window.open(`https://wa.me/${telCliente}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    document.getElementById('btn-enviar-factura-auto').onclick = function() {
        const nombrePerro = selectAdminAlerta.value;
        const telCliente = inputAdminTelCliente.value.trim();
        const servicioSelect = infoUltimaReserva.dataset.servicio;
        const numPerros = parseInt(infoUltimaReserva.dataset.numPerros || "1");

        if(!telCliente) {
            alert("No hay número de WhatsApp registrado para este cliente.");
            return;
        }
        if(!servicioSelect) {
            alert("Este perrito no tiene una reserva registrada para facturar automáticamente.");
            return;
        }

        let precioBase = 6;
        if (servicioSelect.includes("30 min")) precioBase = 6;
        else if (servicioSelect.includes("45 min")) precioBase = 8;
        else if (servicioSelect.includes("60 min")) precioBase = 10;
        else if (servicioSelect.includes("Paquete 5")) precioBase = 38;
        else if (servicioSelect.includes("Paquete 12")) precioBase = 84;
        else if (servicioSelect.includes("Paquete 20")) precioBase = 130;
        else if (servicioSelect.includes("Oferta")) precioBase = 4;

        let totalPagar = precioBase;
        let detalleExtras = "";

        if (numPerros === 2) {
            totalPagar += 3;
            detalleExtras += "\n🐾 Segundo perro: +$3";
        } else if (numPerros >= 3) {
            totalPagar += 5; 
            detalleExtras += "\n🐾 Segundo y tercer perro: +$5";
        }

        const perroEncontrado = perritos.find(p => p.nombre === nombrePerro);
        let dueno = perroEncontrado ? (perroEncontrado.nombreDueno || "Cliente") : "Cliente";
        let familia = perroEncontrado ? (perroEncontrado.familia || "Familia") : "Familia";

        if(perroEncontrado) {
            if (!perroEncontrado.reportes) perroEncontrado.reportes = [];
            perroEncontrado.reportes.push({
                texto: `🧾 Factura enviada: ${servicioSelect} (${numPerros} perros) - Total: $${totalPagar}.`,
                urlMapa: null
            });
            updateDoc(doc(db, "perritos", perroEncontrado.id), { reportes: perroEncontrado.reportes });
        }

        const mensajeWp = `🐾 *FACTURA / RECIBO - DOG'S STEP'S* 🐾\n\n👤 *Cliente / Familia:* ${dueno} (${familia})\n🐕 *Perrito principal:* ${nombrePerro}\n📋 *Servicio:* ${servicioSelect}\n🐶 *Cantidad de perritos:* ${numPerros}${detalleExtras}\n\n💰 *TOTAL A PAGAR: $${totalPagar}.00*\n\n💳 *Métodos de pago:*\n• Efectivo\n• Transferencia Bancoagrícola\n  Titular: NATALIA REYES\n  N° de Cuenta: \`3100617261\`\n\n¡Gracias por confiar en Dog's Step's! 🐕✨`;
        
        window.open(`https://wa.me/${telCliente}?text=${encodeURIComponent(mensajeWp)}`, '_blank');
    };

    const formNuevoReporte = document.getElementById('form-nuevo-reporte');
    formNuevoReporte.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombrePerro = selectPerritoReporte.value;
        const texto = document.getElementById('texto-reporte').value;
        const urlMapa = inputUrlMapa.value.trim();
        const fechaHoraActual = new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' });

        const perroEncontrado = perritos.find(p => p.nombre === nombrePerro);
        if (perroEncontrado) {
            let textoCompleto = `[${fechaHoraActual}] 📸 Reporte de ${nombrePerro}: ${texto}\n\n(Foto adjunta del paseo 📸👇)`;
            if (urlMapa) {
                textoCompleto += `\n🗺️ Ruta del recorrido: ${urlMapa}`;
            }
            
            if (!perroEncontrado.reportes) perroEncontrado.reportes = [];
            perroEncontrado.reportes.push({ 
                texto: textoCompleto, 
                urlMapa: urlMapa || null 
            });

            let datosActualizar = { reportes: perroEncontrado.reportes };
            if (perroEncontrado.paqueteActivo && perroEncontrado.paqueteActivo.totalPaseos) {
                let consumidosActuales = perroEncontrado.paqueteActivo.paseosConsumidos || 0;
                if (consumidosActuales < perroEncontrado.paqueteActivo.totalPaseos) {
                    perroEncontrado.paqueteActivo.paseosConsumidos = consumidosActuales + 1;
                    datosActualizar.paqueteActivo = perroEncontrado.paqueteActivo;
                }
            }

            try {
                await updateDoc(doc(db, "perritos", perroEncontrado.id), datosActualizar);

                const telDueno = perroEncontrado.telefonoDueno || TU_NUMERO_WHATSAPP;
                const urlWp = `https://wa.me/${telDueno}?text=${encodeURIComponent(textoCompleto)}`;

                alert(`✅ ¡Reporte y ruta guardados! Se ha descontado 1 paseo del paquete y se abrirá WhatsApp.`);
                window.open(urlWp, '_blank');
                formNuevoReporte.reset();
                mostrarInicio();
            } catch (error) {
                console.error("Error al actualizar reporte:", error);
            }
        }
    });

    const formReserva = document.getElementById('form-reserva');
    formReserva.addEventListener('submit', async function(e) {
        e.preventDefault();
        const perroNombre = selectPerritoReserva.value;
        const servicioSelect = selectServicio.value;
        const numPerros = parseInt(selectNumPerros.value);
        
        const opcionSeleccionada = selectServicio.options[selectServicio.selectedIndex];
        const esPaquete = opcionSeleccionada.dataset.esPaquete === "true";
        const totalPaseosPaquete = parseInt(opcionSeleccionada.dataset.totalPaseos || "0");

        let detalleFechaTexto = "";
        let fechaOriginalGuardar = "";
        let nuevoPaqueteActivo = null;

        if (esPaquete) {
            const diasTxt = inputPaqueteDias.value.trim();
            const horaTxt = inputPaqueteHora.value.trim();
            if (!diasTxt || !horaTxt) {
                alert("Por favor, ingresa los días y la hora preferidos para el paquete.");
                return;
            }
            detalleFechaTexto = `📦 Paquete - Días: ${diasTxt} a las ${horaTxt}`;
            fechaOriginalGuardar = new Date().toISOString();

            nuevoPaqueteActivo = {
                nombreServicio: servicioSelect,
                totalPaseos: totalPaseosPaquete,
                paseosConsumidos: 0
            };
        } else {
            const fecha = inputFecha.value;
            if (!fecha) {
                alert("Por favor, selecciona una fecha y hora.");
                return;
            }
            detalleFechaTexto = fecha.replace('T', ' a las ');
            fechaOriginalGuardar = fecha;
        }

        const perroEncontrado = perritos.find(p => p.nombre === perroNombre);
        let dueno = "Cliente";
        let telDueno = TU_NUMERO_WHATSAPP;
        let familia = "Familia";

        if(perroEncontrado) {
            dueno = perroEncontrado.nombreDueno || "Cliente";
            telDueno = perroEncontrado.telefonoDueno || TU_NUMERO_WHATSAPP;
            familia = perroEncontrado.familia || "Familia";
            
            const nuevaCita = {
                servicio: servicioSelect,
                numPerros: numPerros,
                fecha: detalleFechaTexto,
                fechaOriginal: fechaOriginalGuardar,
                esPaquete: esPaquete
            };

            perroEncontrado.ultimaReserva = nuevaCita;
            if (!perroEncontrado.citas) perroEncontrado.citas = [];
            perroEncontrado.citas.push(nuevaCita);

            if (esPaquete) {
                perroEncontrado.paqueteActivo = nuevoPaqueteActivo;
            }

            if (!perroEncontrado.reportes) perroEncontrado.reportes = [];
            perroEncontrado.reportes.push({
                texto: `📅 ${esPaquete ? 'Paquete contratado' : 'Cita agendada'}: ${servicioSelect} (${numPerros} perros) - ${detalleFechaTexto}.`,
                urlMapa: null
            });

            try {
                let objetoGuardar = {
                    ultimaReserva: perroEncontrado.ultimaReserva,
                    citas: perroEncontrado.citas,
                    reportes: perroEncontrado.reportes
                };
                if (esPaquete) {
                    objetoGuardar.paqueteActivo = perroEncontrado.paqueteActivo;
                }

                await updateDoc(doc(db, "perritos", perroEncontrado.id), objetoGuardar);
            } catch (error) {
                console.error("Error al guardar reserva en Firebase:", error);
            }
        }

        const mensajeWp = `¡Hola Dog's Step's! 🐾 Tengo una nueva reserva/contratación:\n\n👤 *Dueño:* ${dueno} (${familia})\n📱 *Teléfono:* ${telDueno}\n🐕 *Perrito:* ${perroNombre}\n📋 *Servicio:* ${servicioSelect}\n🐶 *Perritos:* ${numPerros}\n📅 *Detalle:* ${detalleFechaTexto}`;
        const urlWp = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${encodeURIComponent(mensajeWp)}`;

        formReserva.reset();
        contenedorPaqueteDias.style.display = 'none';
        contenedorFechaUnica.style.display = 'block';
        cargarPerritosDeNube();

        if (confirm(`¡Reserva guardada con éxito para ${perroNombre} (${familia})! 🐾\n\n¿Deseas enviar la notificación a tu WhatsApp?`)) {
            window.location.href = urlWp;
        } else {
            alert(`¡Guardado correctamente en el sistema!`);
        }
    });

    cargarPerritosDeNube();
});
