document.addEventListener('DOMContentLoaded', () => {
    // Tu número de WhatsApp personal configurado
    const TU_NUMERO_WHATSAPP = "50373484771"; 
    const PASSWORD_ADMIN = "1234";

    let perritos = JSON.parse(localStorage.getItem('dogs_perritos')) || [
        { 
            nombre: "Max", 
            raza: "Golden Retriever", 
            edad: "3 años", 
            direccion: "Col. Escalón, Block B", 
            notas: "Le gusta correr mucho. Hidratación constante.",
            fotoPerfil: null,
            reportes: [{ texto: "Paseo de 45 min completado con éxito. ¡Muy enérgico! 🐕", foto: null }]
        }
    ];

    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPerfil = document.getElementById('vista-perfil');
    const vistaAdmin = document.getElementById('vista-admin');
    
    const directorioPerritos = document.getElementById('directorio-perritos');
    const selectPerritoReserva = document.getElementById('perro-select');
    const selectPerritoReporte = document.getElementById('reporte-perro-select');
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

        const perritosFiltrados = perritos.filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()) || p.raza.toLowerCase().includes(filtro.toLowerCase()));

        if (perritosFiltrados.length === 0) {
            directorioPerritos.innerHTML = '<p style="color: #776050; text-align: center;">No se encontró ningún perrito.</p>';
            return;
        }

        perritosFiltrados.forEach((p) => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = `${p.nombre} (${p.raza})`;
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
                        <strong>${p.nombre}</strong><br>
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
                let imgTag = r.foto ? `
                    <img src="${r.foto}" class="reporte-img">
                    <a href="${r.foto}" download="paseo_${p.nombre}_${index}.jpg" class="btn-descarga">📥 Descargar Foto</a>
                    <span class="aviso-temporal">⏳ Foto temporal: Este archivo caduca y se elimina en 24 horas. ¡Descárgala!</span>
                ` : '';
                return `
                    <div class="reporte-item">
                        📝 ${r.texto}
                        ${imgTag}
                    </div>
                `;
            }).join('');
        } else {
            htmlReportes = '<p style="color: #776050;">Aún no hay reportes registrados para este perrito.</p>';
        }

        tarjetaPerfilDetalle.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                ${avatarGrandeHtml}
                <h2 style="margin: 0.5rem 0 0 0; color: #4a3319;">${p.nombre}</h2>
                <p style="margin: 0; color: #8c6d53; font-weight: bold;">${p.raza} (${p.edad})</p>
            </div>
            <div style="background: #faf6f0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin: 0.3rem 0;">📍 <strong>Dirección de recolección:</strong> ${p.direccion}</p>
                <p style="margin: 0.3rem 0;">⚠️ <strong>Necesidades especiales:</strong> ${p.notas}</p>
            </div>
            <h3 style="color: #4a3319; border-bottom: 1px solid #eee; padding-bottom: 0.3rem;">Historial de Reportes Oficiales</h3>
            <div style="margin-top: 0.8rem;">
                ${htmlReportes}
            </div>
        `;
    }

    buscador.addEventListener('input', (e) => {
        actualizarDirectorio(e.target.value);
    });

    const formClientePerro = document.getElementById('form-cliente-perro');
    formClientePerro.onsubmit = function(e) {
        e.preventDefault();
        const inputFotoPerfil = document.getElementById('c-foto');
        
        const guardarNuevoPerrito = (urlFotoPerfil) => {
            const nombreIngresado = document.getElementById('c-nombre').value;
            const nuevoPerro = {
                nombre: nombreIngresado,
                raza: document.getElementById('c-raza').value,
                edad: document.getElementById('c-edad').value,
                direccion: document.getElementById('c-direccion').value,
                notas: document.getElementById('c-notas').value,
                fotoPerfil: urlFotoPerfil,
                reportes: [{ texto: "¡Perfil registrado exitosamente en Dog's Step's! 🎉", foto: null }]
            };

            perritos.push(nuevoPerro);
            actualizarDirectorio();
            formClientePerro.reset();
            alert(`¡Éxito! El perfil de "${nombreIngresado}" ha sido creado correctamente en Dog's Step's 🐾.`);
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
    };

    function actualizarPanelAdmin() {
        selectPerritoReporte.innerHTML = '';
        perritos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.nombre;
            opt.textContent = p.nombre;
            selectPerritoReporte.appendChild(opt);
        });

        listaAdminPerros.innerHTML = '';
        if (perritos.length === 0) {
            listaAdminPerros.innerHTML = '<p style="color: #742a2a; font-size: 0.9rem;">No hay perritos registrados.</p>';
            return;
        }

        perritos.forEach((p, index) => {
            const fila = document.createElement('div');
            fila.className = 'admin-perfil-fila';
            fila.innerHTML = `
                <div>
                    <strong>🐕 ${p.nombre}</strong> <small style="color: #666;">(${p.raza})</small>
                </div>
                <button class="btn-peligro" data-index="${index}">Eliminar</button>
            `;

            fila.querySelector('button').addEventListener('click', () => {
                if (confirm(`¿Estás segura de que deseas eliminar permanentemente el perfil de ${p.nombre}?`)) {
                    perritos.splice(index, 1);
                    localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
                    actualizarPanelAdmin();
                    alert('Perfil eliminado con éxito.');
                }
            });

            listaAdminPerros.appendChild(fila);
        });
    }

    const formNuevoReporte = document.getElementById('form-nuevo-reporte');
    formNuevoReporte.onsubmit = function(e) {
        e.preventDefault();
        const nombrePerro = selectPerritoReporte.value;
        const texto = document.getElementById('texto-reporte').value;
        const inputFoto = document.getElementById('foto-reporte');
        const fechaHoraActual = new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' });

        const perroEncontrado = perritos.find(p => p.nombre === nombrePerro);
        if (perroEncontrado) {
            const guardarReporteConFoto = (urlFoto) => {
                perroEncontrado.reportes.push({
                    texto: `[${fechaHoraActual}] ${texto}`,
                    foto: urlFoto
                });
                localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
                alert(`🔒 ¡Reporte publicado con éxito en el perfil de ${nombrePerro}!`);
                formNuevoReporte.reset();
                mostrarInicio();
            };

            if (inputFoto.files && inputFoto.files[0]) {
                const reader = new FileReader();
                reader.onload = function(uploadEvent) {
                    guardarReporteConFoto(uploadEvent.target.result);
                };
                reader.readAsDataURL(inputFoto.files[0]);
            } else {
                guardarReporteConFoto(null);
            }
        }
    };

    const formReserva = document.getElementById('form-reserva');
    formReserva.onsubmit = function(e) {
        e.preventDefault();
        const dueno = document.getElementById('dueno').value;
        const perroNombre = selectPerritoReserva.value;
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;

        if(fecha) {
            const fechaFormateada = fecha.replace('T', ' a las ');
            
            const perroEncontrado = perritos.find(p => p.nombre === perroNombre);
            if(perroEncontrado) {
                perroEncontrado.reportes.push({
                    texto: `📅 Paseo agendado (${servicio}) para el ${fechaFormateada} por ${dueno}.`,
                    foto: null
                });
                localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
            }

            const mensajeWp = `¡Hola Dog's Step's! 🐾 Tengo una nueva reserva:%0A%0A👤 *Dueño:* ${dueno}%0A🐕 *Perrito:* ${perroNombre}%0A📋 *Servicio:* ${servicio}%0A📅 *Fecha y hora:* ${fechaFormateada}`;
            const urlWp = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWp}`;

            formReserva.reset();
            actualizarDirectorio();

            if (confirm(`¡Cita agendada con éxito para ${perroNombre}! 🐾\n\n¿Deseas notificar inmediatamente a la paseadora por WhatsApp?`)) {
                window.location.href = urlWp;
            } else {
                alert("Reserva guardada correctamente en el sistema.");
            }
        }
    };

    actualizarDirectorio();
});
