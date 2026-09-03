document.addEventListener('DOMContentLoaded', () => {
    const pasos = [
        {
            titulo: "Introducción",
            descripcion: "Ponte en una posición cómoda. Haz una respiración profunda y prepárate para conectar con tus sentidos.",
            audio: "audio/intro.mp3"
        },
        {
            titulo: "5 Cosas que puedes VER",
            descripcion: "Observa a tu alrededor y detalla 5 cosas que puedas ver claramente.",
            audio: "audio/vista.mp3"
        },
        {
            titulo: "4 Cosas que puedes TOCAR",
            descripcion: "Siente 4 cosas que estén a tu alcance o la textura de tu ropa.",
            audio: "audio/tacto.mp3"
        },
        {
            titulo: "3 Cosas que puedes ESCUCHAR",
            descripcion: "Presta atención y reconoce 3 sonidos sutiles a tu alrededor.",
            audio: "audio/oido.mp3"
        },
        {
            titulo: "2 Cosas que puedes OLER",
            descripcion: "Inhala suavemente e identifica 2 olores en tu entorno.",
            audio: "audio/olfato.mp3"
        },
        {
            titulo: "1 Cosa que puedes SABOREAR",
            descripcion: "Nota el sabor en tu boca o reconoce 1 sabor que te sea agradable.",
            audio: "audio/gusto.mp3"
        },
        {
            titulo: "Cierre del Ejercicio",
            descripcion: "Has completado el ejercicio. Mantén esta sensación de calma y presencia.",
            audio: "audio/cierre.mp3"
        }
    ];

    let pasoActual = -1;
    let audioActual = null;

    const tituloEl = document.getElementById('titulo-paso');
    const descripcionEl = document.getElementById('descripcion-paso');
    const btnPrincipal = document.getElementById('btn-principal');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const progresoContainer = document.getElementById('indicador-progreso');
    const barraProgreso = document.getElementById('barra-progreso');

    function detenerAudioActual() {
        if (audioActual) {
            audioActual.pause();
            audioActual.currentTime = 0;
            audioActual = null;
        }
    }

    function reproducirPaso(indice) {
        detenerAudioActual();

        const paso = pasos[indice];
        tituloEl.textContent = paso.titulo;
        descripcionEl.textContent = paso.descripcion;

        // Mostrar barra de progreso
        progresoContainer.style.display = "block";
        const porcentaje = ((indice + 1) / pasos.length) * 100;
        barraProgreso.style.width = `${porcentaje}%`;

        // Reproducción de audio compatible con móviles
        try {
            audioActual = new Audio(paso.audio);
            const playPromise = audioActual.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Autoplay impedido o archivo no encontrado:", error);
                });
            }
        } catch (e) {
            console.error("Error al instanciar el audio:", e);
        }

        // Actualización del botón
        if (indice < pasos.length - 1) {
            btnPrincipal.textContent = "Siguiente paso";
            btnReiniciar.style.display = "block";
        } else {
            btnPrincipal.textContent = "Finalizar";
            btnReiniciar.style.display = "block";
        }
    }

    btnPrincipal.addEventListener('click', () => {
        if (pasoActual === -1 || pasoActual >= pasos.length - 1) {
            pasoActual = 0;
        } else {
            pasoActual++;
        }
        reproducirPaso(pasoActual);
    });

    btnReiniciar.addEventListener('click', () => {
        detenerAudioActual();
        pasoActual = -1;
        tituloEl.textContent = "Técnica Mindfulness 5-4-3-2-1";
        descripcionEl.textContent = "Bienvenido. Esta técnica te ayudará a conectar con el momento presente a través de tus sentidos. Haz clic en el botón para iniciar.";
        btnPrincipal.textContent = "Iniciar Ejercicio";
        btnReiniciar.style.display = "none";
        progresoContainer.style.display = "none";
        barraProgreso.style.width = "0%";
    });
});
