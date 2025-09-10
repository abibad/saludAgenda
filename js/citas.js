// === CitasManager: Manejo de citas médicas ===
const CitasManager = {
    citas: [],
    
    // Inicializar
    init() {
        this.cargarCitas();
        this.setupEventListeners();
        this.mostrarCitas();
    },

    // Cargar citas desde localStorage
    cargarCitas() {
        this.citas = JSON.parse(localStorage.getItem("citas")) || [];
    },

    // Guardar citas en localStorage
    guardarCitas() {
        localStorage.setItem("citas", JSON.stringify(this.citas));
    },

    // Configurar event listeners
    setupEventListeners() {
        document.getElementById("filtroEspecialidad").addEventListener("change", () => this.mostrarCitas());
        document.getElementById("filtroDesde").addEventListener("change", () => this.mostrarCitas());
        document.getElementById("filtroHasta").addEventListener("change", () => this.mostrarCitas());
    },

    // Obtener clase de badge según estado
    getBadgeClass(estado) {
        const badges = {
            'Programada': 'bg-primary',
            'Confirmada': 'bg-success',
            'Cancelada': 'bg-danger'
        };
        return badges[estado] || 'bg-primary';
    },

    // Formatear fecha
    formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString('es-ES');
    },

    // Mostrar citas en la tabla
    mostrarCitas() {
        const filtroEsp = document.getElementById("filtroEspecialidad").value;
        const filtroDesde = document.getElementById("filtroDesde").value;
        const filtroHasta = document.getElementById("filtroHasta").value;

        const citasFiltradas = this.citas.filter(cita => {
            if (filtroEsp && cita.especialidad !== filtroEsp) return false;
            if (filtroDesde && cita.fecha < filtroDesde) return false;
            if (filtroHasta && cita.fecha > filtroHasta) return false;
            return true;
        });

        const tbody = document.getElementById("tablaCitas");
        tbody.innerHTML = citasFiltradas.map((cita, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${cita.nombre}</td>
                <td>${cita.especialidad}</td>
                <td>${this.formatearFecha(cita.fecha)}</td>
                <td>${cita.hora}</td>
                <td>
                    <span class="badge ${this.getBadgeClass(cita.estado)}">
                        ${cita.estado || 'Programada'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="CitasManager.editarCita(${index})">
                        <i class="fas fa-edit me-1"></i>Editar
                    </button>
                    <button class="btn btn-info btn-sm mx-1" onclick="CitasManager.cambiarEstado(${index})">
                        <i class="fas fa-sync-alt me-1"></i>Estado
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="CitasManager.eliminarCita(${index})">
                        <i class="fas fa-trash-alt me-1"></i>Eliminar
                    </button>
                </td>
            </tr>
        `).join('');
    },

    // Editar cita
    editarCita(index) {
        const cita = this.citas[index];
        const nuevaFecha = prompt("Ingrese nueva fecha (YYYY-MM-DD):", cita.fecha);
        const nuevaHora = prompt("Ingrese nueva hora (HH:MM):", cita.hora);
        
        if (nuevaFecha && nuevaHora) {
            this.citas[index] = { ...cita, fecha: nuevaFecha, hora: nuevaHora };
            this.guardarCitas();
            this.mostrarCitas();
        }
    },

    // Cambiar estado de la cita
    cambiarEstado(index) {
        const estados = ['Programada', 'Confirmada', 'Cancelada'];
        const estadoActual = this.citas[index].estado || 'Programada';
        const nuevoEstado = prompt(
            `Estado actual: ${estadoActual}\nNuevo estado (${estados.join(', ')}):`,
            estadoActual
        );

        if (nuevoEstado && estados.includes(nuevoEstado)) {
            this.citas[index].estado = nuevoEstado;
            this.guardarCitas();
            this.mostrarCitas();
        }
    },

    // Eliminar cita
    eliminarCita(index) {
        if (confirm("¿Está seguro que desea eliminar esta cita?")) {
            this.citas.splice(index, 1);
            this.guardarCitas();
            this.mostrarCitas();
        }
    },

    // Exportar a TXT
    exportarTXT() {
        let contenido = "LISTADO DE CITAS\n";
        contenido += "================\n\n";
        
        this.citas.forEach((cita, index) => {
            contenido += `Cita #${index + 1}\n`;
            contenido += `Paciente: ${cita.nombre}\n`;
            contenido += `Especialidad: ${cita.especialidad}\n`;
            contenido += `Fecha: ${this.formatearFecha(cita.fecha)}\n`;
            contenido += `Hora: ${cita.hora}\n`;
            contenido += `Estado: ${cita.estado || "Programada"}\n`;
            contenido += "================\n\n";
        });

        const blob = new Blob([contenido], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "citas.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => CitasManager.init());
