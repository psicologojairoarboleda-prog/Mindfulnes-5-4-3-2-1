document.addEventListener('DOMContentLoaded', () => {

    // Música de fondo ambiental desde un enlace externo libre de derechos
    const musicaFondo = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3");
    musicaFondo.loop = true;
    musicaFondo.volume = 0.15; // Volumen suave (15%) para acompañar sin tapar la voz

    const pasos = [
        {
            titulo: "Paso 1: Introducción",
            texto: "Acomódate en tu lugar. Toma una respiración profunda y prepárate para conectar con tus sentidos.",
            audio: "audio/intro.mp3",
            duracion: 0
        },
        {
            titulo: "Paso 2: Vista (5 Cosas)",
            texto: "Observa a tu alrededor e identifica 5 cosas que puedas ver claramente.",
            audio: "audio/vista.mp3",
            duracion: 8
        },
        {
            titulo: "Paso 3: Tacto (4 Cosas)",
            texto: "Siente 4 cosas que puedas tocar a tu alrededor o la textura de tu ropa.",
            audio: "audio/tacto.mp3",
            duracion: 8
        },
        {
            titulo: "Paso 4: Oído (3 Sonidos)",
            texto: "Escucha con atención los sonidos de la naturaleza que se reproducirán a continuación.",
            esOido: true,
            subAudios: [
                { nombre: "Aves", archivo: "audio/aves.mp3" },
                { nombre: "Lluvia", archivo: "audio/lluvia.mp3" },
                { nombre: "Mar", archivo: "audio/mar.mp3" }
            ]
        },
        {
            titulo: "Paso 5: Olfato (2 Olores)",
            texto: "Inhala despacio e identifica 2 olores presentes en tu entorno.",
            audio: "audio/olfato.mp3",
            duracion: 6
        },
        {
            titulo: "Paso 6: Gusto (1 Sabor)",
            texto: "Percibe y reconoce 1 sabor en tu boca en este momento.",
            audio: "audio/gusto.mp3",
            duracion: 4
        },
        {
            titulo: "Paso Final: Cierre",
            texto: "Has completado el ejercicio. Mantén esta sensación de presencia y calma.",
            audio: "audio/cierre.mp3",
            duracion: 0
        }
    ];

    let pasoActual = -1;
    let audioInstruccion = null;
    let timerInterval = null;
    let tiempoRestante = 0;
    let tiempoTotal = 0;
    let enPausa = false;
    let callbackTimer = null;

    const tituloEl = document.getElementById('titulo');
    const descripcionEl = document.getElementById('descripcion');
    const subIndicacionEl = document.getElementById('sub-indicacion');
    const timerDisplay = document.getElementById('timer-display');
    const timerProgress = document.getElementById('timer-progress');
    const breathCircle = document.querySelector('.breath-circle');

    const btnAnterior = document.getElementById('btn-anterior');
    const btnPausa = document.getElementById('btn-pausa');
    const btnSiguiente = document.getElementById('btn-siguiente');

    // Estado inicial de la interfaz
    btnAnterior.disabled = true;
    btnSiguiente.textContent = "Iniciar Ejercicio";

    function detenerTodoAudio() {
        if (audioInstruccion) {
            audioInstruccion.pause();
            audioInstruccion.currentTime = 0;
            audioInstruccion = null;
        }
        if (timerInterval) clearInterval(timerInterval);
        enPausa = false;
        btnPausa.textContent = "⏸ Pausar";
    }

    function actualizarCirculoProgreso(segundosRestantes, total) {
        if (total === 0) {
            timerProgress.style.strokeDashoffset = 0;
            return;
        }
        const maxOffset = 283;
        const offset = maxOffset - (segundosRestantes / total) * maxOffset;
        timerProgress.style.strokeDashoffset = offset;
    }

    function iniciarConteoRegresivo(segundos, callback) {
        if (timerInterval) clearInterval(timerInterval);
        tiempoRestante = segundos;
        tiempoTotal = segundos;
        callbackTimer = callback;

        timerDisplay.textContent = tiempoRestante;
        actualizarCirculoProgreso(tiempoRestante, tiempoTotal);

        timerInterval = setInterval(() => {
            if (!enPausa) {
                tiempoRestante--;
                if (tiempoRestante >= 0) {
                    timerDisplay.textContent = tiempoRestante;
                    actualizarCirculoProgreso(tiempoRestante, tiempoTotal);
                } else {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "--";
                    actualizarCirculoProgreso(0, 0);
                    if (callbackTimer) callbackTimer();
                }
            }
        }, 1000);
    }

    function ejecutarPaso(indice) {
        detenerTodoAudio();
        subIndicacionEl.textContent = "";

        // Activar música de fondo si estaba pausada
        if (musicaFondo.paused) {
            musicaFondo.play().catch(() => {});
        }

        pasoActual = indice;
        btnAnterior.disabled = (pasoActual <= 0);

        const paso = pasos[indice];
        tituloEl.textContent = paso.titulo;

        // Transición suave de texto
        descripcionEl.classList.remove('animar-cambio');
        void descripcionEl.offsetWidth;
        descripcionEl.classList.add('animar-cambio');
        descripcionEl.textContent = paso.texto;

        if (paso.esOido) {
            if (breathCircle) breathCircle.classList.add('fijo');
            
            // Audio explicativo de oído
            audioInstruccion = new Audio("audio/oido.mp3");
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                reproducirSecuenciaOido(paso.subAudios, 0);
            };
        } else {
            // Pasos estándar
            audioInstruccion = new Audio(paso.audio);
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                if (paso.duracion > 0) {
                    if (breathCircle) breathCircle.classList.add('fijo');
                    subIndicacionEl.textContent = "Tiempo de práctica...";
                    iniciarConteoRegresivo(paso.duracion, () => {
                        if (breathCircle) breathCircle.classList.remove('fijo');
                        subIndicacionEl.textContent = "¡Tiempo completado! Avanza al siguiente paso.";
                    });
                } else {
                    if (breathCircle) breathCircle.classList.remove('fijo');
                }
            };
        }

        btnSiguiente.textContent = (indice < pasos.length - 1) ? "Siguiente →" : "Reiniciar ↺";
    }

    function reproducirSecuenciaOido(audios, indiceAudio) {
        if (indiceAudio >= audios.length) {
            subIndicacionEl.textContent = "Has escuchado los 3 sonidos. Puedes avanzar al siguiente paso.";
            timerDisplay.textContent = "--";
            actualizarCirculoProgreso(0, 0);
            if (breathCircle) breathCircle.classList.remove('fijo');
            return;
        }

        const actual = audios[indiceAudio];
        subIndicacionEl.textContent = `Escuchando: ${actual.nombre} (${indiceAudio + 1} de 3)...`;
        
        // 1. Sonido por 10 segundos
        audioInstruccion = new Audio(actual.archivo);
        audioInstruccion.play().catch(() => {});

        iniciarConteoRegresivo(10, () => {
            // Silenciar el sonido exacto a los 10s
            if (audioInstruccion) {
                audioInstruccion.pause();
                audioInstruccion.currentTime = 0;
            }

            // 2. Tiempo de actividad en silencio de 3 segundos
            subIndicacionEl.textContent = `Tiempo de actividad (${actual.nombre})...`;
            iniciarConteoRegresivo(3, () => {
                // Siguiente sonido
                reproducirSecuenciaOido(audios, indiceAudio + 1);
            });
        });
    }

    // Controles de botones
    btnSiguiente.addEventListener('click', () => {
        if (pasoActual === -1 || pasoActual >= pasos.length - 1) {
            ejecutarPaso(0);
        } else {
            ejecutarPaso(pasoActual + 1);
        }
    });

    btnAnterior.addEventListener('click', () => {
        if (pasoActual > 0) {
            ejecutarPaso(pasoActual - 1);
        }
    });

    btnPausa.addEventListener('click', () => {
        if (pasoActual === -1) return;

        enPausa = !enPausa;
        if (enPausa) {
            if (audioInstruccion) audioInstruccion.pause();
            musicaFondo.pause();
            btnPausa.textContent = "▶ Reanudar";
        } else {
            if (audioInstruccion) audioInstruccion.play().catch(() => {});
            musicaFondo.play().catch(() => {});
            btnPausa.textContent = "⏸ Pausar";
        }
    });
});
