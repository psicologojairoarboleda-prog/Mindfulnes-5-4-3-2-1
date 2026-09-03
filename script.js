const svgIcons = {
    intro: `<svg viewBox="0 0 200 200" width="160" height="160"><circle cx="100" cy="100" r="80" fill="#e0e7ff"/><path d="M70 100 Q100 70 130 100 Q100 130 70 100" fill="none" stroke="#6366f1" stroke-width="8" stroke-linecap="round"/><circle cx="100" cy="100" r="15" fill="#6366f1"/></svg>`,
    vista: `<svg viewBox="0 0 200 200" width="160" height="160"><circle cx="100" cy="100" r="80" fill="#e0f2fe"/><path d="M50 100 C70 60 130 60 150 100 C130 140 70 140 50 100 Z" fill="none" stroke="#0284c7" stroke-width="8"/><circle cx="100" cy="100" r="25" fill="#0284c7"/></svg>`,
    tacto: `<svg viewBox="0 0 200 200" width="160" height="160"><circle cx="100" cy="100" r="80" fill="#dcfce7"/><path d="M70 130 C70 110 80 90 100 90 C120 90 130 110 130 130" fill="none" stroke="#16a34a" stroke-width="8" stroke-linecap="round"/><path d="M100 70 L100 120" stroke="#16a34a" stroke-width="8" stroke-linecap="round"/></svg>`,
    oido: `<svg viewBox="0 0 200 200" width="160" height="160"><circle cx="100" cy="100" r="80" fill="#fef3c7"/><path d="M80 70 C110 50 140 80 120 110 C110 125 90 120 90 140" fill="none" stroke="#d97706" stroke-width="8" stroke-linecap="round"/></svg>`,
    gusto: `<svg viewBox="0 0 200 200" width="160" height="160"><circle cx="100" cy="100" r="80" fill="#fce7f3"/><path d="M70 90 Q100 140 130 90" fill="none" stroke="#db2777" stroke-width="8" stroke-linecap="round"/><path d="M85 110 Q100 150 115 110" fill="none" stroke="#db2777" stroke-width="6"/></svg>`,
    cierre: `<svg viewBox="0 0 200 200" width="160" height="160"><circle cx="100" cy="100" r="80" fill="#f3e8ff"/><path d="M70 100 L90 120 L130 80" fill="none" stroke="#9333ea" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const stages = [
    { id: 'intro', title: 'Bienvenido', audio: 'audio/intro.mp3.mp4', svg: svgIcons.intro, text: 'Prepárate para conectar con el presente.' },
    { id: 'vista', title: '5 Cosas que puedas VER', audio: 'audio/vista.mp3.mp4', svg: svgIcons.vista, text: 'Observa a tu alrededor y nombra 5 objetos.' },
    { id: 'tacto', title: '4 Cosas que puedas TOCAR', audio: 'audio/tacto.mp3.mp4', svg: svgIcons.tacto, text: 'Siente texturas y temperaturas.' },
    { 
        id: 'oido', 
        title: '3 Sonidos que puedas ESCUCHAR', 
        audio: 'audio/oido.mp3.mp4', 
        svg: svgIcons.oido, 
        text: 'A continuación concéntrate en los sonidos con los ojos cerrados y déjate llevar por ellos.',
        effects: [
            'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
            'https://actions.google.com/sounds/v1/weather/wind_synthetic.ogg',
            'https://actions.google.com/sounds/v1/ambiences/outdoor_birds.ogg'
        ]
    },
    { id: 'olfato', title: '2 Cosas que puedas OLER', audio: 'audio/olfato.mp3.mp4', svg: '', text: 'Inhala profundo y visualiza cómo transita el aroma.' },
    { id: 'gusto', title: '1 Cosa que puedas SABOREAR', audio: 'audio/gusto.mp3.mp4', svg: svgIcons.gusto, text: 'Lleva el producto a la boca y experimenta su textura y sabor.' },
    { id: 'cierre', title: 'Ejercicio Completado', audio: 'audio/cierre.mp3.mp4', svg: svgIcons.cierre, text: 'Has vuelto al aquí y al ahora.' }
];

let currentStageIndex = 0;
let isPlaying = false;
let isEffectsPlaying = false;

const mainAudio = document.getElementById('main-audio');
const bgMusic = document.getElementById('bg-music');
const stageTitle = document.getElementById('stage-title');
const stageSubtext = document.getElementById('stage-subtext');
const visualContainer = document.getElementById('visual-content');
const progressBar = document.getElementById('progress-bar');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

bgMusic.volume = 0.25;

function loadStage(index) {
    const stage = stages[index];
    stageTitle.textContent = stage.title;
    stageSubtext.textContent = stage.text;
    progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;

    if (stage.id === 'olfato') {
        visualContainer.innerHTML = `
            <svg id="olfato-animation" viewBox="0 0 300 300" width="180" height="180">
                <circle cx="150" cy="150" r="120" fill="#f0fdf4"/>
                <path d="M 110,80 Q 150,100 160,140 Q 150,180 160,230" stroke="#16a34a" stroke-width="5" fill="none"/>
                <circle class="aroma-particle p1" cx="125" cy="110" r="8" fill="#a29bfe"/>
                <circle class="aroma-particle p2" cx="125" cy="110" r="6" fill="#74b9ff"/>
            </svg>`;
        document.querySelectorAll('.aroma-particle').forEach(p => p.classList.add('active'));
    } else {
        visualContainer.innerHTML = stage.svg;
    }

    mainAudio.src = stage.audio;
}

async function playStage() {
    isPlaying = true;
    btnPlayPause.textContent = '⏸ Pausa';
    
    // Desbloquea la reproducción en navegadores móviles tras la primera pulsación
    try {
        if (!isEffectsPlaying) {
            await bgMusic.play();
        }
        await mainAudio.play();
    } catch (e) {
        console.error("Error al reproducir audio:", e);
    }
}

function pauseStage() {
    isPlaying = false;
    btnPlayPause.textContent = '▶ Continuar';
    mainAudio.pause();
    bgMusic.pause();
}

mainAudio.onended = async () => {
    const currentStage = stages[currentStageIndex];

    if (currentStage.id === 'oido' && currentStage.effects) {
        isEffectsPlaying = true;
        bgMusic.pause();

        for (const soundSrc of currentStage.effects) {
            if (!isPlaying) break;
            mainAudio.src = soundSrc;
            try {
                await mainAudio.play();
            } catch(e) {}
            await new Promise(resolve => setTimeout(resolve, 8000));
        }

        isEffectsPlaying = false;
        if (isPlaying) bgMusic.play().catch(() => {});
    }

    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStage(currentStageIndex);
        if (isPlaying) playStage();
    } else {
        pauseStage();
        btnPlayPause.textContent = '▶ Reiniciar';
    }
};

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

loadStage(currentStageIndex);
