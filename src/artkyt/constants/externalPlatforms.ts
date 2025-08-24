export const recordingPlatforms = [
    "youtube",
    "soundcloud",
    "spotify",
    "bandcamp",
    "apple-music",
] as const;

export const externalPlatforms = [
    "website",
    "instagram",
    "facebook",
    "x",
    "linkedin",
    "tiktok",
    ...recordingPlatforms,
    "other"
] as const;

export type RecordingPlatformCode = typeof recordingPlatforms[number];
export type SocialPlatformCode = typeof externalPlatforms[number];

export interface SocialPlatform {
    code: SocialPlatformCode;
    label: string;
    iconUrl?: string;
}

export const socialPlatformCodeToPlatform: Record<SocialPlatformCode, SocialPlatform> = {
    website: {
        code: "website",
        label: "Website",
        iconUrl: "/icons/externalPlatforms/website.svg"
    },
    instagram: {
        code: "instagram",
        label: "Instagram",
        iconUrl: "/icons/externalPlatforms/instagram.svg"
    },
    facebook: {
        code: "facebook",
        label: "Facebook",
        iconUrl: "/icons/externalPlatforms/facebook.svg"
    },
    x: {
        code: "x",
        label: "Twitter / X",
        iconUrl: "/icons/externalPlatforms/x.svg"
    },
    youtube: {
        code: "youtube",
        label: "YouTube",
        iconUrl: "/icons/externalPlatforms/youtube.svg"
    },
    linkedin: {
        code: "linkedin",
        label: "LinkedIn",
        iconUrl: "/icons/externalPlatforms/linkedin.svg"
    },
    tiktok: {
        code: "tiktok",
        label: "TikTok",
        iconUrl: "/icons/externalPlatforms/tiktok.svg"
    },
    soundcloud: {
        code: "soundcloud",
        label: "SoundCloud",
        iconUrl: "/icons/externalPlatforms/soundcloud.svg"
    },
    spotify: {
        code: "spotify",
        label: "Spotify",
        iconUrl: "/icons/externalPlatforms/spotify.svg"
    },
    bandcamp: {
        code: "bandcamp",
        label: "Bandcamp",
        iconUrl: "/icons/externalPlatforms/bandcamp.svg"
    },
    "apple-music": {
        code: "apple-music",
        label: "Apple Music",
        iconUrl: "/icons/externalPlatforms/appleMusic.svg"
    },
    other: {
        code: "other",
        label: "Other",
        iconUrl: "/icons/externalPlatforms/other.svg"
    }
};

/**
 * Parse the externalId from a given platform and URL.
 * @param platform - Name of the platform (e.g., "youtube", "spotify", "appleMusic").
 * @param url - The full URL to parse.
 * @returns The extracted externalId string, or null if it couldn't be parsed.
 */
export function parseExternalId(platform: string, url: string): string | null {
    try {
        const parsed = new URL(url);

        switch (platform.toLowerCase()) {
            case "youtube": {
                // Handles both long and short forms
                if (parsed.hostname.includes("youtu.be")) {
                    return parsed.pathname.slice(1);
                }
                if (parsed.searchParams.has("v")) {
                    return parsed.searchParams.get("v");
                }
                break;
            }

            case "spotify": {
                // Example: https://open.spotify.com/track/{id}
                const parts = parsed.pathname.split("/");
                const kinds = [ "track", "playlist", "album", "artist" ];
                const kindIndex = parts.findIndex(v => kinds.includes(v));

                if (kindIndex === -1 || parts.length <= kindIndex + 1) return null;

                return `${parts[kindIndex]}/${parts[kindIndex + 1]}`;
            }

            case "apple-music": {
                // Example: https://music.apple.com/**
                const parts = parsed.pathname.split("/");
                return parts.slice(1).join("/") || null;
            }

            case "soundcloud": {
                // SoundCloud IDs are usually full slugs, not short IDs
                return parsed.pathname.slice(1) || null;
            }

            case "bandcamp": {
                return url;
            }

            default:
                console.warn(`parseExternalId: Unknown platform "${platform}"`);
                return null;
        }
    } catch (err) {
        console.error("parseExternalId: Invalid URL", err);
        return null;
    }

    return null;
}

export function getEmbedPlayerUrl(platform: string, url: string): string | null {
    const id = parseExternalId(platform, url);
    if (!id) return null;

    switch (platform.toLowerCase()) {
        case "youtube":
            return `https://www.youtube.com/embed/${id}`;
        case "spotify":
            return `https://open.spotify.com/embed/${id}`;
        case "bandcamp":
            return url;
        case "apple-music":
            return `https://embed.music.apple.com/us/album/${id}`;
        case "soundcloud":
            // SoundCloud needs a URL parameter with the track page
            return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;
        default:
            return null;
    }
}