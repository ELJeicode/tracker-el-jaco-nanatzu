// Imágenes servidas desde la wiki de Nanatsu no Taizai (Fandom).
// wiki('ruta/archivo.png', ancho) → miniatura redimensionada por el CDN de la wiki.
const WIKI = 'https://static.wikia.nocookie.net/nanatsu-no-taizai/images/';
const wiki = (path, w = 600) => `${WIKI}${path}/revision/latest/scale-to-width-down/${w}`;

// Las 7 eras del camino. Cada nivel pertenece a una.
const ERAS = [
    { id: 1, name: 'Caballeros Sagrados',          color: '#7dd3fc', from: 1,  to: 6  },
    { id: 2, name: 'Pecados Capitales · Forma Base', color: '#f87171', from: 7,  to: 11 },
    { id: 3, name: 'Tesoros Sagrados',             color: '#fbbf24', from: 12, to: 16 },
    { id: 4, name: 'Los Diez Mandamientos',        color: '#c084fc', from: 17, to: 22 },
    { id: 5, name: 'Evolución de Élite',           color: '#fb7185', from: 23, to: 28 },
    { id: 6, name: 'Pico Guerrero · Guerra Santa', color: '#fb923c', from: 29, to: 34 },
    { id: 7, name: 'Rango Dios · El Origen',       color: '#e0e7ff', from: 35, to: 40 }
];

// pos = object-position del retrato (para que la cara quede en el marco).
// box = recorte opcional (object-view-box), p. ej. para quitar el título de un póster.
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
    { level: 13, name: 'Meliodas', title: 'Tesoro Sagrado Lostvayne', reqXP: 53000, img: wiki('5/5c/Meliodas_considering_to_sell_Lostvayne.png', 900), pos: '62% center', desc: 'Clonación física y mental. Multiplicas tu productividad en proyectos personales.' },
    { level: 14, name: 'Gowther', title: 'Tesoro Sagrado Herritt', reqXP: 57000, img: wiki('3/38/Gowther_using_Herritt.png', 900), pos: '72% center', desc: 'Reescribiendo la mente. Memoria y retención absoluta durante tus sesiones de estudio.' },
    { level: 15, name: 'Ban', title: 'Tesoro Sagrado Courechouse', reqXP: 61000, img: wiki('3/32/Ban_Anime_Season_3_Design.png', 600), pos: 'center 22%', desc: 'Alcance y precisión extendida. Control estricto de gastos y hábitos impecables.' },
    { level: 16, name: 'Merlin', title: 'Tesoro Sagrado Aldan', reqXP: 65000, img: wiki('3/3c/Merlin_full_appearance_Anime.png', 275), pos: 'center 6%', desc: 'Magia Infinita. 1 AÑO CUMPLIDO. Capacidad inagotable para aprender física y matemáticas.' },

    // IV. LOS DIEZ MANDAMIENTOS
    { level: 17, name: 'Fraudrin', title: 'Mandamiento del Altruismo', reqXP: 69000, img: wiki('5/58/Fraudrin_anime.png', 644), pos: 'center 30%', desc: 'Dejas de sacrificar tu rutina por complacer a otros. Primero tu disciplina, después ayudas.' },
    { level: 18, name: 'Grayroad', title: 'Mandamiento del Pacifismo', reqXP: 71500, img: wiki('6/67/Grayroad_Intro_Anime.png', 700), pos: 'center', desc: 'Ninguna discusión ni provocación te saca de tu plan del día. Paz que protege tu enfoque.' },
    { level: 19, name: 'Galand', title: 'Mandamiento de la Verdad', reqXP: 74000, img: wiki('5/5f/Galand_%28Anime%29.png', 600), pos: 'center 15%', desc: 'Cero mentiras personales. Cumples tus compromisos diarios sin excusas.' },
    { level: 20, name: 'Melascula', title: 'Mandamiento de la Fe', reqXP: 76500, img: wiki('7/74/Melascula_Anime.png', 600), pos: 'center 15%', desc: 'Fe inquebrantable en tu proceso a largo plazo, sin importar la fatiga.' },
    { level: 21, name: 'Gloxinia', title: 'Mandamiento del Reposo', reqXP: 79000, img: wiki('f/fa/Gloxinia_Anime_Infobox.png', 600), pos: 'center 15%', desc: 'Dominio de la regeneración y el descanso activo mediante técnicas de respiración.' },
    { level: 22, name: 'Drole', title: 'Mandamiento de la Paciencia', reqXP: 81500, img: wiki('1/13/Drole_anime.png', 600), pos: 'center 15%', desc: 'Paciencia inamovible. Construyendo resultados físicos y académicos piedra a piedra.' },

    // V. EVOLUCIÓN DE ÉLITE
    { level: 23, name: 'Meliodas', title: 'Marca Demoníaca Recuperada', reqXP: 84000, img: wiki('b/b8/Meliodas_Demon_Mark_Anime.png', 600), pos: 'center 25%', desc: 'Acceso a reservas profundas de energía. Concentración absoluta bajo alta carga laboral.' },
    { level: 24, name: 'Derieri', title: 'Mandamiento de la Pureza', reqXP: 86000, img: wiki('f/fd/Derieri_Anime.png', 700), pos: 'center 20%', desc: 'Combo Star. Cada día consecutivo de racha multiplica la fuerza de tu ejecución.' },
    { level: 25, name: 'Monspeet', title: 'Mandamiento de la Reticencia', reqXP: 88000, img: wiki('4/4a/Monspeet_Anime.png', 700), pos: 'center 20%', desc: 'Estrategia silenciosa y precisión en tus decisiones financieras y personales.' },
    { level: 26, name: 'Estarossa', title: 'Mandamiento del Amor', reqXP: 90000, img: wiki('f/f1/Estarossa_anime.png', 700), pos: 'center 15%', desc: 'Amor propio: te tratas con respeto, cuerpo y mente. Cero autosabotaje.' },
    { level: 27, name: 'Zeldris', title: 'El Ejecutor', reqXP: 92000, img: wiki('b/b7/Zeldris_Anime.png', 360), pos: 'center 20%', desc: 'Autoridad del Rey Demonio. Cero espacio para la procrastinación.' },
    { level: 28, name: 'Meliodas', title: 'Modo Asalto', reqXP: 94000, img: wiki('1/18/Meliodas_Assault_Mode_Anime.png', 600), pos: 'center 8%', desc: 'Modo de enfoque frío y calculador. Eliminación total de interferencias emocionales.' },

    // VI. PICO GUERRERO & GUERRA SANTA
    { level: 29, name: 'King', title: 'Rey Hada · Despertar', reqXP: 94800, img: wiki('5/54/King_Full_Wings_close-up.png', 600), pos: 'center 15%', desc: 'Alas completas: la pereza vencida para siempre. Descanso y acción en equilibrio perfecto.' },
    { level: 30, name: 'Diane', title: 'Reina de los Gigantes', reqXP: 95600, img: wiki('5/58/Diane_%28Cursed_by_Light%29.png', 700), pos: 'center 30%', box: 'inset(19% 14% 0 2%)', desc: 'Lideras tu vida con fuerza y serenidad. Tu cuerpo alcanza su forma plena.' },
    { level: 31, name: 'Escanor', title: '"The One" · El Minuto Dorado', reqXP: 96400, img: wiki('7/79/Escanor_%22One_Mode%22_Anime.png', 600), pos: 'center 8%', desc: 'El pico del rendimiento físico. Invencibilidad en tus rutinas de calistenia.' },
    { level: 32, name: 'Ban', title: 'Del Purgatorio', reqXP: 97200, img: wiki('c/ca/Ban%27s_outfit_in_Purgatory.png', 389), pos: 'center 4%', desc: 'Cuerpo adaptable a cualquier condición extrema de entrenamiento y trabajo.' },
    { level: 33, name: 'Elizabeth', title: 'Modo Diosa', reqXP: 98000, img: wiki('b/b4/Goddess_Elizabeth_anime_full_appearance.png', 700), pos: 'center 10%', desc: 'Poder divino despertado. Purificación de hábitos y serenidad espiritual absoluta.' },
    { level: 34, name: 'Escanor', title: '"The One Ultimate"', reqXP: 98600, img: wiki('7/71/Escanor_%22Ultimate_Mode%22_Anime.png', 547), pos: 'center 6%', desc: 'Fuego vital entregado a la meta. Disciplina innegociable en la fase final.' },

    // VII. RANGO DIOS & EL ORIGEN
    { level: 35, name: 'Mael', title: 'Arcángel · Cuatro Mandamientos', reqXP: 98800, img: wiki('5/5d/Mael_Four_Commandments_Form.png', 1000), pos: '52% center', desc: 'Luz y oscuridad en un solo cuerpo. Ninguna tentación ni distracción alcanza tu rostro: solo queda el propósito.' },
    { level: 36, name: 'El Demonio Original', title: 'La Oscuridad Primigenia', reqXP: 99100, img: wiki('8/8a/Original_Demon_Anime.png', 800), pos: 'center 30%', desc: 'Nacido del poder puro del Clan Demonio. Fuerza bruta sin límites al servicio de tu disciplina.' },
    { level: 37, name: 'La Deidad Suprema', title: 'Luz Absoluta', reqXP: 99400, img: wiki('7/72/Supreme_Deity_Anime.png', 700), pos: 'center 15%', desc: 'Luz absoluta y dominio de las reglas del universo.' },
    { level: 38, name: 'El Rey Demonio', title: 'Cuerpo Original', reqXP: 99600, img: wiki('c/c7/Demon_King_anime_full_appearance.png', 700), pos: 'center 15%', desc: 'Soberanía total sobre la materia, las finanzas y el entorno.' },
    { level: 39, name: 'Meliodas', title: 'Forma Rey Demonio', reqXP: 99800, img: wiki('3/38/Meliodas_%22Demon_King%22_Anime.png', 602), pos: 'center 6%', desc: 'El poder capaz de destruir las maldiciones eternas. Control absoluto de tu destino.' },
    { level: 40, name: 'Rey Arturo', title: 'El Caos Primordial', reqXP: 100000, img: wiki('3/3f/Arthur_%22Chaos_Eyes%22_Anime.png', 1000), pos: 'center 30%', desc: 'MENTE INQUEBRANTABLE ABSOLUTA. 2 años de disciplina. Has creado tu propio universo.' }
];

// Escenarios de Britannia usados como fondo de cada pestaña.
const ESCENARIOS = {
    habits:  { img: wiki('a/a8/Fairy_King%27s_Forest_Anime.png', 1600), name: 'Bosque del Rey Hada' },
    finance: { img: wiki('5/55/Liones_Castle.png', 1280),                name: 'Castillo de Liones' },
    rewards: { img: wiki('c/c1/Boar_Hat_Third_Design_%28Anime%29.png', 900), name: 'Taberna Boar Hat' },
    path:    { img: wiki('e/e5/Camelot_Anime.png', 747),                  name: 'Camelot' }
};

const HAWK_IMG = wiki('1/1f/Hawk_anime_full_appearance.png', 216);
