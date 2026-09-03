const stages = [
    { 
        id: 'intro', 
        title: 'Bienvenido', 
        audio: 'audio/intro.mp3', 
        text: 'Prepárate para conectar con el presente.' 
    },
    { 
        id: 'vista', 
        title: '5 Cosas que puedas VER', 
        audio: 'audio/vista.mp3', 
        text: 'Observa a tu alrededor y nombra 5 objetos.' 
    },
    { 
        id: 'tacto', 
        title: '4 Cosas que puedas TOCAR', 
        audio: 'audio/tacto.mp3', 
        text: 'Siente texturas y temperaturas.' 
    },
    { 
        id: 'oido', 
        title: '3 Sonidos que puedas ESCUCHAR', 
        audio: 'audio/oido.mp3', 
        text: 'A continuación concéntrate en los sonidos con los ojos cerrados y déjate llevar por ellos.',
        effects: ['audio/lluvia.mp3', 'audio/viento.mp3', 'audio/aves.mp3']
    },
    { 
        id: 'olfato', 
        title: '2 Cosas que puedas OLER', 
        audio: 'audio/olfato.mp3', 
        text: 'Inhala profundo y visualiza cómo transita el aroma.' 
    },
    { 
        id: 'gusto', 
        title: '1 Cosa que puedas SABOREAR', 
        audio: 'audio/gusto.mp3', 
        text: 'Lleva el producto a la boca y experimenta su textura y sabor.' 
    },
    { 
        id: 'cierre', 
        title: 'Ejercicio Completado', 
        audio: 'audio/cierre.mp3', 
        text: 'Has vuelto al aquí y al ahora.' 
    }
];

let currentStageIndex = 0;
let isPlaying = false;
let isEffectsPlaying = false;

const mainAudio = document.getElementById('main-audio');
const bgMusic = document.getElementById('bg-music');
const stageTitle = document.getElementById('stage-title');
const stageSubtext = document.getElementById('stage-subtext');
const stageImage = document.getElementById('stage-image');
const progressBar = document.getElementById('progress-bar');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const olfatoAnimation = document.getElementById('olfato-animation');
const aromaParticles = document.querySelectorAll('.aroma-particle');

function loadStage(index) {
    const stage = stages[index];
    stageTitle.textContent = stage.title;
    stageSubtext.textContent = stage.text;
    progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;

    // Manejo de animación visual de Olfato o visibilidad
    if (stage.id === 'olfato') {
        stageImage.classList.add('hidden');
        olfatoAnimation.classList.remove('hidden');
        aromaParticles.forEach(p => p.classList.add('active'));
    } else {
        olfatoAnimation.classList.add('hidden');
        stageImage.classList.remove('hidden');
        aromaParticles.forEach(p => p.classList.remove('active'));
    }

    mainAudio.src = stage.audio;
    mainAudio.load();
}

async function playStage() {
    isPlaying = true;
    btnPlayPause.textContent = '⏸ Pausa';
    
    // Iniciar reproducción de audio de fondo y voz
    try {
        if (!isEffectsPlaying && bgMusic.src) {
            await bgMusic.play();
        }
        await mainAudio.play();
    } catch (e) {
        console.warn("El navegador requirió interacción del usuario para reproducir el audio:", e);
    }
}

function pauseStage() {
    isPlaying = false;
    btnPlayPause.textContent = '▶ Continuar';
    mainAudio.pause();
    bgMusic.pause();
}

// Al finalizar el audio de la etapa
mainAudio.onended = async () => {
    const currentStage = stages[currentStageIndex];

    // Secuencia de los 3 efectos de sonido del oído
    if (currentStage.id === 'oido' && currentStage.effects) {
        isEffectsPlaying = true;
        bgMusic.pause();

        for (const soundSrc of currentStage.effects) {
            if (!isPlaying) break;
            mainAudio.src = soundSrc;
            mainAudio.load();
            try {
                await mainAudio.play();
            } catch(e) {}
            // Esperar 8 segundos por cada sonido
            await new Promise(resolve => setTimeout(resolve, 8000));
        }

        isEffectsPlaying = false;
        if (isPlaying && bgMusic.src) bgMusic.play().catch(() => {});
    }

    // Avanzar automáticamente a la siguiente etapa
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStage(currentStageIndex);
        if (isPlaying) playStage();
    } else {
        pauseStage();
        btnPlayPause.textContent = '▶ Reiniciar';
    }
};

// Eventos de botones
btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
        pauseStage();
    } else {
        if (currentStageIndex === stages.length - 1) currentStageIndex = 0;
        loadStage(currentStageIndex);
        playStage();
    }
});

btnNext.addEventListener('click', () => {
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStage(currentStageIndex);
        if (isPlaying) playStage();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStageIndex > 0) {
        currentStageIndex--;
        loadStage(currentStageIndex);
        if (isPlaying) playStage();
    }
});

// Carga inicial
loadStage(currentStageIndex);
