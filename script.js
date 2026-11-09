document.addEventListener('DOMContentLoaded', () => {

    // Música ambiental de fondo (configurada para arrancar con retraso de 10 segundos)
    const musicaFondo = new Audio('audio/Audio9.mp3');
    musicaFondo.loop = true;
    musicaFondo.volume = 0.25;
    let temporizadorFondoInicio = null;

    function iniciarMusicaFondoConRetardo() {
        if (temporizadorFondoInicio) clearTimeout(temporizadorFondoInicio);
        temporizadorFondoInicio = setTimeout(() => {
            if (musicaFondo.paused && pasoActual !== -1) {
                musicaFondo.play().catch(e => console.log("Fondo:", e));
            }
        }, 10000); // 10 segundos de retraso
    }

    // Ondas concéntricas para la introducción y el cierre
    const ondasIntro = `
        <div class="waves-container">
            <div class="wave"></div>
            <div class="wave"></div>
            <div class="wave"></div>
        </div>
    `;

    // Pasos de la técnica 5-4-3-2-1
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
            esOidoEspecial: true, // Secuencia especial: mar, aves, lluvia
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

    function detenerTodoAudio() {
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
        if (total === 0) {
            timerProgress.style.strokeDashoffset = 283;
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
                    if (timerDisplay) timerDisplay.textContent = "";
                    actualizarCirculoProgreso(0, 0);
                    if (callback) callback();
                }
            }
        }, 1000);
    }

    // Secuencia del sentido del oído: Pausa la música de fondo y reproduce mar, aves y lluvia (7s c/u con 3s de silencio)
    function ejecutarSecuenciaOido() {
        // Pausar música ambiental mientras suenan los sonidos de la naturaleza
        musicaFondo.pause();

        const sonidosOido = ["audio/mar.mp3", "audio/aves.mp3", "audio/lluvia.mp3"];
        let indiceSonido = 0;

        subIndicacionEl.textContent = "Escucha los sonidos de la naturaleza...";

        function reproducirSiguienteSonidoOido() {
            if (enPausa) return;

            if (indiceSonido < sonidosOido.length) {
                const archivoAudio = sonidosOido[indiceSonido];
                audioInstruccion = new Audio(archivoAudio);
                audioInstruccion.play().catch(e => console.log("Audio oído error:", e));

                // Cada sonido suena exactamente 7 segundos
                iniciarConteoRegresivo(7, () => {
                    if (audioInstruccion) {
                        audioInstruccion.pause();
                        audioInstruccion.currentTime = 0;
                    }
                    indiceSonido++;

                    if (indiceSonido < sonidosOido.length) {
                        // 3 segundos de silencio entre sonido y sonido
                        subIndicacionEl.textContent = "Pausa...";
                        iniciarConteoRegresivo(3, () => {
                            subIndicacionEl.textContent = "Escucha el siguiente sonido...";
                            reproducirSiguienteSonidoOido();
                        });
                    } else {
                        // Al terminar los tres sonidos, se reanuda la música de fondo y avanza al siguiente paso (Olfato) de corrido
                        musicaFondo.play().catch(e => console.log("Fondo reanudar:", e));
                        if (pasoActual < pasos.length - 1) {
                            ejecutarPaso(pasoActual + 1);
                        }
                    }
                });
            }
        }

        reproducirSiguienteSonidoOido();
    }

    function ejecutarPaso(indice) {
        detenerTodoAudio();
        subIndicacionEl.textContent = "";

        pasoActual = indice;
        btnAnterior.disabled = (pasoActual <= 0);

        const paso = pasos[indice];
        tituloEl.textContent = paso.titulo;
        descripcionEl.textContent = paso.texto;

        // Renderizado visual limpio
        if (paso.esIntro || paso.esCierre) {
            iconContainer.innerHTML = ondasIntro;
        } else if (paso.imagen) {
            iconContainer.innerHTML = `
                <img src="${paso.imagen}" class="step-graphic" alt="${paso.titulo}">
                <span id="timer-display" class="timer-text"></span>
            `;
        }

        // Activar el conteo de los 10 segundos para la música de fondo si estamos empezando
        iniciarMusicaFondoConRetardo();

        // Reproducir el audio del paso actual
        audioInstruccion = new Audio(paso.audio);
        audioInstruccion.play().catch(e => console.log("Audio voz:", e));

        audioInstruccion.onended = () => {
            if (paso.esOidoEspecial) {
                ejecutarSecuenciaOido();
            } else if (paso.duracion > 0) {
                subIndicacionEl.textContent = "Tiempo de práctica...";
                iniciarConteoRegresivo(paso.duracion, () => {
                    // AVANCE AUTOMÁTICO DE CORRIDO HASTA EL FINAL
                    if (pasoActual < pasos.length - 1) {
                        ejecutarPaso(pasoActual + 1);
                    } else {
                        finalizarEjercicio();
                    }
                });
            } else if (paso.esCierre) {
                finalizarEjercicio();
            } else {
                // Avance automático continuo también para pasos sin cuenta regresiva (como la intro)
                if (pasoActual < pasos.length - 1) {
                    ejecutarPaso(pasoActual + 1);
                }
            }
        };

        btnSiguiente.textContent = (indice < pasos.length - 1) ? "Siguiente →" : "Reiniciar ↺";
    }

    function finalizarEjercicio() {
        subIndicacionEl.textContent = "¡Sesión finalizada con éxito!";
        musicaFondo.pause();
        musicaFondo.currentTime = 0;
        if (temporizadorFondoInicio) clearTimeout(temporizadorFondoInicio);
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
            if (temporizadorFondoInicio) clearTimeout(temporizadorFondoInicio);
            btnPausa.textContent = "▶ Reanudar";
        } else {
            if (audioInstruccion) audioInstruccion.play().catch(() => {});
            if (!musicaFondo.currentTime || musicaFondo.paused) {
                musicaFondo.play().catch(() => {});
            }
            btnPausa.textContent = "⏸ Pausar";
        }
    });
});
