// Ilustraciones vectoriales en paleta territa
const svgIllustrations = {
    intro: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#fdf0ed"/><path d="M60 100 C60 70 140 70 140 100 C140 130 60 130 60 100 Z" fill="none" stroke="#e07a5f" stroke-width="6"/><circle cx="100" cy="100" r="16" fill="#81b29a"/></svg>`,
    vista: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#f2cc8f" opacity="0.3"/><path d="M40 100 Q100 45 160 100 Q100 155 40 100 Z" fill="none" stroke="#e07a5f" stroke-width="7"/><circle cx="100" cy="100" r="22" fill="#3d405b"/></svg>`,
    tacto: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#e8f3ee"/><path d="M75 130 C75 95 90 85 100 85 C110 85 125 95 125 130" fill="none" stroke="#81b29a" stroke-width="8" stroke-linecap="round"/><path d="M100 60 L100 110" stroke="#81b29a" stroke-width="8" stroke-linecap="round"/></svg>`,
    oido: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#fdf0ed"/><path d="M75 60 C115 40 145 70 125 110 C110 130 90 120 90 145" fill="none" stroke="#e07a5f" stroke-width="7" stroke-linecap="round"/></svg>`,
    olfato: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#e8f3ee"/><path d="M100 140 Q100 80 130 60 M100 100 Q80 80 70 90" stroke="#81b29a" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`,
    gusto: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#f2cc8f" opacity="0.3"/><path d="M60 90 Q100 145 140 90" fill="none" stroke="#e07a5f" stroke-width="7" stroke-linecap="round"/></svg>`,
    cierre: `<svg viewBox="0 0 200 200" width="100" height="100"><circle cx="100" cy="100" r="70" fill="#e8f3ee"/><path d="M60 100 L90 130 L140 70" fill="none" stroke="#81b29a" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`
};

const stages = [
    { id: 'intro', title: 'Bienvenido', audio: 'audio/intro.mp3', svg: svgIllustrations.intro, text: 'Prepárate para conectar con el presente.', pause: 6 },
    { id: 'vista', title: '5 Cosas que puedas VER', audio: 'audio/vista.mp3', svg: svgIllustrations.vista, text: 'Observa a tu alrededor y nombra 5 objetos.', pause: 6 },
    { id: 'tacto', title: '4 Cosas que puedas TOCAR', audio: 'audio/tacto.mp3', svg: svgIllustrations.tacto, text: 'Siente texturas y temperaturas.', pause: 10 },
    { 
        id: 'oido', 
        title: '3 Sonidos que puedas ESCUCHAR', 
        audio: 'audio/oido.mp3', 
        svg: svgIllustrations.oido, 
        text: 'Escucha atentamente a los sonidos de la naturaleza.',
        pauseAfterEffect: 3,
        effects: [
            'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3e6f9fa68.mp3?filename=wind-blowing-sound-effect-10823.mp3', // Viento
            'https://cdn.pixabay.com/download/audio/2021/08/09/audio_884d658c7e.mp3?filename=heavy-rain-nature-sounds-8162.mp3', // Lluvia
            'https://cdn.pixabay.com/download/audio/2021/09/06/audio_0ed471549d.mp3?filename=birds-in-forest-24239.mp3'  // Aves
        ]
    },
    { id: 'olfato', title: '2 Cosas que puedas OLER', audio: 'audio/olfato.mp3', svg: svgIllustrations.olfato, text: 'Inhala profundo y reconoce los aromas.', pause: 6 },
    { id: 'gusto', title: '1 Cosa que puedas SABOREAR', audio: 'audio/gusto.mp3', svg: svgIllustrations.gusto, text: 'Conéctate con el sentido del gusto.', pause: 6 },
    { id: 'cierre', title: 'Ejercicio Completado', audio: 'audio/cierre.mp3', svg: svgIllustrations.cierre, text: 'Has vuelto al aquí y al ahora.', pause: 0 }
];

let currentStageIndex = 0;
let isPlaying = false;
let timerInterval = null;

const mainAudio = document.getElementById('main-audio');
const bgMusic = document.getElementById('bg-music');
const stageTitle = document.getElementById('stage-title');
const stageSubtext = document.getElementById('stage-subtext');
const visualContainer = document.getElementById('visual-content');
const progressBar = document.getElementById('progress-bar');
const stepBadge = document.getElementById('step-badge');
const timerBox = document.getElementById('timer-box');
const timerCount = document.getElementById('timer-count');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnIcon = document.getElementById('btn-icon');
const btnText = document.getElementById('btn-text');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');

// Música ambiental suave (volumen bajo: 0.08)
bgMusic.volume = 0.08;

function loadStageUI(index) {
    clearTimeout(timerInterval);
    timerBox.classList.remove('active');
    const stage = stages[index];
    stageTitle.textContent = stage.title;
    stageSubtext.textContent = stage.text;
    stepBadge.textContent = `Paso ${index + 1} de ${stages.length}`;
    progressBar.style.width = `${((index + 1) / stages.length) * 100}%`;
    visualContainer.innerHTML = stage.svg;
}

function startCountdown(seconds, callback) {
    if (seconds <= 0) {
        callback();
        return;
    }
    let remaining = seconds;
    timerCount.textContent = `${remaining}s`;
    timerBox.classList.add('active');

    timerInterval = setInterval(() => {
        if (!isPlaying) return;
        remaining--;
        timerCount.textContent = `${remaining}s`;
        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerBox.classList.remove('active');
            callback();
        }
    }, 1000);
}

async function playStageSequence() {
    clearTimeout(timerInterval);
    timerBox.classList.remove('active');
    const stage = stages[currentStageIndex];

    if (stage.id === 'oido') {
        // Voz del sentido del oído
        bgMusic.play().catch(() => {});
        mainAudio.src = stage.audio;
        mainAudio.load();
        await mainAudio.play().catch(() => {});

        mainAudio.onended = async () => {
            // Silenciar música ambiental para emitir los efectos de la naturaleza
            bgMusic.pause();
            
            for (let i = 0; i < stage.effects.length; i++) {
                if (!isPlaying) return;
                mainAudio.src = stage.effects[i];
                mainAudio.load();
                await mainAudio.play().catch(() => {});

                // Esperar a que el efecto de naturaleza termine de sonar
                await new Promise(resolve => {
                    mainAudio.onended = resolve;
                });

                // Pausa con contador de 3 segundos después de cada efecto
                if (isPlaying) {
                    await new Promise(resolve => startCountdown(stage.pauseAfterEffect, resolve));
                }
            }

            // Retomar música de fondo y avanzar
            bgMusic.play().catch(() => {});
            advanceStage();
        };

    } else {
        // Restaurar música de fondo suave
        bgMusic.play().catch(() => {});
        mainAudio.src = stage.audio;
        mainAudio.load();
        await mainAudio.play().catch(() => {});

        mainAudio.onended = () => {
            // Pausa programada con contador regresivo al finalizar la voz
            startCountdown(stage.pause, advanceStage);
        };
    }
}

function advanceStage() {
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStageUI(currentStageIndex);
        if (isPlaying) playStageSequence();
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
    } else {
        if (currentStageIndex === stages.length - 1) {
            currentStageIndex = 0;
        }
        isPlaying = true;
        btnIcon.textContent = '⏸';
        btnText.textContent = 'Pausa';
        loadStageUI(currentStageIndex);
        playStageSequence();
    }
});

btnNext.addEventListener('click', () => {
    clearInterval(timerInterval);
    if (currentStageIndex < stages.length - 1) {
        currentStageIndex++;
        loadStageUI(currentStageIndex);
        if (isPlaying) playStageSequence();
    }
});

btnPrev.addEventListener('click', () => {
    clearInterval(timerInterval);
    if (currentStageIndex > 0) {
        currentStageIndex--;
        loadStageUI(currentStageIndex);
        if (isPlaying) playStageSequence();
    }
});

// Inicialización de interfaz
loadStageUI(currentStageIndex);
