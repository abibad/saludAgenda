// === registro.js ===
class RegistroCitas {
    constructor() {
        this.form = document.getElementById("formRegistro");
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        
        // Validar fecha mínima en tiempo real
        document.getElementById("fecha").addEventListener("input", (e) => {
            const hoy = new Date().toISOString().split("T")[0];
            e.target.min = hoy;
            if (e.target.value < hoy) {
                e.target.value = hoy;
            }
        });

        // Validar teléfono en tiempo real
        document.getElementById("telefono").addEventListener("input", (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }

    validarFormulario() {
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const especialidad = document.getElementById("especialidad").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;
        const motivo = document.getElementById("motivo").value.trim();

        // Validación de campos vacíos
        if (!nombre || !correo || !telefono || !especialidad || !fecha || !hora || !motivo) {
            this.mostrarError("Todos los campos son obligatorios");
            return false;
        }

        // Validación de nombre (solo letras y espacios)
        if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/.test(nombre)) {
            this.mostrarError("El nombre solo debe contener letras");
            return false;
        }

        // Validación de correo
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            this.mostrarError("Ingrese un correo electrónico válido");
            return false;
        }

        // Validación de teléfono
        if (!/^[0-9]{8,10}$/.test(telefono)) {
            this.mostrarError("El teléfono debe tener entre 8 y 10 dígitos");
            return false;
        }

        // Validación de fecha
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaSeleccionada < hoy) {
            this.mostrarError("No se permiten fechas pasadas");
            return false;
        }

        return true;
    }

    mostrarError(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            text: mensaje,
            confirmButtonColor: '#0d6efd'
        });
    }

    mostrarExito() {
        Swal.fire({
            icon: 'success',
            title: '¡Cita registrada!',
            text: 'Su cita ha sido agendada correctamente',
            confirmButtonColor: '#198754'
        });
    }

    guardarCita(datos) {
        let citas = JSON.parse(localStorage.getItem("citas")) || [];
        citas.push(datos);
        localStorage.setItem("citas", JSON.stringify(citas));
    }

    handleSubmit(event) {
        event.preventDefault();

        if (!this.validarFormulario()) return;

        const cita = {
            nombre: document.getElementById("nombre").value.trim(),
            correo: document.getElementById("correo").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            especialidad: document.getElementById("especialidad").value,
            fecha: document.getElementById("fecha").value,
            hora: document.getElementById("hora").value,
            motivo: document.getElementById("motivo").value.trim(),
            estado: "Programada",
            fechaRegistro: new Date().toISOString()
        };

        this.guardarCita(cita);
        this.mostrarExito();
        this.form.reset();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    new RegistroCitas();
});
