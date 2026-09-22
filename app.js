document.addEventListener('DOMContentLoaded', () => {
    // Datos iniciales base si el navegador no tiene registros previos
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
            reportes: ["Paseo de 30 min realizado sin novedad."]
        },
        { 
            nombre: "Kaiser", 
            raza: "Pastor Alemán", 
            edad: "4 años", 
            direccion: "Antiguo Cuscatlán, Res. El Encanto", 
            notas: "Tranquilo pero prefiere caminar solo.",
            reportes: ["Paseo de 60 min completado excelente."]
        }
    ];

    const contenedorPerros = document.getElementById('lista-perritos');
    const selectPerrito = document.getElementById('perro-select');
    const btnMostrarForm = document.getElementById('btn-mostrar-form-perro');
    const formNuevoPerro = document.getElementById('form-nuevo-perro');

    // Mostrar u ocultar formulario de nuevo perro
    btnMostrarForm.addEventListener('click', () => {
        formNuevoPerro.style.display = formNuevoPerro.style.display === 'none' ? 'block' : 'none';
    });

    // Función para renderizar perritos y selectores
    function actualizarVista() {
        contenedorPerros.innerHTML = '';
        selectPerrito.innerHTML = '';

        perritos.forEach((p, index) => {
            // Llenar el selector de reservas
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = `${p.nombre} (${p.raza})`;
            selectPerrito.appendChild(option);

            // Crear tarjeta interactiva del perfil
            const div = document.createElement('div');
            div.className = 'perro-item';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                    <strong>🐕 ${p.nombre}</strong> 
                    <span style="font-size: 0.85rem; color: #8c6d53;">Ver detalles ▼</span>
                </div>
                <div class="detalles-perro" style="display: none;">
                    <p><strong>Raza:</strong> ${p.raza}</p>
                    <p><strong>Edad:</strong> ${p.edad}</p>
                    <p><strong>Dirección:</strong> ${p.direccion}</p>
                    <p><strong>Notas:</strong> ${p.notas}</p>
                    <h4 style="margin: 0.5rem 0 0.2rem 0; color: #4a3319;">Historial de Reportes:</h4>
                    <ul style="padding-left: 1rem; margin: 0;">
                        ${p.reportes.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            `;

            // Efecto acordeón al hacer clic en el perfil
            const headerDiv = div.firstElementChild;
            const detallesDiv = div.lastElementChild;
            headerDiv.addEventListener('click', () => {
                detallesDiv.style.display = detallesDiv.style.display === 'none' ? 'block' : 'none';
            });

            contenedorPerros.appendChild(div);
        });

        // Guardar en localStorage
        localStorage.setItem('dogs_perritos', JSON.stringify(perritos));
    }

    // Registrar nuevo perrito desde la app
    formNuevoPerro.addEventListener('submit', (e) => {
        e.preventDefault();
        const nuevoPerro = {
            nombre: document.getElementById('nuevo-nombre').value,
            raza: document.getElementById('nuevo-raza').value,
            edad: document.getElementById('nuevo-edad').value,
            direccion: document.getElementById('nuevo-direccion').value,
            notas: document.getElementById('nuevo-notas').value,
            reportes: ["¡Perfil creado con éxito en Dog's Step's! 🎉"]
        };

        perritos.push(nuevoPerro);
        actualizarVista();
        formNuevoPerro.reset();
        formNuevoPerro.style.display = 'none';
        alert('¡Perrito registrado con éxito!');
    });

    // Manejo del formulario de reservas
    const formReserva = document.getElementById('form-reserva');
    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        const dueno = document.getElementById('dueno').value;
        const perroNombre = selectPerrito.value;
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;

        if(fecha) {
            // Agregar un reporte automático al perrito seleccionado correspondiente a la reserva
            const perroEncontrado = perritos.find(p => p.nombre === perroNombre);
            if(perroEncontrado) {
                perroEncontrado.reportes.push(`Paseo agendado (${servicio}) para el ${fecha.replace('T', ' a las ')} por ${dueno}. 📅`);
                actualizarVista();
            }

            alert(`¡Gracias ${dueno}! Paseo agendado con éxito para ${perroNombre} (${servicio}). 🐾`);
            formReserva.reset();
        }
    });

    // Inicializar la vista por primera vez
    actualizarVista();
});
