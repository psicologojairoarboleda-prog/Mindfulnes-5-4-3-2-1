// Fotografías de alta estética (Unsplash)
const stageImages = {
    intro: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    vista: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    tacto: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
    oido: 'https://images.unsplash.com/photo-1511497584788-876761c119ef?auto=format&fit=crop&w=800&q=80',
    olfato: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80',
    gusto: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    cierre: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=800&q=80'
};

const stages = [
    { 
        id: 'intro', 
        badge: 'Introducción', 
        title: 'Calma y Presencia', 
        audio: 'audio/intro.mp3', 
        img: stageImages.intro, 
        text: 'Siéntate cómodamente y respira profundo.', 
        pause: 6 
    },
    { 
        id: 'vista', 
        badge: 'Vista', 
        title: '5 Cosas que puedas ver', 
        audio: 'audio/vista.mp3', 
        img: stageImages.vista, 
        text: 'Observa detenidamente los detalles de 5 objetos a tu alrededor.', 
        pause: 6 
    },
    { 
        id: 'tacto', 
        badge: 'Tacto', 
        title: '4 Cosas que puedas tocar', 
        audio: 'audio/tacto.mp3', 
        img: stageImages.tacto, 
        text: 'Siente texturas, temperaturas o telas cercanas.', 
        pause: 10 
    },
    { 
        id: 'oido', 
        badge: 'Oído', 
        title: '3 Sonidos que puedas escuchar', 
        audio: 'audio/oido.mp3', 
        img: stageImages.oido, 
        text: 'Escucha con atención los 3 sonidos naturales a continuación.',
        pauseAfterEffect: 3,
        // Audios de prueba estables y directos (Aves, Viento, Lluvia - 8 segundos cada uno)
        effects: [
            'https://actions.google.com/sounds/v1/animals/birds_forest.ogg',
            'https://actions.google.com/sounds/v1/weather/wind_heavy.ogg',
            'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg'
        ]
    },
    { 
        id: 'olfato', 
        badge: 'Olfato', 
        title: '2 Cosas que puedas oler', 
        audio: 'audio/olfato.mp3', 
        img: stageImages.olfato, 
        text: 'Inhala suavemente e identifica los aromas del ambiente.', 
        pause: 6 
    },
    { 
        id: 'gusto', 
        badge: 'Gusto', 
        title: '1 Cosa que puedas saborear', 
        audio: 'audio/gusto.mp3', 
        img: stageImages.gusto, 
        text: 'Registra cualquier sabor en tu boca o toma un sorbo de agua.', 
        pause: 6 
    },
    { 
        id: 'cierre', 
        badge: 'Cierre', 
        title: 'Ejercicio Completado', 
        audio: 'audio/cierre.mp3', 
        img: stageImages.cierre, 
        text: 'Has regresado al momento presente.', 
        pause: 0 
    }
];

let currentStageIndex = 0;
let isPlaying = false;
let timerInterval = null;

const mainAudio = document.getElementById('main-audio');
const bgMusic = document.getElementById('bg-music');
const stageTitle = document.getElementById('stage-title');
const stageSubtext = document.getElementById('stage-subtext');
const visualImage = document.getElementById('visual-image');
const progressBar = document.getElementById('progress-bar');
const stepBadge = document.getElementById('step-badge');
const timerBox = document.getElementById('timer-box');
const timerCount = document.getElementById('timer-count');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnIcon = document.getElementById('btn-icon');
const btnText = document.getElementById('btn-text');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

// Música de fondo a volumen bajo (0.05 a 0.08)
bgMusic.volume = 0.06;

function updateUI(index) {
    clearInterval(timerInterval);
    timerBox.classList.remove('active');
    timerCount.textContent = '0s';

    const stage = stages[index];
    stepBadge.textContent = stage.badge;
    stageTitle.textContent = stage.title;
    stageSubtext.textContent = stage.text;
    visualImage.src = stage.img;
    progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;
}

function runCountdown(seconds) {
    return new Promise((resolve) => {
        if (seconds <= 0 || !isPlaying) {
            resolve();
            return;
        }

        let remaining = seconds;
        timerCount.textContent = `${remaining}s`;
        timerBox.classList.add('active');

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(timerInterval);
                return;
            }

            remaining--;
            timerCount.textContent = `${remaining}s`;

            if (remaining <= 0) {
                clearInterval(timerInterval);
                timerBox.classList.remove('active');
                resolve();
            }
        }, 1000);
    });
}

function playAudioTrack(src) {
    return new Promise((resolve) => {
        mainAudio.src = src;
        mainAudio.load();
        
        mainAudio.play().then(() => {
            mainAudio.onended = () => resolve(true);
        }).catch((err) => {
            console.warn('Audio no disponible o bloqueado:', src, err);
            resolve(false); // Continúa la secuencia aun si falla la carga local
        });
    });
}

function playAudioWithCutoff(src, durationSeconds) {
    return new Promise((resolve) => {
        mainAudio.src = src;
        mainAudio.load();
        
        let timer = null;
        mainAudio.play().then(() => {
            timer = setTimeout(() => {
                mainAudio.pause();
                resolve(true);
            }, durationSeconds * 1000);

            mainAudio.onended = () => {
                clearTimeout(timer);
                resolve(true);
            };
        }).catch(() => {
            resolve(false);
        });
    });
}

async function executeStageSequence() {
    const stage = stages[currentStageIndex];

    if (stage.id === 'oido') {
        // Voz explicativa del sentido del oído con fondo sutil
        bgMusic.play().catch(() => {});
        await playAudioTrack(stage.audio);

        // Apagar la música de fondo para dejar solo los sonidos de la naturaleza
        bgMusic.pause();

        for (let i = 0; i < stage.effects.length; i++) {
            if (!isPlaying) return;

            // Reproducir efecto exactamente durante 8 segundos
            await playAudioWithCutoff(stage.effects[i], 8);

            // Pausa obligatoria con contador visible de 3 segundos
            if (isPlaying) {
                await runCountdown(stage.pauseAfterEffect);
            }
        }

        // Retomar la música de fondo
        if (isPlaying) {
            bgMusic.play().catch(() => {});
            nextStage();
        }

    } else {
        // Restaurar música de fondo suave en los demás sentidos
        bgMusic.play().catch(() => {});
        
        // Reproducir audio de voz de la actividad
        await playAudioTrack(stage.audio);

        // Activar el contador de segundos para la realización del ejercicio
        if (isPlaying) {
            await runCountdown(stage.pause);
            if (isPlaying) {
                nextStage();
            }
        }
    }
}

function nextStage() {
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        updateUI(currentStageIndex);
        if (isPlaying) executeStageSequence();
    } else {
        isPlaying = false;
        btnIcon.textContent = '▶';
        btnText.textContent = 'Reiniciar';
        bgMusic.pause();
    }
}

btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
        isPlaying = false;
        btnIcon.textContent = '▶';
        btnText.textContent = 'Continuar';
        mainAudio.pause();
        bgMusic.pause();
        clearInterval(timerInterval);
        timerBox.classList.remove('active');
    } else {
        if (currentStageIndex === stages.length - 1) {
            currentStageIndex = 0;
        }
        isPlaying = true;
        btnIcon.textContent = '⏸';
        btnText.textContent = 'Pausa';
        updateUI(currentStageIndex);
        executeStageSequence();
    }
});

btnNext.addEventListener('click', () => {
    mainAudio.pause();
    clearInterval(timerInterval);
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        updateUI(currentStageIndex);
        if (isPlaying) executeStageSequence();
    }
});

btnPrev.addEventListener('click', () => {
    mainAudio.pause();
    clearInterval(timerInterval);
    if (currentStageIndex > 0) {
        currentStageIndex--;
        updateUI(currentStageIndex);
        if (isPlaying) executeStageSequence();
    }
});

// Cargar vista inicial
updateUI(currentStageIndex);
