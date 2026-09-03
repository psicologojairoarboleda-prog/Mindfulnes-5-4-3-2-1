const stages = [
    { 
        id: 'intro', 
        title: 'Bienvenido', 
        audio: 'audio/intro.mp3', 
        image: '', 
        text: 'Prepárate para conectar con el presente.' 
    },
    { 
        id: 'vista', 
        title: '5 Cosas que puedas VER', 
        audio: 'audio/vista.mp3', 
        image: '', 
        text: 'Observa a tu alrededor y nombra 5 objetos.' 
    },
    { 
        id: 'tacto', 
        title: '4 Cosas que puedas TOCAR', 
        audio: 'audio/tacto.mp3', 
        image: '', 
        text: 'Siente texturas y temperaturas.' 
    },
    { 
        id: 'oido', 
        title: '3 Sonidos que puedas ESCUCHAR', 
        audio: 'audio/oido.mp3', 
        image: '', 
        text: 'A continuación concéntrate en los sonidos con los ojos cerrados y déjate llevar por ellos.',
        effects: ['audio/lluvia.mp3', 'audio/viento.mp3', 'audio/aves.mp3']
    },
    { 
        id: 'olfato', 
        title: '2 Cosas que puedas OLER', 
        audio: 'audio/olfato.mp3', 
        image: '', 
        text: 'Inhala profundo y visualiza cómo transita el aroma.' 
    },
    { 
        id: 'gusto', 
        title: '1 Cosa que puedas SABOREAR', 
        audio: 'audio/gusto.mp3', 
        image: '', 
        text: 'Lleva el producto a la boca y experimenta su textura y sabor.' 
    },
    { 
        id: 'cierre', 
        title: 'Ejercicio Completado', 
        audio: 'audio/cierre.mp3', 
        image: '', 
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

    // Manejar vista especial de Olfato (Animación)
    if (stage.id === 'olfato') {
        stageImage.classList.add('hidden');
        olfatoAnimation.classList.remove('hidden');
        aromaParticles.forEach(p => p.classList.add('active'));
    } else {
        olfatoAnimation.classList.add('hidden');
        stageImage.classList.remove('hidden');
        stageImage.src = stage.image || '';
        aromaParticles.forEach(p => p.classList.remove('active'));
    }

    mainAudio.src = stage.audio;
}

async function playStage() {
    isPlaying = true;
    btnPlayPause.textContent = '⏸ Pausa';
    
    // Reproducir música de fondo suave salvo cuando estén los sonidos del oído
    if (!isEffectsPlaying) {
        bgMusic.play().catch(() => {});
    }

    try {
        await mainAudio.play();
    } catch (e) {
        console.log("Aesperando reproducción de audio...");
    }
}

function pauseStage() {
    isPlaying = false;
    btnPlayPause.textContent = '▶ Continuar';
    mainAudio.pause();
    bgMusic.pause();
}

// Al terminar el audio principal de una sección
mainAudio.onended = async () => {
    const currentStage = stages[currentStageIndex];

    // Secuencia especial para la sección de Oído: 3 sonidos de 8 segundos cada uno
    if (currentStage.id === 'oido' && currentStage.effects) {
        isEffectsPlaying = true;
        bgMusic.pause(); // Pausar música ambiental durante los 3 sonidos

        for (const soundSrc of currentStage.effects) {
            if (!isPlaying) break; // Si el usuario pausó, detener la secuencia
            mainAudio.src = soundSrc;
            await mainAudio.play();
            // Esperar 8 segundos por cada sonido
            await new Promise(resolve => setTimeout(resolve, 8000));
        }

        isEffectsPlaying = false;
        if (isPlaying) bgMusic.play();
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

// Carga inicial de la primera etapa
loadStage(currentStageIndex);
