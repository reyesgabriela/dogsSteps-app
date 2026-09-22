document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ REEMPLAZA ESTE NÚMERO CON TU WHATSAPP (Ej: 50370000000)
    const TU_NUMERO_WHATSAPP = "50300000000"; 
    
    // Contraseña protegida para el panel de paseador
    const PASSWORD_ADMIN = "1234";

    let perritos = JSON.parse(localStorage.getItem('dogs_perritos')) || [
        { 
            nombre: "Max", 
            raza: "Golden Retriever", 
            edad: "3 años", 
            direccion: "Col. Escalón, Block B", 
            notas: "Le gusta correr mucho. Hidratación constante.",
            reportes: ["Paseo de 45 min completado con éxito. ¡Muy enérgico! 🐕"]
        },
        { 
            nombre: "Luna", 
            raza: "Beagle", 
            edad: "2 años", 
            direccion: "Santa Elena, Polígono 4", 
            notas: "Olfatea demasiado, usar correa corta.",
            reportes: ["Paseo de 30 min realizado sin novedad. 🐾"]
        }
    ];

    // Elementos de la interfaz
    const vistaInicio = document.getElementById('vista-inicio');
    const vistaPerfil = document.getElementById('vista-perfil');
    const vistaAdmin = document.getElementById('vista-admin');
    
    const directorioPerritos = document.getElementById('directorio-perritos');
    const selectPerritoReserva = document.getElementById('perro-select');
    const selectPerritoReporte = document.getElementById('reporte-perro-select');
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
        actualizarSelectsAdmin();
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

            const div = document.createElement('div');
            div.className = 'perfil-card-item';
            div.innerHTML = `
                <div>
                    <strong>🐕 ${p.nombre}</strong><br>
                    <small style="color: #776050;">${p.raza} • ${p.edad}</small>
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

        tarjetaPerfilDetalle.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 3rem; background: #faf6f0; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; margin: 0 auto; border: 2px solid #4a3319;">🐕</div>
                <h2 style="margin: 0.5rem 0 0 0; color: #4a3319;">${p.nombre}</h2>
                <p style="margin: 0; color: #8c6d53; font-weight: bold;">${p.raza} (${p.edad})</p>
            </div>
            <div style="background: #faf6f0; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <p style="margin: 0.3rem 0;">📍 <strong>Dirección de recolección:</strong> ${p.direccion}</p>
                <p style="margin: 0.3rem 0;">⚠️ <strong>Necesidades especiales:</strong> ${p.notas}</p>
            </div>
            <h3 style="color: #4a3319; border-bottom: 1px solid #eee; padding-bottom: 0.3rem;">Historial de Reportes Oficiales</h3>
            <div style="margin-top: 0.8rem;">
                ${p.reportes.length > 0 ? p.reportes.map(r => `<div class="reporte-item">📝 ${r}</div>`).join('') : '<p style="color: #776050;">Aún no hay reportes registrados para este perrito.</p>'}
            </div>
        `;
    }

    buscador.addEventListener('input', (e) => {
        actualizarDirectorio(e.target.value);
    });

    // Permitir que los clientes registren a su perrito libremente
    document.getElementById('form-cliente-perro').addEventListener('submit', (e) => {
        e.preventDefault();
        const nuevoPerro = {
            nombre: document.getElementById('c-nombre').value,
            raza: document.getElementById('c-raza').value,
            edad: document.getElementById('c-edad').value,
            direccion: document.getElementById('c-direccion').value,
            notas: document.getElementById('c-notas').value,
            reportes: ["¡Perfil registrado exitosamente en Dog's Step's! 🎉"]
        };

        perritos.push(nuevoPerro);
        actualizarDirectorio();
        document.getElementById('form-cliente-perro').reset();
        alert('¡Tu perrito ha sido registrado con éxito en Dog\'s Step\'s!');
    });

    // Actualizar selectores del panel de administración
    function actualizarSelectsAdmin() {
        selectPerritoReporte.innerHTML = '';
        perritos.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.nombre;
            opt.textContent = p.nombre;
            selectPerritoReporte.appendChild(opt);
        });
    }

    // Enviar Reporte Oficial (Desde el Admin protegido)
    document.getElementById('form-nuevo-reporte').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombrePerro = selectPerritoReporte.value;
        const texto = document.getElementById('texto-reporte').value;
        const fechaHoraActual = new Date().toLocaleString('es-SV', { dateStyle: 'short', timeStyle: 'short' });

        const perroEncontrado = perritos.find(p => p.nombre === nombrePerro);
        if (perroEncontrado) {
            perroEncontrado.reportes.push(`[${fechaHoraActual}] ${texto}`);
            localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
            alert(`¡Reporte publicado con éxito en el perfil de ${nombrePerro}!`);
            document.getElementById('form-nuevo-reporte').reset();
            mostrarInicio();
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
                perroEncontrado.reportes.push(`📅 Paseo agendado (${servicio}) para el ${fechaFormateada} por ${dueno}.`);
                localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
            }

            // Construir el mensaje de WhatsApp para ti
            const mensajeWp = `¡Hola Dog's Step's! 🐾 Tengo una nueva reserva:%0A%0A👤 *Dueño:* ${dueno}%0A🐕 *Perrito:* ${perroNombre}%0A📋 *Servicio:* ${servicio}%0A📅 *Fecha y hora:* ${fechaFormateada}`;
            
            // Abrir WhatsApp automáticamente con la alerta
            window.open(`https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWp}`, '_blank');

            alert(`¡Gracias ${dueno}! Paseo agendado con éxito para ${perroNombre}. Redirigiendo a WhatsApp para notificar a la paseadora... 🐾`);
            document.getElementById('form-reserva').reset();
            actualizarDirectorio();
        }
    });

    actualizarDirectorio();
});
