document.addEventListener('DOMContentLoaded', () => {

    // Música de fondo meditativa por defecto (URL externa continua)
    const musicaFondo = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-background-112224.mp3");
    musicaFondo.loop = true;
    musicaFondo.volume = 0.25;
    let musicaActiva = true;

    // Configuración de pasos, audios del repositorio y tiempos exactos
    const pasos = [
        {
            titulo: "Paso 1: Introducción",
            texto: "Acomódate en tu lugar. Toma una respiración profunda y permite que tu mente se relaje.",
            audio: "audio/intro.mp3",
            duracion: 0
        },
        {
            titulo: "Paso 2: Vista (5 Cosas)",
            texto: "Observa a tu alrededor y detalla con atención 5 elementos que puedas ver.",
            audio: "audio/vista.mp3",
            duracion: 8
        },
        {
            titulo: "Paso 3: Tacto (4 Cosas)",
            texto: "Siente 4 texturas o sensaciones táctiles presentes en este instante.",
            audio: "audio/tacto.mp3",
            duracion: 8
        },
        {
            titulo: "Paso 4: Oído (3 Sonidos)",
            texto: "Escucha con atención. Se reproducirán 3 sonidos distintos.",
            esOido: true,
            subAudios: ["audio/oido.mp3", "audio/oido.mp3", "audio/oido.mp3"], // Si tienes oido1.mp3, oido2.mp3, oido3.mp3 cámbialos aquí
            duracionSonido: 8,
            pausa: 3
        },
        {
            titulo: "Paso 5: Olfato (2 Olores)",
            texto: "Inhala despacio e identifica 2 olores en tu espacio.",
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
            texto: "Has completado el ejercicio. Conserva esta calma y presencialidad durante todo tu día.",
            audio: "audio/cierre.mp3",
            duracion: 0
        }
    ];

    let pasoActual = -1;
    let audioInstruccion = null;
    let timerInterval = null;

    const tituloEl = document.getElementById('titulo');
    const descripcionEl = document.getElementById('descripcion');
    const subIndicacionEl = document.getElementById('sub-indicacion');
    const timerDisplay = document.getElementById('timer-display');
    const timerProgress = document.getElementById('timer-progress');
    const btnAccion = document.getElementById('btn-accion');
    const btnMusica = document.getElementById('btn-musica');

    function detenerTodoAudio() {
        if (audioInstruccion) {
            audioInstruccion.pause();
            audioInstruccion.currentTime = 0;
        }
        if (timerInterval) clearInterval(timerInterval);
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
        let tiempo = segundos;
        timerDisplay.textContent = tiempo;
        actualizarCirculoProgreso(tiempo, segundos);

        timerInterval = setInterval(() => {
            tiempo--;
            if (tiempo >= 0) {
                timerDisplay.textContent = tiempo;
                actualizarCirculoProgreso(tiempo, segundos);
            } else {
                clearInterval(timerInterval);
                timerDisplay.textContent = "--";
                actualizarCirculoProgreso(0, 0);
                if (callback) callback();
            }
        }, 1000);
    }

    function ejecutarPaso(indice) {
        detenerTodoAudio();
        subIndicacionEl.textContent = "";

        // Activar música de fondo si el usuario la mantiene encendida
        if (musicaActiva && musicaFondo.paused) {
            musicaFondo.play().catch(() => {});
        }

        const paso = pasos[indice];
        tituloEl.textContent = paso.titulo;
        descripcionEl.textContent = paso.texto;

        if (paso.esOido) {
            // Manejo especial para los 3 sonidos de oído
            audioInstruccion = new Audio("audio/oido.mp3");
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                reproducirSecuenciaOido(paso.subAudios, 0, paso.duracionSonido, paso.pausa);
            };
        } else {
            // Reproducción estándar de audio de voz guiada
            audioInstruccion = new Audio(paso.audio);
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                if (paso.duracion > 0) {
                    subIndicacionEl.textContent = "Tiempo de práctica...";
                    iniciarConteoRegresivo(paso.duracion, () => {
                        subIndicacionEl.textContent = "¡Tiempo completado! Haz clic en siguiente.";
                    });
                }
            };
        }

        btnAccion.textContent = (indice < pasos.length - 1) ? "Siguiente paso" : "Reiniciar ejercicio";
    }

    function reproducirSecuenciaOido(audios, indiceAudio, duracion, pausa) {
        if (indiceAudio >= audios.length) {
            subIndicacionEl.textContent = "Has escuchado los 3 sonidos. Puedes continuar.";
            return;
        }

        subIndicacionEl.textContent = `Escuchando sonido ${indiceAudio + 1} de 3...`;
        let sonido = new Audio(audios[indiceAudio]);
        sonido.play().catch(() => {});

        iniciarConteoRegresivo(duracion, () => {
            sonido.pause();
            subIndicacionEl.textContent = `Pausa de integración (${pausa}s)...`;
            iniciarConteoRegresivo(pausa, () => {
                reproducirSecuenciaOido(audios, indiceAudio + 1, duracion, pausa);
            });
        });
    }

    // Eventos
    btnAccion.addEventListener('click', () => {
        if (pasoActual === -1 || pasoActual >= pasos.length - 1) {
            pasoActual = 0;
        } else {
            pasoActual++;
        }
        ejecutarPaso(pasoActual);
    });

    btnMusica.addEventListener('click', () => {
        musicaActiva = !musicaActiva;
        if (musicaActiva) {
            musicaFondo.play().catch(() => {});
            btnMusica.textContent = "🎵 Música: ON";
        } else {
            musicaFondo.pause();
            btnMusica.textContent = "🔇 Música: OFF";
        }
    });
});
