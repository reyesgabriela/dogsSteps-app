document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ REEMPLAZA ESTE NÚMERO CON TU WHATSAPP (Ej: 50370000000)
    const TU_NUMERO_WHATSAPP = "50373484771"; 
    
    // Contraseña protegida para el panel de paseador
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
        },
        { 
            nombre: "Luna", 
            raza: "Beagle", 
            edad: "2 años", 
            direccion: "Santa Elena, Polígono 4", 
            notas: "Olfatea demasiado, usar correa corta.",
            fotoPerfil: null,
            reportes: [{ texto: "Paseo de 30 min realizado sin novedad. 🐾", foto: null }]
        }
    ];

    // Elementos de la interfaz
    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPerfil = document.getElementById('vista-perfil');
    const vistaAdmin = document.getElementById('vista-admin');
    
    const directorioPerritos = document.getElementById('directorio-perritos');
    const selectPerritoReserva = document.getElementById('perro-select');
    const selectPerritoReporte = document.getElementById('reporte-perro-select');
    const listaAdminPerros = document.getElementById('lista-admin-perros');
    const buscador = document.getElementById('buscador-perros');
    const tarjetaPerfilDetalle = document.getElementById('tarjeta-perfil-detalle');

    // Botones de navegación
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

    // Renderizar directorio de perfiles (Buscable)
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

    // Mostrar perfil individual detallado
    function abrirPerfilIndividual(p) {
        vistaInicio.style.display = 'none';
        vistaPerfil.style.display = 'block';
        vistaAdmin.style.display = 'none';

        let avatarGrandeHtml = p.fotoPerfil ? 
            `<img src="${p.fotoPerfil}" class="avatar-perfil-grande">` : 
            `<div style="font-size: 3.5rem; background: #faf6f0; width: 90px; height: 90px; line-height: 90px; border-radius: 50%; margin: 0 auto 0.5rem auto; border: 3px solid #4a3319; text-align: center;">🐕</div>`;

        let htmlReportes = '';
        if (p.reportes.length > 0) {
            htmlReportes = p.reportes.map(r => {
                let imgTag = r.foto ? `<img src="${r.foto}" class="reporte-img"><span class="aviso-temporal">⏳ Foto temporal: Este archivo caduca y se elimina en 24 horas. ¡Descárgala!</span>` : '';
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

    // Permitir que los clientes registren a su perrito con foto de perfil
    document.getElementById('form-cliente-perro').addEventListener('submit', (e) => {
        e.preventDefault();
        const inputFotoPerfil = document.getElementById('c-foto');
        
        const guardarNuevoPerrito = (urlFotoPerfil) => {
            const nuevoPerro = {
                nombre: document.getElementById('c-nombre').value,
                raza: document.getElementById('c-raza').value,
                edad: document.getElementById('c-edad').value,
                direccion: document.getElementById('c-direccion').value,
                notas: document.getElementById('c-notas').value,
                fotoPerfil: urlFotoPerfil,
                reportes: [{ texto: "¡Perfil registrado exitosamente en Dog's Step's! 🎉", foto: null }]
            };

            perritos.push(nuevoPerro);
            actualizarDirectorio();
            document.getElementById('form-cliente-perro').reset();
            alert('¡Tu perrito ha sido registrado con éxito en Dog\'s Step\'s!');
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

    // Actualizar elementos dentro del panel de administración (Selector y lista de borrado)
    function actualizarPanelAdmin() {
        // Llenar selector de reportes
        selectPerritoReporte.innerHTML = '';
        perritos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.nombre;
            opt.textContent = p.nombre;
            selectPerritoReporte.appendChild(opt);
        });

        // Llenar lista de gestión para eliminar perfiles
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

            // Botón para eliminar perrito con confirmación
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

    // Enviar Reporte Oficial con foto adjunta (Desde el Admin protegido)
    document.getElementById('form-nuevo-reporte').addEventListener('submit', (e) => {
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
                alert(`¡Reporte publicado con éxito en el perfil de ${nombrePerro}!`);
                document.getElementById('form-nuevo-reporte').reset();
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
    });

    // Manejo de reservas de clientes con notificación automática a WhatsApp
    document.getElementById('form-reserva').addEventListener('submit', (e) => {
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
            
            window.open(`https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWp}`, '_blank');

            alert(`¡Gracias ${dueno}! Paseo agendado con éxito para ${perroNombre}. Redirigiendo a WhatsApp para notificar a la paseadora... 🐾`);
            document.getElementById('form-reserva').reset();
            actualizarDirectorio();
        }
    });

    actualizarDirectorio();
});
