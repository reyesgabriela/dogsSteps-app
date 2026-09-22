document.addEventListener('DOMContentLoaded', () => {
    // Perfiles simulados basados en tu clientela
    const perritos = [
        { nombre: "Max", raza: "Golden Retriever", notas: "Le gusta correr mucho. Hidratación constante." },
        { nombre: "Luna", raza: "Beagle", notas: "Olfatea demasiado, usar correa corta." },
        { nombre: "Kaiser", raza: "Pastor Alemán", notas: "Tranquilo pero prefiere caminar solo." }
    ];

    const contenedorPerros = document.getElementById('lista-perritos');

    perritos.forEach(p => {
        const div = document.createElement('div');
        div.style.marginBottom = "0.8rem";
        div.style.borderBottom = "1px solid #f4efe9";
        div.style.paddingBottom = "0.5rem";
        div.innerHTML = `<strong>🐕 ${p.nombre}</strong> (${p.raza})<br><small style="color: #776050;">Nota: ${p.notas}</small>`;
        contenedorPerros.appendChild(div);
    });

    // Manejo de la reserva conectada
    const formReserva = document.getElementById('form-reserva');
    formReserva.addEventListener('submit', (e) => {
        e.preventDefault();
        const dueno = document.getElementById('dueno').value;
        const perro = document.getElementById('perro').value;
        const servicio = document.getElementById('servicio').value;
        const fecha = document.getElementById('fecha').value;

        if(fecha) {
            alert(`¡Gracias ${dueno}! Paseo agendado con éxito para ${perro} (${servicio}). ¡Nos vemos pronto en Dog's Step's! 🐾`);
            formReserva.reset();
        }
    });
});