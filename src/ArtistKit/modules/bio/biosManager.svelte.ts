import { PUBLIC_ARTKYT_BIO_ID, PUBLIC_ARTKYT_PROFILE_ID, PUBLIC_ARTKYT_SHORT_BIO_ID, PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { Status } from "../../core/types/fetchTypes";
import type { FirebaseString } from "../../core/types/firebaseTypes";

export interface Biography {
    short: string;
    full: string;
}

export type FirebaseBiography = Biography;

export interface BioFetchResult {
    biography: Biography;
    status: Status;
}

// Key is language code (i.e. "en", "fr", "de")
export type MultilingualBioFetchResult = { [key: string]: BioFetchResult };

interface RawBio {
    name: string;
    fields: {
        short: FirebaseString,
        full: FirebaseString
    }
}

class BioManager {
    #bios: MultilingualBioFetchResult = $state({});

    async updateLanguage(lang: string = "en", fetchFunction = fetch) {
        if (this.#bios[lang]?.status === Status.OK) return;

        this.#bios = {
            ...this.#bios,
            [lang]: {
                biography: {
                    short: "",
                    full: "",
                },
                status: Status.PENDING
            }
        };
    
        try {
            const res = await fetchFunction(`https://firestore.googleapis.com/v1/projects/${PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/bios/${lang}`);
            const json = await res.json() as RawBio;
            
            this.#bios = {
                ...this.#bios,
                [lang]: {
                    biography: {
                        short: json.fields.short.stringValue,
                        full: json.fields.full.stringValue,
                    },
                    status: Status.OK
                }
            };
        } catch (error) {
            this.#bios = {
                ...this.#bios,
                [lang]: {
                    biography: {
                        short: "",
                        full: "",
                    },
                    status: Status.FAILED
                }
            };
        }
    }

    get languages() {
        return this.#bios;
    }

    language(lang = "en") {
        return this.#bios[lang];
    }
}

export const bios = new BioManager;

interface SingleBioPreview {
    name: string;
    content: string;
    selectedLanguage: string;
}

export async function getShortBioInLanguage(lang: string, fetchFunction = fetch): Promise<SingleBioPreview> {
    const res = await fetchFunction(`http://localhost:5173/api/public/profile/${PUBLIC_ARTKYT_PROFILE_ID}/bios/${PUBLIC_ARTKYT_SHORT_BIO_ID}?lang=${lang}`);
    const json = await res.json() as { bio: SingleBioPreview };
    console.log(json);

    return json.bio;
}

export async function getFullBioInLanguage(lang: string, fetchFunction = fetch): Promise<SingleBioPreview> {
    const res = await fetchFunction(`http://localhost:5173/api/public/profile/${PUBLIC_ARTKYT_PROFILE_ID}/bios/${PUBLIC_ARTKYT_BIO_ID}?lang=${lang}`);
    const json = await res.json() as { bio: SingleBioPreview };
    console.log(json);

    return json.bio;
}