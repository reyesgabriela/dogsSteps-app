document.addEventListener('DOMContentLoaded', () => {
    const TU_NUMERO_WHATSAPP = "50373484771"; 
    const PASSWORD_ADMIN = "1234";

    let perritos = JSON.parse(localStorage.getItem('dogs_perritos')) || [
        { 
            nombre: "Max", 
            familia: "Familia Ramírez",
            raza: "Golden Retriever", 
            edad: "3 años", 
            direccion: "Col. Escalón, Block B", 
            notas: "Le gusta correr mucho.",
            nombreDueno: "Natalia Ramírez",
            telefonoDueno: "50373484771",
            fotoPerfil: null,
            reportes: [{ texto: "¡Perfil inicial registrado en Dog's Step's! 🐾", media: null, tipoMedia: null }]
        }
    ];

    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPerfil = document.getElementById('vista-perfil');
    const vistaAdmin = document.getElementById('vista-admin');
    
    const directorioPerritos = document.getElementById('directorio-perritos');
    const selectPerritoReserva = document.getElementById('perro-select');
    const selectPerritoReporte = document.getElementById('reporte-perro-select');
    const selectAdminAlerta = document.getElementById('admin-perro-alerta');
    const inputAdminTelCliente = document.getElementById('admin-tel-cliente');
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

    function mostrarInicio() {
        vistaInicio.style.display = 'block';
        vistaPerfil.style.display = 'none';
        vistaAdmin.style.display = 'none';
        actualizarDirectorio();
    }

    function mostrarAdmin() {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'none';
        vistaAdmin.style.display = 'block';
        actualizarPanelAdmin();
    }

    function actualizarDirectorio(filtro = '') {
        directorioPerritos.innerHTML = '';
        selectPerritoReserva.innerHTML = '';

        const perritosFiltrados = perritos.filter(p => 
            p.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
            p.familia.toLowerCase().includes(filtro.toLowerCase()) ||
            p.raza.toLowerCase().includes(filtro.toLowerCase())
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

        localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
    }

    function abrirPerfilIndividual(p) {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'block';
        vistaAdmin.style.display = 'none';

        let avatarGrandeHtml = p.fotoPerfil ? 
            `<img src="${p.fotoPerfil}" class="avatar-perfil-grande">` : 
            `<div style="font-size: 3.5rem; background: #faf6f0; width: 90px; height: 90px; line-height: 90px; border-radius: 50%; margin: 0 auto 0.5rem auto; border: 3px solid #4a3319; text-align: center;">🐕</div>`;

        let htmlReportes = '';
        if (p.reportes.length > 0) {
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

    // REGISTRO DE PERRITO (Con alerta asegurada al 100%)
    const formClientePerro = document.getElementById('form-cliente-perro');
    formClientePerro.addEventListener('submit', function(e) {
        e.preventDefault();
        const inputFotoPerfil = document.getElementById('c-foto');
        const nombreIngresado = document.getElementById('c-nombre').value;
        const familiaIngresada = document.getElementById('c-familia').value;
        
        const guardarNuevoPerrito = (urlFotoPerfil) => {
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
                reportes: [{ texto: `¡Perfil de ${nombreIngresado} registrado con éxito en ${familiaIngresada}! 🎉`, media: null, tipoMedia: null }]
            };

            perritos.push(nuevoPerro);
            actualizarDirectorio();
            formClientePerro.reset();
            
            // Alerta de confirmación inmediata
            alert(`¡Éxito! El perfil de "${nombreIngresado}" (${familiaIngresada}) ha sido creado correctamente en Dog's Step's 🐾.`);
        };

        if (inputFotoPerfil.files && inputFotoPerfil.files[0]) {
            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                guardarNuevoPerrito(uploadEvent.target.result);
            };
            reader.readAsDataURL(inputFotoPerfil.files[0]);
        } else {
            guardarNuevoPerrito(null);
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
        };
        if(selectAdminAlerta.options.length > 0) {
            selectAdminAlerta.onchange();
        }

        listaAdminPerros.innerHTML = '';
        if (perritos.length === 0) {
            listaAdminPerros.innerHTML = '<p style="color: #742a2a; font-size: 0.9rem;">No hay registros.</p>';
            return;
        }

        perritos.forEach((p, index) => {
            const fila = document.createElement('div');
            fila.className = 'admin-perfil-fila';
            fila.innerHTML = `
                <div>
                    <strong>🐕 ${p.nombre}</strong> <small style="color: #666;">[${p.familia}]</small>
                </div>
                <button class="btn-peligro" data-index="${index}">Eliminar</button>
            `;

            fila.querySelector('button').addEventListener('click', () => {
                if (confirm(`¿Estás segura de eliminar permanentemente a ${p.nombre}?`)) {
                    perritos.splice(index, 1);
                    localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
                    actualizarPanelAdmin();
                    alert('Perfil eliminado con éxito.');
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

    const formNuevoReporte = document.getElementById('form-nuevo-reporte');
    formNuevoReporte.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombrePerro = selectPerritoReporte.value;
        const texto = document.getElementById('texto-reporte').value;
        const inputArchivo = document.getElementById('archivo-reporte');
        const fechaHoraActual = new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' });

        const perroEncontrado = perritos.find(p => p.nombre === nombrePerro);
        if (perroEncontrado) {
            const guardarReporteMultimedia = (urlMedia, tipo) => {
                perroEncontrado.reportes.push({
                    texto: `[${fechaHoraActual}] ${texto}`,
                    media: urlMedia,
                    tipoMedia: tipo
                });
                localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
                alert(`🔒 ¡Reporte publicado con éxito en el perfil de ${nombrePerro}!`);
                formNuevoReporte.reset();
                mostrarInicio();
            };

            if (inputArchivo.files && inputArchivo.files[0]) {
                const archivo = inputArchivo.files[0];
                const tipo = archivo.type.startsWith('video') ? 'video' : 'foto';
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    guardarReporteMultimedia(uploadEvent.target.result, tipo);
                };
                reader.readAsDataURL(archivo);
            } else {
                guardarReporteMultimedia(null, null);
            }
        }
    });

    // RESERVA CON CÁLCULO Y ALERTA DE ÉXITO ESTRICTA
    const formReserva = document.getElementById('form-reserva');
    formReserva.addEventListener('submit', function(e) {
        e.preventDefault();
        const perroNombre = selectPerritoReserva.value;
        const servicioSelect = document.getElementById('servicio').value;
        const numPerros = parseInt(document.getElementById('num-perros-servicio').value);
        const esDomingoFeriado = document.getElementById('es-domingo-feriado').checked;
        const fecha = document.getElementById('fecha').value;

        if(fecha) {
            const fechaFormateada = fecha.replace('T', ' a las ');
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

            if (esDomingoFeriado) {
                totalPagar += 2;
                detalleExtras += "\n☀️ Domingo/Feriado: +$2";
            }

            const perroEncontrado = perritos.find(p => p.nombre === perroNombre);
            let dueno = "Cliente";
            let telDueno = TU_NUMERO_WHATSAPP;
            let familia = "Familia";

            if(perroEncontrado) {
                dueno = perroEncontrado.nombreDueno || "Cliente";
                telDueno = perroEncontrado.telefonoDueno || TU_NUMERO_WHATSAPP;
                familia = perroEncontrado.familia || "Familia";
                
                perroEncontrado.reportes.push({
                    texto: `🧾 Factura generada: ${servicioSelect} (${numPerros} perros) - Total: $${totalPagar}. Fecha: ${fechaFormateada}`,
                    media: null,
                    tipoMedia: null
                });
                localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
            }

            const mensajeWp = `🐾 *FACTURA / RECIBO - DOG'S STEP'S* 🐾%0A%0A👤 *Cliente / Familia:* ${dueno} (${familia})%0A📱 *Teléfono:* ${telDueno}%0A🐕 *Perrito principal:* ${perroNombre}%0A📋 *Servicio:* ${servicioSelect}%0A🐶 *Cantidad de perritos:* ${numPerros}${detalleExtras}%0A📅 *Fecha del paseo:* ${fechaFormateada}%0A%0A💰 *TOTAL A PAGAR: $${totalPagar}.00*%0A%0A💳 *Métodos de pago:*%0A• Efectivo%0A• Bancoagrícola (Ahorro: 3100617261 - Natalia Reyes)%0A%0A¡Gracias por confiar en Dog's Step's! 🐕✨`;
            const urlWp = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWp}`;

            formReserva.reset();
            actualizarDirectorio();

            // Alerta estricta de confirmación
            if (confirm(`¡Cita agendada con éxito para ${perroNombre} (${familia})! 🐾\n\nTotal calculado: $${totalPagar}.00\n\n¿Deseas enviar la factura por WhatsApp ahora mismo?`)) {
                window.location.href = urlWp;
            } else {
                alert(`¡Cita agendada con éxito! Total a pagar: $${totalPagar}.00 guardado en el perfil.`);
            }
        }
    });

    actualizarDirectorio();
});
