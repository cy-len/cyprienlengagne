export type CompositionTypeCode =
    | "orchestra"
    | "orchestra-soloist"
    | "choir"
    | "orchestra-choir"
    | "ensemble"
    | "ensemble-soloist"
    | "ensemble-voice"
    | "chamber-music"
    | "chamber-music-voice"
    | "solo"
    | "opera"
    | "ballet"
    | "wind-band"
    | "big-band"
    | "electronic"
    | "electroacoustic"
    | "film-score"
    | "game-score"
    | "experimental"
    | "song"
    | "cantata-oratorio"
    | "other";

export const categoryByLanguage: { [lang: string]: { [code in CompositionTypeCode]: string } } = {
    en: {
        "orchestra": "Orchestra",
        "orchestra-soloist": "Orchestra with soloist",
        "choir": "Choir",
        "orchestra-choir": "Orchestra with choir",
        "ensemble": "Ensemble",
        "ensemble-soloist": "Ensemble with soloist",
        "ensemble-voice": "Ensemble with voice",
        "chamber-music": "Chamber music",
        "chamber-music-voice": "Chamber music with voice",
        "solo": "Solo work",
        "opera": "Opera",
        "ballet": "Ballet",
        "wind-band": "Wind band",
        "big-band": "Big band",
        "electronic": "Electronic",
        "electroacoustic": "Electroacoustic",
        "film-score": "Film score",
        "game-score": "Game score",
        "experimental": "Experimental",
        "song": "Song",
        "cantata-oratorio": "Cantata / Oratorio",
        "other": "Other"
    },
    fr: {
        "orchestra": "Orchestre",
        "orchestra-soloist": "Orchestre avec soliste",
        "choir": "Chœur",
        "orchestra-choir": "Orchestre avec chœur",
        "ensemble": "Ensemble",
        "ensemble-soloist": "Ensemble avec soliste",
        "ensemble-voice": "Ensemble avec voix",
        "chamber-music": "Musique de chambre",
        "chamber-music-voice": "Musique de chambre avec voix",
        "solo": "Pièce solo",
        "opera": "Opéra",
        "ballet": "Ballet",
        "wind-band": "Orchestre d’harmonie",
        "big-band": "Big band",
        "electronic": "Électronique",
        "electroacoustic": "Électroacoustique",
        "film-score": "Musique de film",
        "game-score": "Musique de jeu vidéo",
        "experimental": "Expérimental",
        "song": "Chanson",
        "cantata-oratorio": "Cantate / Oratorio",
        "other": "Autre"
    }
};
