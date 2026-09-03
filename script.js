const stages = [
    { 
        id: 'intro', 
        title: 'Bienvenido', 
        audio: 'audio/intro.mp3.mp4', 
        text: 'Prepárate para conectar con el presente.' 
    },
    { 
        id: 'vista', 
        title: '5 Cosas que puedas VER', 
        audio: 'audio/vista.mp3.mp4', 
        text: 'Observa a tu alrededor y nombra 5 objetos.' 
    },
    { 
        id: 'tacto', 
        title: '4 Cosas que puedas TOCAR', 
        audio: 'audio/tacto.mp3.mp4', 
        text: 'Siente texturas y temperaturas.' 
    },
    { 
        id: 'oido', 
        title: '3 Sonidos que puedas ESCUCHAR', 
        audio: 'audio/oido.mp3.mp4', 
        text: 'A continuación concéntrate en los sonidos con los ojos cerrados y déjate llevar por ellos.',
        effects: [
            'https://cdn.pixabay.com/download/audio/2021/08/09/audio_884d658c7e.mp3?filename=heavy-rain-nature-sounds-8162.mp3',
            'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3e6f9fa68.mp3?filename=wind-blowing-sound-effect-10823.mp3',
            'https://cdn.pixabay.com/download/audio/2021/09/06/audio_0ed471549d.mp3?filename=birds-in-forest-24239.mp3'
        ]
    },
    { 
        id: 'olfato', 
        title: '2 Cosas que puedas OLER', 
        audio: 'audio/olfato.mp3.mp4', 
        text: 'Inhala profundo y visualiza cómo transita el aroma.' 
    },
    { 
        id: 'gusto', 
        title: '1 Cosa que puedas SABOREAR', 
        audio: 'audio/gusto.mp3.mp4', 
        text: 'Lleva el producto a la boca y experimenta su textura y sabor.' 
    },
    { 
        id: 'cierre', 
        title: 'Ejercicio Completado', 
        audio: 'audio/cierre.mp3.mp4', 
        text: 'Has vuelto al aquí y al ahora.' 
    }
];
