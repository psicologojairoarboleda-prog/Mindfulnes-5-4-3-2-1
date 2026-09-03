const pasos = [
    {
        titulo: "Paso 1: Intro",
        texto: "Tómate un momento para respirar profundo y ponerte cómodo.",
        audio: "audio/intro.mp3"
    },
    {
        titulo: "Paso 2: Vista (5 cosas)",
        texto: "Observa a tu alrededor 5 cosas que puedas ver.",
        audio: "audio/vista.mp3"
    },
    {
        titulo: "Paso 3: Tacto (4 cosas)",
        texto: "Siente 4 cosas que puedas tocar a tu alrededor.",
        audio: "audio/tacto.mp3"
    },
    {
        titulo: "Paso 4: Oído (3 cosas)",
        texto: "Escucha con atención 3 sonidos a tu alrededor.",
        audio: "audio/oido.mp3"
    },
    {
        titulo: "Paso 5: Olfato (2 cosas)",
        texto: "Identifica 2 olores que puedas percibir.",
        audio: "audio/olfato.mp3"
    },
    {
        titulo: "Paso 6: Gusto (1 cosa)",
        texto: "Reconoce 1 sabor presente en tu boca.",
        audio: "audio/gusto.mp3"
    },
    {
        titulo: "Paso Final: Cierre",
        texto: "Has completado el ejercicio. Conéctate con tu respiración y el presente.",
        audio: "audio/cierre.mp3"
    }
];

let pasoActual = 0;
let reproductor = null;

const tituloEl = document.getElementById('titulo');
const descripcionEl = document.getElementById('descripcion');
const btnAccion = document.getElementById('btn-accion');

function reproducirPaso(indice) {
    if (reproductor) {
        reproductor.pause();
        reproductor.currentTime = 0;
    }

    const paso = pasos[indice];
    tituloEl.textContent = paso.titulo;
    descripcionEl.textContent = paso.texto;

    reproductor = new Audio(paso.audio);
    reproductor.play().catch(function(error) {
        console.log("Error o bloqueo de audio:", error);
    });

    if (indice < pasos.length - 1) {
        btnAccion.textContent = "Siguiente paso";
    } else {
        btnAccion.textContent = "Reiniciar ejercicio";
    }
}

btnAccion.addEventListener('click', function() {
    if (btnAccion.textContent === "Iniciar Ejercicio" || btnAccion.textContent === "Reiniciar ejercicio") {
        pasoActual = 0;
    } else {
        pasoActual++;
    }

    reproducirPaso(pasoActual);
});
