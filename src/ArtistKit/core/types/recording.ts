export interface Recording {
    platform: PlatformPossibility;
    link: string;
}

export type PlatformPossibility = "youtube" | "spotify" | "soundcloud";