document.addEventListener('DOMContentLoaded', () => {

    // --- SISTEMA DE AUDIO CON FADE IN / FADE OUT ---
    function reproducirConFadeIn(audioElem, volumenMax = 0.25, duracionFade = 1500) {
        audioElem.volume = 0;
        audioElem.play().catch(e => console.log("FadeIn error:", e));
        
        let incremento = 0.05;
        let intervaloTiempo = duracionFade / (volumenMax / incremento);
        let fade = setInterval(() => {
            if (audioElem.volume < volumenMax - incremento) {
                audioElem.volume = Math.min(volumenMax, audioElem.volume + incremento);
            } else {
                audioElem.volume = volumenMax;
                clearInterval(fade);
            }
        }, intervaloTiempo);
    }

    function detenerConFadeOut(audioElem, duracionFade = 1500, alTerminar = null) {
        if (!audioElem || audioElem.paused) {
            if (alTerminar) alTerminar();
            return;
        }

        let volumenInicial = audioElem.volume;
        let decremento = 0.05;
        let intervaloTiempo = duracionFade / (volumenInicial / decremento || 1);

        let fade = setInterval(() => {
            if (audioElem.volume > decremento) {
                audioElem.volume = Math.max(0, audioElem.volume - decremento);
            } else {
                audioElem.volume = 0;
                audioElem.pause();
                audioElem.currentTime = 0;
                clearInterval(fade);
                if (alTerminar) alTerminar();
            }
        }, intervaloTiempo);
    }

    // Música ambiental de fondo
    const musicaFondo = new Audio('audio/Audio9.mp3');
    musicaFondo.loop = true;

    // Ondas concéntricas para introducción y cierre
    const ondasIntro = `
        <div class="waves-container">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
        </div>
    `;

    // Pasos estructurados de la técnica
    const pasos = [
        {
            titulo: "Introducción",
            texto: "Acomódate en tu lugar. Toma una respiración profunda y prepárate para conectar con tus sentidos.",
            audio: "audio/intro.mp3",
            esIntro: true,
            duracion: 0
        },
        {
            titulo: "Vista (5 Cosas)",
            texto: "Observa a tu alrededor e identifica 5 cosas que puedas ver claramente.",
            audio: "audio/vista.mp3",
            imagen: "Imagenes1/VISTA.jpg",
            duracion: 15
        },
        {
            titulo: "Tacto (4 Cosas)",
            texto: "Siente 4 cosas que puedas tocar a tu alrededor o la textura de tu ropa.",
            audio: "audio/tacto.mp3",
            imagen: "Imagenes1/TACTO.jpg",
            duracion: 12
        },
        {
            titulo: "Oído (3 Sonidos)",
            texto: "Escucha con atención los sonidos de tu entorno o de la naturaleza.",
            audio: "audio/oido.mp3",
            imagen: "Imagenes1/OIDO.jpg",
            esOidoEspecial: true, // Secuencia mar, aves, lluvia con fade
            duracion: 0
        },
        {
            titulo: "Olfato (2 Olores)",
            texto: "Inhala despacio e identifica 2 olores presentes en tu entorno.",
            audio: "audio/olfato.mp3",
            imagen: "Imagenes1/OLFATO.jpg",
            duracion: 10
        },
        {
            titulo: "Gusto (1 Sabor)",
            texto: "Percibe y reconoce 1 sabor en tu boca en este momento.",
            audio: "audio/gusto.mp3",
            imagen: "Imagenes1/GUSTO.jpg",
            duracion: 8
        },
        {
            titulo: "Cierre",
            texto: "Has completado el ejercicio. Mantén esta sensación de presencia y calma.",
            audio: "audio/cierre.mp3",
            esCierre: true,
            duracion: 0
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

    function detenerTodoAudioInstantly() {
        if (audioInstruccion) {
            audioInstruccion.pause();
            audioInstruccion.currentTime = 0;
            audioInstruccion.onended = null;
            audioInstruccion = null;
        }
        if (timerInterval) clearInterval(timerInterval);
        enPausa = false;
        btnPausa.textContent = "⏸ Pausar";
    }

    // Círculo simple y limpio (el progreso se llena de forma directa)
    function actualizarCirculoProgreso(segundosRestantes, total) {
        if (total === 0) {
            timerProgress.style.strokeDashoffset = 283;
            return;
        }
        const maxOffset = 283;
        // Se llena proporcionalmente conforme avanza el tiempo
        const transcurrido = total - segundosRestantes;
        const offset = maxOffset - (transcurrido / total) * maxOffset;
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
                    if (timerDisplay) timerDisplay.textContent = "";
                    actualizarCirculoProgreso(tiempoTotal, tiempoTotal); // Llega lleno al final
                    if (callback) callback();
                }
            }
        }, 1000);
    }

    // Secuencia de oído con FADE OUT y FADE IN en la música de fondo
    function ejecutarSecuenciaOido() {
        // Desvanecer la música de fondo suavemente
        detenerConFadeOut(musicaFondo, 1500, () => {
            const sonidosOido = ["audio/mar.mp3", "audio/aves.mp3", "audio/lluvia.mp3"];
            let indiceSonido = 0;

            subIndicacionEl.textContent = "Escucha los sonidos de la naturaleza...";

            function reproducirSiguienteSonidoOido() {
                if (enPausa) return;

                if (indiceSonido < sonidosOido.length) {
                    const archivoAudio = sonidosOido[indiceSonido];
                    audioInstruccion = new Audio(archivoAudio);
                    
                    reproducirConFadeIn(audioInstruccion, 0.5, 800);

                    iniciarConteoRegresivo(7, () => {
                        detenerConFadeOut(audioInstruccion, 800, () => {
                            indiceSonido++;

                            if (indiceSonido < sonidosOido.length) {
                                subIndicacionEl.textContent = "Pausa...";
                                iniciarConteoRegresivo(3, () => {
                                    subIndicacionEl.textContent = "Escucha el siguiente sonido...";
                                    reproducirSiguienteSonidoOido();
                                });
                            } else {
                                // Al terminar los 3 sonidos, reanudamos la música de fondo con Fade In y pasamos al olfato
                                reproducirConFadeIn(musicaFondo, 0.25, 2000);
                                if (pasoActual < pasos.length - 1) {
                                    ejecutarPaso(pasoActual + 1);
                                }
                            }
                        });
                    });
                }
            }

            reproducirSiguienteSonidoOido();
        });
    }

    function ejecutarPaso(indice) {
        detenerTodoAudioInstantly();
        subIndicacionEl.textContent = "";

        pasoActual = indice;
        btnAnterior.disabled = (pasoActual <= 0);

        const paso = pasos[indice];
        tituloEl.textContent = paso.titulo;
        descripcionEl.textContent = paso.texto;

        // Render visual limpio
        if (paso.esIntro || paso.esCierre) {
            iconContainer.innerHTML = ondasIntro;
        } else if (paso.imagen) {
            iconContainer.innerHTML = `
                <img src="${paso.imagen}" class="step-graphic" alt="${paso.titulo}">
                <span id="timer-display" class="timer-text"></span>
            `;
        }

        // Si es la introducción, arrancamos la música de fondo con Fade In de inmediato
        if (paso.esIntro && musicaFondo.paused) {
            reproducirConFadeIn(musicaFondo, 0.25, 2000);
        }

        // Reproducir audio de voz del paso actual con Fade In
        audioInstruccion = new Audio(paso.audio);
        reproducirConFadeIn(audioInstruccion, 0.8, 800);

        audioInstruccion.onended = () => {
            detenerConFadeOut(audioInstruccion, 800, () => {
                if (paso.esOidoEspecial) {
                    ejecutarSecuenciaOido();
                } else if (paso.duracion > 0) {
                    subIndicacionEl.textContent = "Tiempo de práctica...";
                    iniciarConteoRegresivo(paso.duracion, () => {
                        if (pasoActual < pasos.length - 1) {
                            ejecutarPaso(pasoActual + 1);
                        } else {
                            finalizarEjercicio();
                        }
                    });
                } else if (paso.esCierre) {
                    finalizarEjercicio();
                } else {
                    // Avance automático continuo en la introducción
                    if (pasoActual < pasos.length - 1) {
                        ejecutarPaso(pasoActual + 1);
                    }
                }
            });
        };

        btnSiguiente.textContent = (indice < pasos.length - 1) ? "Siguiente →" : "Reiniciar ↺";
    }

    function finalizarEjercicio() {
        subIndicacionEl.textContent = "¡Sesión finalizada con éxito!";
        detenerConFadeOut(musicaFondo, 2000);
        btnSiguiente.textContent = "Reiniciar ↺";
    }

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
            if (musicaFondo.paused) {
                musicaFondo.play().catch(() => {});
            }
            btnPausa.textContent = "⏸ Pausar";
        }
    });
});
