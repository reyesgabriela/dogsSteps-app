// Importar Firebase SDK desde los servidores oficiales de Google (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tu configuración de Firebase obtenida de la consola
const firebaseConfig = {
    apiKey: "AIzaSyCuXyJ_HdMbortpE5w1ZTyR8DbVi5CXWtY",
    authDomain: "dogs-steps.firebaseapp.com",
    projectId: "dogs-steps",
    storageBucket: "dogs-steps.firebasestorage.app",
    messagingSenderId: "218797965541",
    appId: "1:218797965541:web:98998455ea54983ba4d40c"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const TU_NUMERO_WHATSAPP = "50373484771"; 
    const PASSWORD_ADMIN = "1234";

    let perritos = [];

    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPerfil = document.getElementById('vista-perfil');
    const vistaAdmin = document.getElementById('vista-admin');
    
    const directorioPerritos = document.getElementById('directorio-perritos');
    const selectPerritoReserva = document.getElementById('perro-select');
    const selectPerritoReporte = document.getElementById('reporte-perro-select');
    const selectAdminAlerta = document.getElementById('admin-perro-alerta');
    const inputAdminTelCliente = document.getElementById('admin-tel-cliente');
    const infoUltimaReserva = document.getElementById('info-ultima-reserva');
    const listaAdminPerros = document.getElementById('lista-admin-perros');
    const buscador = document.getElementById('buscador-perros');
    const tarjetaPerfilDetalle = document.getElementById('tarjeta-perfil-detalle');

    document.getElementById('titulo-app').addEventListener('click', mostrarInicio);
    document.getElementById('btn-volver-inicio').addEventListener('click', mostrarInicio);
    document.getElementById('btn-salir-admin').addEventListener('click', mostrarInicio);

    document.getElementById('btn-ir-admin').addEventListener('click', () => {
        const pass = prompt("Ingresa tu contraseña de paseador:");
        if (pass === PASSWORD_ADMIN) {
            mostrarAdmin();
        } else if (pass !== null) {
            alert("Contraseña incorrecta.");
        }
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
        cargarPerritosDeNube();
    }

    function mostrarAdmin() {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'none';
        vistaAdmin.style.display = 'block';
        cargarPerritosDeNube().then(() => actualizarPanelAdmin());
    }

    function actualizarDirectorio(filtro = '') {
        directorioPerritos.innerHTML = '';
        selectPerritoReserva.innerHTML = '';

        const perritosFiltrados = perritos.filter(p => 
            (p.nombre && p.nombre.toLowerCase().includes(filtro.toLowerCase())) || 
            (p.familia && p.familia.toLowerCase().includes(filtro.toLowerCase())) ||
            (p.raza && p.raza.toLowerCase().includes(filtro.toLowerCase()))
        );

        if (perritosFiltrados.length === 0) {
            directorioPerritos.innerHTML = '<p style="color: #776050; text-align: center;">No se encontró ningún registro.</p>';
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
                <span style="color: #4a3319; font-weight: bold; font-size: 0.9rem;">Ver Perfil →</span>
            `;

            div.addEventListener('click', () => {
                abrirPerfilIndividual(p);
            });

            directorioPerritos.appendChild(div);
        });
    }

    function abrirPerfilIndividual(p) {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'block';
        vistaAdmin.style.display = 'none';

        let avatarGrandeHtml = p.fotoPerfil ? 
            `<img src="${p.fotoPerfil}" class="avatar-perfil-grande">` : 
            `<div style="font-size: 3.5rem; background: #faf6f0; width: 90px; height: 90px; line-height: 90px; border-radius: 50%; margin: 0 auto 0.5rem auto; border: 3px solid #4a3319; text-align: center;">🐕</div>`;

        let htmlReportes = '';
        if (p.reportes && p.reportes.length > 0) {
            htmlReportes = p.reportes.map((r, index) => {
                let mediaTag = '';
                if (r.media) {
                    if (r.tipoMedia === 'video') {
                        mediaTag = `
                            <video src="${r.media}" controls class="reporte-video"></video>
                            <a href="${r.media}" download="video_paseo_${p.nombre}_${index}.mp4" class="btn-descarga">📥 Descargar Video</a>
                            <span class="aviso-temporal">⏳ Archivo temporal: Este video caduca y se elimina en 24 horas.</span>
                        `;
                    } else {
                        mediaTag = `
                            <img src="${r.media}" class="reporte-img">
                            <a href="${r.media}" download="foto_paseo_${p.nombre}_${index}.jpg" class="btn-descarga">📥 Descargar Foto</a>
                            <span class="aviso-temporal">⏳ Archivo temporal: Esta foto caduca y se elimina en 24 horas.</span>
                        `;
                    }
                }
                return `
                    <div class="reporte-item">
                        📝 ${r.texto}
                        ${mediaTag}
                    </div>
                `;
            }).join('');
        } else {
            htmlReportes = '<p style="color: #776050;">Aún no hay reportes registrados.</p>';
        }

        tarjetaPerfilDetalle.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                ${avatarGrandeHtml}
                <h2 style="margin: 0.5rem 0 0 0; color: #4a3319;">${p.nombre}</h2>
                <p style="margin: 0; color: #8c6d53; font-weight: bold;">${p.familia} • ${p.raza} (${p.edad})</p>
            </div>
            <div style="background: #faf6f0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin: 0.3rem 0;">👤 <strong>Dueño:</strong> ${p.nombreDueno || 'No especificado'}</p>
                <p style="margin: 0.3rem 0;">📱 <strong>WhatsApp:</strong> ${p.telefonoDueno || 'No especificado'}</p>
                <p style="margin: 0.3rem 0;">📍 <strong>Dirección:</strong> ${p.direccion}</p>
                <p style="margin: 0.3rem 0;">⚠️ <strong>Notas:</strong> ${p.notas}</p>
            </div>
            <h3 style="color: #4a3319; border-bottom: 1px solid #eee; padding-bottom: 0.3rem;">Historial de Reportes y Facturas</h3>
            <div style="margin-top: 0.8rem;">
                ${htmlReportes}
            </div>
        `;
    }

    buscador.addEventListener('input', (e) => {
        actualizarDirectorio(e.target.value);
    });

    // Registrar nuevo perrito directamente en Firebase
    const formClientePerro = document.getElementById('form-cliente-perro');
    formClientePerro.addEventListener('submit', async function(e) {
        e.preventDefault();
        const inputFotoPerfil = document.getElementById('c-foto');
        const nombreIngresado = document.getElementById('c-nombre').value;
        const familiaIngresada = document.getElementById('c-familia').value;
        
        const guardarEnNube = async (urlFotoPerfil) => {
            const nuevoPerro = {
                nombre: nombreIngresado,
                familia: familiaIngresada,
                nombreDueno: document.getElementById('c-dueno').value,
                telefonoDueno: document.getElementById('c-tel').value,
                raza: document.getElementById('c-raza').value,
                edad: document.getElementById('c-edad').value,
                direccion: document.getElementById('c-direccion').value,
                notas: document.getElementById('c-notas').value,
                fotoPerfil: urlFotoPerfil,
                reportes: [{ texto: `¡Perfil de ${nombreIngresado} registrado con éxito en ${familiaIngresada}! 🎉`, media: null, tipoMedia: null }],
                ultimaReserva: null
            };

            try {
                await addDoc(collection(db, "perritos"), nuevoPerro);
                formClientePerro.reset();
                alert(`¡Éxito! El perfil de "${nombreIngresado}" (${familiaIngresada}) ha sido creado y guardado en la nube 🐾.`);
                cargarPerritosDeNube();
            } catch (error) {
                console.error("Error al guardar en Firebase:", error);
                alert("Hubo un error al guardar el registro en la nube.");
            }
        };

        if (inputFotoPerfil.files && inputFotoPerfil.files[0]) {
            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                guardarEnNube(uploadEvent.target.result);
            };
            reader.readAsDataURL(inputFotoPerfil.files[0]);
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
            opt2.textContent = `${p.nombre} (${p.familia})`;
            opt2.dataset.tel = p.telefonoDueno || "";
            selectAdminAlerta.appendChild(opt2);
        });

        selectAdminAlerta.onchange = function() {
            const selectedOpt = selectAdminAlerta.options[selectAdminAlerta.selectedIndex];
            inputAdminTelCliente.value = selectedOpt.dataset.tel || "";
            
            const perritoActual = perritos.find(p => p.nombre === selectAdminAlerta.value);
            if (perritoActual && perritoActual.ultimaReserva) {
                const r = perritoActual.ultimaReserva;
                infoUltimaReserva.innerHTML = `📋 <strong>Servicio:</strong> ${r.servicio}<br>🐶 <strong>Perritos:</strong> ${r.numPerros}<br>📅 <strong>Fecha:</strong> ${r.fecha}`;
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
                <div>
                    <strong>🐕 ${p.nombre}</strong> <small style="color: #666;">[${p.familia}]</small>
                </div>
                <button class="btn-peligro" data-id="${p.id}">Eliminar</button>
            `;

            fila.querySelector('button').addEventListener('click', async () => {
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
        const mensaje = `¡Hola! 🐾 Te escribimos de Dog's Step's para avisarte que *acabamos de iniciar* el paseo de ${nombrePerro}. ¡Todo listo y con la mejor energía! 🐕✨`;
        window.open(`https://wa.me/${telCliente}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    document.getElementById('btn-finalizar-paseo').onclick = function() {
        const nombrePerro = selectAdminAlerta.value;
        const telCliente = inputAdminTelCliente.value.trim();
        if(!telCliente) {
            alert("No hay número de contacto registrado.");
            return;
        }
        const mensaje = `¡Hola! 🐾 Te escribimos de Dog's Step's para avisarte que *hemos finalizado con éxito* el paseo de ${nombrePerro}. ¡Ya está de vuelta en casa y descansando feliz! ❤️🏡`;
        window.open(`https://wa.me/${telCliente}?text=${encodeURIComponent(mensaje)}`, '_blank');
    };

    // GENERAR FACTURA AUTOMÁTICA DESDE LA RESERVA (Con encodeURIComponent para emojis limpios)
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
            perroEncontrado.reportes.push({
                texto: `🧾 Factura automática enviada: ${servicioSelect} (${numPerros} perros) - Total: $${totalPagar}.`,
                media: null,
                tipoMedia: null
            });
            updateDoc(doc(db, "perritos", perroEncontrado.id), { reportes: perroEncontrado.reportes });
        }

        const mensajeWp = `🐾 *FACTURA / RECIBO - DOG'S STEP'S* 🐾\n\n👤 *Cliente / Familia:* ${dueno} (${familia})\n🐕 *Perrito principal:* ${nombrePerro}\n📋 *Servicio:* ${servicioSelect}\n🐶 *Cantidad de perritos:* ${numPerros}${detalleExtras}\n\n💰 *TOTAL A PAGAR: $${totalPagar}.00*\n\n💳 *Métodos de pago:*\n• Efectivo\n• Transferencia Bancoagrícola\n  Titular: NATALIA REYES\n  N° de Cuenta: \`3100617261\`\n\n¡Gracias por confiar en Dog's Step's! 🐕✨`;
        
        window.open(`https://wa.me/${telCliente}?text=${encodeURIComponent(mensajeWp)}`, '_blank');
    };

    // PUBLICAR REPORTE (Actualiza en la nube de Firebase)
    const formNuevoReporte = document.getElementById('form-nuevo-reporte');
    formNuevoReporte.addEventListener('submit', async function(e) {
        e.preventDefault();
        const nombrePerro = selectPerritoReporte.value;
        const texto = document.getElementById('texto-reporte').value;
        const inputArchivo = document.getElementById('archivo-reporte');
        const fechaHoraActual = new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' });

        const perroEncontrado = perritos.find(p => p.nombre === nombrePerro);
        if (perroEncontrado) {
            const guardarReporteEnNube = async (urlMedia, tipo) => {
                const textoCompleto = `[${fechaHoraActual}] 📸 Reporte de ${nombrePerro}: ${texto}`;
                
                perroEncontrado.reportes.push({
                    texto: textoCompleto,
                    media: urlMedia,
                    tipoMedia: tipo
                });

                try {
                    await updateDoc(doc(db, "perritos", perroEncontrado.id), {
                        reportes: perroEncontrado.reportes
                    });

                    cargarPerritosDeNube();
                    navigator.clipboard.writeText(textoCompleto).catch(() => {});

                    const telDueno = perroEncontrado.telefonoDueno || TU_NUMERO_WHATSAPP;
                    const urlWp = `https://wa.me/${telDueno}?text=${encodeURIComponent(textoCompleto)}`;

                    alert(`✅ ¡Reporte multimedia publicado y sincronizado en la nube para ${nombrePerro}!`);
                    window.open(urlWp, '_blank');
                    formNuevoReporte.reset();
                    mostrarInicio();
                } catch (error) {
                    console.error("Error al actualizar reporte:", error);
                }
            };

            if (inputArchivo.files && inputArchivo.files[0]) {
                const archivo = inputArchivo.files[0];
                const tipo = archivo.type.startsWith('video') ? 'video' : 'foto';
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    guardarReporteEnNube(uploadEvent.target.result, tipo);
                };
                reader.readAsDataURL(archivo);
            } else {
                guardarReporteEnNube(null, null);
            }
        }
    });

    // RESERVA DEL CLIENTE (Sincronizada en la nube)
    const formReserva = document.getElementById('form-reserva');
    formReserva.addEventListener('submit', async function(e) {
        e.preventDefault();
        const perroNombre = selectPerritoReserva.value;
        const servicioSelect = document.getElementById('servicio').value;
        const numPerros = parseInt(document.getElementById('num-perros-servicio').value);
        const fecha = document.getElementById('fecha').value;

        if(fecha) {
            let citaOcupada = false;
            perritos.forEach(p => {
                if (p.reportes) {
                    p.reportes.forEach(r => {
                        if (r.texto && r.texto.includes(`📅 Cita agendada`) && r.texto.includes(fecha.replace('T', ' a las '))) {
                            citaOcupada = true;
                        }
                    });
                }
            });

            if (citaOcupada) {
                alert(`❌ Lo sentimos mucho, pero este horario ya está reservado en la nube por otro perrito.\n\nPor favor, selecciona otra fecha u hora disponible. 🐾`);
                return;
            }

            const fechaFormateada = fecha.replace('T', ' a las ');
            const perroEncontrado = perritos.find(p => p.nombre === perroNombre);
            let dueno = "Cliente";
            let telDueno = TU_NUMERO_WHATSAPP;
            let familia = "Familia";

            if(perroEncontrado) {
                dueno = perroEncontrado.nombreDueno || "Cliente";
                telDueno = perroEncontrado.telefonoDueno || TU_NUMERO_WHATSAPP;
                familia = perroEncontrado.familia || "Familia";
                
                perroEncontrado.ultimaReserva = {
                    servicio: servicioSelect,
                    numPerros: numPerros,
                    fecha: fechaFormateada
                };

                perroEncontrado.reportes.push({
                    texto: `📅 Cita agendada: ${servicioSelect} (${numPerros} perros) para el ${fechaFormateada}.`,
                    media: null,
                    tipoMedia: null
                });

                try {
                    await updateDoc(doc(db, "perritos", perroEncontrado.id), {
                        ultimaReserva: perroEncontrado.ultimaReserva,
                        reportes: perroEncontrado.reportes
                    });
                } catch (error) {
                    console.error("Error al guardar reserva en Firebase:", error);
                }
            }

            const mensajeWp = `¡Hola Dog's Step's! 🐾 Tengo una nueva reserva de espacio:\n\n👤 *Dueño:* ${dueno} (${familia})\n📱 *Teléfono:* ${telDueno}\n🐕 *Perrito:* ${perroNombre}\n📋 *Servicio:* ${servicioSelect}\n🐶 *Perritos:* ${numPerros}\n📅 *Fecha:* ${fechaFormateada}`;
            const urlWp = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${encodeURIComponent(mensajeWp)}`;

            formReserva.reset();
            cargarPerritosDeNube();

            if (confirm(`¡Cita agendada y guardada en la nube para ${perroNombre} (${familia})! 🐾\n\n¿Deseas notificar inmediatamente a tu WhatsApp que hay un nuevo cupo reservado?`)) {
                window.location.href = urlWp;
            } else {
                alert(`¡Cita agendada correctamente en el sistema!`);
            }
        }
    });

    cargarPerritosDeNube();
});
