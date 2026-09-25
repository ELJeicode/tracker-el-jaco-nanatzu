// Imágenes servidas desde la wiki de Nanatsu no Taizai (Fandom).
// wiki('ruta/archivo.png', ancho) → miniatura redimensionada por el CDN de la wiki.
const WIKI = 'https://static.wikia.nocookie.net/nanatsu-no-taizai/images/';
const wiki = (path, w = 600) => `${WIKI}${path}/revision/latest/scale-to-width-down/${w}`;

// Las 7 eras del camino. Cada nivel pertenece a una.
const ERAS = [
    { id: 1, name: 'Caballeros Sagrados',          color: '#7dd3fc', from: 1,  to: 6  },
    { id: 2, name: 'Pecados Capitales · Forma Base', color: '#f87171', from: 7,  to: 11 },
    { id: 3, name: 'Tesoros Sagrados',             color: '#fbbf24', from: 12, to: 16 },
    { id: 4, name: 'Los Diez Mandamientos',        color: '#c084fc', from: 17, to: 20 },
    { id: 5, name: 'Evolución de Élite',           color: '#fb7185', from: 21, to: 25 },
    { id: 6, name: 'Pico Guerrero · Guerra Santa', color: '#fb923c', from: 26, to: 29 },
    { id: 7, name: 'Rango Dios · El Origen',       color: '#e0e7ff', from: 30, to: 33 }
];

// pos = object-position del retrato (para que la cara quede en el marco).
const SIN_LEVELS = [
    // I. CABALLEROS SAGRADOS
    { level: 1,  name: 'Twigo', title: 'Aprendiz de Caballero', reqXP: 0,     img: wiki('9/92/Twigo_Anime.png', 500), pos: 'center 20%', desc: 'Inicio del camino. Superas la inercia diaria y empiezas a construir disciplina.' },
    { level: 2,  name: 'Guila', title: 'Nueva Generación', reqXP: 2000,  img: wiki('b/b2/Guila_Anime.png', 500), pos: 'center 10%', desc: 'Aumento de fuerza base. Despertar a las 05:00 AM empieza a volverse un hábito sólido.' },
    { level: 3,  name: 'Gilthunder', title: 'Rango Diamante', reqXP: 5000,  img: wiki('7/79/Gilthunder_Anime.png', 500), pos: 'center 10%', desc: 'Fuerza constante como el rayo. Enfoque total en el trabajo y cero distracciones.' },
    { level: 4,  name: 'Dreyfus', title: 'Gran Caballero Sagrado', reqXP: 9000,  img: wiki('b/b3/Dreyfus_Anime.png', 446), pos: 'center 10%', desc: 'Autoridad y control mental. Ejecución limpia en tu jornada diaria.' },
    { level: 5,  name: 'Hendrickson', title: 'Forma Humana', reqXP: 13000, img: wiki('a/a2/Hendrickson_Anime.png', 441), pos: 'center 10%', desc: 'Límites humanos al máximo. Inicios del entrenamiento riguroso de física y mates.' },
    { level: 6,  name: 'Hendrickson', title: 'Demonio Gris', reqXP: 18000, img: wiki('b/b6/Hendrickson_Grey_Demon_Form.png', 250), pos: 'center 8%', desc: 'Superación de la naturaleza humana. Resistencia a la incomodidad y esfuerzo continuo.' },

    // II. PECADOS CAPITALES - FORMA BASE
    { level: 7,  name: 'Gowther', title: 'Pecado de la Lujuria', reqXP: 23000, img: wiki('a/a5/Gowther_Anime.png', 500), pos: 'center 10%', desc: 'Control de impulsos. Mente analítica sin caer en tentaciones de dopamina barata.' },
    { level: 8,  name: 'Diane', title: 'Pecado de la Envidia', reqXP: 28000, img: wiki('5/5e/Diane_anime_full_appearance.png', 413), pos: 'center 4%', desc: 'Fuerza bruta natural. Te enfocas exclusivamente en tu propio progreso sin comparar.' },
    { level: 9,  name: 'Ban', title: 'Pecado de la Avaricia', reqXP: 33000, img: wiki('e/e3/Ban_anime_full_appearance.png', 190), pos: 'center 3%', desc: 'Resistencia física y rápida recuperación. Inicios de tus metas financieras.' },
    { level: 10, name: 'King', title: 'Pecado de la Pereza', reqXP: 38000, img: wiki('c/cb/King_anime_full_appearance.png', 254), pos: 'center 4%', desc: 'Adaptabilidad táctica. Manejo perfecto del tiempo entre entrenamiento y descanso.' },
    { level: 11, name: 'Meliodas', title: 'Pecado de la Ira', reqXP: 43000, img: wiki('7/7b/Meliodas_anime_full_appearance.png', 320), pos: 'center 4%', desc: 'Líder de los Pecados. Mantienes la calma ante la presión laboral y física.' },

    // III. TESOROS SAGRADOS
    { level: 12, name: 'Diane', title: 'Tesoro Sagrado Gideon', reqXP: 48000, img: wiki('c/c4/Diane_Gideon_Anime.png', 468), pos: 'center 20%', desc: 'Conexión total con la tierra. Estabilidad mental sólida frente a cualquier reto.' },
    { level: 13, name: 'Meliodas', title: 'Tesoro Sagrado Lostvayne', reqXP: 53000, img: wiki('e/e1/Meliodas_anime_full_appearance_2.png', 366), pos: 'center 12%', desc: 'Clonación física y mental. Multiplicas tu productividad en proyectos personales.' },
    { level: 14, name: 'Gowther', title: 'Tesoro Sagrado Herritt', reqXP: 57000, img: wiki('3/38/Gowther_using_Herritt.png', 900), pos: '72% center', desc: 'Reescribiendo la mente. Memoria y retención absoluta durante tus sesiones de estudio.' },
    { level: 15, name: 'Ban', title: 'Tesoro Sagrado Courechouse', reqXP: 61000, img: wiki('3/32/Ban_Anime_Season_3_Design.png', 600), pos: 'center 22%', desc: 'Alcance y precisión extendida. Control estricto de gastos y hábitos impecables.' },
    { level: 16, name: 'Merlin', title: 'Tesoro Sagrado Aldan', reqXP: 65000, img: wiki('3/3c/Merlin_full_appearance_Anime.png', 275), pos: 'center 6%', desc: 'Magia Infinita. 1 AÑO CUMPLIDO. Capacidad inagotable para aprender física y matemáticas.' },

    // IV. LOS DIEZ MANDAMIENTOS
    { level: 17, name: 'Galand', title: 'Mandamiento de la Verdad', reqXP: 69000, img: wiki('5/5f/Galand_%28Anime%29.png', 600), pos: 'center 15%', desc: 'Cero mentiras personales. Cumples tus compromisos diarios sin excusas.' },
    { level: 18, name: 'Melascula', title: 'Mandamiento de la Fe', reqXP: 73000, img: wiki('7/74/Melascula_Anime.png', 600), pos: 'center 15%', desc: 'Fe inquebrantable en tu proceso a largo plazo, sin importar la fatiga.' },
    { level: 19, name: 'Gloxinia', title: 'Mandamiento del Reposo', reqXP: 77000, img: wiki('f/fa/Gloxinia_Anime_Infobox.png', 600), pos: 'center 15%', desc: 'Dominio de la regeneración y el descanso activo mediante técnicas de respiración.' },
    { level: 20, name: 'Drole', title: 'Mandamiento de la Paciencia', reqXP: 81000, img: wiki('1/13/Drole_anime.png', 600), pos: 'center 15%', desc: 'Paciencia inamovible. Construyendo resultados físicos y académicos piedra a piedra.' },

    // V. EVOLUCIÓN DE ÉLITE
    { level: 21, name: 'Meliodas', title: 'Marca Demoníaca Recuperada', reqXP: 84000, img: wiki('b/b8/Meliodas_Demon_Mark_Anime.png', 600), pos: 'center 25%', desc: 'Acceso a reservas profundas de energía. Concentración absoluta bajo alta carga laboral.' },
    { level: 22, name: 'Derieri', title: 'Mandamiento de la Pureza', reqXP: 87000, img: wiki('f/fd/Derieri_Anime.png', 700), pos: 'center 20%', desc: 'Combo Star. Cada día consecutivo de racha multiplica la fuerza de tu ejecución.' },
    { level: 23, name: 'Monspeet', title: 'Mandamiento de la Reticencia', reqXP: 89500, img: wiki('4/4a/Monspeet_Anime.png', 700), pos: 'center 20%', desc: 'Estrategia silenciosa y precisión en tus decisiones financieras y personales.' },
    { level: 24, name: 'Zeldris', title: 'El Ejecutor', reqXP: 92000, img: wiki('b/b7/Zeldris_Anime.png', 360), pos: 'center 20%', desc: 'Autoridad del Rey Demonio. Cero espacio para la procrastinación.' },
    { level: 25, name: 'Meliodas', title: 'Modo Asalto', reqXP: 94000, img: wiki('1/18/Meliodas_Assault_Mode_Anime.png', 600), pos: 'center 8%', desc: 'Modo de enfoque frío y calculador. Eliminación total de interferencias emocionales.' },

    // VI. PICO GUERRERO & GUERRA SANTA
    { level: 26, name: 'Escanor', title: '"The One" · El Minuto Dorado', reqXP: 95500, img: wiki('7/79/Escanor_%22One_Mode%22_Anime.png', 600), pos: 'center 8%', desc: 'El pico del rendimiento físico. Invencibilidad en tus rutinas de calistenia.' },
    { level: 27, name: 'Ban', title: 'Del Purgatorio', reqXP: 96500, img: wiki('c/ca/Ban%27s_outfit_in_Purgatory.png', 389), pos: 'center 4%', desc: 'Cuerpo adaptable a cualquier condición extrema de entrenamiento y trabajo.' },
    { level: 28, name: 'Elizabeth', title: 'Modo Diosa', reqXP: 97500, img: wiki('b/b4/Goddess_Elizabeth_anime_full_appearance.png', 700), pos: 'center 10%', desc: 'Poder divino despertado. Purificación de hábitos y serenidad espiritual absoluta.' },
    { level: 29, name: 'Escanor', title: '"The One Ultimate"', reqXP: 98300, img: wiki('7/71/Escanor_%22Ultimate_Mode%22_Anime.png', 547), pos: 'center 6%', desc: 'Fuego vital entregado a la meta. Disciplina innegociable en la fase final.' },

    // VII. RANGO DIOS & EL ORIGEN
    { level: 30, name: 'La Deidad Suprema', title: 'Luz Absoluta', reqXP: 99000, img: wiki('7/72/Supreme_Deity_Anime.png', 700), pos: 'center 15%', desc: 'Luz absoluta y dominio de las reglas del universo.' },
    { level: 31, name: 'El Rey Demonio', title: 'Cuerpo Original', reqXP: 99500, img: wiki('c/c7/Demon_King_anime_full_appearance.png', 700), pos: 'center 15%', desc: 'Soberanía total sobre la materia, las finanzas y el entorno.' },
    { level: 32, name: 'Meliodas', title: 'Forma Rey Demonio', reqXP: 99800, img: wiki('3/38/Meliodas_%22Demon_King%22_Anime.png', 602), pos: 'center 6%', desc: 'El poder capaz de destruir las maldiciones eternas. Control absoluto de tu destino.' },
    { level: 33, name: 'Rey Arturo', title: 'El Caos Primordial', reqXP: 100000, img: wiki('3/3f/Arthur_%22Chaos_Eyes%22_Anime.png', 1000), pos: 'center 30%', desc: 'MENTE INQUEBRANTABLE ABSOLUTA. 2 años de disciplina. Has creado tu propio universo.' }
];

// Escenarios de Britannia usados como fondo de cada pestaña.
const ESCENARIOS = {
    habits:  { img: wiki('a/a8/Fairy_King%27s_Forest_Anime.png', 1600), name: 'Bosque del Rey Hada' },
    finance: { img: wiki('5/55/Liones_Castle.png', 1280),                name: 'Castillo de Liones' },
    rewards: { img: wiki('c/c1/Boar_Hat_Third_Design_%28Anime%29.png', 900), name: 'Taberna Boar Hat' },
    path:    { img: wiki('e/e5/Camelot_Anime.png', 747),                  name: 'Camelot' }
};

const HAWK_IMG = wiki('1/1f/Hawk_anime_full_appearance.png', 216);
