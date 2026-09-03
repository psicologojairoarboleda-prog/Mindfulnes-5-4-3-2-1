const svgIcons = {
    intro: `<svg viewBox="0 0 200 200" width="120" height="120"><circle cx="100" cy="100" r="75" fill="#e0e7ff"/><path d="M70 100 C70 70 130 70 130 100 C130 130 70 130 70 100 Z" fill="none" stroke="#6366f1" stroke-width="6"/><circle cx="100" cy="100" r="18" fill="#4f46e5"/></svg>`,
    vista: `<svg viewBox="0 0 200 200" width="120" height="120"><circle cx="100" cy="100" r="75" fill="#e0f2fe"/><path d="M45 100 Q100 50 155 100 Q100 150 45 100 Z" fill="none" stroke="#0284c7" stroke-width="7"/><circle cx="100" cy="100" r="22" fill="#0284c7"/></svg>`,
    tacto: `<svg viewBox="0 0 200 200" width="120" height="120"><circle cx="100" cy="100" r="75" fill="#dcfce7"/><path d="M70 125 C70 95 90 85 100 85 C110 85 130 95 130 125" fill="none" stroke="#16a34a" stroke-width="7" stroke-linecap="round"/><path d="M100 65 L100 115" stroke="#16a34a" stroke-width="7" stroke-linecap="round"/></svg>`,
    oido: `<svg viewBox="0 0 200 200" width="120" height="120"><circle cx="100" cy="100" r="75" fill="#fef3c7"/><path d="M80 65 C115 45 145 75 125 105 C115 120 95 115 95 135" fill="none" stroke="#d97706" stroke-width="7" stroke-linecap="round"/></svg>`,
    gusto: `<svg viewBox="0 0 200 200" width="120" height="120"><circle cx="100" cy="100" r="75" fill="#fce7f3"/><path d="M65 90 Q100 145 135 90" fill="none" stroke="#db2777" stroke-width="7" stroke-linecap="round"/><path d="M85 110 Q100 145 115 110" fill="none" stroke="#db2777" stroke-width="5"/></svg>`,
    cierre: `<svg viewBox="0 0 200 200" width="120" height="120"><circle cx="100" cy="100" r="75" fill="#f3e8ff"/><path d="M65 100 L90 125 L135 75" fill="none" stroke="#9333ea" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const stages = [
    { id: 'intro', title: 'Bienvenido', audio: 'audio/intro.mp3', svg: svgIcons.intro, text: 'Prepárate para conectar con el presente.' },
    { id: 'vista', title: '5 Cosas que puedas VER', audio: 'audio/vista.mp3', svg: svgIcons.vista, text: 'Observa a tu alrededor y nombra 5 objetos.' },
    { id: 'tacto', title: '4 Cosas que puedas TOCAR', audio: 'audio/tacto.mp3', svg: svgIcons.tacto, text: 'Siente texturas y temperaturas.' },
    { 
        id: 'oido', 
        title: '3 Sonidos que puedas ESCUCHAR', 
        audio: 'audio/oido.mp3', 
        svg: svgIcons.oido, 
        text: 'Concéntrate en los sonidos con los ojos cerrados.',
        effects: [
            'https://cdn.pixabay.com/download/audio/2021/08/09/audio_884d658c7e.mp3?filename=heavy-rain-nature-sounds-8162.mp3',
            'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3e6f9fa68.mp3?filename=wind-blowing-sound-effect-10823.mp3',
            'https://cdn.pixabay.com/download/audio/2021/09/06/audio_0ed471549d.mp3?filename=birds-in-forest-24239.mp3'
        ]
    },
    { id: 'olfato', title: '2 Cosas que puedas OLER', audio: 'audio/olfato.mp3', svg: '', text: 'Inhala profundo y visualiza cómo transita el aroma.' },
    { id: 'gusto', title: '1 Cosa que puedas SABOREAR', audio: 'audio/gusto.mp3', svg: svgIcons.gusto, text: 'Lleva el producto a la boca y experimenta su textura y sabor.' },
    { id: 'cierre', title: 'Ejercicio Completado', audio: 'audio/cierre.mp3', svg: svgIcons.cierre, text: 'Has vuelto al aquí y al ahora.' }
];

let currentStageIndex = 0;
let isPlaying = false;
let subAudioIndex = -1; // -1: audio principal, 0,1,2: efectos ambientales de oído

const mainAudio = document.getElementById('main-audio');
const bgMusic = document.getElementById('bg-music');
const stageTitle = document.getElementById('stage-title');
const stageSubtext = document.getElementById('stage-subtext');
const visualContainer = document.getElementById('visual-content');
const progressBar = document.getElementById('progress-bar');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

bgMusic.volume = 0.2;

function loadStageUI(index) {
    const stage = stages[index];
    stageTitle.textContent = stage.title;
    stageSubtext.textContent = stage.text;
    progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;

    if (stage.id === 'olfato') {
        visualContainer.innerHTML = `
            <div class="visual-card">
                <svg viewBox="0 0 200 200" width="120" height="120">
                    <circle cx="100" cy="100" r="75" fill="#f0fdf4"/>
                    <path d="M 80,50 Q 110,70 120,100 Q 110,130 120,160" stroke="#16a34a" stroke-width="6" fill="none"/>
                    <circle class="aroma-particle" cx="85" cy="80" r="7" fill="#a29bfe"/>
                    <circle class="aroma-particle" cx="85" cy="80" r="5" fill="#74b9ff"/>
                </svg>
            </div>`;
    } else {
        visualContainer.innerHTML = `<div class="visual-card">${stage.svg}</div>`;
    }
}

function playCurrentAudio() {
    const stage = stages[currentStageIndex];
    
    if (subAudioIndex === -1) {
        mainAudio.src = stage.audio;
    } else if (stage.effects && stage.effects[subAudioIndex]) {
        mainAudio.src = stage.effects[subAudioIndex];
    }

    mainAudio.load();
    
    if (isPlaying) {
        bgMusic.play().catch(() => {});
        mainAudio.play().catch((err) => console.log("Cargando pista:", err));
    }
}

// Controlador de flujo automático al terminar cada audio
mainAudio.onended = () => {
    const stage = stages[currentStageIndex];

    // Manejo de la sub-secuencia de los 3 efectos de sonido en Oído
    if (stage.id === 'oido' && stage.effects && subAudioIndex < stage.effects.length - 1) {
        subAudioIndex++;
        playCurrentAudio();
        return;
    }

    // Reiniciar sub-índice y avanzar automáticamente a la siguiente etapa
    subAudioIndex = -1;
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStageUI(currentStageIndex);
        playCurrentAudio();
    } else {
        isPlaying = false;
        btnPlayPause.textContent = '▶ Reiniciar';
        bgMusic.pause();
    }
};

// Controles del Usuario (Play/Pausa, Siguiente, Anterior)
btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
        isPlaying = false;
        btnPlayPause.textContent = '▶ Continuar';
        mainAudio.pause();
        bgMusic.pause();
    } else {
        if (currentStageIndex === stages.length - 1 && subAudioIndex === -1) {
            currentStageIndex = 0;
        }
        isPlaying = true;
        btnPlayPause.textContent = '⏸ Pausa';
        loadStageUI(currentStageIndex);
        playCurrentAudio();
    }
});

btnNext.addEventListener('click', () => {
    subAudioIndex = -1;
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStageUI(currentStageIndex);
        playCurrentAudio();
    }
});

btnPrev.addEventListener('click', () => {
    subAudioIndex = -1;
    if (currentStageIndex > 0) {
        currentStageIndex--;
        loadStageUI(currentStageIndex);
        playCurrentAudio();
    }
});

// Carga de la interfaz inicial
loadStageUI(currentStageIndex);
