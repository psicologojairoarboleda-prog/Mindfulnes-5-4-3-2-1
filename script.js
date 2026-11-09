document.addEventListener('DOMContentLoaded', () => {

    // Sistema de Fade In / Fade Out ultra suave
    function aplicarFadeIn(audioElem, volumenMax = 0.25, duracionMs = 1500) {
        audioElem.volume = 0;
        audioElem.play().catch(e => console.log("FadeIn bloqueado:", e));
        
        let paso = 0.02;
        let intervalo = duracionMs / (volumenMax / paso);
        let timer = setInterval(() => {
            if (audioElem.volume < volumenMax - paso) {
                audioElem.volume = Math.min(volumenMax, audioElem.volume + paso);
            } else {
                audioElem.volume = volumenMax;
                clearInterval(timer);
            }
        }, intervalo);
    }

    function aplicarFadeOut(audioElem, duracionMs = 1500, alTerminar = null) {
        if (!audioElem || audioElem.paused) {
            if (alTerminar) alTerminar();
            return;
        }

        let volumenInicial = audioElem.volume;
        if (volumenInicial === 0) {
            audioElem.pause();
            audioElem.currentTime = 0;
            if (alTerminar) alTerminar();
            return;
        }

        let paso = 0.02;
        let intervalo = duracionMs / (volumenInicial / paso);
        let timer = setInterval(() => {
            if (audioElem.volume > paso) {
                audioElem.volume = Math.max(0, audioElem.volume - paso);
            } else {
                audioElem.volume = 0;
                audioElem.pause();
                audioElem.currentTime = 0;
                clearInterval(timer);
                if (alTerminar) alTerminar();
            }
        }, intervalo);
    }

    const musicaFondo = new Audio('audio/Audio9.mp3');
    musicaFondo.loop = true;

    // Estructura de ondas relajantes para la Intro y el Cierre
    const htmlOndasRelajantes = `
        <div class="relax-waves">
            <div class="wave-ring"></div>
            <div class="wave-ring"></div>
            <div class="wave-ring"></div>
        </div>
    `;

    const pasos = [
        {
            badgeText: "Técnica de Mindfulness 5-4-3-2-1",
            titulo: "Introducción",
            texto: "Busca una postura cómoda, toma una respiración profunda y prepárate para anclar tu atención en el presente a través de tus sentidos.",
            audio: "audio/intro.mp3",
            esIntro: true,
            duracion: 0
        },
        {
            badgeText: "Paso 1 de 5",
            titulo: "Vista (5 Cosas)",
            texto: "Mira a tu alrededor con atención y reconoce 5 elementos u objetos que puedas ver en este momento.",
            audio: "audio/vista.mp3",
            imagen: "Imagenes1/VISTA.jpg",
            duracion: 15
        },
        {
            badgeText: "Paso 2 de 5",
            titulo: "Tacto (4 Cosas)",
            texto: "Toma consciencia de 4 cosas que puedas sentir al tacto, como la textura de tu ropa o la superficie donde te apoyas.",
            audio: "audio/tacto.mp3",
            imagen: "Imagenes1/TACTO.jpg",
            duracion: 12
        },
        {
            badgeText: "Paso 3 de 5",
            titulo: "Oído (3 Sonidos)",
            texto: "Abre tus oídos para captar los sonidos sutiles a tu alrededor o los elementos de la naturaleza.",
            audio: "audio/oido.mp3",
            imagen: "Imagenes1/OIDO.jpg",
            esOidoEspecial: true,
            duracion: 0
        },
        {
            badgeText: "Paso 4 de 5",
            titulo: "Olfato (2 Olores)",
            texto: "Inhala suavemente por la nariz e intenta percibir 2 aromas u olores presentes en tu entorno.",
            audio: "audio/olfato.mp3",
            imagen: "Imagenes1/OLFATO.jpg",
            duracion: 10
        },
        {
            badgeText: "Paso 5 de 5",
            titulo: "Gusto (1 Sabor)",
            texto: "Presta atención a tu boca y percibe 1 sabor presente en este instante.",
            audio: "audio/gusto.mp3",
            imagen: "Imagenes1/GUSTO.jpg",
            duracion: 8
        },
        {
            badgeText: "Cierre del Ejercicio",
            titulo: "Cierre",
            texto: "El ejercicio ha concluido. Conserva esta sensación de calma, presencia y conexión interior.",
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

    const badgeEl = document.querySelector('.badge');
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

    function actualizarCirculoProgreso(segundosRestantes, total) {
        if (!timerProgress || total <= 0) {
            if (timerProgress) timerProgress.style.strokeDashoffset = 283;
            return;
        }
        const maxOffset = 283;
        const proporcion = segundosRestantes / total;
        const offset = maxOffset * (1 - proporcion);
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
                    actualizarCirculoProgreso(0, tiempoTotal);
                    if (callback) callback();
                }
            }
        }, 1000);
    }

    function ejecutarSecuenciaOido() {
        aplicarFadeOut(musicaFondo, 2000, () => {
            const sonidosOido = ["audio/mar.mp3", "audio/aves.mp3", "audio/lluvia.mp3"];
            let indiceSonido = 0;

            subIndicacionEl.textContent = "Escucha los sonidos de la naturaleza...";

            function reproducirSiguienteSonidoOido() {
                if (enPausa) return;

                if (indiceSonido < sonidosOido.length) {
                    const archivoAudio = sonidosOido[indiceSonido];
                    audioInstruccion = new Audio(archivoAudio);
                    
                    aplicarFadeIn(audioInstruccion, 0.5, 1000);

                    iniciarConteoRegresivo(7, () => {
                        aplicarFadeOut(audioInstruccion, 1000, () => {
                            indiceSonido++;

                            if (indiceSonido < sonidosOido.length) {
                                subIndicacionEl.textContent = "Pausa...";
                                iniciarConteoRegresivo(3, () => {
                                    subIndicacionEl.textContent = "Escucha el siguiente sonido...";
                                    reproducirSiguienteSonidoOido();
                                });
                            } else {
                                aplicarFadeIn(musicaFondo, 0.25, 2500);
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
        if (badgeEl) badgeEl.textContent = paso.badgeText;
        tituloEl.textContent = paso.titulo;
        descripcionEl.textContent = paso.texto;

        // Renderizado visual según el paso (ondas para intro/cierre, imagen para los sentidos)
        if (paso.esIntro || paso.esCierre) {
            iconContainer.innerHTML = htmlOndasRelajantes;
        } else if (paso.imagen) {
            iconContainer.innerHTML = `
                <img src="${paso.imagen}" class="step-graphic" alt="${paso.titulo}">
                <span id="timer-display" class="timer-text"></span>
            `;
        }

        // Si es la introducción, arrancamos la música de fondo EXACTAMENTE al mismo tiempo que la voz
        if (paso.esIntro && musicaFondo.paused) {
            aplicarFadeIn(musicaFondo, 0.25, 1000);
        }

        audioInstruccion = new Audio(paso.audio);
        aplicarFadeIn(audioInstruccion, 0.8, 800);

        audioInstruccion.onended = () => {
            aplicarFadeOut(audioInstruccion, 800, () => {
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
        aplicarFadeOut(musicaFondo, 2500);
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
