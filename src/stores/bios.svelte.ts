import { Status } from "../types/status";

export interface Biography {
    short: string;
    full: string;
}

// short["en"] ; short["fr"] ; short["de"] ...
export interface BioFetchResult {
    biography: Biography;
    status: Status;
}

// Key is language code (i.e. "en", "fr", "de")
export type MultilingualBioFetchResult = { [key: string]: BioFetchResult };

interface RawBio {
    name: string;
    fields: {
        short: {
            stringValue: string;
        },
        full: {
            stringValue: string;
        }
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
            const res = await fetchFunction(`https://firestore.googleapis.com/v1/projects/cyprienlengagne-73f1d/databases/(default)/documents/bios/${lang}`);
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