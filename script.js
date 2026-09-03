const svgIcons = {
    intro: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#e0e7ff"/><path d="M70 100 C70 70 130 70 130 100 C130 130 70 130 70 100 Z" fill="none" stroke="#4f46e5" stroke-width="6"/><circle cx="100" cy="100" r="18" fill="#4f46e5"/></svg>`,
    vista: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#e0f2fe"/><path d="M45 100 Q100 50 155 100 Q100 150 45 100 Z" fill="none" stroke="#0284c7" stroke-width="7"/><circle cx="100" cy="100" r="22" fill="#0284c7"/></svg>`,
    tacto: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#dcfce7"/><path d="M70 125 C70 95 90 85 100 85 C110 85 130 95 130 125" fill="none" stroke="#16a34a" stroke-width="7" stroke-linecap="round"/><path d="M100 65 L100 115" stroke="#16a34a" stroke-width="7" stroke-linecap="round"/></svg>`,
    oido: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#fef3c7"/><path d="M80 65 C115 45 145 75 125 105 C115 120 95 115 95 135" fill="none" stroke="#d97706" stroke-width="7" stroke-linecap="round"/></svg>`,
    olfato: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#f0fdf4"/><path d="M 80,50 Q 110,70 120,100 Q 110,130 120,160" stroke="#16a34a" stroke-width="6" fill="none"/><circle cx="85" cy="80" r="6" fill="#a29bfe"/></svg>`,
    gusto: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#fce7f3"/><path d="M65 90 Q100 145 135 90" fill="none" stroke="#db2777" stroke-width="7" stroke-linecap="round"/></svg>`,
    cierre: `<svg viewBox="0 0 200 200" width="90" height="90"><circle cx="100" cy="100" r="75" fill="#f3e8ff"/><path d="M65 100 L90 125 L135 75" fill="none" stroke="#9333ea" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const stages = [
    { id: 'intro', title: 'Bienvenido', audio: 'audio/intro.mp3', svg: svgIcons.intro, text: 'Prepárate para conectar con el presente.' },
    { id: 'vista', title: '5 Cosas que puedas VER', audio: 'audio/vista.mp3', svg: svgIcons.vista, text: 'Observa a tu alrededor y nombra 5 objetos.' },
    { id: 'tacto', title: '4 Cosas que puedas TOCAR', audio: 'audio/tacto.mp3', svg: svgIcons.tacto, text: 'Siente texturas y temperaturas.' },
    { id: 'oido', title: '3 Sonidos que puedas ESCUCHAR', audio: 'audio/oido.mp3', svg: svgIcons.oido, text: 'Escucha atentamente a tu entorno.' },
    { id: 'olfato', title: '2 Cosas que puedas OLER', audio: 'audio/olfato.mp3', svg: svgIcons.olfato, text: 'Inhala profundo y reconoce los aromas.' },
    { id: 'gusto', title: '1 Cosa que puedas SABOREAR', audio: 'audio/gusto.mp3', svg: svgIcons.gusto, text: 'Conéctate con el sentido del gusto.' },
    { id: 'cierre', title: 'Ejercicio Completado', audio: 'audio/cierre.mp3', svg: svgIcons.cierre, text: 'Has vuelto al aquí y al ahora.' }
];

let currentStageIndex = 0;
let isPlaying = false;

const mainAudio = document.getElementById('main-audio');
const bgMusic = document.getElementById('bg-music');
const stageTitle = document.getElementById('stage-title');
const stageSubtext = document.getElementById('stage-subtext');
const visualContainer = document.getElementById('visual-content');
const progressBar = document.getElementById('progress-bar');
const stepBadge = document.getElementById('step-badge');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnIcon = document.getElementById('btn-icon');
const btnText = document.getElementById('btn-text');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

bgMusic.volume = 0.15;

function loadStageUI(index) {
    const stage = stages[index];
    stageTitle.textContent = stage.title;
    stageSubtext.textContent = stage.text;
    stepBadge.textContent = `Paso ${index + 1} de ${stages.length}`;
    progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;
    visualContainer.innerHTML = stage.svg;
}

function playAudioSequence() {
    const stage = stages[currentStageIndex];
    mainAudio.src = stage.audio;
    mainAudio.load();

    if (isPlaying) {
        bgMusic.play().catch(() => {});
        mainAudio.play().catch(err => {
            console.error(`Error al reproducir ${stage.audio}:`, err);
        });
    }
}

// Avance automático cuando el audio de voz actual finaliza
mainAudio.onended = () => {
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStageUI(currentStageIndex);
        playAudioSequence();
    } else {
        isPlaying = false;
        btnIcon.textContent = '▶';
        btnText.textContent = 'Reiniciar';
        bgMusic.pause();
    }
};

btnPlayPause.addEventListener('click', () => {
    if (isPlaying) {
        isPlaying = false;
        btnIcon.textContent = '▶';
        btnText.textContent = 'Continuar';
        mainAudio.pause();
        bgMusic.pause();
    } else {
        if (currentStageIndex === stages.length - 1) {
            currentStageIndex = 0;
        }
        isPlaying = true;
        btnIcon.textContent = '⏸';
        btnText.textContent = 'Pausa';
        loadStageUI(currentStageIndex);
        playAudioSequence();
    }
});

btnNext.addEventListener('click', () => {
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStageUI(currentStageIndex);
        playAudioSequence();
    }
});

btnPrev.addEventListener('click', () => {
    if (currentStageIndex > 0) {
        currentStageIndex--;
        loadStageUI(currentStageIndex);
        playAudioSequence();
    }
});

// Carga inicial
loadStageUI(currentStageIndex);
