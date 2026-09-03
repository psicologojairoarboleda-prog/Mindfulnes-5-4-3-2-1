import React, { useState, useEffect, useRef } from 'react';

// Rutas directas de los archivos subidos al servidor
const AUDIO_BG = '/audio/musica_fondo.mp3'; // Música aprobada
const AUDIOS_SENTIDOS = {
  viento: '/audio/viento.mp3',
  aves: '/audio/aves.mp3',
  lluvia: '/audio/lluvia.mp3'
};

const GroundingApp = () => {
  const [paso, setPaso] = useState(1); // 1 = Intro, 2..6 = Sentidos
  const [contador, setContador] = useState(0);
  const [faseSonido, setFaseSonido] = useState('reproduciendo'); // 'reproduciendo' (8s) | 'pausa' (3s)

  const audioBgRef = useRef(null);
  const audioEfectoRef = useRef(null);
  const timerRef = useRef(null);

  // 1. GESTIÓN DE MÚSICA DE FONDO (Permanece continua durante todo el ejercicio)
  useEffect(() => {
    audioBgRef.current = new Audio(AUDIO_BG);
    audioBgRef.current.loop = true;
    audioBgRef.current.volume = 0.2; // Volumen suave de fondo
    audioBgRef.current.play().catch(err => console.log("Click necesario para reproducir:", err));

    return () => {
      if (audioBgRef.current) {
        audioBgRef.current.pause();
        audioBgRef.current = null;
      }
    };
  }, []);

  // 2. GESTIÓN DE TIEMPOS Y EFECTOS DE SONIDO POR PASO
  useEffect(() => {
    // Limpieza de temporizadores y audios anteriores al cambiar de paso
    clearInterval(timerRef.current);
    if (audioEfectoRef.current) {
      audioEfectoRef.current.pause();
      audioEfectoRef.current = null;
    }

    // SI ES LA INTRO (PASO 1): Sin conteo regresivo ni efectos de sonido
    if (paso === 1) {
      setContador(0);
      return;
    }

    // PARA LOS PASOS DE ACTIVIDAD (PASOS 2 AL 6): Lógica de 8s sonido / 3s pausa
    let tiempoEnFase = 0;
    let modo = 'reproduciendo';
    setFaseSonido('reproduciendo');
    setContador(8);

    // Cargar sonido ambiental del paso actual
    const sonidoActual = paso === 2 ? AUDIOS_SENTIDOS.viento 
                        : paso === 3 ? AUDIOS_SENTIDOS.aves 
                        : AUDIOS_SENTIDOS.lluvia;

    audioEfectoRef.current = new Audio(sonidoActual);
    audioEfectoRef.current.volume = 0.6;
    audioEfectoRef.current.play().catch(e => console.log(e));

    // Bucle exacto de tiempo
    timerRef.current = setInterval(() => {
      tiempoEnFase++;

      if (modo === 'reproduciendo') {
        const restante = 8 - tiempoEnFase;
        setContador(restante);

        if (tiempoEnFase >= 8) {
          modo = 'pausa';
          tiempoEnFase = 0;
          setFaseSonido('pausa');
          setContador(3);
          if (audioEfectoRef.current) audioEfectoRef.current.pause();
        }
      } else if (modo === 'pausa') {
        const restante = 3 - tiempoEnFase;
        setContador(restante);

        if (tiempoEnFase >= 3) {
          modo = 'reproduciendo';
          tiempoEnFase = 0;
          setFaseSonido('reproduciendo');
          setContador(8);
          if (audioEfectoRef.current) {
            audioEfectoRef.current.currentTime = 0;
            audioEfectoRef.current.play().catch(e => console.log(e));
          }
        }
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [paso]);

  const siguientePaso = () => setPaso((prev) => Math.min(prev + 1, 6));

  return (
    <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', textAlign: 'center' }}>
      <span style={{ color: '#FF9F45', fontWeight: 'bold' }}>PASO {paso} DE 6</span>
      
      {paso === 1 ? (
        <>
          <h2 style={{ color: '#005C53' }}>Bienvenido</h2>
          {/* Ilustración de persona sentada en sillón */}
          <img src="/assets/intro_persona.svg" alt="Persona relajada" style={{ width: '220px' }} />
          <p style={{ color: '#555' }}>Prepárate para conectar con el presente.</p>
        </>
      ) : (
        <>
          <h2 style={{ color: '#005C53' }}>Actividad del Sentido</h2>
          {/* Ilustración concreta de la acción */}
          <img src={`/assets/sentido_paso_${paso}.svg`} alt="Acción concreta" style={{ width: '220px' }} />
          
          <div style={{ marginTop: '16px' }}>
            <p style={{ color: faseSonido === 'reproduciendo' ? '#005C53' : '#BCAAA4', fontWeight: 'bold' }}>
              {faseSonido === 'reproduciendo' ? 'Escucha / Siente...' : 'Pausa / Inhala...'} ({contador}s)
            </p>
          </div>
        </>
      )}

      <button 
        onClick={siguientePaso}
        style={{ background: '#FF9F45', color: '#FFF', border: 'none', padding: '12px 32px', borderRadius: '24px', cursor: 'pointer', marginTop: '20px' }}
      >
        {paso === 1 ? 'Iniciar' : 'Continuar'}
      </button>
    </div>
  );
};

export default GroundingApp;
