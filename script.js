document.addEventListener('DOMContentLoaded', () => {

    // Música ambiental de fondo
    const musicaFondo = new Audio("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3");
    musicaFondo.loop = true;
    musicaFondo.volume = 0.15; // Volumen objetivo (15%)

    // Iconos SVG de los sentidos
    const iconos = {
        inicio: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path stroke="currentColor" d="M10 8l6 4-6 4V8z"/></svg>`,
        vista: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" stroke="currentColor"/></svg>`,
        tacto: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V2a2 2 0 0 0-4 0v9M6 14v-2a2 2 0 0 0-4 0v7a8 8 0 0 0 16 0v-5a2 2 0 0 0-4 0"/></svg>`,
        oido: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10.5"/><path stroke="currentColor" d="M13 15a2.5 2.5 0 0 0 0-5"/></svg>`,
        olfato: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M12 3a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path stroke="currentColor" d="M12 16v5"/><circle cx="12" cy="19" r="2" stroke="currentColor"/></svg>`,
        gusto: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M12 21a9 9 0 0 1-9-9c0-4.97 4.03-9 9-9s9 4.03 9 9a9 9 0 0 1-9 9z"/><path stroke="currentColor" d="M8 14s1.5 2 4 2 4-2 4-2"/></svg>`,
        cierre: `<svg class="sense-icon" viewBox="0 0 24 24"><path stroke="currentColor" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path stroke="currentColor" d="M9 12l2 2 4-4"/></svg>`
    };

    const pasos = [
        {
            titulo: "Introducción",
            texto: "Acomódate en tu lugar. Toma una respiración profunda y prepárate para conectar con tus sentidos.",
            audio: "audio/intro.mp3",
            icono: iconos.inicio,
            duracion: 0
        },
        {
            titulo: "Vista (5 Cosas)",
            texto: "Observa a tu alrededor e identifica 5 cosas que puedas ver claramente.",
            audio: "audio/vista.mp3",
            icono: iconos.vista,
            duracion: 8
        },
        {
            titulo: "Tacto (4 Cosas)",
            texto: "Siente 4 cosas que puedas tocar a tu alrededor o la textura de tu ropa.",
            audio: "audio/tacto.mp3",
            icono: iconos.tacto,
            duracion: 8
        },
        {
            titulo: "Oído (3 Sonidos)",
            texto: "Escucha con atención los sonidos de la naturaleza que se reproducirán a continuación.",
            esOido: true,
            icono: iconos.oido,
            subAudios: [
                { nombre: "Aves", archivo: "audio/aves.mp3" },
                { nombre: "Lluvia", archivo: "audio/lluvia.mp3" },
                { nombre: "Mar", archivo: "audio/mar.mp3" }
            ]
        },
        {
            titulo: "Olfato (2 Olores)",
            texto: "Inhala despacio e identifica 2 olores presentes en tu entorno.",
            audio: "audio/olfato.mp3",
            icono: iconos.olfato,
            duracion: 6
        },
        {
            titulo: "Gusto (1 Sabor)",
            texto: "Percibe y reconoce 1 sabor en tu boca en este momento.",
            audio: "audio/gusto.mp3",
            icono: iconos.gusto,
            duracion: 4
        },
        {
            titulo: "Cierre",
            texto: "Has completado el ejercicio. Mantén esta sensación de presencia y calma.",
            audio: "audio/cierre.mp3",
            icono: iconos.cierre,
            duracion: 0,
            esCierre: true
        }
    ];

    let pasoActual = -1;
    let audioInstruccion = null;
    let timerInterval = null;
    let tiempoRestante = 0;
    let tiempoTotal = 0;
    let enPausa = false;

    const tituloEl = document.getElementById('titulo');
    const descripcionEl = document.getElementById('descripcion');
    const subIndicacionEl = document.getElementById('sub-indicacion');
    const timerProgress = document.getElementById('timer-progress');
    const iconContainer = document.getElementById('icon-container');

    const btnAnterior = document.getElementById('btn-anterior');
    const btnPausa = document.getElementById('btn-pausa');
    const btnSiguiente = document.getElementById('btn-siguiente');

    btnAnterior.disabled = true;
    btnSiguiente.textContent = "Iniciar Ejercicio";

    // --- FUNCIONES DE TRANSICIÓN SUAVE (FADE IN / FADE OUT) ---

    function aplicarFadeOut(audioElement, duracionMs = 1500, callback = null) {
        if (!audioElement || audioElement.paused) {
            if (callback) callback();
            return;
        }
        const volumenInicial = audioElement.volume;
        const intervalo = 50;
        const pasos = duracionMs / intervalo;
        const decremento = volumenInicial / pasos;

        const timerFade = setInterval(() => {
            if (audioElement.volume - decremento > 0) {
                audioElement.volume -= decremento;
            } else {
                audioElement.volume = 0;
                audioElement.pause();
                audioElement.volume = volumenInicial; // Restablecer volumen de origen
                clearInterval(timerFade);
                if (callback) callback();
            }
        }, intervalo);
    }

    function aplicarFadeIn(audioElement, volumenMaximo = 0.15, duracionMs = 1500) {
        if (!audioElement) return;
        audioElement.volume = 0;
        audioElement.play().catch(() => {});

        const intervalo = 50;
        const pasos = duracionMs / intervalo;
        const incremento = volumenMaximo / pasos;

        const timerFade = setInterval(() => {
            if (audioElement.volume + incremento < volumenMaximo) {
                audioElement.volume += incremento;
            } else {
                audioElement.volume = volumenMaximo;
                clearInterval(timerFade);
            }
        }, intervalo);
    }

    // --- CONTROL DE AUDIOS Y TEMPORIZADOR ---

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

        const timerDisplay = document.getElementById('timer-display');
        if (timerDisplay) timerDisplay.textContent = tiempoRestante;
        actualizarCirculoProgreso(tiempoRestante, tiempoTotal);

        timerInterval = setInterval(() => {
            if (!enPausa) {
                tiempoRestante--;
                if (tiempoRestante >= 0) {
                    if (timerDisplay) timerDisplay.textContent = tiempoRestante;
                    actualizarCirculoProgreso(tiempoRestante, tiempoTotal);
                } else {
                    clearInterval(timerInterval);
                    if (timerDisplay) timerDisplay.textContent = "--";
                    actualizarCirculoProgreso(0, 0);
                    if (callback) callback();
                }
            }
        }, 1000);
    }

    function ejecutarPaso(indice) {
        detenerTodoAudio();
        subIndicacionEl.textContent = "";

        pasoActual = indice;
        btnAnterior.disabled = (pasoActual <= 0);

        const paso = pasos[indice];
        tituloEl.textContent = paso.titulo;
        descripcionEl.textContent = paso.texto;

        iconContainer.innerHTML = `${paso.icono}<span id="timer-display" class="timer-text">--</span>`;

        if (paso.esCierre) {
            // Reproducir audio de cierre y al finalizar, desvanecer la música de fondo en 3s
            if (musicaFondo.paused) aplicarFadeIn(musicaFondo, 0.15, 1000);

            audioInstruccion = new Audio(paso.audio);
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                subIndicacionEl.textContent = "Sesión finalizada. Desconectando...";
                aplicarFadeOut(musicaFondo, 3000, () => {
                    subIndicacionEl.textContent = "¡Que tengas un excelente día!";
                });
            };
        } else if (paso.esOido) {
            if (musicaFondo.paused) aplicarFadeIn(musicaFondo, 0.15, 1000);

            audioInstruccion = new Audio("audio/oido.mp3");
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                // Hacer Fade Out de la música de fondo antes de iniciar la naturaleza
                aplicarFadeOut(musicaFondo, 1500, () => {
                    reproducirSecuenciaOido(paso.subAudios, 0);
                });
            };
        } else {
            if (musicaFondo.paused) aplicarFadeIn(musicaFondo, 0.15, 1000);

            audioInstruccion = new Audio(paso.audio);
            audioInstruccion.play().catch(() => {});

            audioInstruccion.onended = () => {
                if (paso.duracion > 0) {
                    subIndicacionEl.textContent = "Tiempo de práctica...";
                    iniciarConteoRegresivo(paso.duracion, () => {
                        if (pasoActual < pasos.length - 1) {
                            ejecutarPaso(pasoActual + 1);
                        }
                    });
                } else {
                    if (pasoActual < pasos.length - 1) {
                        ejecutarPaso(pasoActual + 1);
                    }
                }
            };
        }

        btnSiguiente.textContent = (indice < pasos.length - 1) ? "Siguiente →" : "Reiniciar ↺";
    }

    function reproducirSecuenciaOido(audios, indiceAudio) {
        if (indiceAudio >= audios.length) {
            // Entrar de nuevo la música de fondo suavemente al terminar todos los sonidos
            aplicarFadeIn(musicaFondo, 0.15, 2000);
            if (pasoActual < pasos.length - 1) {
                ejecutarPaso(pasoActual + 1);
            }
            return;
        }

        const actual = audios[indiceAudio];
        subIndicacionEl.textContent = `Escuchando: ${actual.nombre} (${indiceAudio + 1} de 3)...`;

        audioInstruccion = new Audio(actual.archivo);
        // Iniciar el sonido de naturaleza con Fade In
        aplicarFadeIn(audioInstruccion, 0.8, 1500);

        iniciarConteoRegresivo(10, () => {
            // Cuando falten pocos segundos / termine el tiempo, desvanecer con Fade Out
            aplicarFadeOut(audioInstruccion, 1500, () => {
                subIndicacionEl.textContent = `Tiempo de actividad (${actual.nombre})...`;
                iniciarConteoRegresivo(3, () => {
                    reproducirSecuenciaOido(audios, indiceAudio + 1);
                });
            });
        });
    }

    // --- CONTROLES DE BOTONES ---

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
            if (!pasos[pasoActual].esOido) {
                musicaFondo.play().catch(() => {});
            }
            btnPausa.textContent = "⏸ Pausar";
        }
    });
});
